"""
News REST API endpoints.
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.news_store import NewsStore
from app.services.scheduler import news_scheduler

router = APIRouter(prefix="/api/news", tags=["News"])

VALID_CATEGORIES = {"industry", "research", "policy", "funding", "product", "standard"}
VALID_REGIONS = {"global", "china", "us", "europe", "japan", "korea"}


@router.get("")
async def get_news(
    category: str | None = Query(None, description="Filter by category"),
    region: str | None = Query(None, description="Filter by region"),
    tag: str | None = Query(None, description="Filter by chip technology tag"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
):
    """Get paginated news entries with optional filters."""
    # Validate enum params
    if category and category not in VALID_CATEGORIES:
        raise HTTPException(status_code=422, detail=f"Invalid category. Must be one of: {', '.join(VALID_CATEGORIES)}")
    if region and region not in VALID_REGIONS:
        raise HTTPException(status_code=422, detail=f"Invalid region. Must be one of: {', '.join(VALID_REGIONS)}")

    store = NewsStore(db)
    items, total = await store.query(
        category=category,
        region=region,
        tag=tag,
        page=page,
        page_size=page_size,
    )

    total_pages = (total + page_size - 1) // page_size

    return {
        "items": [
            {
                "id": str(item.id),
                "title": item.title,
                "summary": item.summary,
                "source": item.source_name,
                "sourceUrl": item.source_url,
                "date": item.published_at.isoformat() if item.published_at else item.fetched_at.isoformat(),
                "category": item.category,
                "region": item.region,
                "chipTags": item.chip_tags or [],
                "importance": item.importance,
                "content": "",
            }
            for item in items
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.get("/stats")
async def get_news_stats(db: AsyncSession = Depends(get_db)):
    """Get aggregated news statistics."""
    store = NewsStore(db)
    stats = await store.get_stats()
    return stats


@router.get("/health")
async def get_news_health():
    """Get system health status and last fetch cycle info."""
    health = news_scheduler.get_health()
    return {
        "status": health.status,
        "last_fetch": health.last_fetch.isoformat() if health.last_fetch else None,
        "entry_count": health.entry_count,
        "last_cycle": health.last_cycle_summary,
    }
