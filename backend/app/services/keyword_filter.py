"""
Keyword Filter service — filters RSS entries for photonics relevance.
"""
import logging
import re
from typing import Sequence

from app.services.rss_crawler import RawEntry

logger = logging.getLogger(__name__)

# Default photonics keyword list (English + Chinese)
DEFAULT_KEYWORDS = [
    # English keywords (case-insensitive matching)
    "silicon photonics", "photonic", "EML", "TFLN", "CPO",
    "quantum photonics", "optical amplifier", "photonic integrated circuit",
    "PIC", "waveguide", "modulator", "laser", "photodetector",
    "optical interconnect", "lithium niobate", "co-packaged optics",
    "EDFA", "SOA", "FDTD", "grating coupler", "microring",
    "MZI", "Mach-Zehnder", "InP", "GaAs", "SiN",
    "optical computing", "photonic computing", "LiDAR",
    # Chinese keywords (substring matching)
    "硅光", "光芯片", "光模块", "光子集成", "调制器",
    "激光器", "光放大器", "量子光子", "光互连", "铌酸锂",
    "光电共封装", "光计算", "光纤通信", "光探测器",
    "波导", "光栅耦合", "微环", "光子芯片", "光引擎",
]


class KeywordFilter:
    """Filters RSS entries by matching title/summary against photonics keywords."""

    def __init__(self, keywords: list[str] | None = None):
        self.keywords = keywords or DEFAULT_KEYWORDS
        # Precompile English patterns for performance
        self._en_patterns = [
            re.compile(re.escape(kw), re.IGNORECASE)
            for kw in self.keywords if all(ord(c) < 0x4E00 for c in kw)
        ]
        # Chinese keywords: simple substring
        self._zh_keywords = [
            kw for kw in self.keywords if any(ord(c) >= 0x4E00 for c in kw)
        ]

    def matches(self, entry: RawEntry) -> bool:
        """
        Check if entry title or summary matches any keyword.
        English: case-insensitive regex match.
        Chinese: substring match.
        """
        text = f"{entry.title} {entry.summary}"

        # Check English patterns
        for pattern in self._en_patterns:
            if pattern.search(text):
                return True

        # Check Chinese keywords
        for kw in self._zh_keywords:
            if kw in text:
                return True

        return False

    def filter_entries(self, entries: Sequence[RawEntry]) -> tuple[list[RawEntry], list[RawEntry]]:
        """
        Partition entries into (matched, discarded).
        Matched entries proceed to AI enrichment.
        Discarded entries are logged and dropped.
        """
        matched: list[RawEntry] = []
        discarded: list[RawEntry] = []

        for entry in entries:
            if self.matches(entry):
                matched.append(entry)
            else:
                discarded.append(entry)
                logger.debug(f"Discarded (no keyword match): {entry.title[:60]}")

        logger.info(f"Keyword filter: {len(matched)} matched, {len(discarded)} discarded out of {len(entries)} total")
        return matched, discarded
