#!/usr/bin/env bash
# scripts/pg-local.sh – project-scoped Postgres (no system service, no conflicts)
#
# Postgres runs on port 5433 with its data dir inside backend/.pgdata/.
# Nothing is registered with launchd, so other projects on this laptop
# are completely unaffected. Delete backend/.pgdata to "uninstall".
#
# Usage:
#   scripts/pg-local.sh init     # one-time: initdb + create db + seed
#   scripts/pg-local.sh start    # start the server (foreground or background)
#   scripts/pg-local.sh stop
#   scripts/pg-local.sh status
#   scripts/pg-local.sh psql     # open a SQL shell
#   scripts/pg-local.sh wipe     # nuke the data dir (start fresh)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PGDATA="$ROOT/backend/.pgdata"
PGPORT=5433
PGDB=growfresh
PGUSER_NAME=postgres          # role created inside the cluster
LOG="$PGDATA/postgres.log"

# ── locate the brew binaries (don't add to PATH globally) ──
PG_PREFIX="$(brew --prefix postgresql@16 2>/dev/null || true)"
if [ -z "$PG_PREFIX" ] || [ ! -x "$PG_PREFIX/bin/initdb" ]; then
  echo "❌  postgresql@16 not installed. Run:"
  echo "    brew install postgresql@16"
  exit 1
fi
export PATH="$PG_PREFIX/bin:$PATH"

cmd="${1:-help}"

case "$cmd" in
  init)
    if [ -d "$PGDATA" ]; then
      echo "ℹ️   $PGDATA already exists – skipping initdb."
    else
      echo "🌱  initdb -> $PGDATA"
      initdb -D "$PGDATA" -U "$PGUSER_NAME" --auth-host=trust --auth-local=trust >/dev/null
      # Lock the cluster to this port so it never clashes with other Postgres installs.
      echo "port = $PGPORT"                  >> "$PGDATA/postgresql.conf"
      echo "unix_socket_directories = '/tmp'" >> "$PGDATA/postgresql.conf"
    fi
    "$0" start
    sleep 1
    createdb -h 127.0.0.1 -p $PGPORT -U "$PGUSER_NAME" "$PGDB" 2>/dev/null && \
      echo "✅  database '$PGDB' created" || echo "ℹ️   database '$PGDB' already exists"
    echo ""
    echo "Next:"
    echo "   cd backend && npm run db:migrate && npm run db:seed"
    ;;

  start)
    if pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
      echo "ℹ️   Postgres already running on :$PGPORT (data: $PGDATA)"
    else
      echo "▶️   starting Postgres on :$PGPORT"
      pg_ctl -D "$PGDATA" -l "$LOG" start
    fi
    ;;

  stop)
    pg_ctl -D "$PGDATA" stop -m fast || true
    ;;

  status)
    pg_ctl -D "$PGDATA" status || true
    ;;

  psql)
    psql -h 127.0.0.1 -p $PGPORT -U "$PGUSER_NAME" -d "$PGDB"
    ;;

  wipe)
    "$0" stop || true
    rm -rf "$PGDATA"
    echo "🧹  $PGDATA removed."
    ;;

  *)
    cat <<EOF
GrowFresh project-scoped Postgres

  scripts/pg-local.sh init     one-time setup (initdb + createdb)
  scripts/pg-local.sh start    start server in background
  scripts/pg-local.sh stop     stop server
  scripts/pg-local.sh status
  scripts/pg-local.sh psql     SQL shell into the growfresh db
  scripts/pg-local.sh wipe     delete data dir (fresh start)

Data dir : $PGDATA
Port     : $PGPORT
DB       : $PGDB
User     : $PGUSER_NAME (passwordless, trust auth, listens on 127.0.0.1 only)
EOF
    ;;
esac
