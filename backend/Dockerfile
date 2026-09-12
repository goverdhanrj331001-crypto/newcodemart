# syntax=docker/dockerfile:1.7

# ============================================================================
# CodeMart Backend — Multi-stage Production Dockerfile (DNS-resilient)
# Uses bcryptjs (pure JS) — no native compile needed, no python/g++ required.
# ============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# No build deps needed — we use bcryptjs (pure JS) instead of bcrypt (native).
# But keep tini available for runtime.

COPY package*.json ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./

# Install ALL deps (incl. devDeps for build) with --legacy-peer-deps to avoid
# peer-dep conflicts (NestJS ecosystem can be a bit picky).
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY . .

RUN npm run build

# Prune devDependencies to keep the production image lean
RUN npm install --omit=dev --no-audit --no-fund --legacy-peer-deps


# ============================================================================
# Final runtime image
# ============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install tini with mirror fallback (DNS-resilient).
RUN set -eux; \
    if ! apk add --no-cache --quiet tini > /dev/null 2>&1; then \
      echo "[runtime] default apk repo failed, switching to mirror..."; \
      sed -i 's|dl-cdn.alpinelinux.org|uk.alpinelinux.org|g' /etc/apk/repositories; \
      apk update --quiet && apk add --no-cache --quiet tini; \
    fi && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Copy built artifact + node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

# Copy supporting files (for seed / migration scripts)
COPY --chown=nestjs:nodejs src/database ./src/database

# Persistent volume for uploads
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads
VOLUME ["/app/uploads"]

USER nestjs

EXPOSE 4000

# Healthcheck using wget (built-in to Alpine, no curl needed)
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health/ping || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]
