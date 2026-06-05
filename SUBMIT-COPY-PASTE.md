# 📋 AgriWatch — Devpost Copy-Paste Sheet (Beyond Tomorrow Summit)

For each field below: copy the text in the box and paste it into the matching Devpost field.
`<<...>>` = replace with your own info. Devpost renders **Markdown**.

⏰ Deadline: **June 5, 5:00pm EDT** · Category: **Sustainability / FinTech / AI**

---

## 1) Project name
```
AgriWatch
```

## 2) Tagline (a.k.a. "elevator pitch", keep it short)
```
We watch your fields from space, warn you before the storm, and pay you the instant drought hits.
```

## 3) "Built with" (technology tags — add each as a tag)
```
nextjs
typescript
react
tailwindcss
prisma
sqlite
postgresql
postgis
anthropic
claude
sentinel-2
nasa-power
open-meteo
twilio
whatsapp
leaflet
recharts
m-pesa
docker
```

## 4) "Try it out" links
```
https://github.com/m3nnoun/agriwatch
```
(Add a second link if you deploy to Vercel: `https://<<your-app>>.vercel.app`)

---

## 5) Project Description / "The Story"
👉 Paste this entire block into the big description box:

---

## Inspiration
500 million smallholder farming families grow **70% of the world's food** — yet **75% of their climate risk is completely uninsured**, and nearly a third have no access to climate information. When drought hits, they find out only when it's already too late: one bad season means debt, kids pulled out of school, and hunger. Traditional crop insurance can't help — it needs inspectors and paperwork, economics that fall apart on a one-hectare plot. We built AgriWatch for farmers like "Amara," a millet grower in Senegal whose rains never came.

## What it does
AgriWatch is satellite-powered, AI-driven **parametric micro-insurance**, delivered to any phone — no app required:

- **🛰️ Watch** — monitors every farm from orbit: crop health (NDVI/NDWI) from **Sentinel-2**, fused with rainfall and 14-day forecasts from **NASA POWER** and **Open-Meteo**.
- **📡 Warn** — when risk crosses **FAO drought thresholds**, **Claude** writes a clear alert in the farmer's own language (Arabic, Swahili, French, English) with 3 actions, sent over **WhatsApp/SMS**.
- **💵 Pay** — if drought is confirmed, a **parametric payout** fires automatically to mobile money (M-Pesa/Orange Money) with a receipt — in seconds, no claim form, no inspector.

The magic moment: **$15 reaches a farmer's phone the instant the satellite confirms drought.** Our `/simulate` page runs the whole chain live — satellite scan → NDVI drop → risk score → Claude alert streaming token-by-token → WhatsApp delivery → automatic payout.

## How we built it
- **Next.js 14 (App Router)** + TypeScript — frontend, API, and logic in one repo.
- **Route Handlers** with a **Server-Sent Events** stream (`/api/simulate`) powering the live demo.
- **Anthropic Claude** for streaming, multilingual alert generation.
- **Prisma** with a dual schema: **SQLite** (zero-setup) + **PostgreSQL/PostGIS** (Docker).
- Real satellite math (NDVI = (NIR−Red)/(NIR+Red)) and **FAO** crop thresholds → a 0–100 risk score.
- **Tailwind CSS** dark UI, **Leaflet** NDVI map, **Recharts**, **Twilio** WhatsApp, **Docker Compose**.

## Challenges we ran into
- **SQLite has no enums** — we moved DB enums to `String` and enforced values in TypeScript so one codebase runs on both SQLite and Postgres.
- **Reliable streaming** — clean Server-Sent Events from a Next.js Route Handler, with a structured error event so it never hard-crashes.
- **Keyless demo** — a localized, token-by-token fallback so `/simulate` works with no API key, upgrading to live Claude when a key is present.

## Accomplishments that we're proud of
- A **genuinely working** end-to-end product — one click runs satellite → AI → payout live.
- **Live, streaming, multilingual** AI alerts in 4 languages.
- Runs with **zero setup** (SQLite, no Docker) and ships a production Docker/Postgres path.
- Built on **100% open data** (Sentinel-2, NASA POWER, Open-Meteo) — no proprietary hardware.

## What we learned
- How **parametric insurance** removes fraud and cost by making the measurement the trigger.
- Satellite vegetation indices and fusing them with weather to reduce basis risk.
- Server-Sent Events in Next.js, and multi-provider Prisma setups.

## What's next for AgriWatch
- Live **Copernicus/Sentinel-2** pipeline, real **M-Pesa (Daraja)** & **Orange Money** payouts, production **Twilio** WhatsApp.
- **SMS/USSD** for farmers without WhatsApp.
- A **pilot** with a cooperative or microfinance partner, backed by reinsurance.
- New perils already modeled: **flood, frost, pest**.

---
👆 End of description block.

---

## 6) Problem Statement *(if there's a separate field)*
👉 Paste:

---
500 million smallholder farming families produce 70% of the world's food, yet 75% of their climate risk is uninsured and 31% have no access to climate information. When drought or flood strikes, they find out only when it is already too late — and one bad season cascades into debt, school dropouts, and hunger. Traditional crop insurance cannot reach them: it relies on human inspectors and paperwork, economics that collapse on a one-hectare plot, so insurers simply do not offer it. There is no affordable system that pairs early warning with a payout a smallholder can actually receive.

---

## 7) Solution Overview *(if there's a separate field)*
👉 Paste:

---
AgriWatch is satellite-powered, AI-driven parametric micro-insurance delivered to any phone, no app required. It Watches every farm from orbit (Sentinel-2 NDVI/NDWI fused with NASA POWER + Open-Meteo weather), Warns the farmer with a Claude-written alert in their own language when risk crosses FAO drought thresholds via WhatsApp/SMS, and Pays automatically — a parametric payout to mobile money (M-Pesa/Orange Money) the instant drought is confirmed, with no claim form or inspector. The result: $15 reaches a farmer's phone the second the satellite confirms drought. A one-click /simulate demo runs the full chain live.

---

## 8) Technology Stack *(if there's a separate field)*
👉 Paste:

---
Next.js 14 (App Router), TypeScript, React, Tailwind CSS; Anthropic Claude (streaming, multilingual); Sentinel-2 (NDVI/NDWI), NASA POWER, Open-Meteo, FAO drought thresholds; Prisma ORM with SQLite (zero-setup) and PostgreSQL/PostGIS (Docker); Server-Sent Events for real-time streaming; Twilio WhatsApp and M-Pesa (simulated); Leaflet maps; Recharts; Docker Compose; Vercel-ready.

---

## 9) Team Details *(if there's a separate field)*
👉 Paste and fill in:

---
Team: <<your team name>>
<<Your full name>> — Full-stack & AI — <<email / university>>
<<Teammate name>> — <<role>> — <<email>>

---

## 10) GitHub Repository Link  ✅ REQUIRED
```
https://github.com/<<your-username>>/agriwatch
```
⚠️ The repo must exist and be public. (Ask me to set this up if you haven't — `git init` + push.)

## 11) Demo Video Link  ✅ REQUIRED
```
https://youtu.be/<<your-video-id>>
```
Record the `/simulate` flow (~1–2 min). Cover: problem → solution → live demo → tech → impact.
Narration script is in `pitch/SCRIPT.md` (slide 7).

## 12) Pitch Deck / Presentation  ✅ REQUIRED
- File: `pitch/index.html` (open in browser, present live).
- To submit a PDF: open `pitch/index.html?print-pdf` → Print → Save as PDF (margins: None, backgrounds: on).

## 13) Screenshots / Product Images  ✅ REQUIRED
Capture (Windows: `Win+Shift+S`) after `npm run dev`:
1. Landing hero (`/`)
2. `/simulate` mid-payout (the green $15.00 receipt) ← use as **thumbnail**
3. `/dashboard`
4. `/map`
5. A pitch-deck slide

---

## ✅ Final checklist before you hit Submit
- [ ] Name + tagline pasted
- [ ] Description pasted
- [ ] Problem / Solution / Tech / Team filled (if separate fields)
- [ ] "Built with" tags added
- [ ] GitHub link works & repo is public
- [ ] Demo video uploaded + link pasted
- [ ] Pitch deck attached / linked
- [ ] 3–5 screenshots uploaded (thumbnail = $15 payout)
- [ ] Category: Sustainability / FinTech / AI
- [ ] Click **Submit** (before 5:00pm EDT)
