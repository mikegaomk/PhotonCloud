#!/bin/bash
# ============================================================
# 光芯云 PhotonCloud — 一键部署脚本
# 使用方式: chmod +x setup.sh && ./setup.sh
# 要求: Docker + Docker Compose
# ============================================================

set -e

echo "╔══════════════════════════════════════════════════════╗"
echo "║     光芯云 PhotonCloud — 一键部署                     ║"
echo "║     国产光芯片设计第一云平台                            ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装。请先安装 Docker:"
    echo "   macOS: brew install --cask docker"
    echo "   Ubuntu: sudo apt install docker.io docker-compose"
    exit 1
fi

echo "✓ Docker 已安装: $(docker --version)"

# Check docker-compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose 未安装"
    exit 1
fi

echo "✓ Docker Compose 可用"

# Create .env if not exists
if [ ! -f backend/.env ]; then
    echo ""
    echo "📝 创建后端配置文件..."
    cp backend/.env.example backend/.env
    
    echo ""
    echo "⚠️  请设置 OPENAI_API_KEY (用于 AI 资讯分类):"
    echo "   编辑 backend/.env 文件，填入你的 OpenAI API Key"
    echo "   如果没有 Key，系统仍可运行（AI 功能降级为默认分类）"
    echo ""
    read -p "是否现在输入 OPENAI_API_KEY? (y/n): " answer
    if [ "$answer" = "y" ]; then
        read -p "请输入你的 OPENAI_API_KEY: " api_key
        sed -i.bak "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$api_key|" backend/.env
        rm -f backend/.env.bak
        echo "✓ API Key 已保存"
    fi
fi

# Build and start
echo ""
echo "🚀 启动服务..."
echo "   - PostgreSQL (数据库)"
echo "   - Backend (FastAPI + 仿真引擎 + RSS 爬虫)"
echo "   - Frontend (React + Vite)"
echo ""

docker-compose up -d --build

echo ""
echo "⏳ 等待服务就绪..."
sleep 10

# Health check
echo ""
echo "🔍 健康检查..."

if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✓ 后端 API: http://localhost:8000"
    echo "  - Swagger 文档: http://localhost:8000/docs"
    echo "  - 资讯 API: http://localhost:8000/api/news"
    echo "  - 健康检查: http://localhost:8000/api/news/health"
else
    echo "⚠️  后端可能还在启动中，请等待 30 秒后重试"
fi

if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo "✓ 前端: http://localhost:3000"
else
    echo "⚠️  前端可能还在构建中"
fi

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅ 部署完成！                                        ║"
echo "║                                                      ║"
echo "║  前端:    http://localhost:3000                       ║"
echo "║  后端 API: http://localhost:8000                      ║"
echo "║  API 文档: http://localhost:8000/docs                 ║"
echo "║  数据库:  localhost:5432 (photoncloud/password)       ║"
echo "║                                                      ║"
echo "║  演示账号: zhangwei / demo123                         ║"
echo "║                                                      ║"
echo "║  停止: docker-compose down                           ║"
echo "║  日志: docker-compose logs -f backend                ║"
echo "╚══════════════════════════════════════════════════════╝"
