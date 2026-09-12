# Backend Integration Guide

This frontend is now backed by a complete NestJS + PostgreSQL + Redis backend.

## Backend location
- Backend code: `../codemart-backend/`
- API URL: `http://localhost:4000/api`
- Swagger docs: `http://localhost:4000/docs`

## Connecting the frontend

1. Create `.env.local` in this frontend project:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   NEXT_PUBLIC_API_BASE=http://localhost:4000
   ```

2. Replace the static data imports in `features/*/data/*.ts` with `fetch` calls:
   - `features/products/data/products.data.ts` → `GET /api/products`
   - `features/products/data/products.data.ts` (single) → `GET /api/products/slug/:slug`
   - `features/categories/data/categories.data.ts` → `GET /api/categories`
   - `features/courses/data/courses.data.ts` → `GET /api/courses`
   - `features/admin/data/admin.data.ts`:
     - users → `GET /api/users/admin`
     - orders → `GET /api/orders/admin`
     - reviews → `GET /api/reviews/admin`
     - banners → `GET /api/banners/admin`
     - shops → `GET /api/shops/admin/list`
     - settings → `GET /api/settings`

3. The UI components DO NOT change — only the data sources swap.

## Authentication

Store JWT access token (15 min TTL) in localStorage:
```ts
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
```

Use the access token in Authorization header for all protected requests.
On 401, call `POST /api/auth/refresh` to get a new pair.

## Admin panel
The admin panel at `/admin` already has the right shape. To connect:
- Admin login: `admin@codemart.io` / `ChangeMe@Admin123`
- Dashboard stats: `GET /api/admin/stats`
- Revenue chart: `GET /api/admin/revenue?days=30`

See `../codemart-backend/README.md` for the complete API reference.
