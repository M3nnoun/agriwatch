import { SimulatePanel } from '@/components/SimulatePanel'

export const metadata = { title: 'Simulate drought · AgriWatch' }

export default function SimulatePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Drought simulation</h1>
        <p className="mt-1 text-gray-400 text-sm">
          Pick a farm and fire a full monitoring cycle: satellite scan → NDVI → risk scoring → a live
          Claude-written alert → WhatsApp delivery → automatic micro-insurance payout.
        </p>
      </header>
      <SimulatePanel />
    </div>
  )
}
