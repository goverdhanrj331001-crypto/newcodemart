# 🚀 CodeMart Fullstack — Localhost Quick-Start

**Ek hi command** se frontend + backend + PostgreSQL + Redis sab kuch chal jata hai!

## 📋 Prerequisites (sirf 1 cheez chahiye)

**Docker Desktop** install hona chahiye:
- Windows/Mac: <https://docs.docker.com/get-docker/>
- Linux: `apt install docker.io docker-compose-plugin`

Verify:
```bash
docker --version
docker compose version
```

---

## ▶️ Sab kuch ek command se chalu karo

### Step 1 — Zip extract karo

```bash
# Mac/Linux
unzip ~/Downloads/codemart-fullstack.zip
cd codemart-fullstack

# Windows PowerShell
Expand-Archive "$env:USERPROFILE\Downloads\codemart-fullstack.zip" "."
cd codemart-fullstack
```

### Step 2 — Ek command, sab kuch ready

#### Mac / Linux / Git Bash (Windows)
```bash
chmod +x start.sh
./start.sh
```

#### Windows PowerShell
```powershell
docker compose build
docker compose up -d
Start-Sleep -Seconds 60
docker compose exec backend node dist/database/seed.js
```

First run ~3-5 min lagenge. Final output:
```
🎉 All done! Services:
NAME         STATUS              PORTS
postgres     Up (healthy)        0.0.0.0:5432->5432/tcp
redis        Up (healthy)        0.0.0.0:6379->6379/tcp
backend      Up (healthy)        0.0.0.0:4000->4000/tcp
frontend     Up (healthy)        0.0.0.0:3000->3000/tcp

Frontend:    http://localhost:3000
Backend API: http://localhost:4000/api
Swagger:     http://localhost:4000/docs
```

---

## 🔐 Admin Panel Access

### Production-ready Authentication Flow

1. **Frontend** par jao: <http://localhost:3000>
2. Header mein **"Admin"** button pe click karo (ya direct <http://localhost:3000/admin> kholo)
3. Login page khulegi
4. Default credentials daalo:
   - **Email**: `admin@codemart.io`
   - **Password**: `ChangeMe@Admin123`
5. **Sign in** karo → dashboard load hoga
6. Logout karne ke liye top-right user icon pe click karo → **Sign out**

### RBAC Roles (4 levels)
| Role         | Access Level |
| ------------ | ------------ |
| `customer`     | Public marketplace only |
| `store_owner`  | Own products + shop |
| `admin`        | Admin panel + moderate content |
| `super_admin`  | Full access + delete users + change roles |

### JWT Token Flow
- Access token: 15 min TTL, localStorage mein store hota hai
- Refresh token: 7 day TTL, automatically rotate hota hai
- 401 aane pe automatically refresh ho jata hai
- Logout pe dono tokens revoke ho jaate hain

---

## 🌐 URLs

| URL | Purpose |
| --- | --- |
| <http://localhost:3000> | **Frontend** — Marketplace + Admin Panel |
| <http://localhost:3000/login> | Admin Login Page |
| <http://localhost:3000/admin> | Admin Dashboard (login required) |
| <http://localhost:4000/api/health/ping> | Backend health check |
| <http://localhost:4000/docs> | Swagger UI — sab APIs test karo |

---

## 📋 Useful commands

```bash
./start.sh                  # Build + start + seed
./start.sh logs             # Sab logs
./start.sh logs backend     # Sirf backend logs
./start.sh logs frontend    # Sirf frontend logs
./start.sh stop             # Stop (data preserved)
./start.sh restart          # Restart containers
./start.sh reset            # ⚠ Wipe ALL data + rebuild
./start.sh psql             # PostgreSQL CLI
./start.sh redis-cli        # Redis CLI
./start.sh seed             # Re-run seed
./start.sh help             # Help
```

---

## 🔧 Troubleshooting

### "Port already in use"
```bash
# Mac/Linux
lsof -i :3000   # ya :4000, :5432, :6379
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Backend "unhealthy" dikhata
Backend ko boot hone mein 60-90s lagte hain (TypeORM schema sync). Wait karo aur check karo:
```bash
docker compose logs backend | tail -20
# Agar "Nest application successfully started" dikhe to ready hai
```

### Login nahi ho raha
```bash
# Backend up hai check karo
curl http://localhost:4000/api/health/ping

# Seed run karo (admin create karne ke liye)
docker compose exec backend node dist/database/seed.js

# Test login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@codemart.io","password":"ChangeMe@Admin123"}'
```

### Frontend pe data nahi aa raha
```bash
# API reachable check karo (from frontend container)
docker compose exec frontend wget -qO- http://backend:4000/api/products

# Browser console check karo — agar CORS error hai to backend .env mein
# CORS_ORIGINS mein frontend URL add karo
```

### Build fail ho raha (DNS issue)
Docker Desktop → Settings → Docker Engine mein DNS add karo:
```json
{
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```
Restart Docker Desktop, phir:
```bash
docker compose build --no-cache
```

### Sab kuch fresh start karna hai
```bash
./start.sh reset
```

---

## 🔒 Production Checklist (before going live)

- [ ] `.env` mein **JWT_ACCESS_SECRET** aur **JWT_REFRESH_SECRET** change karo (`openssl rand -hex 32`)
- [ ] **SUPER_ADMIN_PASSWORD** change karo
- [ ] **DB_PASSWORD** aur **REDIS_PASSWORD** strong password set karo
- [ ] **MAIL_HOST/USER/PASS** real SMTP credentials daalo
- [ ] **CORS_ORIGINS** mein apna frontend domain add karo
- [ ] HTTPS enable karo (nginx + Let's Encrypt)
- [ ] PostgreSQL port 5432 publicly expose mat karo
- [ ] Redis port 6379 publicly expose mat karo
- [ ] Daily database backups setup karo

---

## 🎯 Default Credentials (change in production!)

| Role | Email | Password |
| --- | --- | --- |
| Super Admin | `admin@codemart.io` | `ChangeMe@Admin123` |

---

## ✅ Sab kuch ready!

- 🟢 Frontend: <http://localhost:3000>
- 🟢 Admin Panel: <http://localhost:3000/admin>
- 🟢 Login: <http://localhost:3000/login>
- 🟢 API: <http://localhost:4000/api>
- 🟢 Swagger: <http://localhost:4000/docs>

Koi dikkat ho to exact error bhejna, fix bata dunga! 🚀
