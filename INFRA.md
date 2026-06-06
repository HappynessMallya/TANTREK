# INFRA — TANTREK 360 CMS API (Docker / Traefik / MinIO)

Deployment baseline for the NestJS CMS API. Companion to **[BACKEND_HANDOFF.md](./BACKEND_HANDOFF.md)**.

**Domains (Cloudflare → Traefik → containers):**

| Host | Cloudflare | Service |
|------|-----------|---------|
| `tantrek360safaris.com`, `www.tantrek360safaris.com` | proxied (orange) | Public site (Next.js, hosted separately) |
| `api.tantrek360safaris.com` | proxied (orange) OK | Nest API — content base `…/api/v1` |
| `minio.tantrek360safaris.com` | **DNS-only (grey)** | MinIO — grey cloud so large uploads aren't capped |

---

## docker-compose.yml

```yaml
networks:
  tantrek_net:
    driver: bridge
  proxy-network:
    external: true

volumes:
  postgres_data:
  redis_data:
  minio_data:

services:
  # --- API (Traefik) ---
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    image: tantrek-cms-api:latest
    container_name: tantrek_api
    restart: always
    env_file: .env
    environment:
      NODE_ENV: production
      DB_TYPE: postgres
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${DB_NAME:-tantrek_db}
      DB_USER: ${DB_USER:-tantrek_user}
      DB_PASS: ${DB_PASS}

      # JWT auth (Bearer) — the dashboard sends Authorization: Bearer <token>
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-7d}

      # Seeded admin (override at deploy time)
      ADMIN_SEED_EMAIL: ${ADMIN_SEED_EMAIL:-admin@tantrek360safaris.com}
      ADMIN_SEED_PASSWORD: ${ADMIN_SEED_PASSWORD:-change-me-password}
      ADMIN_SEED_ROLE: ${ADMIN_SEED_ROLE:-admin}

      REDIS_HOST: redis
      REDIS_PORT: 6379

      # MinIO internal — hyphenated alias (minio-js rejects underscores in Host)
      MINIO_ENDPOINT: tantrek-minio-s3
      MINIO_PORT: "9000"
      MINIO_USE_SSL: "false"

      # MinIO public (browser-reachable host for presigned/stable URLs)
      MINIO_PUBLIC_ENDPOINT: minio.tantrek360safaris.com
      MINIO_PUBLIC_PORT: "443"
      MINIO_PUBLIC_USE_SSL: "true"

      MINIO_ACCESS_KEY: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_SECRET_KEY: ${MINIO_SECRET_KEY:-minioadmin}
      MINIO_BUCKET: ${MINIO_BUCKET:-cms-media}

      MEDIA_NAMESPACE: ${MEDIA_NAMESPACE:-tantrek-cms}
      MEDIA_PRESIGN_PUT_TTL_SEC: ${MEDIA_PRESIGN_PUT_TTL_SEC:-7200}
      MEDIA_PRESIGN_GET_TTL_SEC: ${MEDIA_PRESIGN_GET_TTL_SEC:-3600}
      MAX_VIDEO_SIZE_MB: ${MAX_VIDEO_SIZE_MB:-500}
      MEDIA_AUTO_TRANSCODE: ${MEDIA_AUTO_TRANSCODE:-true}

      # CORS — public site + admin origins
      CORS_ORIGIN: ${CORS_ORIGIN:-https://tantrek360safaris.com,https://www.tantrek360safaris.com}
    networks:
      - tantrek_net
      - proxy-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
      minio:
        condition: service_started
      minio-init:
        condition: service_completed_successfully
    healthcheck:
      test:
        - "CMD-SHELL"
        - "node -e \"require('http').get('http://localhost:3000/api/v1/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))\""
      interval: 30s
      timeout: 10s
      retries: 3
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.tantrek-api.rule=Host(`api.tantrek360safaris.com`) && PathPrefix(`/api`)"
      - "traefik.http.routers.tantrek-api.entrypoints=web,websecure"
      - "traefik.http.routers.tantrek-api.tls=true"
      - "traefik.http.routers.tantrek-api.priority=1000"
      - "traefik.http.routers.tantrek-api.tls.certresolver=letsencrypt"
      - "traefik.http.services.tantrek-api.loadbalancer.server.port=3000"
      - "traefik.docker.network=proxy-network"

  # --- MinIO (Traefik) ---
  minio:
    image: minio/minio:latest
    container_name: tantrek_minio
    restart: always
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY:-minioadmin}
    volumes:
      - minio_data:/data
    networks:
      tantrek_net:
        aliases:
          - tantrek-minio-s3
      proxy-network: {}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.tantrek-minio.rule=Host(`minio.tantrek360safaris.com`)"
      - "traefik.http.routers.tantrek-minio.entrypoints=web,websecure"
      - "traefik.http.routers.tantrek-minio.tls=true"
      - "traefik.http.routers.tantrek-minio.tls.certresolver=letsencrypt"
      - "traefik.http.services.tantrek-minio.loadbalancer.server.port=9000"
      - "traefik.docker.network=proxy-network"
      # Long timeouts for big video PUTs (see Traefik notes below)
      - "traefik.http.services.tantrek-minio.loadbalancer.serverstransport=minio-long-upload@file"

  # --- MinIO init: create bucket once ---
  minio-init:
    image: minio/mc:latest
    container_name: tantrek_minio_init
    entrypoint: ["/bin/sh", "-c"]
    command:
      - |
        echo "Waiting for MinIO..."
        sleep 5
        mc alias set myminio http://tantrek-minio-s3:9000 "$$MINIO_ROOT_USER" "$$MINIO_ROOT_PASSWORD"
        mc mb myminio/"$MINIO_BUCKET" --ignore-existing
        echo "MinIO bucket '$MINIO_BUCKET' ready."
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY:-minioadmin}
      MINIO_BUCKET: ${MINIO_BUCKET:-cms-media}
    depends_on:
      minio:
        condition: service_started
    networks:
      - tantrek_net
    restart: "no"

  # --- POSTGRES ---
  postgres:
    image: postgres:16-alpine
    container_name: tantrek_postgres
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME:-tantrek_db}
      POSTGRES_USER: ${DB_USER:-tantrek_user}
      POSTGRES_PASSWORD: ${DB_PASS}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - tantrek_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-tantrek_user} -d ${DB_NAME:-tantrek_db}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # --- REDIS ---
  redis:
    image: redis:7-alpine
    container_name: tantrek_redis
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - tantrek_net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
```

---

## Dockerfile

```dockerfile
FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg \
  && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY seed.json ./seed.json
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

---

## .env (production reference)

```env
# Database
DB_NAME=tantrek_db
DB_USER=tantrek_user
DB_PASS=<strong-password>

# Auth
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
ADMIN_SEED_EMAIL=admin@tantrek360safaris.com
ADMIN_SEED_PASSWORD=<change-me>
ADMIN_SEED_ROLE=admin

# MinIO
MINIO_ACCESS_KEY=<minio-access-key>
MINIO_SECRET_KEY=<minio-secret-key>
MINIO_BUCKET=cms-media

# Media
MEDIA_NAMESPACE=tantrek-cms
MEDIA_PRESIGN_PUT_TTL_SEC=7200
MEDIA_PRESIGN_GET_TTL_SEC=3600
MAX_VIDEO_SIZE_MB=500
MEDIA_AUTO_TRANSCODE=true

# CORS — public site origins (no trailing slash)
CORS_ORIGIN=https://tantrek360safaris.com,https://www.tantrek360safaris.com
```

**Frontend env (set on the Next.js host):**
```env
NEXT_PUBLIC_CMS_API_URL=https://api.tantrek360safaris.com/api/v1
NEXT_PUBLIC_SITE_URL=https://www.tantrek360safaris.com
```
Also add `minio.tantrek360safaris.com` to the frontend `next.config.mjs` `images.remotePatterns` so `next/image` can load CMS media.

---

## Traefik — long-upload transport (for large video PUTs)

The MinIO service references `minio-long-upload@file`. Add this dynamic file to Traefik (e.g. `/etc/traefik/dynamic/minio-upload.yml`) and ensure the file provider is enabled:

```yaml
# /etc/traefik/dynamic/minio-upload.yml
http:
  serversTransports:
    minio-long-upload:
      forwardingTimeouts:
        dialTimeout: 30s
        responseHeaderTimeout: 0s
        idleConnTimeout: 0s
```

```yaml
# static traefik.yml
providers:
  file:
    directory: /etc/traefik/dynamic
    watch: true
```

If you prefer not to use a ServersTransport, raise `entryPoints.websecure.transport.respondingTimeouts` (read/write/idle) instead. Either restart Traefik and recreate the MinIO container after the change.

---

## CORS on the MinIO bucket (only needed if you use presigned browser PUT)

The current frontend uploads via the Nest **multipart** endpoints (file flows through the API), so API CORS (`CORS_ORIGIN` above) is what matters. **If** you later add presigned browser-direct PUT, set bucket CORS to allow the site origins:

```json
[
  {
    "AllowedOrigins": ["https://tantrek360safaris.com", "https://www.tantrek360safaris.com"],
    "AllowedMethods": ["GET", "PUT", "HEAD", "POST", "DELETE", "OPTIONS"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "x-amz-request-id"],
    "MaxAgeSeconds": 3000
  }
]
```
Apply with `mc cors set <alias>/cms-media cors.json`.

---

## Verify

1. `GET https://api.tantrek360safaris.com/api/v1/health` → `200`.
2. `POST …/api/v1/auth/login` → `{ access_token, user }`.
3. Public site with `NEXT_PUBLIC_CMS_API_URL` set renders the seeded content.
4. Upload a video in `/cms/media`: PUT to MinIO host completes; returned `url` still works after a redeploy.
