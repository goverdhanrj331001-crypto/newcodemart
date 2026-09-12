# CodeMart / Pixer — Enterprise Backend

A production-grade NestJS + TypeScript backend for the **CodeMart / Pixer** digital marketplace frontend (themes, templates, scripts, courses). Built with PostgreSQL, Redis, JWT auth, role-based access control, Docker, and an admin panel.

> **Note**: This backend is designed to power the existing Next.js frontend (`codemart.zip`) WITHOUT modifying any UI. Just point your frontend to the API URL and call the endpoints.

---

## 📦 Tech Stack

| Layer            | Choice                                                          |
| ---------------- | --------------------------------------------------------------- |
| Runtime          | Node.js 20 (LTS Alpine)                                         |
| Language         | TypeScript 5.7                                                  |
| Framework        | NestJS 10                                                       |
| ORM              | TypeORM 0.3                                                     |
| Database         | PostgreSQL 16                                                   |
| Cache / Sessions | Redis 7 (via ioredis)                                          |
| Auth             | JWT + Refresh-token rotation, bcrypt, email verification, password reset |
| Validation       | class-validator + class-transformer                            |
| API Docs         | Swagger / OpenAPI 3.1 at `/docs`                               |
| Security         | Helmet, CORS, global rate-limiter (Throttler), route-level RBAC |
| Mailer           | Nodemailer (SMTP — Mailtrap / SES / Gmail / Mailgun compatible)|
| Containerisation | Docker + docker-compose                                         |
| Reverse Proxy    | Nginx config bundled                                            |

---

## 🚀 Quick Start (Local Dev)

### 1. Clone & install
```bash
cd codemart-backend
npm install
cp .env.example .env
# edit .env if you want to change passwords/secrets
```

### 2. Run the stack with Docker
```bash
docker compose up -d --build
```

This will start **PostgreSQL 16**, **Redis 7** and the **API** (NestJS) together. Wait ~30 seconds for first boot.

### 3. Run migrations + seed
```bash
docker compose exec api node dist/database/run-migration.js
docker compose exec api node dist/database/seed.js
```

You should see:
```
✅ Super admin created: admin@codemart.io / ChangeMe@Admin123
✅ Products seeded (8 new)
✅ Courses seeded (4 new)
✅ Banners seeded (3 new)
🎉 Seed complete.
```

### 4. Explore
- API root:        <http://localhost:4000/api>
- Health:           <http://localhost:4000/api/health>
- Swagger docs:     <http://localhost:4000/docs>

Default super admin (from `.env`):
- Email: `admin@codemart.io`
- Password: `ChangeMe@Admin123`

Sample sellers (password: `Seller@Pass123`):
- `omnico@codemart.io`, `imagineco@codemart.io`, `bentasoft@codemart.io`, `bitronic@codemart.io`

---

## 🔌 Connect your existing Next.js frontend

In your **frontend** project (the `codemart.zip` you uploaded), create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_API_BASE=http://localhost:4000
```

Then refactor the data-fetching layer to call REST endpoints instead of the in-memory `INITIAL_*` arrays. The UI components themselves **do not change** — only the data sources swap from local constants to `fetch`/`axios` calls.

A minimal API client:
```ts
// lib/api.ts
export const api = (path: string, init?: RequestInit) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
      ...(typeof window !== 'undefined' && localStorage.getItem('accessToken')
        ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        : {}),
    },
    credentials: 'include',
  }).then((r) => r.json());
```

Key endpoint mappings (frontend data file → backend route):

| Frontend file                                  | Backend route                              |
| ---------------------------------------------- | ------------------------------------------ |
| `features/products/data/products.data.ts`      | `GET /api/products`                        |
| `features/products/data/products.data.ts` (single) | `GET /api/products/slug/:slug`          |
| `features/categories/data/categories.data.ts`  | `GET /api/categories`                      |
| `features/courses/data/courses.data.ts`        | `GET /api/courses`                         |
| `features/courses/data/courses.data.ts` (single) | `GET /api/courses/slug/:slug`            |
| `features/admin/data/admin.data.ts` (users)    | `GET /api/users/admin`                     |
| `features/admin/data/admin.data.ts` (orders)   | `GET /api/orders/admin`                   |
| `features/admin/data/admin.data.ts` (reviews)  | `GET /api/reviews/admin`                  |
| `features/admin/data/admin.data.ts` (banners) | `GET /api/banners/admin`                  |
| `features/admin/data/admin.data.ts` (shops)   | `GET /api/shops/admin/list`               |
| `features/admin/data/admin.data.ts` (settings)| `GET /api/settings`                        |
| `features/navigation/components/seller-modal.tsx` | `POST /api/seller-applications`        |
| `features/navigation/components/contact-modal.tsx`| `POST /api/contact`                     |
| `features/navigation/components/user-account-modal.tsx` | `GET /api/users/me` + `GET /api/orders/mine` |

---

## 🗂 Project structure

```
codemart-backend/
├── src/
│   ├── main.ts                         # bootstrap (helmet, cors, swagger, pipes)
│   ├── app.module.ts                   # root module
│   ├── config/                         # app / database / redis / jwt / mail / throttler
│   ├── common/                         # guards, decorators, filters, interceptors, dto, utils
│   ├── database/
│   │   ├── entities/                   # 14 TypeORM entities
│   │   ├── migrations/                 # SQL migrations (production)
│   │   ├── seed.ts                     # seed script (super admin + sample data)
│   │   ├── run-migration.ts            # migration runner
│   │   └── data-source.ts              # standalone DataSource (CLI)
│   ├── redis/                          # ioredis wrapper (cache-aside, hashes, rate-limit)
│   └── modules/
│       ├── auth/                       # register, login, refresh, reset, verify
│       ├── users/                      # profile + admin user mgmt
│       ├── products/                   # CRUD + featured + slug-by
│       ├── categories/                 # CRUD + recompute counts
│       ├── courses/                    # CRUD + curriculum
│       ├── reviews/                    # CRUD + moderation + recompute rating
│       ├── questions/                  # CRUD + answer (author/admin)
│       ├── orders/                    # create + admin list/update status
│       ├── cart/                       # Redis-backed cart
│       ├── banners/                    # CRUD + toggle
│       ├── shops/                      # CRUD + status + recompute revenue
│       ├── settings/                  # singleton settings
│       ├── contact/                    # contact form + admin moderation
│       ├── seller-applications/        # apply to become a seller + admin review
│       ├── admin/                      # dashboard stats + revenue chart
│       ├── uploads/                    # file uploads (images + source files)
│       ├── notifications/              # email service (Nodemailer)
│       └── health/                     # liveness / readiness
├── nginx/
│   └── codemart.conf                   # production nginx reverse-proxy
├── deploy/
│   ├── vps-deploy.sh                  # one-shot VPS deploy script
│   └── postgres-init/01-extensions.sql # PG extensions init
├── Dockerfile                         # multi-stage production image
├── docker-compose.yml                 # postgres + redis + api
├── .env.example                       # all configurable env vars
├── package.json
└── tsconfig.json
```

---

## 🔐 Authentication & RBAC

**Roles** (4-level hierarchy):
| Role            | Code           | Description                                  |
| --------------- | -------------- | -------------------------------------------- |
| Customer        | `customer`     | Default role. Can buy, review, ask questions |
| Store Owner     | `store_owner`  | Approved seller. Can CRUD own products       |
| Admin           | `admin`        | Moderate content, manage users, banners, etc. |
| Super Admin     | `super_admin`  | Full access incl. delete users, change roles |

**Auth flow:**
1. `POST /api/auth/register` → returns `{ user, accessToken, refreshToken, expiresIn }`
2. Client stores `accessToken` (15 min, in memory/localStorage) and `refreshToken` (7 days, httpOnly cookie recommended)
3. On expiry, `POST /api/auth/refresh` with refresh token → new access+refresh pair (rotation)
4. `POST /api/auth/logout` revokes the refresh token
5. `POST /api/auth/forgot-password` → emails a reset link
6. `POST /api/auth/reset-password` → sets new password, revokes all sessions
7. `GET /api/auth/verify-email?token=...` → verifies the email

**Header format:**
```
Authorization: Bearer <accessToken>
```

---

## 🌐 API endpoints (summary)

### Public (no auth)
- `GET    /api/health`
- `GET    /api/products` (paginated, filterable)
- `GET    /api/products/featured`
- `GET    /api/products/slug/:slug`
- `GET    /api/categories`
- `GET    /api/courses` (paginated, filterable)
- `GET    /api/courses/featured`
- `GET    /api/courses/slug/:slug`
- `GET    /api/reviews/product/:productId`
- `GET    /api/questions/product/:productId`
- `GET    /api/banners`
- `GET    /api/shops` (paginated)
- `GET    /api/settings`
- `POST   /api/contact`
- `POST   /api/orders` (guest checkout allowed)
- `GET    /api/orders/by-number/:orderNumber`

### Authenticated (Bearer token)
- `POST   /api/auth/register`, `/login`, `/refresh`, `/logout`
- `POST   /api/auth/forgot-password`, `/reset-password`
- `GET    /api/auth/verify-email?token=...`
- `POST   /api/auth/change-password`
- `GET    /api/users/me` + `PATCH /api/users/me`
- `GET    /api/orders/mine`
- `GET    /api/cart` + `POST /items` + `PATCH /items` + `DELETE /items/:productId` + `DELETE`
- `POST   /api/reviews/product/:productId` (auth user)
- `POST   /api/questions/product/:productId` (auth user)
- `POST   /api/seller-applications` + `GET /mine`
- `POST   /api/uploads/image` (sellers+) + `POST /api/uploads/file`
- `GET    /api/shops/mine`
- `POST   /api/shops` (sellers+) + `PATCH /:id` + `DELETE /:id`

### Admin (`role: admin` or `super_admin`)
- `GET    /api/admin/stats` (dashboard)
- `GET    /api/admin/revenue?days=30`
- `GET    /api/admin/top-products?limit=10`
- `GET    /api/users/admin` + `GET /:id` + `PATCH /:id` + `PATCH /:id/ban` + `PATCH /:id/wallet` + `DELETE /:id`
- `GET    /api/products/admin` + `POST` + `PATCH /:id` + `DELETE /:id`
- `GET    /api/categories/admin` + `POST` + `PATCH /:id` + `DELETE /:id`
- `GET    /api/courses/admin` + `POST` + `PATCH /:id` + `DELETE /:id`
- `GET    /api/reviews/admin` + `PATCH /admin/:id` + `DELETE /admin/:id`
- `GET    /api/orders/admin` + `GET /:id` + `PATCH /:id/status`
- `GET    /api/banners/admin` + `POST` + `PATCH /:id` + `PATCH /:id/toggle` + `DELETE /:id`
- `GET    /api/shops/admin/list` + `PATCH /admin/:id/status` + `POST /admin/recompute`
- `GET    /api/contact/admin` + `PATCH /:id` + `DELETE /:id`
- `GET    /api/seller-applications/admin` + `PATCH /admin/:id/review`

### Super Admin only
- `DELETE /api/users/admin/:id`
- `PATCH  /api/users/admin/:id/ban`

---

## 🐳 Production deployment on a VPS

### Option A — One-shot deploy script

1. Upload the project to your VPS:
   ```bash
   scp -r codemart-backend user@your-server:/opt/codemart
   ssh user@your-server
   cd /opt/codemart
   ```

2. Run the deploy script:
   ```bash
   chmod +x deploy/vps-deploy.sh
   sudo ./deploy/vps-deploy.sh
   ```

   The script:
   - Installs Docker if missing
   - Builds and starts the containers
   - Runs migrations + seed
   - Prints service URLs

3. Point your domain's DNS to the VPS IP, then (optional) install nginx + certbot:
   ```bash
   sudo cp nginx/codemart.conf /etc/nginx/sites-available/codemart
   sudo ln -s /etc/nginx/sites-available/codemart /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d codemart.io -d www.codemart.io
   ```

### Option B — Manual Docker Compose

```bash
cd /opt/codemart
cp .env.example .env
# EDIT .env:
#   - Change DB_PASSWORD, REDIS_PASSWORD
#   - Set JWT_ACCESS_SECRET to `openssl rand -hex 32`
#   - Set JWT_REFRESH_SECRET to `openssl rand -hex 32`
#   - Set SUPER_ADMIN_PASSWORD
#   - Set APP_URL=https://your-domain.com
#   - Set FRONTEND_URL=https://your-domain.com
#   - Set CORS_ORIGINS=https://your-domain.com

docker compose --env-file .env up -d --build
docker compose exec api node dist/database/run-migration.js
docker compose exec api node dist/database/seed.js
```

### Useful Docker commands
```bash
docker compose logs -f api          # tail API logs
docker compose logs -f postgres     # tail DB logs
docker compose restart api          # restart API after env change
docker compose down                 # stop everything
docker compose down -v              # WIPE volumes (destructive!)
docker compose pull && docker compose up -d  # update images
```

---

## ⚙️ Environment variables

All configuration is via `.env` (see `.env.example`). Key variables:

| Variable                  | Default                                  | Description                       |
| ------------------------- | ---------------------------------------- | --------------------------------- |
| `NODE_ENV`                | `production`                             | runtime env                       |
| `APP_PORT`                | `4000`                                   | API listening port                |
| `APP_URL`                 | `http://localhost:4000`                  | public base URL (for upload URLs) |
| `FRONTEND_URL`            | `http://localhost:3000`                  | for CORS + email links            |
| `CORS_ORIGINS`            | `http://localhost:3000`                  | comma-separated list             |
| `DB_HOST` / `DB_PORT`     | `postgres` / `5432`                      | PostgreSQL connection            |
| `DB_USER` / `DB_PASSWORD` | `codemart` / `...`                       | DB credentials                    |
| `DB_NAME`                 | `codemart`                               | DB name                           |
| `DB_SYNC`                 | `false`                                  | TypeORM sync (DEV ONLY)          |
| `REDIS_HOST` / `REDIS_PORT`| `redis` / `6379`                         | Redis connection                  |
| `REDIS_PASSWORD`          | `...`                                    | Redis ACL                         |
| `JWT_ACCESS_SECRET`       | (32+ chars)                              | HS256 secret                       |
| `JWT_REFRESH_SECRET`      | (32+ chars, different)                   | Refresh token HS256 secret        |
| `JWT_ACCESS_EXPIRES`      | `15m`                                    | access token TTL                  |
| `JWT_REFRESH_EXPIRES`     | `7d`                                     | refresh token TTL                 |
| `SUPER_ADMIN_EMAIL`       | `admin@codemart.io`                      | seeded super admin email          |
| `SUPER_ADMIN_PASSWORD`    | `ChangeMe@Admin123`                       | seeded super admin password       |
| `MAIL_HOST` / `MAIL_PORT` | `smtp.mailtrap.io` / `587`               | SMTP for transactional emails      |
| `MAIL_USER` / `MAIL_PASS` | (mailtrap creds)                          | SMTP credentials                   |
| `MAIL_FROM`               | `no-reply@codemart.io`                    | From: address                     |
| `THROTTLE_TTL` / `LIMIT`  | `60000` / `120`                          | global rate limit                  |
| `AUTH_THROTTLE_TTL`/`LIMIT`| `60000` / `10`                          | auth route rate limit              |
| `SWAGGER_PATH`            | `docs`                                   | Swagger UI path                    |

Generate strong secrets with:
```bash
openssl rand -hex 32
```

---

## 🔒 Security checklist (before going live)

- [ ] Set `DB_PASSWORD`, `REDIS_PASSWORD` to strong unique values
- [ ] Generate new `JWT_ACCESS_SECRET` + `JWT_REFRESH_SECRET` (≥ 32 chars each)
- [ ] Change `SUPER_ADMIN_PASSWORD` to something strong
- [ ] Set `NODE_ENV=production`
- [ ] Set `DB_SYNC=false` (use migrations)
- [ ] Configure real SMTP credentials (`MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`)
- [ ] Configure `CORS_ORIGINS` to your actual frontend domain(s)
- [ ] Enable HTTPS via nginx + Let's Encrypt
- [ ] Restrict `5432` (PostgreSQL) and `6379` (Redis) to localhost — don't expose them publicly
- [ ] Set up daily DB backups: `pg_dump -U codemart -h localhost codemart | gzip > codemart_$(date +%F).sql.gz`
- [ ] Configure log rotation for Docker (`/etc/docker/daemon.json`)
- [ ] Set up monitoring (UptimeRobot, Grafana, etc.)

---

## 🧪 Local development (without Docker)

```bash
# 1. Run postgres + redis locally OR via docker compose:
docker compose up -d postgres redis

# 2. Install deps
npm install

# 3. Apply schema (dev-only)
DB_SYNC=true npm run start:dev

# 4. In another terminal, seed:
npm run seed

# 5. API live at http://localhost:4000/api
# 6. Swagger at http://localhost:4000/docs
```

---

## 🛠 Database schema overview

14 tables, all using UUID primary keys:

| Table                  | Purpose                                                    |
| ---------------------- | --------------------------------------------------------- |
| `users`                | customers, sellers, admins (with role + status enums)    |
| `shops`                | seller storefronts                                         |
| `products`             | digital products (with author, category, shop relations) |
| `categories`           | product categories (tech / project_type groups)           |
| `courses`              | video courses with curriculum JSON                         |
| `reviews`              | product reviews with moderation status                     |
| `questions`            | product Q&A with answers                                   |
| `orders`               | checkout orders with payment method + status               |
| `order_items`          | line items per order                                       |
| `banners`              | marketing banners (carousel / popup)                       |
| `settings`             | site-wide singleton settings                               |
| `contact_messages`     | contact form submissions                                   |
| `seller_applications`  | seller onboarding applications                            |
| `refresh_tokens`       | JWT refresh tokens (rotated on each refresh)               |
| `audit_logs`           | admin action audit trail                                   |
| `subscriptions`        | newsletter subscribers                                     |

---

## 📈 Performance & caching

- **Redis** is used for:
  - Cache-aside on hot reads (product by slug, featured products, categories, banners, settings, dashboard stats)
  - Per-user cart (hash), 7-day TTL
  - Rate-limit counters (via `@nestjs/throttler`)
- **TTL strategy**: 60s (dashboard stats), 120s (course by slug), 300s (featured products, banners, categories, settings), 3600s default.
- Cache invalidation on write (every mutation clears the relevant cache key).

---

## 📚 API documentation

Once the API is running, open the interactive Swagger UI:

- **Local**: <http://localhost:4000/docs>
- **Production**: <https://your-domain.com/docs> (disable in prod via `SWAGGER_PATH=` empty)

You can test every endpoint, with full authentication (click **Authorize**, paste your `accessToken`).

---

## 🧭 Roadmap / Extensibility

This is intentionally structured so you can extend it without breaking the frontend:

- Add **Stripe / Razorpay / PayPal** payment integrations in `orders.service.ts`
- Add **OAuth** (Google / GitHub) by extending the `auth` module
- Add **WebSocket** notifications (NestJS Gateway) for live order updates
- Add **Elasticsearch** for product search (drop-in replacement for the LIKE queries)
- Add **S3 / MinIO** for file uploads (swap the local-fs in `uploads.service.ts`)
- Add **2FA** for admins via TOTP

---

## 📄 License

MIT © CodeMart Team
