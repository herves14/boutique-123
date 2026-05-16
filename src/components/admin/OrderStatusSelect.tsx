'use client'
// src/components/admin/OrderStatusSelect.tsx
import { useState } from 'react'
import { ORDER_STATUS_LABELS } from '@/lib/utils'

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const COLORS: Record<string, string> = {
  PENDING:   'text-yellow-400 border-yellow-800/40',
  CONFIRMED: 'text-blue-400 border-blue-800/40',
  SHIPPED:   'text-purple-400 border-purple-800/40',
  DELIVERED: 'text-green-400 border-green-800/40',
  CANCELLED: 'text-red-400 border-red-800/40',
}

export default function OrderStatusSelect({
  orderId, currentStatus
}: {
  orderId: string
  currentStatus: string
}) {
  const [status,  setStatus]  = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleChange = async (newStatus: string) => {
    setLoading(true)
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      setStatus(newStatus)
    } catch {
      alert('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      value={status}
      onChange={e => handleChange(e.target.value)}
      disabled={loading}
      className={`bg-transparent border text-[10px] tracking-[0.2em] uppercase
        px-2 py-1.5 focus:outline-none cursor-pointer transition-colors
        ${COLORS[status] ?? 'text-brand-gray border-white/15'}
        ${loading ? 'opacity-50' : ''}`}
    >
      {STATUSES.map(s => (
        <option key={s} value={s} className="bg-brand-dark text-brand-cream text-[12px]">
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  )
}