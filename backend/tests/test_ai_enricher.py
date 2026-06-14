"""
Tests for AIEnricher service.
Property 5: AI enrichment produces valid structured output.
Property 6: AI summary length constraint.
Property 7: AI enrichment graceful fallback.
"""
import pytest
from unittest.mock import AsyncMock, patch
from datetime import datetime, timezone

from app.services.ai_enricher import AIEnricher, EnrichedEntry, VALID_CATEGORIES, VALID_REGIONS
from app.services.rss_crawler import RawEntry


@pytest.fixture
def enricher():
    return AIEnricher(api_key="test-key")


@pytest.fixture
def sample_entry():
    return RawEntry(
        title="New CPO optical engine achieves 3.2 Tbps",
        link="https://example.com/cpo",
        published=datetime(2026, 6, 1, tzinfo=timezone.utc),
        summary="Broadcom demonstrates co-packaged optics engine for next-gen switches.",
        source_name="Optics.org",
        source_url="https://example.com/cpo",
    )


# --- Property 5: Valid structured output ---

def test_fallback_produces_valid_category(sample_entry):
    """Feature: auto-news-rss, Property 5: Fallback produces valid category."""
    enricher = AIEnricher(api_key="")  # No key → fallback
    import asyncio
    result = asyncio.get_event_loop().run_until_complete(enricher.enrich(sample_entry))
    assert result.category in VALID_CATEGORIES


def test_fallback_produces_valid_region(sample_entry):
    """Feature: auto-news-rss, Property 5: Fallback produces valid region."""
    enricher = AIEnricher(api_key="")
    import asyncio
    result = asyncio.get_event_loop().run_until_complete(enricher.enrich(sample_entry))
    assert result.region in VALID_REGIONS


def test_fallback_chip_tags_is_list(sample_entry):
    """Feature: auto-news-rss, Property 5: chip_tags is always a list."""
    enricher = AIEnricher(api_key="")
    import asyncio
    result = asyncio.get_event_loop().run_until_complete(enricher.enrich(sample_entry))
    assert isinstance(result.chip_tags, list)


# --- Property 7: Graceful fallback ---

def test_fallback_defaults(sample_entry):
    """Feature: auto-news-rss, Property 7: On AI failure, use defaults."""
    enricher = AIEnricher(api_key="")
    import asyncio
    result = asyncio.get_event_loop().run_until_complete(enricher.enrich(sample_entry))

    assert result.category == "industry"
    assert result.region == "global"
    assert result.chip_tags == []
    assert result.importance == "medium"
    assert result.summary_zh == sample_entry.title[:150]


def test_enriched_entry_preserves_source_fields(sample_entry):
    """Enriched entry preserves original title, link, source fields."""
    enricher = AIEnricher(api_key="")
    import asyncio
    result = asyncio.get_event_loop().run_until_complete(enricher.enrich(sample_entry))

    assert result.title == sample_entry.title
    assert result.link == sample_entry.link
    assert result.source_name == sample_entry.source_name
    assert result.source_url == sample_entry.source_url
    assert result.published == sample_entry.published
