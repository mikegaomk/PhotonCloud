"""
News Store service — database CRUD for news items.
"""
import logging
from datetime import datetime, timezone

from sqlalchemy import select, func, desc
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.news import NewsItem, FetchLog
from app.services.ai_enricher import EnrichedEntry

logger = logging.getLogger(__name__)


class NewsStore:
    """Handles persistence and querying of news entries in PostgreSQL."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def exists_by_url(self, source_url: str) -> bool:
        """Check if an entry with this source URL already exists (deduplication)."""
        result = await self.session.execute(
            select(NewsItem.id).where(NewsItem.source_url == source_url).limit(1)
        )
        return result.scalar_one_or_none() is not None

    async def save_entry(self, entry: EnrichedEntry) -> str | None:
        """
        Persist enriched entry to database.
        Returns the generated ID, or None if duplicate (silently skipped).
        """
        item = NewsItem(
            title=entry.title,
            summary=entry.summary_zh,
            source_name=entry.source_name,
            source_url=entry.source_url,
            published_at=entry.published,
            fetched_at=datetime.now(timezone.utc),
            category=entry.category,
            region=entry.region,
            chip_tags=entry.chip_tags,
            importance=entry.importance,
            content_link=entry.link,
        )
        self.session.add(item)
        try:
            await self.session.flush()
            return str(item.id)
        except IntegrityError:
            await self.session.rollback()
            logger.debug(f"Duplicate entry skipped: {entry.source_url}")
            return None

    async def query(
        self,
        category: str | None = None,
        region: str | None = None,
        tag: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[NewsItem], int]:
        """
        Query news with filters and pagination.
        Returns (items, total_count).
        """
        stmt = select(NewsItem)
        count_stmt = select(func.count(NewsItem.id))

        # Apply filters
        if category:
            stmt = stmt.where(NewsItem.category == category)
            count_stmt = count_stmt.where(NewsItem.category == category)
        if region:
            stmt = stmt.where(NewsItem.region == region)
            count_stmt = count_stmt.where(NewsItem.region == region)
        if tag:
            stmt = stmt.where(NewsItem.chip_tags.any(tag))
            count_stmt = count_stmt.where(NewsItem.chip_tags.any(tag))

        # Get total count
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar_one()

        # Apply ordering and pagination
        offset = (page - 1) * page_size
        stmt = stmt.order_by(desc(NewsItem.published_at)).offset(offset).limit(page_size)

        result = await self.session.execute(stmt)
        items = list(result.scalars().all())

        return items, total

    async def get_stats(self) -> dict:
        """Aggregated stats: total count, per-category counts, per-region counts."""
        # Total
        total_result = await self.session.execute(select(func.count(NewsItem.id)))
        total = total_result.scalar_one()

        # Per category
        cat_result = await self.session.execute(
            select(NewsItem.category, func.count(NewsItem.id)).group_by(NewsItem.category)
        )
        by_category = {row[0]: row[1] for row in cat_result.all()}

        # Per region
        reg_result = await self.session.execute(
            select(NewsItem.region, func.count(NewsItem.id)).group_by(NewsItem.region)
        )
        by_region = {row[0]: row[1] for row in reg_result.all()}

        return {
            "total": total,
            "by_category": by_category,
            "by_region": by_region,
        }

    async def save_fetch_log(self, log: FetchLog) -> int:
        """Save a fetch cycle log record."""
        self.session.add(log)
        await self.session.flush()
        return log.id

    async def get_latest_fetch_log(self) -> FetchLog | None:
        """Get the most recent fetch log for health check."""
        result = await self.session.execute(
            select(FetchLog).order_by(desc(FetchLog.started_at)).limit(1)
        )
        return result.scalar_one_or_none()
