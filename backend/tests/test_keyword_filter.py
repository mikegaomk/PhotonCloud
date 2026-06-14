"""
Tests for KeywordFilter service.
Property 4: Keyword filter is a complete partition.
"""
import pytest
from hypothesis import given, strategies as st

from app.services.keyword_filter import KeywordFilter, DEFAULT_KEYWORDS
from app.services.rss_crawler import RawEntry


@pytest.fixture
def kf():
    return KeywordFilter()


# --- Property Tests ---

# Feature: auto-news-rss, Property 4: Keyword filter is a complete partition
@given(
    title=st.text(min_size=1, max_size=100),
    summary=st.text(min_size=0, max_size=300),
)
def test_filter_is_complete_partition(title, summary):
    """Every entry is either matched or discarded — no entry is lost."""
    kf = KeywordFilter()
    entry = RawEntry(title=title, link="http://x.com", published=None, summary=summary, source_name="Test", source_url="http://x.com")
    matched, discarded = kf.filter_entries([entry])
    assert len(matched) + len(discarded) == 1


# Feature: auto-news-rss, Property 4: Match iff keyword present
@given(keyword_idx=st.integers(min_value=0, max_value=len(DEFAULT_KEYWORDS) - 1))
def test_entry_with_keyword_matches(keyword_idx):
    """An entry containing a keyword must always match."""
    kf = KeywordFilter()
    keyword = DEFAULT_KEYWORDS[keyword_idx]
    entry = RawEntry(title=f"News about {keyword} today", link="http://x.com", published=None, summary="", source_name="T", source_url="http://x.com")
    assert kf.matches(entry) is True


def test_entry_without_keywords_discarded():
    """An entry with no photonics keywords is discarded."""
    kf = KeywordFilter()
    entry = RawEntry(title="Football match results", link="http://x.com", published=None, summary="The team won 3-1 in the championship.", source_name="Sports", source_url="http://x.com")
    assert kf.matches(entry) is False


# --- Unit Tests ---

def test_chinese_keyword_match(kf):
    """Chinese keywords use substring matching."""
    entry = RawEntry(title="国产硅光芯片取得重大突破", link="http://x.com", published=None, summary="", source_name="T", source_url="http://x.com")
    assert kf.matches(entry) is True


def test_english_case_insensitive(kf):
    """English keywords are case-insensitive."""
    entry = RawEntry(title="New SILICON PHOTONICS Device", link="http://x.com", published=None, summary="", source_name="T", source_url="http://x.com")
    assert kf.matches(entry) is True


def test_filter_entries_returns_tuple(kf, sample_raw_entries):
    """filter_entries returns (matched, discarded) with correct counts."""
    matched, discarded = kf.filter_entries(sample_raw_entries)
    assert len(matched) == 2  # silicon photonics + TFLN
    assert len(discarded) == 1  # sports
    assert matched[0].title.startswith("New silicon")
    assert discarded[0].title.startswith("Sports")


def test_minimum_keywords_present():
    """Keyword list contains all required minimum keywords from Req 2.2."""
    required = ["silicon photonics", "EML", "TFLN", "CPO", "quantum photonics",
                "optical amplifier", "PIC", "waveguide", "modulator", "laser",
                "硅光", "光芯片", "光模块", "调制器", "激光器", "光放大器", "量子光子"]
    kf = KeywordFilter()
    for kw in required:
        assert any(kw.lower() in k.lower() for k in kf.keywords), f"Missing keyword: {kw}"
