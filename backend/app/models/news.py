"""
SQLAlchemy ORM models for the news aggregation system.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, Integer, Text, text
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY

from app.core.database import Base


class NewsItem(Base):
    """Stores individual news entries from RSS feeds after enrichment."""
    __tablename__ = "news_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    summary = Column(String(500), nullable=False)
    source_name = Column(String(100), nullable=False)
    source_url = Column(String(2000), nullable=False, unique=True, index=True)
    published_at = Column(DateTime(timezone=True))
    fetched_at = Column(DateTime(timezone=True), server_default=text("NOW()"))
    category = Column(String(20), nullable=False, default="industry")
    region = Column(String(20), nullable=False, default="global")
    chip_tags = Column(ARRAY(String), nullable=False, server_default="{}")
    importance = Column(String(10), nullable=False, default="medium")
    content_link = Column(String(2000))
    created_at = Column(DateTime(timezone=True), server_default=text("NOW()"))

    def __repr__(self):
        return f"<NewsItem {self.title[:40]}>"


class FetchLog(Base):
    """Logs each RSS fetch cycle for monitoring and health checks."""
    __tablename__ = "fetch_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    started_at = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True))
    sources_attempted = Column(Integer, default=0)
    sources_succeeded = Column(Integer, default=0)
    entries_found = Column(Integer, default=0)
    entries_passed_filter = Column(Integer, default=0)
    entries_stored = Column(Integer, default=0)
    errors = Column(JSONB, server_default="[]")
    status = Column(String(20), default="running")

    def __repr__(self):
        return f"<FetchLog {self.id} status={self.status}>"
