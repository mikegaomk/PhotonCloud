"""
Photonics News Auto-Fetcher
Fetches latest photonics/silicon photonics news from RSS feeds and updates newsData.ts
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
}


def is_photonics_related(title, summary):
    """Check if article is related to photonics"""
    text = (title + ' ' + summary).lower()
    return any(kw.lower() in text for kw in PHOTONICS_KEYWORDS)


def extract_chip_tags(title, summary):
    """Extract relevant chip technology tags"""
    text = (title + ' ' + summary).lower()
    tags = []
    for tag, keywords in TAG_KEYWORDS.items():
        if any(kw.lower() in text for kw in keywords):
            tags.append(tag)
    return tags if tags else ['Photonics']


def determine_importance(title, summary):
    """Determine news importance"""
    text = (title + ' ' + summary).lower()
    high_keywords = ['breakthrough', 'first', 'record', 'billion', 'launch',
                     'revolution', '突破', '首次', '世界纪录', '发布']
    if any(kw in text for kw in high_keywords):
        return 'high'
    return 'medium'


def generate_id(title):
    """Generate unique ID from title"""
    return 'auto_' + md5(title.encode()).hexdigest()[:8]


def fetch_news_from_feeds():
    """Fetch news from all RSS feeds"""
    articles = []
    cutoff_date = datetime.now() - timedelta(days=7)  # Last 7 days only

    for feed_info in FEEDS:
        try:
            feed = feedparser.parse(feed_info['url'])
            for entry in feed.entries[:20]:  # Max 20 per feed
                title = entry.get('title', '')
                summary = entry.get('summary', entry.get('description', ''))
                # Clean HTML from summary
                summary = re.sub(r'<[^>]+>', '', summary).strip()[:200]

                if not is_photonics_related(title, summary):
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

                articles.append({
                    'id': generate_id(title),
                    'title': title,
                    'summary': summary,
                    'source': feed_info['source'],
                    'sourceUrl': entry.get('link', ''),
                    'date': date_str,
                    'category': feed_info['category'],
                    'region': feed_info['region'],
                    'chipTags': extract_chip_tags(title, summary),
                    'importance': determine_importance(title, summary),
                    'content': summary,
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
    content = article['content'].replace('`', "'")
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
        print(f"  - [{a['date']}] {a['title']}")
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
