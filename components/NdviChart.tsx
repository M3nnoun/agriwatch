'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'

export interface NdviPoint {
  date: string
  ndvi: number
  seasonal: number
}

export function NdviChart({ data }: { data: NdviPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} />
        <YAxis stroke="#6b7280" fontSize={11} domain={[0, 1]} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: '#0b0f1a',
            border: '1px solid #1f2937',
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: '#9ca3af' }}
        />
        <ReferenceLine y={0.35} stroke="#ef4444" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="seasonal"
          stroke="#6b7280"
          strokeWidth={1.5}
          strokeDasharray="5 5"
          dot={false}
          name="Seasonal avg"
        />
        <Line
          type="monotone"
          dataKey="ndvi"
          stroke="#22c55e"
          strokeWidth={2.5}
          dot={{ r: 3 }}
          name="NDVI"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
