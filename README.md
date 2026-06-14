# 光芯云 PhotonCloud

**国产光芯片设计第一云平台** — 云原生仿真引擎 + 国产 Foundry PDK 聚合

## 快速启动

### Docker 一键部署（推荐）

```bash
chmod +x setup.sh
./setup.sh
```

访问:
- 前端: http://localhost:3000
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

### 开发模式

```bash
# 前端
npm install
npm run dev              # → http://localhost:5173

# 后端（需 Python 3.10+）
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env     # 编辑填入 OPENAI_API_KEY
uvicorn main:app --reload --port 8000
```

## 演示账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| zhangwei | demo123 | 工程师 |
| lina | demo123 | 研究员 |
| admin | admin123 | 管理员 |

## 平台功能

| 模块 | 说明 |
|------|------|
| 🏠 首页 | 商业着陆页 + 定价 |
| ☁️ 云仿真 | 5 引擎 + GPU 集群 + 12 模板 |
| 🏭 PDK 聚合 | 6 家 Foundry + 器件库 + GDSFactory |
| 📊 设计仿真 | 6 设计工具 + 8 仿真器 + S 参数可视化 |
| 📡 资讯 | RSS 自动聚合 + AI 分类 |
| 📚 芯片库 | 8 大技术方向 + 深度文章 |
| 💬 社区 | 论坛 + 帖子回复 |
| 🔍 搜索 | 全局搜索 (⌘K) |
| 🌐 国际化 | 中英文切换 |

## 技术栈

| 层面 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + Tailwind CSS + Recharts |
| 后端 | FastAPI + SQLAlchemy 2.0 + APScheduler + OpenAI |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose + Nginx |
| 测试 | Playwright (E2E) + Pytest + Hypothesis (Property) |

## 项目结构

```
├── src/                    # React 前端 (17 页面)
├── backend/                # FastAPI 后端
│   ├── app/
│   │   ├── core/           # 配置 + 数据库
│   │   ├── models/         # ORM 模型
│   │   ├── routers/        # API 端点
│   │   └── services/       # 业务逻辑 (爬虫/过滤/AI/存储/调度)
│   ├── alembic/            # 数据库迁移
│   └── tests/              # 后端测试
├── e2e/                    # E2E 测试 (Playwright)
├── docker-compose.yml      # 一键部署
└── setup.sh                # 部署脚本
```

## License

Private — 光芯云 PhotonCloud © 2026
