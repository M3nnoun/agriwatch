# --- deps: install all dependencies (incl. dev, needed for prisma CLI + ts-node) ---
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
# prisma/ is needed because the postinstall hook runs `prisma generate`
COPY prisma ./prisma
RUN npm ci

# --- builder: generate the Postgres Prisma client + build Next.js ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Docker/production runs on PostgreSQL + PostGIS, not the default SQLite schema.
RUN npm run db:generate:postgres
RUN npm run build

# --- runner: ship the app with full node_modules so db push + seed run on boot ---
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV DEMO_MODE=true
ENV NEXT_PUBLIC_DEMO_MODE=true

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

# On boot: sync the Postgres schema, seed demo data, then start Next.js.
CMD sh -c "npm run db:push:postgres && npm run db:seed && npm run start"
