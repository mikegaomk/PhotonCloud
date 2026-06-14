"""
Test fixtures for the news aggregation system.
"""
import asyncio
import pytest
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch

from app.services.rss_crawler import RawEntry, RSSSource


@pytest.fixture
def sample_raw_entries():
    """Generate sample RawEntry objects for testing."""
    return [
        RawEntry(
            title="New silicon photonics chip achieves 100 Gbaud",
            link="https://example.com/siph-chip",
            published=datetime(2026, 6, 1, tzinfo=timezone.utc),
            summary="Researchers demonstrate a novel silicon photonics modulator operating at 100 Gbaud with low Vπ.",
            source_name="Optics.org",
            source_url="https://example.com/siph-chip",
        ),
        RawEntry(
            title="TFLN 调制器突破 110 GHz 带宽",
            link="https://example.com/tfln-news",
            published=datetime(2026, 5, 28, tzinfo=timezone.utc),
            summary="国内铌酸锂薄膜调制器实现超高带宽，推动 1.6T 相干模块发展。",
            source_name="OFweek 光电新闻",
            source_url="https://example.com/tfln-news",
        ),
        RawEntry(
            title="Sports championship results announced",
            link="https://example.com/sports",
            published=datetime(2026, 6, 2, tzinfo=timezone.utc),
            summary="The national basketball tournament concluded with a dramatic final.",
            source_name="General News",
            source_url="https://example.com/sports",
        ),
    ]


@pytest.fixture
def sample_rss_source():
    return RSSSource(name="Test Source", url="https://test.com/rss", language="en")


@pytest.fixture
def mock_openai_response():
    """Mock successful OpenAI API response."""
    return {
        "category": "research",
        "summary_zh": "研究人员展示了一种新型硅光调制器，工作在 100 Gbaud，具有低半波电压",
        "region": "global",
        "chip_tags": ["Silicon Photonics"],
        "importance": "high",
    }
