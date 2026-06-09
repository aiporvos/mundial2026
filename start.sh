#!/bin/sh
set -e

IMAGE_VERSION=$(cat /app/seed.version)
DATA_VERSION=$(cat /data/seed.version 2>/dev/null || echo "none")

if [ "$IMAGE_VERSION" != "$DATA_VERSION" ]; then
  echo "Seed changed ($DATA_VERSION -> $IMAGE_VERSION), reinitializing database..."
  cp /app/schema.db /data/prod.db
  cp /app/seed.version /data/seed.version
  echo "Database initialized."
fi

exec node server.js
