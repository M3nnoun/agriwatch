# 🌍 AgriWatch

**We watch your fields from space. We warn you before the storm hits. We pay you when it does.**

AgriWatch is a full-stack Next.js 14 app that combines **satellite crop monitoring**, **AI-powered
early warning**, and **automatic parametric micro-insurance** — delivered to any phone over WhatsApp,
in the farmer's own language, with no app install required.

500M smallholder families grow 70% of the world's food, yet 75% of their risk is uninsured. When
drought hits, they find out too late. AgriWatch closes that gap: the instant satellite + weather data
confirm drought, Claude writes a localized alert and a micro-payout fires to the farmer's mobile money.

---

## ⚡ Quick start (no Docker — SQLite)

The fastest way to run the whole app. No database server, no containers — just Node.

```bash
npm install                 # installs deps + generates the Prisma client
npm run db:push             # creates prisma/dev.db (SQLite) and the tables
npm run db:seed             # seeds 8 farmers across 6 countries
npm run dev                 # http://localhost:3000
```

`.env` already defaults to SQLite (`DATABASE_URL="file:./dev.db"`). The **entire app — including the
`/simulate` drought flow — runs with no API key**: when `ANTHROPIC_API_KEY` is absent (or a call
fails), AgriWatch streams a localized canned alert token-by-token so the demo is identical. Add a key
to get **live** Claude-written alerts:

```bash
ANTHROPIC_API_KEY="sk-ant-..."   # in .env
# optional: ANTHROPIC_MODEL="claude-sonnet-4-6"  (default)
```

> Everything else runs in **DEMO_MODE** — satellite, payouts, and WhatsApp all have mock fallbacks.
> With a key, Claude alert generation goes live; that token-by-token message is the heart of the product.

## 🐳 Run with Docker (PostgreSQL + PostGIS)

For a production-shaped stack on Postgres:

```bash
cp .env.example .env        # add your ANTHROPIC_API_KEY
docker compose up --build
```

Then open **http://localhost:3000**. The Postgres schema is auto-pushed and pre-seeded on boot, so
judges see live data immediately.

> AgriWatch ships **two Prisma schemas** from one codebase: `prisma/schema.prisma` (SQLite, the
> default for local dev) and `prisma/schema.postgres.prisma` (used by Docker/production). Because
> SQLite has no native enum type, enum-like fields are stored as `String` and their allowed values
> are enforced in TypeScript (`lib/types.ts`).

---

## 🎬 The demo (the moment that matters)

1. Open `/simulate`
2. Select **Amara Diallo** (Senegal, millet)
3. Click **Simulate drought event** and watch, live:
   - 🛰️ Satellite scan progresses (Sentinel-2 bands B04 + B08)
   - 📉 NDVI drops to **0.28** (≈45% below seasonal average)
   - 🔴 Risk climbs to **CRITICAL**
   - 💬 Claude streams a **French** WhatsApp alert token by token
   - 📲 WhatsApp delivered
   - 💵 **$15.00** auto-fires to M-Pesa with a transaction reference

That instant payout — the moment satellite confirms drought — *is* the product.

---

## 🏗️ Architecture

```
FARMER (WhatsApp / SMS)
   |  Twilio webhook
   v
Next.js Route Handlers (app/api/**/route.ts)
   |- /api/simulate         SSE stream *  (the demo engine)
   |- /api/monitor/[farmId] full monitoring cycle
   |- /api/webhook/whatsapp onboarding flow
   |- /api/farmers, /api/alerts, /api/payouts, /api/dashboard
   |
   |- lib/satellite.ts      Sentinel-2 + NDVI/NDWI math
   |- lib/weather.ts        NASA POWER + Open-Meteo
   |- lib/risk-engine.ts    FAO drought thresholds -> risk score
   |- lib/advisory.ts       Anthropic SDK streaming (live)
   |- lib/payout-engine.ts  parametric trigger + mock M-Pesa
   |- lib/whatsapp.ts       Twilio sender (mock in demo)
   v
Prisma -> PostgreSQL + PostGIS
   v
App Router UI: dashboard . /simulate * . /map . /alerts . /farmers
```

### Stack
Next.js 14 (App Router) · TypeScript · Prisma · PostgreSQL/PostGIS · Tailwind CSS · Anthropic SDK ·
Leaflet · Recharts.

---

## 📡 Data sources

| Layer       | Source                                   | NDVI / risk basis                            |
| ----------- | ---------------------------------------- | -------------------------------------------- |
| Crop health | Sentinel-2 (B08 NIR, B04 Red, B03 Green) | `NDVI = (NIR-Red)/(NIR+Red)`                 |
| Weather     | NASA POWER + Open-Meteo                  | 7-day rainfall, 14-day forecast, soil moist. |
| Thresholds  | FAO Irrigation & Drainage Paper 56       | per-crop mm/week critical & warning limits   |

---

## 🔧 Environment variables

See [`.env.example`](./.env.example). Only `DATABASE_URL` and `ANTHROPIC_API_KEY` are required;
`DEMO_MODE=true` makes everything else optional.

## 📜 Scripts

| Command           | Description                      |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start the dev server            |
| `npm run build`   | Production build                |
| `npm run start`   | Start the production server     |
| `npm run db:push` | Push the SQLite schema to the DB |
| `npm run db:seed` | Seed 8 demo farmers             |
| `npm run db:reset` | Wipe + re-push + re-seed SQLite |
| `npm run setup`   | Generate client + push + seed (one-shot) |

---

Built for farmers who deserve to know what's coming — and to be made whole when it arrives.
