# Tasks

## Task 1: Database schema and ORM models
- **Requirements:** Requirement 4 (数据持久化)
- **Design Reference:** Data Models section
- **Status:** not started

### Subtasks
- [ ] Create `backend/app/models/news.py` with SQLAlchemy ORM models (`NewsItem`, `FetchLog`)
- [ ] Create `backend/app/core/database.py` with async engine setup (`create_async_engine`, `async_sessionmaker`)
- [ ] Create `backend/app/core/config.py` with Pydantic Settings class (DATABASE_URL, OPENAI_API_KEY, RSS_FETCH_INTERVAL_HOURS, etc.)
- [ ] Create Alembic migration for `news_items` and `fetch_logs` tables with indexes
- [ ] Update `backend/requirements.txt` to add: sqlalchemy[asyncio], asyncpg, alembic, pydantic-settings
- [ ] Update `docker-compose.yml` to add DATABASE_URL and OPENAI_API_KEY environment variables

## Task 2: RSS Crawler service
- **Requirements:** Requirement 1 (RSS 信息源抓取)
- **Design Reference:** RSS Crawler component interface
- **Status:** not started

### Subtasks
- [ ] Create `backend/app/services/rss_crawler.py` with `RSSCrawler` class and `RawEntry` dataclass
- [ ] Implement `fetch_source()` method using `feedparser` (parse title, link, published date, summary, source name)
- [ ] Implement `fetch_all()` method with per-source error isolation (try/except per source, collect errors)
- [ ] Configure 5 RSS sources: optics.org, photonics.com, OFweek, C114, arXiv physics.optics
- [ ] Add HTTP timeout (30s) and user-agent header for requests
- [ ] Add `backend/requirements.txt` entry: feedparser, httpx

## Task 3: Keyword Filter service
- **Requirements:** Requirement 2 (关键词过滤)
- **Design Reference:** Keyword Filter component interface
- **Status:** not started

### Subtasks
- [ ] Create `backend/app/services/keyword_filter.py` with `KeywordFilter` class
- [ ] Implement keyword list with 20+ photonics terms (English case-insensitive, Chinese substring match)
- [ ] Implement `matches(entry)` method checking title + summary against keyword list
- [ ] Implement `filter_entries(entries)` returning (matched, discarded) tuple
- [ ] Add logging for discarded entries (title + reason)

## Task 4: AI Enricher service
- **Requirements:** Requirement 3 (AI 分类与摘要生成)
- **Design Reference:** AI Enricher component interface
- **Status:** not started

### Subtasks
- [ ] Create `backend/app/services/ai_enricher.py` with `AIEnricher` class and `EnrichedEntry` dataclass
- [ ] Implement OpenAI API call with structured JSON output prompt (category, summary_zh, region, chip_tags, importance)
- [ ] Implement `enrich(entry)` method with single-entry processing
- [ ] Implement `enrich_batch(entries)` with asyncio.gather and rate limiting (max 5 concurrent)
- [ ] Implement graceful fallback: on AI failure, set category="industry", summary=title[:150], region="global", chip_tags=[], importance="medium"
- [ ] Add exponential backoff retry (1s, 2s, 4s, max 3 retries) for 429 rate limit errors
- [ ] Add `backend/requirements.txt` entry: openai

## Task 5: News Store (database CRUD)
- **Requirements:** Requirement 4 (数据持久化)
- **Design Reference:** News Store component interface
- **Status:** not started

### Subtasks
- [ ] Create `backend/app/services/news_store.py` with `NewsStore` class
- [ ] Implement `exists_by_url(source_url)` for deduplication check
- [ ] Implement `save_entry(enriched_entry)` to persist to `news_items` table
- [ ] Implement `query(category, region, tag, page, page_size)` with filtering, pagination, and total count
- [ ] Implement `get_stats()` returning total count, per-category counts, per-region counts
- [ ] Handle unique constraint violation on source_url gracefully (skip duplicate)

## Task 6: Scheduler and pipeline orchestration
- **Requirements:** Requirement 7 (定时调度与监控)
- **Design Reference:** Scheduler component interface
- **Status:** not started

### Subtasks
- [ ] Create `backend/app/services/scheduler.py` with `NewsScheduler` class
- [ ] Implement `run_pipeline()` executing: crawl → deduplicate → filter → enrich → store
- [ ] Write `FetchLog` record at start and update on completion with statistics
- [ ] Implement `start()` to register APScheduler interval job (default 6 hours)
- [ ] Implement `get_health()` returning last fetch cycle result and system status
- [ ] Implement degraded state detection: mark "degraded" if all sources fail, retry after 30 min
- [ ] Add `backend/requirements.txt` entry: apscheduler
- [ ] Register scheduler startup in `backend/main.py` via `@app.on_event("startup")`

## Task 7: News REST API endpoints
- **Requirements:** Requirement 5 (REST API 接口)
- **Design Reference:** News API Router section
- **Status:** not started

### Subtasks
- [ ] Create `backend/app/routers/news.py` with FastAPI APIRouter
- [ ] Implement `GET /api/news` with query params: category, region, tag, page (default 1), page_size (default 20, max 100)
- [ ] Implement response serialization matching existing frontend `NewsItem` interface (camelCase mapping)
- [ ] Implement `GET /api/news/stats` returning aggregated statistics
- [ ] Implement `GET /api/news/health` returning last_fetch timestamp, entry_count, system status
- [ ] Add input validation: return HTTP 422 for invalid params (page < 1, page_size > 100, invalid category/region values)
- [ ] Register news router in `backend/main.py`: `app.include_router(news_router)`

## Task 8: Frontend integration — replace mock data with API calls
- **Requirements:** Requirement 6 (前端资讯页面集成)
- **Design Reference:** Frontend integration section
- **Status:** not started

### Subtasks
- [ ] Create `src/data/newsService.ts` with `fetchNews(params)` and `fetchNewsStats()` API client functions
- [ ] Update `src/pages/NewsPage.tsx` to call `fetchNews()` on mount instead of `getNews()` from localStorage
- [ ] Add loading state (spinner) while API call is pending
- [ ] Add error state with retry button when API is unreachable
- [ ] Implement server-side filtering: pass category/region filter selections as query params to API
- [ ] Add pagination: "加载更多" button or infinite scroll, incrementing page param
- [ ] Add graceful fallback: if API fails, show existing localStorage data with a banner indicating stale data
- [ ] Configure API base URL via environment variable / Vite env (`VITE_API_BASE_URL`)

## Task 9: Testing
- **Requirements:** All requirements
- **Design Reference:** Testing Strategy section
- **Status:** not started

### Subtasks
- [ ] Create `backend/tests/conftest.py` with test database fixture, mock HTTP responses, mock OpenAI
- [ ] Write property tests for keyword filter (Property 4): random text ± keywords → verify match/reject
- [ ] Write property tests for AI enricher output validation (Property 5): verify category/region enum values
- [ ] Write property tests for deduplication (Property 3): seed DB + new entries → verify only novel stored
- [ ] Write property tests for query filtering (Property 9): random DB entries + random filters → verify results match
- [ ] Write property tests for date ordering (Property 10): query → verify descending order
- [ ] Write unit tests for RSS crawler error isolation (mock failures per source)
- [ ] Write unit tests for AI fallback defaults (simulate API error)
- [ ] Write integration test for full pipeline: mock feeds → DB → API response → verify schema
- [ ] Add `backend/requirements-dev.txt`: pytest, pytest-asyncio, hypothesis, httpx, pytest-httpserver

## Task 10: Docker and deployment configuration
- **Requirements:** Requirements 4, 7
- **Design Reference:** Configuration section
- **Status:** not started

### Subtasks
- [ ] Update `backend/Dockerfile` to install new requirements and set working directory
- [ ] Update `docker-compose.yml` with new environment variables (OPENAI_API_KEY, RSS_FETCH_INTERVAL_HOURS)
- [ ] Add Alembic migration command to Docker entrypoint (run migrations on startup)
- [ ] Create `backend/.env.example` documenting all required environment variables
- [ ] Test full `docker-compose up` flow: PostgreSQL → backend starts → scheduler triggers → API responds
