# 📝 AgriWatch — Devpost Submission (copy-paste ready)

Paste each block into the matching Devpost field. Devpost renders **Markdown**, so headings/bold/lists work.

> ⏰ **Beyond Tomorrow Summit — deadline June 5, 5:00pm EDT.** Students only. Category: tag it under
> **Sustainability + FinTech + AI/ML**. **Round 1 is judged by an AI**, so the written sections below
> are deliberately explicit and keyword-rich — paste them as-is.

---

## ✅ Beyond Tomorrow Summit — required fields (paste these)

### Team Details
```
Team name: <your team name>
Member(s): <Full name> — <role, e.g. Full-stack / AI> — <email/university>
<add teammates, one per line>
Hackathon: Beyond Tomorrow Summit
```

### Problem Statement
500 million smallholder farming families produce **70% of the world's food**, yet **75% of their climate risk is uninsured** and 31% have no access to climate information. When drought or flood strikes, they discover it only when it is already too late — and a single bad season cascades into debt, school dropouts, and hunger. Traditional crop insurance cannot reach them: it depends on human inspectors and paperwork, economics that collapse on a one-hectare plot, so insurers do not offer it. There is no affordable system that combines early warning with a payout a smallholder can actually receive.

### Solution Overview
**AgriWatch** is satellite-powered, AI-driven **parametric micro-insurance** for smallholder farmers, delivered to any phone — no app required. It (1) **Watches** every farm from orbit using Sentinel-2 crop-health imagery (NDVI/NDWI) fused with NASA POWER + Open-Meteo weather; (2) **Warns** the farmer with a Claude-written alert in their own language (Arabic/Swahili/French/English) when risk crosses FAO drought thresholds, via WhatsApp/SMS; and (3) **Pays** automatically — a parametric payout to mobile money (M-Pesa/Orange Money) the instant drought is confirmed, with no claim form or inspector. The result: **$15 reaches a farmer's phone the second the satellite confirms drought.** A one-click `/simulate` demo runs the full chain live.

### Technology Stack Used
**Frontend/Backend:** Next.js 14 (App Router), TypeScript, React, Tailwind CSS · **AI:** Anthropic Claude (streaming, multilingual) · **Data:** Sentinel-2 (NDVI/NDWI), NASA POWER, Open-Meteo, FAO drought thresholds · **DB/ORM:** Prisma with SQLite (zero-setup) + PostgreSQL/PostGIS (Docker) · **Realtime:** Server-Sent Events · **Messaging/Payments:** Twilio WhatsApp, M-Pesa (simulated) · **Maps/Charts:** Leaflet, Recharts · **Infra:** Docker Compose, Vercel-ready.

### Deliverables
- **GitHub:** `https://github.com/<your-username>/agriwatch`  ← must be set (see checklist below)
- **Pitch deck:** `pitch/index.html` (Reveal.js) — present live, or export to PDF via `index.html?print-pdf`
- **Demo video:** screen-record the `/simulate` flow (script in `pitch/SCRIPT.md`, slide 7)
- **Screenshots:** see media checklist at the bottom

---

## Project name
```
AgriWatch
```

## Tagline / elevator pitch  (short — keep under ~120 chars)
```
We watch your fields from space, warn you before the storm, and pay you the instant drought hits.
```

---

## Inspiration
500 million smallholder farming families grow 70% of the world's food — yet **75% of their climate risk is completely uninsured**, and nearly a third have no access to climate information at all. When drought or flood hits, they find out only when it's already too late: one bad season cascades into debt, kids pulled out of school, and hunger.

Traditional crop insurance can't help them — it relies on human inspectors and paperwork, economics that fall apart on a one-hectare plot, so insurers simply don't offer it. We kept coming back to one farmer in our research, "Amara," a millet grower in Senegal whose rains never came. We asked: what if the satellite that already sees her field could **warn her in her own language and pay her automatically** the moment drought is confirmed — with no app, no claim form, and no inspector?

## What it does
AgriWatch is climate-resilient **parametric micro-insurance** delivered to any phone. It does three things:

- **🛰️ Watch** — every farm is monitored from orbit. We compute crop health (NDVI/NDWI) from **Sentinel-2** imagery and combine it with rainfall and 14-day forecasts from **NASA POWER** and **Open-Meteo**.
- **📡 Warn** — when risk crosses published **FAO drought thresholds**, **Claude** writes a warm, plain-language alert in the farmer's own language (Arabic, Swahili, French, English) with 3 concrete actions — delivered over **WhatsApp/SMS**, no app required.
- **💵 Pay** — if drought is confirmed, a **parametric payout** fires automatically to the farmer's mobile money (M-Pesa / Orange Money), with a transaction receipt — in seconds, not weeks.

The magic moment: **$15 reaches a farmer's phone the instant the satellite confirms drought.** Our `/simulate` page runs that entire chain live — satellite scan → NDVI drop → risk score → Claude-written alert streaming token-by-token → WhatsApp delivery → automatic payout.

## How we built it
- **Full-stack Next.js 14 (App Router)** + TypeScript — one repo for frontend, API, and background logic.
- **Route Handlers** for the API, including a **Server-Sent Events** stream (`/api/simulate`) that powers the live demo with zero extra libraries.
- **Anthropic Claude** (`claude-sonnet-4-6`) for streaming, multilingual alert generation.
- **Prisma ORM** with a **dual schema**: SQLite by default (zero-setup local run) and PostgreSQL + PostGIS for Docker/production.
- **Satellite/weather science**: NDVI = (NIR−Red)/(NIR+Red) from Sentinel-2 bands; FAO Irrigation & Drainage Paper 56 thresholds per crop drive a 0–100 risk score.
- **Tailwind CSS** for a custom "ground truth from orbit" dark UI; **Leaflet** for the NDVI map; **Recharts** for charts; **Twilio** for WhatsApp.
- **Docker Compose** for a one-command Postgres demo, and a graceful **DEMO_MODE** so the whole product runs with mock satellite/payout/WhatsApp and only Claude live.

## Challenges we ran into
- **SQLite has no enum type.** To let the app run with zero setup *and* on Postgres, we moved DB enums to `String` columns and enforced the allowed values with TypeScript unions — one Prisma Client shape across both providers.
- **Reliable streaming.** Getting Server-Sent Events to stream cleanly from a Next.js Route Handler (and parsing them on the client) took careful buffering, plus a structured `error` event so a failure never hard-crashes the stream.
- **Keyless demo.** We added a localized, token-by-token **fallback** so `/simulate` works perfectly even with no Anthropic API key — judges see the full flow instantly, and it upgrades to live Claude when a key is present.
- **Provider portability.** Two Prisma schemas + scripts so `npm run db:push` just works locally while Docker uses Postgres/PostGIS.

## Accomplishments that we're proud of
- A **genuinely working** end-to-end product, not a mockup — one click runs satellite → AI → payout live.
- **Live, streaming, multilingual** AI alerts in 4 languages.
- Runs with **zero setup** (SQLite, no Docker) *and* ships a production Docker/Postgres path.
- A **premium landing page** and a polished **Reveal.js pitch deck**, all on one cohesive brand.
- Built on **100% open data and APIs** (Sentinel-2, NASA POWER, Open-Meteo) — no proprietary hardware.

## What we learned
- How **parametric insurance** removes fraud and cost by making the measurement itself the trigger.
- The real science of **satellite vegetation indices** and how to fuse them with weather to reduce "basis risk."
- Streaming patterns for **SSE inside Next.js Route Handlers**, and **multi-provider Prisma** setups.
- That the hardest problems here are **last-mile** (language, any phone, trust) — not the algorithms.

## What's next for AgriWatch
- **Live data integrations**: real Copernicus/Sentinel-2 imagery pipeline, Safaricom **Daraja (M-Pesa)** B2C and **Orange Money** payouts, and production Twilio WhatsApp.
- **SMS/USSD** delivery for farmers without WhatsApp.
- A **pilot** with a cooperative or microfinance partner, backed by a reinsurance pool.
- **Cron-based monitoring** at scale (the engine already exists at `/api/monitor/[farmId]`).
- Expanded perils: **flood, frost, and pest** alerts (already modeled in the schema).

---

## "Built with" (tags)
```
nextjs, typescript, react, tailwindcss, prisma, postgresql, sqlite, postgis,
anthropic, claude, sentinel-2, nasa-power, open-meteo, twilio, whatsapp,
leaflet, recharts, m-pesa, docker, vercel
```

## "Try it out" links
- **GitHub:** `https://github.com/<your-username>/agriwatch`  ← replace with your repo
- **Live demo:** `https://<your-deploy>.vercel.app`  ← optional, if you deploy
- **Run locally:**
  ```bash
  npm install
  npm run db:push && npm run db:seed
  npm run dev   # http://localhost:3000  → open /simulate
  ```

---

## 📸 Media checklist (Devpost ranks projects with images/video higher)

**Thumbnail (most important — shows in the gallery):**
- Use the **`/simulate` screen mid-payout** (the green $15.00 receipt) OR the **landing hero**.

**Gallery images (add 4–6):**
1. Landing hero — "We watch your fields from space"
2. `/simulate` showing the $15 payout receipt + streamed alert
3. `/dashboard` overview (metrics, alerts, payouts)
4. `/map` — NDVI map with colored farm markers
5. `/farmers` — multilingual farmer list
6. A pitch-deck slide (e.g. "Watch · Warn · Pay")

> How to capture: `npm run dev`, open each page, use your OS screenshot tool (Win: `Win+Shift+S`).

**Demo video (~1–2 min, optional but strongly recommended):**
- Screen-record the **`/simulate` flow** start to finish, narrating the script from `pitch/SCRIPT.md` (slide 7).
- Upload to YouTube (unlisted is fine) and paste the link in the Devpost "Video demo link" field.

---

## ⏱️ Quick fill order on Devpost
1. Project name + tagline
2. Paste the narrative sections (Inspiration → What's next)
3. Add "Built with" tags
4. Add "Try it out" links (GitHub + run instructions)
5. Upload thumbnail + gallery images
6. Paste video link
7. Select the hackathon's challenge/category and submit ✅
```
```
