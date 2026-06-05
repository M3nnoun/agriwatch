import { Check, CheckCheck, Satellite, ShieldCheck } from 'lucide-react'

/**
 * The "magic moment" — a phone showing a localized drought alert followed by
 * an automatic micro-insurance payout receipt. Pure CSS animation.
 */
export function PhonePreview() {
  return (
    <div className="relative" style={{ animation: 'floatY 7s ease-in-out infinite' }}>
      {/* ambient glow */}
      <div
        className="absolute -inset-10 -z-10 blur-3xl opacity-60"
        style={{
          background:
            'radial-gradient(45% 45% at 60% 30%, rgba(43,209,126,0.35), transparent 70%)',
        }}
      />

      <div className="w-[300px] sm:w-[330px] rounded-[2.4rem] border border-[var(--line)] bg-[#06120c] p-3 shadow-2xl">
        {/* phone status bar */}
        <div className="flex items-center justify-between px-3 pt-1 pb-2 text-[10px] text-[var(--muted)] font-mono-ui">
          <span>9:41</span>
          <span className="h-1.5 w-16 rounded-full bg-white/10" />
          <span>4G ▮▮▮</span>
        </div>

        {/* chat header */}
        <div className="flex items-center gap-2.5 rounded-2xl bg-[#0c1f16] px-3 py-2.5 border border-[var(--line)]">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--brand-strong)]">
            <Satellite size={16} className="text-[#04150d]" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">AgriWatch</p>
            <p className="text-[10px] text-[var(--brand)] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" /> online
            </p>
          </div>
        </div>

        {/* messages */}
        <div className="mt-3 space-y-2.5 px-1">
          <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[#11271c] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#dff3e7]">
            <p className="font-semibold text-[var(--amber)]">⚠️ Alerte sécheresse — millet</p>
            <p className="mt-1 text-[var(--muted)]">
              Bonjour Amara. Vos cultures montrent des signes de stress, et très peu de pluie est
              prévue.
            </p>
            <p className="mt-1.5 text-[#cfeada]">
              1. Arrosez tôt le matin
              <br />
              2. Paillez le sol
              <br />
              3. Attendez la pluie avant l&apos;engrais
            </p>
            <span className="mt-1 flex justify-end items-center gap-1 text-[10px] text-[var(--muted)]">
              09:41 <CheckCheck size={12} className="text-[var(--brand)]" />
            </span>
          </div>

          {/* payout receipt */}
          <div className="relative max-w-[92%] rounded-2xl rounded-tl-sm border border-[var(--brand-strong)]/50">
            <div className="rounded-2xl bg-gradient-to-b from-[#0e2c1d] to-[#091c13] p-4">
              <div className="flex items-center gap-2 text-[var(--brand)] text-[11px] font-medium uppercase tracking-wide">
                <span
                  className="grid h-6 w-6 place-items-center rounded-full bg-[var(--brand)]/15"
                  style={{ animation: 'pulseRing 2.4s ease-out infinite' }}
                >
                  <Check size={13} className="text-[var(--brand)]" />
                </span>
                Payout sent
              </div>
              <p className="mt-2 font-display text-4xl font-semibold text-[var(--brand)]">$15.00</p>
              <p className="text-[12px] text-[#cfeada]">M-Pesa (simulated)</p>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-[var(--muted)] font-mono-ui">
                <span>Ref AW-6099C6E6</span>
                <span className="flex items-center gap-1 text-[var(--brand)]">
                  <ShieldCheck size={11} /> insured
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-1 pt-3 pb-1">
          <div className="rounded-full bg-[#0c1f16] border border-[var(--line)] px-4 py-2 text-[11px] text-[var(--muted)]">
            Reply with a question…
          </div>
        </div>
      </div>
    </div>
  )
}
