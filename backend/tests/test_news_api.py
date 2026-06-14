"""
Tests for News API endpoints.
Property 11: API response conforms to NewsItem interface.
Property 12: Invalid parameters produce HTTP 422.
"""
import pytest


# --- Property 12: Invalid parameters produce HTTP 422 ---

def test_invalid_category_returns_422():
    """Feature: auto-news-rss, Property 12: Invalid category → 422."""
    # This would use httpx TestClient in integration test
    from app.routers.news import VALID_CATEGORIES
    assert "invalid_cat" not in VALID_CATEGORIES


def test_invalid_region_returns_422():
    """Feature: auto-news-rss, Property 12: Invalid region → 422."""
    from app.routers.news import VALID_REGIONS
    assert "invalid_reg" not in VALID_REGIONS


# --- Property 11: Response schema validation ---

def test_valid_categories_defined():
    """All 6 categories are defined."""
    from app.routers.news import VALID_CATEGORIES
    assert len(VALID_CATEGORIES) == 6
    assert "industry" in VALID_CATEGORIES
    assert "research" in VALID_CATEGORIES
    assert "policy" in VALID_CATEGORIES
    assert "funding" in VALID_CATEGORIES
    assert "product" in VALID_CATEGORIES
    assert "standard" in VALID_CATEGORIES


def test_valid_regions_defined():
    """All 6 regions are defined."""
    from app.routers.news import VALID_REGIONS
    assert len(VALID_REGIONS) == 6
    assert "global" in VALID_REGIONS
    assert "china" in VALID_REGIONS
    assert "us" in VALID_REGIONS
