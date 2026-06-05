import Link from 'next/link'
import {
  Satellite,
  Radio,
  Banknote,
  ArrowRight,
  ArrowUpRight,
  Globe,
  MessageSquare,
  Smartphone,
  ShieldCheck,
  CloudRain,
  Languages,
  Check,
  Sparkles,
} from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { PhonePreview } from '@/components/PhonePreview'

export const metadata = {
  title: 'AgriWatch — We watch your fields from space',
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]">
      {/* ---- Atmosphere ---- */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 field-grid" />
        <div
          className="absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full blur-3xl opacity-50"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(43,209,126,0.22), transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[420px] w-[520px] blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(50% 50% at 70% 70%, rgba(198,242,78,0.14), transparent 70%)',
          }}
        />
        <div className="absolute inset-0 grain" />
      </div>

      <Nav />

      {/* ---- Hero ---- */}
      <header className="relative mx-auto max-w-6xl px-5 pt-16 pb-12 sm:pt-24 sm:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span
              className="rise inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/5 px-3 py-1 text-xs text-[var(--muted)]"
              style={{ animationDelay: '0ms' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              Parametric crop insurance, delivered over WhatsApp
            </span>

            <h1
              className="rise mt-6 font-display text-[2.7rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl"
              style={{ animationDelay: '90ms' }}
            >
              We watch your fields
              <br />
              <span className="text-[var(--brand)]">from space.</span>
            </h1>

            <p
              className="rise mt-5 max-w-md text-lg leading-relaxed text-[var(--muted)]"
              style={{ animationDelay: '180ms' }}
            >
              AgriWatch warns smallholder farmers before the drought hits — then pays them
              automatically the moment it does. Any phone. Any language. No app to install.
            </p>

            <div
              className="rise mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: '270ms' }}
            >
              <Link
                href="/simulate"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3.5 text-sm font-semibold text-[#04150d] transition-transform hover:-translate-y-0.5 glow-brand"
              >
                <Sparkles size={16} /> Watch a live drought payout
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/5 px-6 py-3.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-white/10"
              >
                Explore the dashboard
              </Link>
            </div>

            <div
              className="rise mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--muted)]"
              style={{ animationDelay: '360ms' }}
            >
              {['Sentinel-2', 'NASA POWER', 'Open-Meteo', 'WhatsApp', 'M-Pesa'].map((s) => (
                <span key={s} className="font-mono-ui">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="rise flex justify-center lg:justify-end" style={{ animationDelay: '220ms' }}>
            <PhonePreview />
          </div>
        </div>
      </header>

      {/* ---- Problem ---- */}
      <Section id="problem">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
            The gap
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
            The people who grow most of our food are the least protected from losing it.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="bg-[var(--bg)]">
              <div className="p-6">
                <p className="font-display text-4xl font-semibold text-[var(--ink)]">{s.value}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---- How it works ---- */}
      <Section id="how">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
            How it works
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Three moves: watch, warn, pay.
          </h2>
        </Reveal>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-[var(--brand-strong)]/40 to-transparent md:block" />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 120} as="article">
              <div className="relative h-full rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)]/60 p-6 backdrop-blur transition-colors hover:border-[var(--brand-strong)]/50">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand)]/12 text-[var(--brand)]">
                    <step.icon size={22} />
                  </span>
                  <span className="font-mono-ui text-xs text-[var(--muted)]">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
                <ul className="mt-4 space-y-1.5">
                  {step.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-[#cfeada]">
                      <Check size={15} className="mt-0.5 shrink-0 text-[var(--brand)]" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---- The moment ---- */}
      <Section id="moment">
        <div className="overflow-hidden rounded-3xl border border-[var(--brand-strong)]/30 bg-gradient-to-br from-[#0b1f16] to-[#06120d]">
          <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--lime)]">
                The moment that matters
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                $15 lands on a farmer&apos;s phone the instant the satellite confirms drought.
              </h2>
              <p className="mt-4 max-w-md text-[var(--muted)]">
                No claim form. No inspector. No waiting weeks while the harvest dies. The measurement
                is the trigger — so the payout is instant, and cheap enough to reach everyone.
              </p>
              <Link
                href="/simulate"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3.5 text-sm font-semibold text-[#04150d] transition-transform hover:-translate-y-0.5"
              >
                See it happen live <ArrowRight size={16} />
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <RiskVisual />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ---- Satellites, not drones ---- */}
      <Section id="satellites">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative grid aspect-square max-w-sm place-items-center">
              <div
                className="absolute inset-0 rounded-full border border-[var(--line)]"
                style={{ animation: 'orbit 40s linear infinite' }}
              >
                <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--brand)]" />
              </div>
              <div className="absolute inset-10 rounded-full border border-[var(--line)]" />
              <div className="absolute inset-20 rounded-full border border-dashed border-[var(--line)]" />
              <div
                className="grid h-24 w-24 place-items-center rounded-full bg-[var(--brand)]/12 text-[var(--brand)]"
                style={{ animation: 'pulseRing 3s ease-out infinite' }}
              >
                <Globe size={40} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
              No hardware required
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Satellites, not drones.
            </h2>
            <p className="mt-4 max-w-lg text-[var(--muted)]">
              Drones watch one field at a time and someone has to fly them. AgriWatch reads free,
              global Sentinel-2 imagery that already revisits every farm on Earth every few days — then
              fuses it with rainfall and forecast data so clouds never blind us.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Nothing for farmers to buy, charge or repair',
                'Covers millions of farms at once',
                'Works in the most remote villages',
                'Weather data fills in on cloudy days',
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-start gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)]/50 p-3 text-sm text-[#cfeada]"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-[var(--brand)]" /> {t}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---- Features ---- */}
      <Section id="features">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
            Built for the last mile
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Everything works on the phone a farmer already owns.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 70} as="article">
              <div className="group h-full rounded-2xl border border-[var(--line)] bg-[var(--bg-soft)]/50 p-6 transition-all hover:-translate-y-1 hover:border-[var(--brand-strong)]/50">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand)]/12 text-[var(--brand)]">
                  <f.icon size={20} />
                </span>
                <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---- Pricing ---- */}
      <Section id="pricing">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
            Pricing
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
            From one farm to one nation.
          </h2>
          <p className="mt-3 max-w-xl text-[var(--muted)]">
            Premiums are tiny because payouts are automatic. Most farmers are sponsored by co-ops,
            NGOs and governments — so coverage reaches the people who need it.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                  t.featured
                    ? 'border-[var(--brand)] bg-gradient-to-b from-[#0e2c1d] to-[#081710] glow-brand'
                    : 'border-[var(--line)] bg-[var(--bg-soft)]/50'
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-[var(--brand)] px-3 py-1 text-[11px] font-semibold text-[#04150d]">
                    Most deployed
                  </span>
                )}
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {t.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-semibold text-white">{t.price}</span>
                  <span className="text-sm text-[var(--muted)]">{t.unit}</span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{t.blurb}</p>
                <ul className="mt-6 space-y-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#cfeada]">
                      <Check size={16} className="mt-0.5 shrink-0 text-[var(--brand)]" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={t.href}
                  className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                    t.featured
                      ? 'bg-[var(--brand)] text-[#04150d]'
                      : 'border border-[var(--line)] bg-white/5 text-[var(--ink)] hover:bg-white/10'
                  }`}
                >
                  {t.cta} {t.featured ? <ArrowRight size={15} /> : <ArrowUpRight size={15} />}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          Indicative pricing for a hackathon demo — real premiums are set with reinsurance partners.
        </p>
      </Section>

      {/* ---- Final CTA ---- */}
      <Section id="cta">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--brand-strong)]/40 px-6 py-16 text-center sm:py-20">
            <div
              className="absolute inset-0 -z-10 opacity-70"
              style={{
                background:
                  'radial-gradient(60% 100% at 50% 0%, rgba(43,209,126,0.22), transparent 70%)',
              }}
            />
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Protect the next harvest.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[var(--muted)]">
              See the whole flow — satellite to payout — in under a minute.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/simulate"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-7 py-3.5 text-sm font-semibold text-[#04150d] transition-transform hover:-translate-y-0.5"
              >
                Run the live demo <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/5 px-7 py-3.5 text-sm font-medium hover:bg-white/10"
              >
                Open the dashboard
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>

      <Footer />
    </div>
  )
}

/* ---------- pieces ---------- */

function Nav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)]">
            <Satellite size={17} className="text-[#04150d]" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">AgriWatch</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex">
          <a href="#how" className="hover:text-white">
            How it works
          </a>
          <a href="#satellites" className="hover:text-white">
            Why satellites
          </a>
          <a href="#pricing" className="hover:text-white">
            Pricing
          </a>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[#04150d] transition-transform hover:-translate-y-0.5"
        >
          Launch app <ArrowRight size={14} />
        </Link>
      </div>
    </nav>
  )
}

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      {children}
    </section>
  )
}

function RiskVisual() {
  // NDVI collapse → CRITICAL → payout, told with simple animated bars.
  const bars = [62, 58, 55, 49, 41, 33, 28]
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[#06120c]/80 p-6">
      <div className="flex items-center justify-between text-xs text-[var(--muted)] font-mono-ui">
        <span>NDVI — crop health</span>
        <span className="text-[var(--danger)]">−45% vs season</span>
      </div>
      <div className="mt-5 flex h-32 items-end gap-2">
        {bars.map((h, i) => {
          const danger = h < 38
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t origin-bottom"
                style={{
                  height: `${h}%`,
                  background: danger ? 'var(--danger)' : 'var(--brand)',
                  opacity: danger ? 1 : 0.45 + i * 0.06,
                  animation: `barRise 0.7s ${i * 90}ms cubic-bezier(0.22,1,0.36,1) both`,
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-[var(--danger)]/40 bg-[var(--danger)]/10 px-4 py-3">
        <span className="text-sm font-semibold text-[var(--danger)]">Risk: CRITICAL · 82/100</span>
        <span className="font-mono-ui text-xs text-[var(--muted)]">rain 4.2mm/wk</span>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--brand-strong)]/50 bg-[var(--brand)]/10 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--brand)]">
          <Banknote size={16} /> Payout fired
        </span>
        <span className="font-display text-2xl font-semibold text-[var(--brand)]">$15.00</span>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--brand)]">
            <Satellite size={14} className="text-[#04150d]" />
          </span>
          <span className="font-display font-semibold">AgriWatch</span>
        </div>
        <p className="text-center text-xs text-[var(--muted)]">
          Built for farmers who deserve to know what is coming — and to be made whole when it
          arrives.
        </p>
        <div className="flex gap-5 text-xs text-[var(--muted)]">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <Link href="/simulate" className="hover:text-white">
            Demo
          </Link>
          <Link href="/map" className="hover:text-white">
            Map
          </Link>
        </div>
      </div>
    </footer>
  )
}

/* ---------- content ---------- */

const STATS = [
  { value: '500M', label: 'smallholder families grow most of the world food' },
  { value: '70%', label: 'of the world food supply comes from them' },
  { value: '75%', label: 'of their climate risk is completely uninsured' },
  { value: '31%', label: 'have no access to climate information at all' },
]

const STEPS = [
  {
    icon: Satellite,
    title: 'Watch',
    body: 'Every farm is monitored from orbit and ground weather stations — continuously, automatically.',
    points: ['Sentinel-2 crop health (NDVI)', 'NASA POWER + Open-Meteo rainfall', 'FAO drought thresholds per crop'],
  },
  {
    icon: Radio,
    title: 'Warn',
    body: "When risk climbs, Claude writes a clear alert in the farmer's own language with 3 actions.",
    points: ['Arabic, Swahili, French, English', 'Plain language, no jargon', 'Delivered on WhatsApp / SMS'],
  },
  {
    icon: Banknote,
    title: 'Pay',
    body: "If drought is confirmed, a parametric payout reaches the farmer's mobile money in seconds.",
    points: ['No claim form, no inspector', 'Instant M-Pesa / Orange Money', 'Receipt with a transaction reference'],
  },
]

const FEATURES = [
  {
    icon: Languages,
    title: 'Speaks their language',
    body: 'AI-written alerts in Arabic, Swahili, French and English — warm, simple, and actionable.',
  },
  {
    icon: Smartphone,
    title: 'Any phone, no app',
    body: 'Works over WhatsApp and SMS. A basic handset is all a farmer needs to be covered.',
  },
  {
    icon: ShieldCheck,
    title: 'Automatic payouts',
    body: 'Parametric triggers mean money moves the instant data confirms loss — no paperwork.',
  },
  {
    icon: CloudRain,
    title: 'Satellite + weather fusion',
    body: 'Crop imagery and rainfall combine, so a cloudy day never leaves a farm unwatched.',
  },
  {
    icon: MessageSquare,
    title: 'Two-way onboarding',
    body: 'Farmers register with a single message. Replies are answered in their language.',
  },
  {
    icon: Globe,
    title: 'Scales to a nation',
    body: 'One satellite pass covers thousands of farms — built for millions, not dozens.',
  },
]

const TIERS = [
  {
    name: 'Farmer',
    price: 'Free',
    unit: '· 30-day trial',
    blurb: 'Then ≈ $3 / season for an individual smallholder plot.',
    features: [
      'Satellite + weather monitoring',
      'Multilingual WhatsApp alerts',
      'Auto-payout up to $15',
      'Crop-specific advice',
    ],
    cta: 'Start free',
    href: '/dashboard',
    featured: false,
  },
  {
    name: 'Cooperative',
    price: '$2.50',
    unit: '/ farmer / season',
    blurb: 'For co-ops, microfinance and input suppliers covering many farmers at once.',
    features: [
      'Bulk onboarding & co-op dashboard',
      'Auto-payout up to $50',
      'Priority alerts & advisories',
      'Loan & input-bundling ready',
    ],
    cta: 'Cover your members',
    href: '/dashboard',
    featured: true,
  },
  {
    name: 'Institution',
    price: 'Custom',
    unit: '· per programme',
    blurb: 'For governments, insurers and NGOs running national-scale resilience programmes.',
    features: [
      'Monitoring API & white-label',
      'Reinsurance integration',
      'Unlimited farms & regions',
      'Impact reporting & SLAs',
    ],
    cta: 'Talk to us',
    href: '/dashboard',
    featured: false,
  },
]
