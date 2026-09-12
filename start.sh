#!/usr/bin/env bash
# ============================================================
# CodeMart Fullstack — Localhost Quick-Start (one command)
# ============================================================
# Starts: PostgreSQL + Redis + Backend API + Frontend (Next.js)
#
# Usage:
#   chmod +x start.sh
#   ./start.sh                # Build + start + seed (first time)
#   ./start.sh logs           # Tail all logs
#   ./start.sh logs backend   # Tail only backend
#   ./start.sh logs frontend  # Tail only frontend
#   ./start.sh stop           # Stop everything (data preserved)
#   ./start.sh restart        # Restart containers
#   ./start.sh reset          # WIPE ALL data & rebuild
#   ./start.sh psql           # PostgreSQL CLI
#   ./start.sh redis-cli      # Redis CLI
#   ./start.sh help           # Show this help
# ============================================================
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
log(){ echo -e "${GREEN}[start]${NC} $1"; }
warn(){ echo -e "${YELLOW}[warn]${NC} $1"; }
err(){ echo -e "${RED}[error]${NC} $1"; }
info(){ echo -e "${CYAN}[info]${NC} $1"; }

ACTION="${1:-up}"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# ---------- Pre-flight ----------
if ! command -v docker >/dev/null 2>&1; then
  err "Docker is NOT installed."
  echo
  echo "  Install Docker Desktop from: https://docs.docker.com/get-docker/"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  err "Docker Compose v2 is NOT available."
  echo
  echo "  Docker Desktop bundles it. On Linux: 'apt install docker-compose-plugin'"
  exit 1
fi

# Ensure backend/.env exists
if [ ! -f backend/.env ]; then
  warn "backend/.env not found. Copying from .env.example..."
  cp backend/.env.example backend/.env
fi

case "$ACTION" in
  up|start)
    echo
    log "🚀 Building & starting CodeMart Fullstack..."
    log "   This will take ~3-5 minutes on first run (downloading images + building)."
    echo

    docker compose build

    log "Starting all containers..."
    docker compose up -d

    log "Waiting for PostgreSQL to be healthy..."
    for i in {1..30}; do
      if docker compose ps postgres 2>/dev/null | grep -q "healthy"; then break; fi
      sleep 2
    done

    log "Waiting for Backend API to be ready..."
    for i in {1..60}; do
      if curl -sf http://localhost:4000/api/health/ping >/dev/null 2>&1; then
        log "Backend is up!"
        break
      fi
      sleep 2
      [ $i -eq 60 ] && warn "Backend not responding yet — check 'logs' command."
    done

    log "Running database seed (creates super admin + sample data)..."
    docker compose exec -T backend node dist/database/seed.js || warn "Seed already run (this is OK)."

    log "Waiting for Frontend (Next.js) to be ready..."
    for i in {1..60}; do
      if curl -sf http://localhost:3000 >/dev/null 2>&1; then
        log "Frontend is up!"
        break
      fi
      sleep 2
      [ $i -eq 60 ] && warn "Frontend not responding yet — check 'logs frontend' command."
    done

    echo
    log "🎉 All done! Services:"
    docker compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"

    echo
    info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    info "  Frontend:    http://localhost:3000"
    info "  Backend API: http://localhost:4000/api"
    info "  Swagger:     http://localhost:4000/docs"
    info "  PostgreSQL:  localhost:5432 (user: codemart)"
    info "  Redis:       localhost:6379"
    info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo
    info "Super Admin:  admin@codemart.io / ChangeMe@Admin123"
    info "Sample Seller: omnico@codemart.io / Seller@Pass123"
    echo
    info "Run './start.sh logs' to tail all logs."
    echo
    ;;

  logs)
    SVC="${2:-}"
    if [ -z "$SVC" ]; then
      log "Tailing ALL logs (Ctrl+C to stop)..."
      docker compose logs -f
    else
      log "Tailing $SVC logs (Ctrl+C to stop)..."
      docker compose logs -f "$SVC"
    fi
    ;;

  stop|down)
    log "Stopping all services (data preserved)..."
    docker compose down
    log "Stopped. Run './start.sh' to start again."
    ;;

  restart)
    log "Restarting containers..."
    docker compose restart
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
    docker compose build --no-cache
    docker compose up -d
    sleep 15
    docker compose exec -T backend node dist/database/seed.js
    log "Reset complete."
    ;;

  psql)
    log "Connecting to PostgreSQL via psql..."
    docker compose exec postgres psql -U codemart -d codemart
    ;;

  redis-cli)
    log "Connecting to Redis via redis-cli..."
    docker compose exec redis redis-cli -a "$(grep '^REDIS_PASSWORD=' backend/.env | cut -d= -f2)"
    ;;

  seed)
    log "Running seed manually..."
    docker compose exec -T backend node dist/database/seed.js
    ;;

  status|ps)
    docker compose ps
    ;;

  help|--help|-h)
    cat <<EOF

CodeMart Fullstack — Localhost Quick-Start
==========================================

Services started:
  • PostgreSQL 16  (port 5432)
  • Redis 7        (port 6379)
  • Backend API    (port 4000)  → http://localhost:4000/api
  • Frontend       (port 3000)  → http://localhost:3000

Commands:
  ./start.sh                  Build + start + seed (first time)
  ./start.sh logs             Tail ALL logs (Ctrl+C to stop)
  ./start.sh logs backend     Tail only backend logs
  ./start.sh logs frontend    Tail only frontend logs
  ./start.sh stop             Stop containers (data preserved)
  ./start.sh restart          Restart containers
  ./start.sh reset            ⚠ WIPE ALL DATA + rebuild fresh
  ./start.sh psql             PostgreSQL CLI
  ./start.sh redis-cli        Redis CLI
  ./start.sh seed             Re-run the database seed
  ./start.sh status           Show container status
  ./start.sh help             Show this help

URLs after start:
  Frontend:    http://localhost:3000
  Backend API: http://localhost:4000/api
  Swagger:     http://localhost:4000/docs
  Health:      http://localhost:4000/api/health/ping

Default logins:
  Super Admin:   admin@codemart.io / ChangeMe@Admin123
  Sample Seller: omnico@codemart.io / Seller@Pass123

EOF
    ;;

  *)
    err "Unknown action: $ACTION"
    echo "Run './start.sh help' for usage."
    exit 1
    ;;
esac
