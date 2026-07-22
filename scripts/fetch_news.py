"""
Photonics News Auto-Fetcher
Fetches latest photonics/silicon photonics news from RSS feeds
and updates newsData.ts
"""

import feedparser
import json
import re
import os
from datetime import datetime, timedelta
from hashlib import md5

# RSS Feed sources for photonics news
FEEDS = [
    {
        'url': 'https://www.sciencedaily.com/rss/matter_energy/optics.xml',
        'source': 'Science Daily',
        'category': 'research',
        'region': 'global',
    },
    {
        'url': 'https://picmagazine.net/feed',
        'source': 'PIC Magazine',
        'category': 'industry',
        'region': 'global',
    },
    {
        'url': 'https://www.newelectronics.co.uk/feed',
        'source': 'New Electronics',
        'category': 'industry',
        'region': 'europe',
    },
    {
        'url': 'https://semiconductor-today.com/rss.xml',
        'source': 'Semiconductor Today',
        'category': 'industry',
        'region': 'global',
    },
    {
        'url': 'https://www.eenewseurope.com/en/feed/',
        'source': 'EE News',
        'category': 'industry',
        'region': 'europe',
    },
]

# Keywords to filter photonics-related articles
PHOTONICS_KEYWORDS = [
    'photonic', 'photonics', 'silicon photon', 'optical chip',
    'optoelectron', 'co-packaged optics', 'CPO', 'optical interconnect',
    'photonic integrated', 'PIC', 'silicon nitride', 'SiN',
    'thin film lithium niobate', 'TFLN', 'optical computing',
    'quantum photon', 'laser chip', 'optical transceiver',
    'coherent optics', '800G', '1.6T', 'optical module',
    'waveguide', 'modulator', 'photodetector',
    'light chip', 'integrated photon', 'optical AI',
    'fiber network', 'fiber optic', 'broadband fiber',
]

# Chip tags mapping
TAG_KEYWORDS = {
    'Silicon Photonics': ['silicon photon', 'SiPh', 'silicon-based'],
    'CPO': ['co-packaged optics', 'CPO', 'co packaged'],
    'TFLN': ['lithium niobate', 'TFLN', 'LiNbO3'],
    'Photonic Computing': ['optical computing', 'photonic AI', 'optical neural'],
    'Quantum Photonics': ['quantum photon', 'quantum optic', 'single photon'],
    'Optical Interconnect': ['optical interconnect', '800G', '1.6T', 'transceiver'],
    'PIC': ['photonic integrated', 'PIC', 'integrated photon'],
    'Laser': ['laser', 'CW laser', 'DFB'],
    'Photonics': ['photonic', 'optical', 'fiber', 'optoelectronic'],
}

# Region detection keywords (checked against title + content)
REGION_KEYWORDS = {
    'us': [
        'United States', 'US ', 'U.S.', 'California', 'Texas', 'Illinois',
        'New York', 'Massachusetts', 'Arizona', 'Colorado', 'Oregon',
        'Virginia', 'Silicon Valley', 'MIT', 'Stanford', 'UCLA', 'UCSB',
        'NIST', 'DARPA', 'DOE', 'NSF', 'American',
    ],
    'china': [
        'China', 'Chinese', 'Beijing', 'Shanghai', 'Shenzhen', 'Wuhan',
        'Huawei', '华为', '中国', '中科院', 'CIOMP', 'Tsinghua',
    ],
    'japan': [
        'Japan', 'Japanese', 'Tokyo', 'NTT', 'NEC', 'Fujitsu',
        'Sumitomo', 'Hamamatsu',
    ],
    'korea': [
        'Korea', 'Korean', 'Samsung', 'SK ', 'Seoul', 'KAIST',
    ],
    'europe': [
        'European', 'EU ', 'Germany', 'France', 'Netherlands', 'UK',
        'Ireland', 'Belgium', 'Finland', 'Sweden', 'Switzerland',
        'imec', 'EPFL', 'Fraunhofer',
    ],
}


def is_photonics_related(title, summary):
    """Check if article is related to photonics"""
    text = (title + ' ' + summary).lower()
    return any(kw.lower() in text for kw in PHOTONICS_KEYWORDS)


def extract_chip_tags(title, summary, content=''):
    """Extract relevant chip technology tags"""
    text = (title + ' ' + summary + ' ' + content).lower()
    tags = []
    for tag, keywords in TAG_KEYWORDS.items():
        if tag == 'Photonics':
            continue  # Use as fallback only
        if any(kw.lower() in text for kw in keywords):
            tags.append(tag)
    return tags if tags else ['Photonics']


def determine_importance(title, summary):
    """Determine news importance"""
    text = (title + ' ' + summary).lower()
    high_keywords = ['breakthrough', 'first', 'record', 'billion', 'launch',
                     'revolution', 'milestone', 'raises', 'funding',
                     '突破', '首次', '世界纪录', '发布']
    if any(kw in text for kw in high_keywords):
        return 'high'
    return 'medium'


def detect_region(title, summary, content, feed_region):
    """Detect region from article content, overriding feed default when possible.
    
    The feed_region is used as a fallback. If geographic keywords are found in
    the article text, those take priority.
    """
    text = title + ' ' + summary + ' ' + content
    
    # Score each region by keyword matches
    scores = {}
    for region, keywords in REGION_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text)
        if score > 0:
            scores[region] = score
    
    if scores:
        # Return region with highest score
        best_region = max(scores, key=scores.get)
        return best_region
    
    # Fall back to feed's default region
    return feed_region


def generate_id(title):
    """Generate unique ID from title"""
    return 'auto_' + md5(title.encode()).hexdigest()[:8]


def truncate_at_sentence(text, max_chars=1500):
    """Truncate text at the nearest sentence boundary without exceeding max_chars.
    
    Avoids cutting mid-sentence which produces incomplete content.
    """
    if len(text) <= max_chars:
        return text
    
    # Look for sentence endings (. ! ?) before max_chars
    truncated = text[:max_chars]
    
    # Find the last sentence-ending punctuation
    last_period = max(
        truncated.rfind('. '),
        truncated.rfind('.\n'),
        truncated.rfind('? '),
        truncated.rfind('! '),
    )
    
    # If we found a sentence boundary, cut there
    if last_period > max_chars * 0.5:  # At least 50% of max to avoid too-short results
        return truncated[:last_period + 1]
    
    # Fallback: cut at last space to avoid splitting a word
    last_space = truncated.rfind(' ')
    if last_space > max_chars * 0.5:
        return truncated[:last_space] + '.'
    
    return truncated


def extract_text_from_element(element):
    """Extract text from a BeautifulSoup element, preserving word spacing.
    
    The default get_text() can merge adjacent inline elements without spaces,
    producing results like 'Adtranhas' instead of 'Adtran has'.
    """
    # Use separator=' ' to ensure spaces between elements, then clean up
    text = element.get_text(separator=' ', strip=False)
    # Collapse multiple whitespace into single space
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def fetch_article_content(url, title, summary):
    """Fetch article page and extract full content with proper formatting."""
    if not url:
        return _make_content_from_summary(title, summary)

    try:
        import requests
        from bs4 import BeautifulSoup

        headers = {'User-Agent': 'Mozilla/5.0 (compatible; PhotonCloudBot/1.0)'}
        resp = requests.get(url, headers=headers, timeout=10)
        if resp.status_code != 200:
            return _make_content_from_summary(title, summary)

        soup = BeautifulSoup(resp.text, 'html.parser')

        # Remove script, style, nav, footer elements
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            tag.decompose()

        # Try common article content selectors
        content_elem = (
            soup.find('article') or
            soup.find(class_=re.compile(r'article|post|content|entry', re.I)) or
            soup.find('main')
        )

        if content_elem:
            paragraphs = content_elem.find_all('p')
        else:
            paragraphs = soup.find_all('p')

        # Extract text from paragraphs with proper spacing
        text_parts = []
        for p in paragraphs[:15]:  # Up to 15 paragraphs
            text = extract_text_from_element(p)
            if len(text) > 50:  # Skip short/navigation paragraphs
                text_parts.append(text)

        if text_parts:
            body = '\n\n'.join(text_parts)
            full_content = f"## {title}\n\n{body}"
            # Truncate at sentence boundary, not mid-word
            return truncate_at_sentence(full_content, max_chars=1500)

    except Exception as e:
        print(f"  Could not fetch content from {url}: {e}")

    return _make_content_from_summary(title, summary)


def _make_content_from_summary(title, summary):
    """Create content from title + summary when full fetch fails."""
    if summary:
        return f"## {title}\n\n{summary}"
    return f"## {title}"


def generate_summary(title, content, max_len=200):
    """Generate a summary from article content if RSS summary is empty.
    
    Extracts the first meaningful sentence(s) from the content body,
    skipping the heading line.
    """
    if not content:
        return ''
    
    # Strip the markdown heading
    lines = content.split('\n')
    body_lines = [l for l in lines if l.strip() and not l.startswith('##')]
    body = ' '.join(body_lines)
    
    if not body:
        return ''
    
    # Take first sentence(s) up to max_len
    result = ''
    sentences = re.split(r'(?<=[.!?])\s+', body)
    for sentence in sentences:
        if len(result) + len(sentence) + 1 <= max_len:
            result += (' ' if result else '') + sentence
        else:
            break
    
    # If we got nothing (single very long sentence), truncate at word boundary
    if not result and body:
        result = body[:max_len]
        last_space = result.rfind(' ')
        if last_space > max_len * 0.6:
            result = result[:last_space]
    
    return result.strip()


def fetch_news_from_feeds():
    """Fetch news from all RSS feeds"""
    articles = []
    cutoff_date = datetime.now() - timedelta(days=7)  # Last 7 days only

    for feed_info in FEEDS:
        try:
            print(f"  Fetching {feed_info['source']}...")
            feed = feedparser.parse(feed_info['url'])
            for entry in feed.entries[:20]:  # Max 20 per feed
                title = entry.get('title', '')
                raw_summary = entry.get('summary', entry.get('description', ''))
                # Clean HTML from summary, preserve word spacing
                clean_summary = re.sub(r'<[^>]+>', ' ', raw_summary)
                clean_summary = re.sub(r'\s+', ' ', clean_summary).strip()[:300]

                if not is_photonics_related(title, clean_summary):
                    continue

                # Parse date
                published = entry.get('published_parsed') or entry.get('updated_parsed')
                if published:
                    pub_date = datetime(*published[:6])
                    if pub_date < cutoff_date:
                        continue
                    date_str = pub_date.strftime('%Y-%m-%d')
                else:
                    date_str = datetime.now().strftime('%Y-%m-%d')

                # Fetch full article content
                article_url = entry.get('link', '')
                article_content = fetch_article_content(article_url, title, clean_summary)

                # Generate summary from content if RSS summary is empty/short
                if len(clean_summary) < 50:
                    clean_summary = generate_summary(title, article_content)

                # Detect region from content (overrides feed default)
                region = detect_region(
                    title, clean_summary, article_content, feed_info['region']
                )

                articles.append({
                    'id': generate_id(title),
                    'title': title,
                    'summary': clean_summary[:200],
                    'source': feed_info['source'],
                    'sourceUrl': article_url,
                    'date': date_str,
                    'category': feed_info['category'],
                    'region': region,
                    'chipTags': extract_chip_tags(title, clean_summary, article_content),
                    'importance': determine_importance(title, clean_summary),
                    'content': article_content,
                })
        except Exception as e:
            print(f"Error fetching {feed_info['source']}: {e}")
            continue

    # Sort by date descending, limit to 5 newest
    articles.sort(key=lambda x: x['date'], reverse=True)
    return articles[:5]


def read_current_news_file():
    """Read current newsData.ts file"""
    filepath = 'src/data/newsData.ts'
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()


def get_existing_ids(content):
    """Extract existing news IDs from the file"""
    return set(re.findall(r"id:\s*'([^']+)'", content))


def format_news_entry(article):
    """Format a single news article as TypeScript object"""
    chip_tags = json.dumps(article['chipTags'], ensure_ascii=False)
    # Escape backticks in content to avoid breaking template literals
    content = article['content'].replace('`', "'")
    # Escape single quotes in title/summary for TS string literals
    title = article['title'].replace("'", "\\'")
    summary = article['summary'].replace("'", "\\'")

    lines = [
        "  {",
        "    id: '" + article['id'] + "',",
        "    title: '" + title + "',",
        "    summary: '" + summary + "',",
        "    source: '" + article['source'] + "',",
        "    sourceUrl: '" + article['sourceUrl'] + "',",
        "    date: '" + article['date'] + "',",
        "    category: '" + article['category'] + "',",
        "    region: '" + article['region'] + "',",
        "    chipTags: " + chip_tags + ",",
        "    importance: '" + article['importance'] + "',",
        "    content: `" + content + "`,",
        "  }",
    ]
    return "\n".join(lines)


def update_news_file(new_articles):
    """Insert new articles into newsData.ts"""
    content = read_current_news_file()
    existing_ids = get_existing_ids(content)

    # Filter out duplicates
    new_articles = [a for a in new_articles if a['id'] not in existing_ids]

    if not new_articles:
        print("No new articles to add.")
        return False

    # Format new entries
    new_entries = ',\n'.join(format_news_entry(a) for a in new_articles)

    # Insert after "const initialNews: NewsItem[] = ["
    insert_point = "const initialNews: NewsItem[] = [\n"
    if insert_point not in content:
        # Try alternative format
        insert_point = "const initialNews: NewsItem[] = ["
        content = content.replace(insert_point, insert_point + "\n" + new_entries + ",")
    else:
        content = content.replace(insert_point, insert_point + new_entries + ",\n")

    # Write back
    with open('src/data/newsData.ts', 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Added {len(new_articles)} new articles:")
    for a in new_articles:
        print(f"  - [{a['date']}] {a['title']} (region: {a['region']})")
    return True


if __name__ == '__main__':
    print("Fetching photonics news from RSS feeds...")
    articles = fetch_news_from_feeds()
    print(f"Found {len(articles)} relevant articles")

    if articles:
        updated = update_news_file(articles)
        if updated:
            print("newsData.ts updated successfully!")
        else:
            print("No updates needed.")
    else:
        print("No new photonics articles found.")
