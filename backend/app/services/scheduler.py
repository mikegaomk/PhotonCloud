"""
News Scheduler — orchestrates the RSS pipeline on a 6-hour interval.
"""
import logging
from dataclasses import dataclass
from datetime import datetime, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.news import FetchLog
from app.services.rss_crawler import RSSCrawler
from app.services.keyword_filter import KeywordFilter
from app.services.ai_enricher import AIEnricher
from app.services.news_store import NewsStore

logger = logging.getLogger(__name__)


@dataclass
class HealthStatus:
    status: str  # "healthy" | "degraded" | "error"
    last_fetch: datetime | None
    entry_count: int
    last_cycle_summary: dict | None


class NewsScheduler:
    """Orchestrates the RSS → Filter → Enrich → Store pipeline."""

    def __init__(self):
        self.crawler = RSSCrawler(timeout=settings.RSS_FETCH_TIMEOUT_SECONDS)
        self.filter = KeywordFilter()
        self.enricher = AIEnricher()
        self.scheduler = AsyncIOScheduler()
        self._last_health = HealthStatus(status="healthy", last_fetch=None, entry_count=0, last_cycle_summary=None)

    async def run_pipeline(self):
        """Execute full pipeline: crawl → deduplicate → filter → enrich → store."""
        logger.info("Starting RSS fetch pipeline...")
        started_at = datetime.now(timezone.utc)

        async with AsyncSessionLocal() as session:
            store = NewsStore(session)

            # Create fetch log
            fetch_log = FetchLog(started_at=started_at, status="running")
            await store.save_fetch_log(fetch_log)
            await session.commit()

            try:
                # Step 1: Crawl
                raw_entries, errors = await self.crawler.fetch_all()
                fetch_log.sources_attempted = len(self.crawler.sources)
                fetch_log.sources_succeeded = fetch_log.sources_attempted - len(errors)
                fetch_log.entries_found = len(raw_entries)

                # Step 2: Deduplicate
                new_entries = []
                for entry in raw_entries:
                    if not await store.exists_by_url(entry.source_url):
                        new_entries.append(entry)

                # Step 3: Filter
                matched, _ = self.filter.filter_entries(new_entries)
                fetch_log.entries_passed_filter = len(matched)

                # Step 4: Enrich
                enriched = await self.enricher.enrich_batch(matched)

                # Step 5: Store
                stored_count = 0
                for entry in enriched:
                    result = await store.save_entry(entry)
                    if result:
                        stored_count += 1
                fetch_log.entries_stored = stored_count

                # Finalize
                fetch_log.completed_at = datetime.now(timezone.utc)
                fetch_log.errors = [{"source": e.source_name, "error": e.error} for e in errors]
                fetch_log.status = "completed"

                # Update health
                if fetch_log.sources_succeeded == 0 and fetch_log.sources_attempted > 0:
                    fetch_log.status = "degraded"
                    self._last_health.status = "degraded"
                else:
                    self._last_health.status = "healthy"

                await session.commit()

                self._last_health.last_fetch = fetch_log.completed_at
                self._last_health.last_cycle_summary = {
                    "sources_attempted": fetch_log.sources_attempted,
                    "sources_succeeded": fetch_log.sources_succeeded,
                    "entries_found": fetch_log.entries_found,
                    "entries_passed_filter": fetch_log.entries_passed_filter,
                    "entries_stored": fetch_log.entries_stored,
                    "errors": len(errors),
                }

                logger.info(
                    f"Pipeline complete: {fetch_log.entries_found} found → "
                    f"{fetch_log.entries_passed_filter} filtered → "
                    f"{fetch_log.entries_stored} stored"
                )

            except Exception as e:
                fetch_log.completed_at = datetime.now(timezone.utc)
                fetch_log.status = "error"
                fetch_log.errors = [{"source": "pipeline", "error": str(e)}]
                await session.commit()
                self._last_health.status = "error"
                logger.error(f"Pipeline failed: {e}")

    def start(self):
        """Register APScheduler job (interval = RSS_FETCH_INTERVAL_HOURS)."""
        self.scheduler.add_job(
            self.run_pipeline,
            'interval',
            hours=settings.RSS_FETCH_INTERVAL_HOURS,
            id='rss_pipeline',
            replace_existing=True,
        )
        self.scheduler.start()
        logger.info(f"Scheduler started: RSS pipeline every {settings.RSS_FETCH_INTERVAL_HOURS}h")

    def get_health(self) -> HealthStatus:
        """Return last cycle result and system status."""
        return self._last_health


# Singleton instance
news_scheduler = NewsScheduler()
