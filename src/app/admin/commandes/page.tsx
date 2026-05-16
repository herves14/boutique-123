// src/app/admin/commandes/page.tsx
import AdminNav from '@/components/admin/AdminNav'
import CommandesClient from '@/components/admin/CommandesClient'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

export const metadata = { title: 'Commandes - Admin 123' }

async function getStats() {
  try {
    const [total, pending, confirmed, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'CONFIRMED' } }),
      prisma.payment.aggregate({ where: { status: 'APPROVED' }, _sum: { amount: true } }),
    ])
    return { 
      total, 
      pending, 
      confirmed, 
      revenue: revenue._sum.amount ?? 0 
    }
  } catch (error) {
    console.error("Erreur stats:", error)
    return { total: 0, pending: 0, confirmed: 0, revenue: 0 }
  }
}

async function getActiveDates() {
  try {
    const orders = await prisma.order.findMany({ 
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' }
    })
    const dates = orders.map(o => o.createdAt.toISOString().split('T'))
    return [...new Set(dates)]
  } catch (error) { 
    console.error("Erreur dates:", error)
    return [] 
  }
}

export default async function AdminCommandesPage() {
  const [stats, activeDates] = await Promise.all([getStats(), getActiveDates()])

  return (
    <div className="flex min-h-screen bg-brand-black">
      <AdminNav />
      <main className="flex-1 p-8 lg:p-12">
        <div className="mb-10">
          <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-2">Gestion</p>
          <h1 className="font-display text-4xl font-light text-brand-white">Commandes</h1>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Total',      value: stats.total,                color: 'text-brand-white' },
            { label: 'En attente', value: stats.pending,              color: 'text-yellow-400' },
            { label: 'Confirmes',  value: stats.confirmed,            color: 'text-green-400' },
            { label: 'Revenus',    value: formatPrice(stats.revenue), color: 'text-brand-gold-light' },
          ].map((s) => (
            <div key={s.label} className="bg-brand-dark border border-white/5 px-6 py-5">
              <p className={`font-display text-2xl font-light ${s.color}`}>{s.value}</p>
              <p className="text-[9px] tracking-[0.3em] uppercase text-brand-gray mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <CommandesClient activeDates={activeDates} />
      </main>
    </div>
  )
}