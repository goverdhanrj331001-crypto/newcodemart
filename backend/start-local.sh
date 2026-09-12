#!/usr/bin/env bash
# ===========================================================================
# CodeMart Backend — Localhost Quick-Start (one command)
# ===========================================================================
# Usage:
#   chmod +x start-local.sh
#   ./start-local.sh         # build + up + migrate + seed
#   ./start-local.sh logs    # tail API logs
#   ./start-local.sh stop    # stop everything (keeps data)
#   ./start-local.sh reset   # WIPE all data & restart from scratch
#   ./start-local.sh help    # show this help
# ===========================================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
log(){ echo -e "${GREEN}[start-local]${NC} $1"; }
warn(){ echo -e "${YELLOW}[warn]${NC} $1"; }
err(){ echo -e "${RED}[error]${NC} $1"; }
info(){ echo -e "${CYAN}[info]${NC} $1"; }

ACTION="${1:-up}"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# ---------- Pre-flight checks ----------
if ! command -v docker >/dev/null 2>&1; then
  err "Docker is NOT installed."
  echo
  echo "  Install Docker Desktop from: https://docs.docker.com/get-docker/"
  echo "  Then re-run this script."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  err "Docker Compose v2 is NOT available."
  echo
  echo "  Docker Desktop bundles it. On Linux, install: 'apt install docker-compose-plugin'"
  exit 1
fi

# Make sure .env exists
if [ ! -f .env ]; then
  warn ".env not found. Copying from .env.example..."
  cp .env.example .env
fi

# ---------- Actions ----------
case "$ACTION" in
  up|start)
    log "Building images (first run will take ~2 min)..."
    docker compose --env-file .env build

    log "Starting PostgreSQL + Redis + API..."
    docker compose --env-file .env up -d

    log "Waiting for PostgreSQL to become healthy..."
    for i in {1..30}; do
      if docker compose ps postgres 2>/dev/null | grep -q "healthy"; then
        break
      fi
      sleep 2
    done

    log "Waiting for API to be ready (up to 60s)..."
    for i in {1..30}; do
      if curl -sf http://localhost:4000/api/health/ping >/dev/null 2>&1; then
        log "API is up!"
        break
      fi
      sleep 2
    done

    log "Running seed (creates super admin + sample data)..."
    docker compose exec -T api node dist/database/seed.js || warn "Seed may have already been run (this is OK)."

    echo
    log "🎉 All done! Services:"
    docker compose ps
    echo
    info "API:        http://localhost:4000/api/health"
    info "Swagger:    http://localhost:4000/docs"
    info "Frontend:   http://localhost:3000 (run your Next.js app separately)"
    echo
    info "Super Admin:  admin@codemart.io / ChangeMe@Admin123"
    info "Sample Seller: omnico@codemart.io / Seller@Pass123"
    ;;

  logs)
    log "Tailing API logs (Ctrl+C to stop)..."
    docker compose logs -f api
    ;;

  stop|down)
    log "Stopping services (data preserved)..."
    docker compose down
    log "Stopped. Run './start-local.sh' to start again."
    ;;

  reset)
    warn "This will WIPE ALL DATA and rebuild from scratch. Continue? (y/N)"
    read -r confirm
    if [ "${confirm:-}" != "y" ] && [ "${confirm:-}" != "Y" ]; then
      log "Aborted."
      exit 0
    fi
    log "Wiping volumes and rebuilding..."
    docker compose down -v
    docker compose --env-file .env build --no-cache
    docker compose --env-file .env up -d
    sleep 10
    docker compose exec -T api node dist/database/seed.js
    log "Reset complete."
    ;;

  restart)
    log "Restarting containers..."
    docker compose restart
    ;;

  psql)
    log "Connecting to PostgreSQL via psql..."
    docker compose exec postgres psql -U codemart -d codemart
    ;;

  redis-cli)
    log "Connecting to Redis via redis-cli..."
    docker compose exec redis redis-cli -a "$(grep '^REDIS_PASSWORD=' .env | cut -d= -f2)"
    ;;

  help|--help|-h)
    cat <<EOF

CodeMart Backend — Localhost Quick-Start
========================================

Commands:
  ./start-local.sh             Build + start + seed (first run)
  ./start-local.sh logs        Tail API logs (Ctrl+C to stop)
  ./start-local.sh stop        Stop containers (data preserved)
  ./start-local.sh restart     Restart containers
  ./start-local.sh reset       WIPE ALL DATA and rebuild fresh
  ./start-local.sh psql        Connect to PostgreSQL CLI
  ./start-local.sh redis-cli   Connect to Redis CLI
  ./start-local.sh help        Show this help

URLs after start:
  API:        http://localhost:4000/api
  Health:     http://localhost:4000/api/health
  Swagger:    http://localhost:4000/docs

Default logins:
  Super Admin:  admin@codemart.io / ChangeMe@Admin123
  Seller:       omnico@codemart.io / Seller@Pass123

EOF
    ;;

  *)
    err "Unknown action: $ACTION"
    echo "Run './start-local.sh help' for usage."
    exit 1
    ;;
esac
