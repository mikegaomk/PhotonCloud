"""
RSS Crawler service — fetches and parses RSS/Atom feeds from configured photonics sources.
"""
import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

import feedparser
import httpx

logger = logging.getLogger(__name__)


@dataclass
class RSSSource:
    name: str
    url: str
    language: str  # "en" | "zh"


@dataclass
class RawEntry:
    title: str
    link: str
    published: Optional[datetime]
    summary: str
    source_name: str
    source_url: str


@dataclass
class FetchError:
    source_name: str
    source_url: str
    error: str
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


# Configured RSS sources for photonics industry
RSS_SOURCES = [
    RSSSource(name="Optics.org", url="https://optics.org/rss", language="en"),
    RSSSource(name="Photonics.com", url="https://www.photonics.com/RSS", language="en"),
    RSSSource(name="OFweek 光电新闻", url="https://www.ofweek.com/rss/news.xml", language="zh"),
    RSSSource(name="C114 通信网", url="https://www.c114.com.cn/rss.xml", language="zh"),
    RSSSource(name="arXiv physics.optics", url="http://arxiv.org/rss/physics.optics", language="en"),
]


class RSSCrawler:
    """Fetches and parses entries from multiple RSS sources with per-source error isolation."""

    def __init__(self, sources: list[RSSSource] | None = None, timeout: int = 30):
        self.sources = sources or RSS_SOURCES
        self.timeout = timeout

    async def fetch_all(self) -> tuple[list[RawEntry], list[FetchError]]:
        """
        Fetch entries from all configured sources.
        Returns (all_entries, errors) — errors are isolated per source.
        """
        all_entries: list[RawEntry] = []
        errors: list[FetchError] = []

        for source in self.sources:
            try:
                entries = await self.fetch_source(source)
                all_entries.extend(entries)
                logger.info(f"Fetched {len(entries)} entries from {source.name}")
            except Exception as e:
                error = FetchError(
                    source_name=source.name,
                    source_url=source.url,
                    error=str(e),
                )
                errors.append(error)
                logger.error(f"Failed to fetch {source.name}: {e}")

        return all_entries, errors

    async def fetch_source(self, source: RSSSource) -> list[RawEntry]:
        """
        Fetch and parse a single RSS source.
        Raises on network or parse failure.
        """
        # Fetch the feed content via httpx (async HTTP client)
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.get(
                source.url,
                headers={"User-Agent": "PhotonCloud-RSS-Crawler/1.0"},
            )
            response.raise_for_status()

        # Parse with feedparser
        feed = feedparser.parse(response.text)

        if feed.bozo and not feed.entries:
            raise ValueError(f"Malformed feed from {source.name}: {feed.bozo_exception}")

        entries: list[RawEntry] = []
        for entry in feed.entries[:50]:  # Limit per source per cycle
            title = entry.get("title", "").strip()
            link = entry.get("link", "").strip()
            summary = entry.get("summary", entry.get("description", "")).strip()

            if not title or not link:
                continue

            # Parse publication date
            published = None
            published_parsed = entry.get("published_parsed") or entry.get("updated_parsed")
            if published_parsed:
                try:
                    published = datetime(*published_parsed[:6], tzinfo=timezone.utc)
                except (TypeError, ValueError):
                    published = None

            entries.append(RawEntry(
                title=title,
                link=link,
                published=published,
                summary=summary[:500] if summary else title,
                source_name=source.name,
                source_url=link,
            ))

        return entries
