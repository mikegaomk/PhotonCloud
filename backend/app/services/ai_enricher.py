"""
AI Enricher service — classifies, summarizes, and tags news entries using OpenAI.
"""
import asyncio
import json
import logging
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from app.core.config import settings
from app.services.rss_crawler import RawEntry

logger = logging.getLogger(__name__)

VALID_CATEGORIES = {"industry", "research", "policy", "funding", "product", "standard"}
VALID_REGIONS = {"global", "china", "us", "europe", "japan", "korea"}


@dataclass
class EnrichedEntry:
    title: str
    link: str
    published: Optional[datetime]
    summary_zh: str
    source_name: str
    source_url: str
    category: str
    region: str
    chip_tags: list[str]
    importance: str


SYSTEM_PROMPT = """You are a photonics industry analyst. Analyze the given news entry and return a JSON object with:
1. "category": one of "industry", "research", "policy", "funding", "product", "standard"
2. "summary_zh": a Chinese summary (50-150 characters) capturing the key information
3. "region": one of "global", "china", "us", "europe", "japan", "korea" based on geographic relevance
4. "chip_tags": list of relevant photonic chip technology tags (e.g., "CPO", "TFLN", "Silicon Photonics", "EML", "Quantum Photonics", "Optical Amplifier", "CW Laser")
5. "importance": "high" if it's a major industry announcement, breakthrough, or policy change; otherwise "medium"

Return ONLY valid JSON, no markdown or explanation."""


class AIEnricher:
    """Enriches news entries with AI-generated classification, Chinese summary, and tags."""

    def __init__(self, api_key: str | None = None, model: str | None = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.model = model or settings.OPENAI_MODEL
        self._semaphore = asyncio.Semaphore(5)  # Max 5 concurrent API calls

    async def enrich(self, entry: RawEntry) -> EnrichedEntry:
        """
        Classify, summarize, and tag a single entry.
        Falls back to defaults on any AI failure.
        """
        if not self.api_key:
            logger.warning("No OPENAI_API_KEY configured, using fallback defaults")
            return self._fallback(entry)

        try:
            result = await self._call_ai(entry)
            return EnrichedEntry(
                title=entry.title,
                link=entry.link,
                published=entry.published,
                summary_zh=result.get("summary_zh", entry.title[:150]),
                source_name=entry.source_name,
                source_url=entry.source_url,
                category=result.get("category", "industry") if result.get("category") in VALID_CATEGORIES else "industry",
                region=result.get("region", "global") if result.get("region") in VALID_REGIONS else "global",
                chip_tags=result.get("chip_tags", []) if isinstance(result.get("chip_tags"), list) else [],
                importance=result.get("importance", "medium") if result.get("importance") in ("high", "medium", "low") else "medium",
            )
        except Exception as e:
            logger.error(f"AI enrichment failed for '{entry.title[:40]}': {e}")
            return self._fallback(entry)

    async def enrich_batch(self, entries: list[RawEntry]) -> list[EnrichedEntry]:
        """Process entries concurrently with rate limiting (max 5 concurrent)."""
        tasks = [self._rate_limited_enrich(entry) for entry in entries]
        return await asyncio.gather(*tasks)

    async def _rate_limited_enrich(self, entry: RawEntry) -> EnrichedEntry:
        async with self._semaphore:
            return await self.enrich(entry)

    async def _call_ai(self, entry: RawEntry) -> dict:
        """Call OpenAI API with exponential backoff retry."""
        import openai

        client = openai.AsyncOpenAI(api_key=self.api_key)

        user_message = f"Title: {entry.title}\nSource: {entry.source_name}\nSummary: {entry.summary[:300]}"

        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = await client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_message},
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.3,
                    max_tokens=300,
                    timeout=30,
                )
                content = response.choices[0].message.content
                return json.loads(content)
            except openai.RateLimitError:
                wait = 2 ** attempt
                logger.warning(f"Rate limited, retrying in {wait}s (attempt {attempt + 1}/{max_retries})")
                await asyncio.sleep(wait)
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON from AI: {e}")
                return {}

        return {}  # All retries exhausted

    def _fallback(self, entry: RawEntry) -> EnrichedEntry:
        """Default values when AI enrichment is unavailable."""
        return EnrichedEntry(
            title=entry.title,
            link=entry.link,
            published=entry.published,
            summary_zh=entry.title[:150],
            source_name=entry.source_name,
            source_url=entry.source_url,
            category="industry",
            region="global",
            chip_tags=[],
            importance="medium",
        )
