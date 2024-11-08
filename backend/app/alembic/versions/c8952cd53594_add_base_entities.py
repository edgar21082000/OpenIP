"""add base entities

Revision ID: c8952cd53594
Revises: 39c4f2b1489d
Create Date: 2024-11-07 21:04:06.925265

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects.postgresql import ENUM

# revision identifiers, used by Alembic.
revision = 'c8952cd53594'
down_revision = '39c4f2b1489d'
branch_labels = None
depends_on = None


def upgrade():
    interviewmark_enum = ENUM('A', 'B', 'C', 'D', 'E', name='interviewmark')
    interviewmark_enum.create(op.get_bind(), checkfirst=True)
    # ### commands auto generated by Alembic - please adjust! ###
    op.execute("""
        ALTER TABLE interview ALTER COLUMN mark TYPE interviewmark
        USING mark::text::interviewmark
    """)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('interview', 'mark',
               existing_type=sa.Enum('A', 'B', 'C', 'D', 'E', name='interviewmark'),
               type_=postgresql.ENUM('waiting', 'in_progress', 'finished', name='interviewstatus'),
               existing_nullable=True)
    # ### end Alembic commands ###
