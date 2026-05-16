#!/usr/bin/env bash
# db-watch.sh — live tail of GrowFresh user activity.
# Usage:
#   ./scripts/db-watch.sh                # refresh every 2s
#   INTERVAL=5 ./scripts/db-watch.sh     # custom interval
#   MOBILE=9876543210 ./scripts/db-watch.sh   # filter to one user
set -euo pipefail

INTERVAL="${INTERVAL:-2}"
MOBILE="${MOBILE:-}"
PGHOST="${PGHOST:-127.0.0.1}"
PGPORT="${PGPORT:-5433}"
PGUSER="${PGUSER:-postgres}"
PGDATABASE="${PGDATABASE:-growfresh}"
export PGHOST PGPORT PGUSER PGDATABASE
[[ -n "${PGPASSWORD:-}" ]] && export PGPASSWORD

WHERE_USER=""
if [[ -n "$MOBILE" ]]; then
  WHERE_USER="AND u.mobile = '$MOBILE'"
fi

QUERY=$(cat <<SQL
\\echo
\\echo '════════════ 👤 USERS (last 5) ════════════'
SELECT mobile, name, city, reward_points AS pts,
       to_char(created_at,'YYYY-MM-DD HH24:MI:SS') AS joined
FROM users ORDER BY created_at DESC LIMIT 5;

\\echo '════════════ 🛒 ORDERS (last 5) ════════════'
SELECT o.id::text AS order_id, u.mobile, o.status, o.payment_status,
       o.total::numeric(10,2) AS total,
       to_char(o.placed_at,'HH24:MI:SS') AS at
FROM orders o JOIN users u ON u.id=o.user_id
WHERE 1=1 $WHERE_USER
ORDER BY o.placed_at DESC LIMIT 5;

\\echo '════════════ 🌱 GARDEN PLANTS (last 5) ════════════'
SELECT u.mobile, up.plant_type, up.status, up.days_planted AS day,
       to_char(up.planted_at,'HH24:MI:SS') AS planted
FROM user_plants up JOIN users u ON u.id=up.user_id
WHERE 1=1 $WHERE_USER
ORDER BY up.planted_at DESC LIMIT 5;

\\echo '════════════ 📊 ACTIVITY EVENTS (last 15) ════════════'
SELECT to_char(ae.created_at,'HH24:MI:SS') AS at,
       COALESCE(u.mobile,'(anon)') AS mobile,
       ae.event_type, ae.screen,
       LEFT(ae.payload::text, 60) AS payload
FROM activity_events ae LEFT JOIN users u ON u.id=ae.user_id
WHERE 1=1 $WHERE_USER
ORDER BY ae.created_at DESC LIMIT 15;
SQL
)

echo "🔭 Watching Postgres @ $PGHOST:$PGPORT/$PGDATABASE  (Ctrl-C to stop, refresh ${INTERVAL}s)"
[[ -n "$MOBILE" ]] && echo "   filtered to mobile=$MOBILE"

while true; do
  clear
  date '+%Y-%m-%d %H:%M:%S  -- live db snapshot'
  psql -X -q -P pager=off <<<"$QUERY" || echo "(psql error – is Postgres up?)"
  sleep "$INTERVAL"
done
