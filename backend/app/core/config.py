"""
Application configuration via environment variables.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://photoncloud:password@localhost:5432/photoncloud"

    # OpenAI (for AI Enricher)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # RSS Scheduler
    RSS_FETCH_INTERVAL_HOURS: int = 6
    RSS_FETCH_TIMEOUT_SECONDS: int = 30

    # News API
    NEWS_PAGE_SIZE_MAX: int = 100
    NEWS_RETENTION_DAYS: int = 365

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
