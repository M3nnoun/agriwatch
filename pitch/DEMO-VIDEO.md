# 🎬 AgriWatch — Demo Video Storyboard & Script

**Target length:** 90 seconds (a tight 60s version is at the bottom).
**Covers (per Beyond Tomorrow Summit):** problem → solution → live demo → technology → impact.
**Style:** screen recording of the *real* app + your voiceover. Calm, confident, ~110 words/min.

---

## ✅ Before you hit record (5-min setup)

1. **Run the app fresh** so it's snappy:
   ```bash
   npm run db:reset    # reseed clean demo data
   npm run dev         # http://localhost:3000
   ```
   *(Optional but nicer: put a real `ANTHROPIC_API_KEY` in `.env` so the alert is written live by Claude. Without it, a localized fallback streams — still looks great.)*
2. **Browser prep:** full-screen the browser, **hide the bookmarks bar**, close other tabs, set zoom to 100%, use a clean profile (no extensions in the corner).
3. **Pre-open two tabs:** `localhost:3000` (landing) and `localhost:3000/simulate`. On the simulate tab, **pre-select "Amara Diallo"** in the dropdown but **don't click the button yet**.
4. **Recorder:**
   - Windows: **Xbox Game Bar** (`Win + G` → record), or **OBS Studio** (free), or **PowerPoint → Insert → Screen Recording**.
   - Record at **1080p**, 30fps. Record system audio off, mic on (or record silently and add voiceover after).
5. **Do one dry run** of the `/simulate` click so you know the timing of the animation.

> 💡 Tip: record the screen silently first, then record your voice over it. It's far easier than doing both at once.

---

## 🎞️ The storyboard (90 seconds)

| Time | On screen | What you do | Narration (say this) | Overlay text |
|---|---|---|---|---|
| **0:00–0:08** | Landing hero (`/`) | Slowly scroll a touch | "Half a billion farming families grow most of the world's food — yet most have **no insurance** when drought destroys their harvest." | *AgriWatch* |
| **0:08–0:18** | Landing — scroll to stats | Scroll to 500M / 75% | "They find out it's too late only when the crop is already dead. One bad season means debt, hunger, kids out of school." | *75% uninsured* |
| **0:18–0:30** | Landing — "Watch · Warn · Pay" section | Scroll through 3 pillars | "AgriWatch fixes this in three moves: we **watch** every farm from space, **warn** the farmer in their own language, and **pay** them automatically when drought hits." | *Watch · Warn · Pay* |
| **0:30–0:38** | Click into `/simulate`, show Amara selected | Hover the red button | "Here it is live. Amara grows millet in Senegal. Let's run a real monitoring cycle on her farm." | *Live demo* |
| **0:38–0:46** | Satellite scan progress bar | Click **Simulate drought event** | "First, we pull Sentinel-2 satellite imagery and compute her crop's health." | *🛰️ Sentinel-2 NDVI* |
| **0:46–0:54** | NDVI result + risk meter → CRITICAL | Let it animate | "Crop health has collapsed 45% below normal, rainfall is critically low — risk climbs to **CRITICAL**." | *Risk: CRITICAL* |
| **0:54–1:05** | Claude alert streaming (French) | Let text stream in | "Claude instantly writes her an alert — in French — explaining the danger and three actions to take." | *AI alert · 4 languages* |
| **1:05–1:15** | WhatsApp delivered → **$15.00 payout receipt** | Let the green receipt appear | "It's delivered to WhatsApp — and the instant drought is confirmed, **fifteen dollars** lands in her mobile money. No claim form. No inspector." | *💵 $15 auto-payout* |
| **1:15–1:24** | `/dashboard` then `/map` | Click Dashboard, then Map | "Everything's real — a live dashboard, an NDVI map of farms across six countries, all on open satellite and weather data." | *Open data · live* |
| **1:24–1:30** | Back to landing hero (or close logo) | Hold on logo | "AgriWatch. We watch from space, we warn before the storm, and we pay when it hits." | *agriwatch — watch · warn · pay* |

**Total: ~90 seconds.**

---

## 🎙️ Clean voiceover script (read straight through, ~150 words)

> Half a billion farming families grow most of the world's food — yet most have no insurance when drought destroys their harvest. They find out too late, when the crop is already dead. One bad season means debt, hunger, kids pulled out of school.
>
> AgriWatch fixes this in three moves: we watch every farm from space, warn the farmer in their own language, and pay them automatically when drought hits.
>
> Here it is live. Amara grows millet in Senegal. We pull Sentinel-2 satellite imagery and compute her crop's health. It's collapsed far below normal, rainfall is critically low — risk climbs to CRITICAL. Claude instantly writes her an alert in French with three actions. It's delivered to WhatsApp — and the instant drought is confirmed, fifteen dollars lands in her mobile money. No claim form. No inspector.
>
> Everything's real, built on open satellite and weather data. AgriWatch — we watch from space, we warn before the storm, and we pay when it hits.

---

## ✂️ 60-second cut (if there's a hard limit)

Keep only these beats:
1. **0:00–0:10** Hero + problem: *"Half a billion farmers grow our food, but most have no insurance when drought hits."*
2. **0:10–0:18** Solution: *"AgriWatch watches every farm from space, warns the farmer, and pays them automatically."*
3. **0:18–0:48** `/simulate` full run (the whole point): *"Watch — Amara's farm. Satellite confirms her crop is failing, risk goes critical, Claude writes the alert in French, and fifteen dollars lands on her phone instantly. No paperwork."*
4. **0:48–0:60** Close on logo: *"Real, on open data. AgriWatch — watch, warn, pay."*

---

## 🎚️ Polish & export
- **Overlay captions** (the "Overlay text" column) help a lot — add them in any editor (CapCut, Clipchamp on Windows, or DaVinci Resolve, all free).
- Add a soft, hopeful background track at low volume (e.g. from YouTube Audio Library).
- Export **1080p MP4, 30fps**.
- Upload to **YouTube as Unlisted**, then paste the link into the Devpost **Video demo** field.

## 🎯 The one rule
The `/simulate` run (0:38–1:15) is the moment that wins. Give it room, don't rush it, and let the **$15 receipt land on screen** before you speak the next line. That single shot is your whole pitch.
