#!/bin/sh
set -e
node node_modules/.bin/prisma db push --skip-generate
exec node server.js
