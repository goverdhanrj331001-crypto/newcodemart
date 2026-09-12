# 🚀 Localhost Quick-Start (Docker)

## Prerequisites

Aapke system par sirf **2 cheezein** chahiye:

1. **Docker Desktop** (Windows/Mac) ya **Docker Engine + Compose v2** (Linux)
   - Download: <https://docs.docker.com/get-docker/>
   - Verify install karne ke liye terminal khol ke:
     ```bash
     docker --version
     docker compose version
     ```
   - Dono commands ko output milna chahiye.

2. **Downloaded zip file** — `codemart-backend.zip` (ya `codemart-fullstack.zip`)

---

## Step 1 — Zip ko extract karo

Kisi bhi folder mein extract karo, jaise `~/projects/` ya `C:\projects\`:

```bash
# Mac/Linux
mkdir -p ~/projects && cd ~/projects
unzip ~/Downloads/codemart-backend.zip
cd codemart-backend
```

```powershell
# Windows (PowerShell)
Expand-Archive -Path "$env:USERPROFILE\Downloads\codemart-backend.zip" -DestinationPath "C:\projects"
cd C:\projects\codemart-backend
```

Folder structure aisa hona chahiye:
```
codemart-backend/
├── start-local.sh         ← One-shot script (Mac/Linux/Git Bash)
├── docker-compose.yml
├── Dockerfile
├── .env                   ← Already configured for localhost
├── README.md
└── src/
```

---

## Step 2 — (Optional) `.env` me kuch change karna ho to karo

`.env` file already localhost ke liye set hai. Defaults:

```env
APP_PORT=4000              # API port
DB_PASSWORD=codemart_strong_password_change_me
REDIS_PASSWORD=redis_strong_password_change_me
SUPER_ADMIN_EMAIL=admin@codemart.io
SUPER_ADMIN_PASSWORD=ChangeMe@Admin123
```

Agar kuch change karna ho (port, password, etc.) to `.env` edit kar lo.
Production jaane se pehle **JWT_ACCESS_SECRET** aur **JWT_REFRESH_SECRET** zaroor change kar lo:
```bash
openssl rand -hex 32      # Generate new secret, paste in .env
```

---

## Step 3 — Ek hi command, sab kuch ready

### Mac / Linux / Git Bash (Windows)

```bash
chmod +x start-local.sh
./start-local.sh
```

### Windows (agar Git Bash nahi hai)

```powershell
docker compose --env-file .env build
docker compose --env-file .env up -d
# Wait ~30 seconds for containers to be healthy
docker compose exec api node dist/database/seed.js
```

### `start-local.sh` kya karta hai:

1. ✅ Docker images build karta hai (~2 min first time)
2. ✅ PostgreSQL 16 + Redis 7 + NestJS API start karta hai
3. ✅ PostgreSQL ke healthy hone ka wait karta hai
4. ✅ API ke ready hone ka wait karta hai
5. ✅ Database seed run karta hai (super admin + 8 sample products + 4 courses + 3 banners)

---

## Step 4 — Verify sab kuch chal raha hai

Browser mein ye URLs kholo:

| URL                                       | Kya milega                          |
| ----------------------------------------- | ----------------------------------- |
| <http://localhost:4000/api/health/ping>   | `{ "status": "ok", ... }`            |
| <http://localhost:4000/api/health>        | Full health check                   |
| <http://localhost:4000/docs>              | **Swagger UI** (sab APIs test karo) |
| <http://localhost:4000/api/products>      | Sample products list                |
| <http://localhost:4000/api/categories>    | Sample categories                   |
| <http://localhost:4000/api/courses>      | Sample courses                      |
| <http://localhost:4000/api/banners>       | Marketing banners                   |

### Swagger UI pe test karo

1. <http://localhost:4000/docs> kholo
2. **Authorize** button click karo, daalo:
   ```
   Bearer (empty for now, click Authorize)
   ```
3. **POST /api/auth/login** click karo, **Try it out**, body mein:
   ```json
   {
     "email": "admin@codemart.io",
     "password": "ChangeMe@Admin123"
   }
   ```
4. Response se `accessToken` copy karo
5. Authorize button par wapas jaake `Bearer <token>` daalo
6. Ab **GET /api/admin/stats** ya koi bhi admin endpoint try karo

---

## Step 5 — Frontend bhi chalao (optional)

Frontend Next.js app ko alag terminal mein chalao:

```bash
cd codemart-frontend
npm install
npm run dev
# Next.js app at http://localhost:3000
```

Frontend ke `.env.local` mein (create karo agar nahi hai):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

---

## 📋 Useful commands

```bash
./start-local.sh           # Build + start + seed (first time)
./start-local.sh logs      # Live API logs (Ctrl+C to stop)
./start-local.sh stop      # Stop containers (data preserved)
./start-local.sh restart   # Restart containers
./start-local.sh reset     # ⚠️ WIPE ALL DATA + fresh start
./start-local.sh psql       # PostgreSQL CLI
./start-local.sh redis-cli  # Redis CLI
./start-local.sh help       # Show all commands
```

Windows pe (without Git Bash):
```powershell
docker compose logs -f api          # logs
docker compose down                 # stop
docker compose restart              # restart
docker compose down -v              # reset (wipe data)
docker compose exec postgres psql -U codemart -d codemart    # psql
docker compose exec redis redis-cli -a redis_strong_password_change_me  # redis-cli
```

---

## 🔧 Troubleshooting

### "Port 4000 already in use"
```bash
# Mac/Linux
lsof -i :4000
kill -9 <PID>

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```
Ya `.env` mein `APP_PORT=4001` change karke restart karo.

### "Port 5432 (PostgreSQL) already in use"
Local PostgreSQL chal raha hai. Options:
1. Local PostgreSQL stop karo: `sudo systemctl stop postgresql` (Linux) ya Services se (Windows)
2. Ya `docker-compose.yml` mein port change karo: `"5433:5432"` aur `.env` mein `DB_PORT=5433`

### "Port 6379 (Redis) already in use"
Same as above — local Redis stop karo ya port change karo.

### API container baar-baar restart ho raha hai
Logs check karo:
```bash
./start-local.sh logs
# ya
docker compose logs api
```

### Seed pe "database is not initialized" error
Wait 30s aur phir try karo:
```bash
docker compose exec api node dist/database/seed.js
```

### Kuch bhi kaam nahi kar raha — fresh start
```bash
./start-local.sh reset
```

---

## 📊 Default credentials

| Role          | Email                    | Password           |
| ------------- | ------------------------ | ------------------ |
| Super Admin   | admin@codemart.io        | ChangeMe@Admin123  |
| Seller        | omnico@codemart.io       | Seller@Pass123     |
| Seller        | imagineco@codemart.io    | Seller@Pass123     |
| Seller        | bentasoft@codemart.io    | Seller@Pass123     |
| Seller        | bitronic@codemart.io     | Seller@Pass123     |

---

## ✅ That's it!

Backend fully ready hai localhost pe:
- API: <http://localhost:4000/api>
- Docs: <http://localhost:4000/docs>
- PostgreSQL: `localhost:5432` (user: codemart, db: codemart)
- Redis: `localhost:6379` (password in `.env`)

Ab frontend mein data fetch karne ke liye bas `fetch('http://localhost:4000/api/products')` use karna hai — UI components ko bilkul nahi chhedna.
