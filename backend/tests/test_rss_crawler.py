"""
Tests for RSSCrawler service.
Property 1: RSS feed parsing extracts all required fields.
Property 2: Error isolation — failed sources do not block others.
"""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime, timezone

from app.services.rss_crawler import RSSCrawler, RSSSource, RawEntry


# --- Property 2: Error isolation ---

@pytest.mark.asyncio
async def test_failed_source_does_not_block_others():
    """Feature: auto-news-rss, Property 2: Failed sources don't block others."""
    sources = [
        RSSSource(name="Good", url="https://good.com/rss", language="en"),
        RSSSource(name="Bad", url="https://bad.com/rss", language="en"),
    ]
    crawler = RSSCrawler(sources=sources)

    # Mock: Good returns entries, Bad raises
    async def mock_fetch(source):
        if source.name == "Bad":
            raise ConnectionError("Network timeout")
        return [RawEntry(title="Good entry", link="http://g.com", published=None, summary="s", source_name="Good", source_url="http://g.com")]

    with patch.object(crawler, 'fetch_source', side_effect=mock_fetch):
        entries, errors = await crawler.fetch_all()

    assert len(entries) == 1
    assert entries[0].title == "Good entry"
    assert len(errors) == 1
    assert errors[0].source_name == "Bad"


@pytest.mark.asyncio
async def test_all_sources_fail_returns_empty_entries():
    """When all sources fail, entries is empty but errors has all failures."""
    sources = [
        RSSSource(name="S1", url="https://s1.com/rss", language="en"),
        RSSSource(name="S2", url="https://s2.com/rss", language="en"),
    ]
    crawler = RSSCrawler(sources=sources)

    async def mock_fail(source):
        raise TimeoutError("timeout")

    with patch.object(crawler, 'fetch_source', side_effect=mock_fail):
        entries, errors = await crawler.fetch_all()

    assert len(entries) == 0
    assert len(errors) == 2


# --- Unit Tests ---

def test_rss_sources_configured():
    """Req 1.3: All 5 required sources are configured."""
    from app.services.rss_crawler import RSS_SOURCES
    names = [s.name for s in RSS_SOURCES]
    assert any("optics" in n.lower() for n in names)
    assert any("photonics" in n.lower() for n in names)
    assert any("ofweek" in n.lower() for n in names)
    assert any("c114" in n.lower() for n in names)
    assert any("arxiv" in n.lower() for n in names)
    assert len(RSS_SOURCES) == 5


def test_raw_entry_dataclass():
    """RawEntry stores all required fields."""
    entry = RawEntry(
        title="Test", link="http://x.com", published=datetime.now(timezone.utc),
        summary="Summary", source_name="Src", source_url="http://x.com"
    )
    assert entry.title == "Test"
    assert entry.link == "http://x.com"
    assert entry.published is not None
    assert entry.summary == "Summary"
