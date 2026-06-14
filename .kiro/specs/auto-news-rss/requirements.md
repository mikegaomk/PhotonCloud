# Requirements Document

## Introduction

光芯云 PhotonCloud 平台的自动资讯 RSS 聚合系统。该系统自动从全球光子学行业 RSS 信息源（包括英文源 optics.org、photonics.com、arXiv 和中文源 OFweek、C114）抓取资讯，通过关键词过滤筛选光子学相关内容，利用 AI 进行自动分类和摘要生成，存储到 PostgreSQL 数据库，并通过 REST API 将实时资讯展示在前端资讯页面，替代当前的静态 mock 数据。

## Glossary

- **RSS_Crawler**: 后端定时爬虫服务，负责从配置的 RSS 信息源获取资讯条目
- **Keyword_Filter**: 关键词过滤模块，根据预定义的光子学关键词列表筛选相关资讯
- **AI_Enricher**: AI 增强模块，负责对过滤后的资讯进行自动分类和中文摘要生成
- **News_Store**: PostgreSQL 数据库中的资讯存储层，管理资讯的持久化和查询
- **News_API**: FastAPI 后端提供的资讯 REST 接口，供前端消费
- **News_Frontend**: React 前端资讯页面组件，实时展示聚合后的资讯内容
- **RSS_Source**: 被配置的外部 RSS 信息源，包括 optics.org、photonics.com、OFweek、C114、arXiv
- **Scheduler**: 定时调度器，控制 RSS 抓取任务的执行频率

## Requirements

### Requirement 1: RSS 信息源抓取

**User Story:** As a 光子学工程师, I want 平台自动从多个行业信息源抓取最新资讯, so that 我无需手动浏览多个网站即可获取全球光子学动态。

#### Acceptance Criteria

1. THE Scheduler SHALL trigger the RSS_Crawler to fetch new entries from all configured RSS_Source instances every 6 hours
2. WHEN the RSS_Crawler fetches entries from an RSS_Source, THE RSS_Crawler SHALL parse the RSS/Atom feed XML and extract title, link, publication date, source name, and content summary for each entry
3. THE RSS_Crawler SHALL support fetching from the following RSS_Source instances: optics.org, photonics.com, OFweek (光电新闻), C114 (通信网), and arXiv (physics.optics category)
4. WHEN an RSS_Source is unreachable or returns an error, THE RSS_Crawler SHALL log the error with timestamp and source name, skip the failed source, and continue processing remaining sources
5. WHEN the RSS_Crawler encounters a previously fetched entry (identified by source URL), THE RSS_Crawler SHALL skip the duplicate entry without creating a new record

### Requirement 2: 关键词过滤

**User Story:** As a 光子学工程师, I want 系统只保留与光子学相关的资讯, so that 我看到的内容都是与我的专业领域相关的高质量信息。

#### Acceptance Criteria

1. WHEN the RSS_Crawler fetches a new entry, THE Keyword_Filter SHALL evaluate the entry title and summary against a configurable list of photonics keywords
2. THE Keyword_Filter SHALL maintain a keyword list that includes at minimum: silicon photonics, EML, TFLN, CPO, quantum photonics, optical amplifier, photonic integrated circuit, PIC, waveguide, modulator, laser, photodetector, optical interconnect, 硅光, 光芯片, 光模块, 光子集成, 调制器, 激光器, 光放大器, 量子光子
3. WHEN an entry matches at least one keyword (case-insensitive matching for English, substring matching for Chinese), THE Keyword_Filter SHALL pass the entry to the AI_Enricher for further processing
4. WHEN an entry matches zero keywords, THE Keyword_Filter SHALL discard the entry and log the discard action with the entry title

### Requirement 3: AI 分类与摘要生成

**User Story:** As a 光子学工程师, I want 每条资讯被自动分类并生成中文摘要, so that 我可以快速浏览和按类别筛选感兴趣的内容。

#### Acceptance Criteria

1. WHEN the Keyword_Filter passes an entry to the AI_Enricher, THE AI_Enricher SHALL classify the entry into exactly one category from: industry (产业动态), research (科研突破), policy (政策法规), funding (投融资), product (产品发布), standard (标准进展)
2. WHEN the AI_Enricher processes an entry, THE AI_Enricher SHALL generate a Chinese summary of 50 to 150 characters that captures the key information of the entry
3. WHEN the AI_Enricher processes an English-language entry, THE AI_Enricher SHALL generate the summary in Chinese regardless of the original language
4. WHEN the AI_Enricher processes an entry, THE AI_Enricher SHALL assign a region tag from: global, china, us, europe, japan, korea based on the geographic relevance of the content
5. WHEN the AI_Enricher processes an entry, THE AI_Enricher SHALL extract relevant chip technology tags (such as CPO, TFLN, Silicon Photonics, EML, Quantum Photonics) from the entry content
6. IF the AI_Enricher service is unavailable or returns an error, THEN THE AI_Enricher SHALL store the entry with category set to "industry" (default), the original title as the summary, and an empty tag list, and log the error for retry

### Requirement 4: 数据持久化

**User Story:** As a 平台管理员, I want 所有资讯数据存储在 PostgreSQL 数据库中, so that 数据可靠持久化且支持高效查询。

#### Acceptance Criteria

1. THE News_Store SHALL persist each processed news entry with the following fields: unique identifier, title, summary, original source URL, source name, publication date, fetch timestamp, category, region, chip technology tags, importance level, and original content link
2. WHEN a new entry is stored, THE News_Store SHALL assign a default importance level of "medium" unless the AI_Enricher explicitly sets it to "high" based on content relevance
3. THE News_Store SHALL support querying entries by category, region, date range, and chip technology tags with pagination
4. THE News_Store SHALL retain entries for a minimum of 365 days before automatic archival

### Requirement 5: REST API 接口

**User Story:** As a 前端应用, I want 通过标准 REST API 获取资讯数据, so that 前端页面可以实时展示最新的聚合资讯。

#### Acceptance Criteria

1. THE News_API SHALL expose a GET /api/news endpoint that returns a paginated list of news entries sorted by publication date in descending order
2. THE News_API SHALL support the following query parameters on GET /api/news: category (string), region (string), tag (string), page (integer, default 1), page_size (integer, default 20, maximum 100)
3. THE News_API SHALL return response bodies in JSON format conforming to the existing NewsItem interface structure defined in the frontend (id, title, summary, source, sourceUrl, date, category, region, chipTags, importance)
4. WHEN the News_API receives a request with invalid query parameters, THE News_API SHALL return HTTP 422 with a descriptive error message
5. THE News_API SHALL expose a GET /api/news/stats endpoint that returns aggregated statistics including total entry count, entries per category, and entries per region

### Requirement 6: 前端资讯页面集成

**User Story:** As a 光子学工程师, I want 资讯页面实时展示自动聚合的最新行业资讯, so that 我每次访问平台都能看到最新的光子学动态。

#### Acceptance Criteria

1. WHEN the News_Frontend loads, THE News_Frontend SHALL fetch news entries from GET /api/news instead of reading from localStorage mock data
2. THE News_Frontend SHALL display a loading state while fetching data from the News_API
3. WHEN the News_API returns an error or is unreachable, THE News_Frontend SHALL display an error message and offer a retry button to the user
4. THE News_Frontend SHALL support infinite scroll or pagination to load additional entries beyond the initial page
5. WHILE the user applies category or region filters, THE News_Frontend SHALL send corresponding query parameters to the News_API and display filtered results from the server

### Requirement 7: 定时调度与监控

**User Story:** As a 平台管理员, I want 抓取任务按计划自动执行并可监控运行状态, so that 我可以确保系统持续正常运行并及时发现异常。

#### Acceptance Criteria

1. THE Scheduler SHALL execute the RSS fetch pipeline (crawl → filter → AI enrich → store) every 6 hours starting from application startup
2. WHEN a scheduled fetch cycle completes, THE Scheduler SHALL log a summary including: number of sources fetched, entries found, entries passing filter, entries stored, and errors encountered
3. THE News_API SHALL expose a GET /api/news/health endpoint that returns the last fetch cycle timestamp, number of entries in the database, and overall system status (healthy/degraded/error)
4. IF a fetch cycle fails for all configured sources, THEN THE Scheduler SHALL mark the system status as "degraded" and retry after 30 minutes

