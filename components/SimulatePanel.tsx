'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Satellite, Sparkles, MessageCircle, Banknote } from 'lucide-react'
import type { SatelliteReading, RiskScore, PayoutResult } from '@/lib/types'
import { cn } from '@/lib/ui'
import { PayoutToast } from './PayoutToast'

type Step = 'idle' | 'scanning' | 'ndvi' | 'risk' | 'message' | 'whatsapp' | 'payout' | 'done'

interface FarmOption {
  id: string
  label: string
}

export function SimulatePanel() {
  const [step, setStep] = useState<Step>('idle')
  const [scanProgress, setScanProg] = useState(0)
  const [scanStatus, setScanStatus] = useState('')
  const [sat, setSat] = useState<SatelliteReading | null>(null)
  const [risk, setRisk] = useState<RiskScore | null>(null)
  const [message, setMessage] = useState('')
  const [payout, setPayout] = useState<PayoutResult | null>(null)
  const [farmId, setFarmId] = useState('')
  const [error, setError] = useState('')

  const running = step !== 'idle' && step !== 'done'

  async function run() {
    if (!farmId) return
    setError('')
    setStep('scanning')
    setScanProg(0)
    setScanStatus('')
    setSat(null)
    setRisk(null)
    setMessage('')
    setPayout(null)

    let res: Response
    try {
      res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmId }),
      })
    } catch {
      setError('Could not reach the simulation API.')
      setStep('idle')
      return
    }

    if (!res.ok || !res.body) {
      setError('Simulation failed to start.')
      setStep('idle')
      return
    }

    const reader = res.body.getReader()
    const dec = new TextDecoder()
    let buf = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += dec.decode(value, { stream: true })
      const parts = buf.split('\n\n')
      buf = parts.pop() ?? ''

      for (const part of parts) {
        const ev = part.match(/^event: (.+)$/m)?.[1]
        const data = part.match(/^data: (.+)$/m)?.[1]
        if (!ev || !data) continue
        const d = JSON.parse(data)

        if (ev === 'satellite_scan') {
          setScanProg(d.progress)
          setScanStatus(d.status)
        }
        if (ev === 'ndvi_result') {
          setStep('ndvi')
          setSat(d)
        }
        if (ev === 'risk_score') {
          setStep('risk')
          setRisk(d)
        }
        if (ev === 'message_chunk') {
          setStep('message')
          setMessage((p) => p + d.text)
        }
        if (ev === 'whatsapp_sent') setStep('whatsapp')
        if (ev === 'payout_complete') {
          setStep('payout')
          setPayout(d)
        }
        if (ev === 'error') {
          setError(d.message ?? 'Simulation failed.')
          setStep('idle')
          return
        }
        if (ev === 'done') setStep('done')
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Farm selector + trigger */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <FarmSelector value={farmId} onChange={setFarmId} disabled={running} />
        <button
          onClick={run}
          disabled={!farmId || running}
          className="mt-4 w-full py-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-700
                     disabled:text-gray-500 text-white rounded-lg font-medium transition-colors
                     flex items-center justify-center gap-2"
        >
          {running ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Running...
            </>
          ) : (
            <>
              <Satellite size={18} /> Simulate drought event
            </>
          )}
        </button>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {/* Satellite scan progress */}
      {step !== 'idle' && (
        <StepCard
          title="Satellite scan"
          icon={Satellite}
          active={step === 'scanning'}
          done={step !== 'scanning'}
        >
          <p className="text-sm text-gray-400 mb-2">{scanStatus || 'Initializing...'}</p>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </StepCard>
      )}

      {/* NDVI result */}
      {sat && (
        <StepCard title="NDVI analysis" icon={Satellite} done>
          <div className="grid grid-cols-3 gap-3">
            <StatBox label="Current NDVI" value={sat.ndvi.toFixed(2)} danger={sat.ndvi < 0.35} />
            <StatBox label="Seasonal avg" value={sat.seasonalAverage.toFixed(2)} />
            <StatBox
              label="Anomaly"
              value={`${sat.anomalyPct > 0 ? '+' : ''}${sat.anomalyPct.toFixed(1)}%`}
              danger={sat.anomalyPct < -20}
            />
          </div>
        </StepCard>
      )}

      {/* Risk score */}
      {risk && (
        <StepCard title="Risk assessment" icon={Sparkles} done>
          <div className="flex items-center gap-6 mb-1">
            <div className="text-center shrink-0">
              <p className="text-4xl font-bold text-red-400">{risk.score}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{risk.level}</p>
            </div>
            <div className="flex-1 space-y-1">
              {risk.reasons.map((r, i) => (
                <p key={i} className="text-sm text-gray-300">
                  • {r}
                </p>
              ))}
            </div>
          </div>
        </StepCard>
      )}

      {/* Claude message streaming */}
      {message && (
        <StepCard
          title="Alert — generated by Claude"
          icon={MessageCircle}
          active={step === 'message'}
          done={step !== 'message'}
        >
          <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm text-green-300 whitespace-pre-wrap leading-relaxed">
            {message}
            {step === 'message' && <span className="animate-pulse">|</span>}
          </div>
        </StepCard>
      )}

      {/* WhatsApp sent */}
      {['whatsapp', 'payout', 'done'].includes(step) && (
        <StepCard title="WhatsApp alert" icon={MessageCircle} done>
          <p className="text-emerald-400 text-sm">Message delivered to farmer phone</p>
        </StepCard>
      )}

      {/* Payout receipt */}
      {payout && (
        <StepCard title="Automatic payout fired" icon={Banknote} done highlight>
          <PayoutToast payout={payout} />
        </StepCard>
      )}

      {step === 'done' && !payout && (
        <p className="text-sm text-gray-500 text-center">
          Risk did not reach the payout threshold for this farm — alert sent, no payout triggered.
        </p>
      )}
    </div>
  )
}

function FarmSelector({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  const [farms, setFarms] = useState<FarmOption[]>([])

  useEffect(() => {
    fetch('/api/farmers')
      .then((r) => r.json())
      .then(
        (
          data: Array<{
            name: string
            language: string
            farms: Array<{ id: string; cropType: string; country: string }>
          }>
        ) => {
          const opts: FarmOption[] = []
          for (const farmer of data) {
            for (const farm of farmer.farms) {
              opts.push({
                id: farm.id,
                label: `${farmer.name} — ${farm.cropType}, ${farm.country}`,
              })
            }
          }
          setFarms(opts)
        }
      )
      .catch(() => setFarms([]))
  }, [])

  return (
    <label className="block">
      <span className="text-sm text-gray-400">Select a farm</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1.5 w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm
                   text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
      >
        <option value="">— Choose a farmer —</option>
        {farms.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function StatBox({
  label,
  value,
  danger,
}: {
  label: string
  value: string
  danger?: boolean
}) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={cn('mt-1 text-lg font-semibold', danger ? 'text-red-400' : 'text-white')}>
        {value}
      </p>
    </div>
  )
}

function StepCard({
  title,
  icon: Icon,
  active,
  done,
  highlight,
  children,
}: {
  title: string
  icon?: typeof Satellite
  active?: boolean
  done?: boolean
  highlight?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'bg-gray-900 border rounded-xl p-5 transition-colors',
        highlight
          ? 'border-emerald-700'
          : active
            ? 'border-amber-600/70 animate-pulse'
            : 'border-gray-800'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={16} className="text-gray-400" />}
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <span className="ml-auto">
          {active ? (
            <Loader2 size={16} className="text-amber-400 animate-spin" />
          ) : done ? (
            <CheckCircle2 size={16} className="text-emerald-400" />
          ) : null}
        </span>
      </div>
      {children}
    </div>
  )
}
