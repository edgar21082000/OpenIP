#! /usr/bin/env bash

set -e
set -x

# Run migrations
alembic upgrade head

alembic revision --autogenerate -m "${LATEST_MIGRATION_MESSAGE}"
