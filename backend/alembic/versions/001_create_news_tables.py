"""Create news_items and fetch_logs tables

Revision ID: 001
Create Date: 2026-06-08
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # News items table
    op.create_table(
        'news_items',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('summary', sa.String(500), nullable=False),
        sa.Column('source_name', sa.String(100), nullable=False),
        sa.Column('source_url', sa.String(2000), nullable=False, unique=True),
        sa.Column('published_at', sa.DateTime(timezone=True)),
        sa.Column('fetched_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()')),
        sa.Column('category', sa.String(20), nullable=False, server_default='industry'),
        sa.Column('region', sa.String(20), nullable=False, server_default='global'),
        sa.Column('chip_tags', ARRAY(sa.String), nullable=False, server_default='{}'),
        sa.Column('importance', sa.String(10), nullable=False, server_default='medium'),
        sa.Column('content_link', sa.String(2000)),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()')),
        sa.CheckConstraint("category IN ('industry', 'research', 'policy', 'funding', 'product', 'standard')", name='chk_category'),
        sa.CheckConstraint("region IN ('global', 'china', 'us', 'europe', 'japan', 'korea')", name='chk_region'),
        sa.CheckConstraint("importance IN ('high', 'medium', 'low')", name='chk_importance'),
    )
    op.create_index('idx_news_published_at', 'news_items', ['published_at'], postgresql_using='btree')
    op.create_index('idx_news_category', 'news_items', ['category'])
    op.create_index('idx_news_region', 'news_items', ['region'])
    op.create_index('idx_news_chip_tags', 'news_items', ['chip_tags'], postgresql_using='gin')
    op.create_index('idx_news_source_url', 'news_items', ['source_url'])

    # Fetch logs table
    op.create_table(
        'fetch_logs',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True)),
        sa.Column('sources_attempted', sa.Integer, server_default='0'),
        sa.Column('sources_succeeded', sa.Integer, server_default='0'),
        sa.Column('entries_found', sa.Integer, server_default='0'),
        sa.Column('entries_passed_filter', sa.Integer, server_default='0'),
        sa.Column('entries_stored', sa.Integer, server_default='0'),
        sa.Column('errors', JSONB, server_default='[]'),
        sa.Column('status', sa.String(20), server_default='running'),
    )
    op.create_index('idx_fetch_logs_started', 'fetch_logs', ['started_at'], postgresql_using='btree')


def downgrade() -> None:
    op.drop_table('fetch_logs')
    op.drop_table('news_items')
