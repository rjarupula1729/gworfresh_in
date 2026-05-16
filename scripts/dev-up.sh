#!/usr/bin/env bash
# scripts/dev-up.sh – one-command local dev environment
# Brings up Postgres (Docker), runs migrations + seeds, starts API + Expo.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "🌱 1/4  Starting local Postgres (Docker)…"
docker run -d --name growfresh-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=growfresh \
  -p 5432:5432 \
  postgres:16-alpine >/dev/null 2>&1 || docker start growfresh-pg >/dev/null

echo "🌱 2/4  Installing backend deps + running migrations…"
cd backend
[ -f .env ] || cp .env.example .env
npm install --silent
npm run db:migrate
npm run db:seed
cd ..

echo "🌱 3/4  Installing app deps…"
npm install --silent

echo "🌱 4/4  Starting API + Expo in two tabs (macOS Terminal)…"
osascript <<APPLE
tell application "Terminal"
  do script "cd $ROOT/backend && npm run dev"
  do script "cd $ROOT && npx expo start"
end tell
APPLE

echo "✅  All up. Press Ctrl-C in each tab to stop."
