#!/bin/sh
set -e
# Si no existe la DB de producción, inicializarla con el schema del build
if [ ! -f /data/prod.db ]; then
  echo "Initializing production database..."
  cp /app/schema.db /data/prod.db
fi
exec node server.js
