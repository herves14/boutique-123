// src/app/admin/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils'
import AdminNav from '@/components/admin/AdminNav'
import { Package, ShoppingBag, Tag, TrendingUp } from 'lucide-react'

async function getStats() {
  try {
    const [totalProducts, totalOrders, totalCategories, recentOrders, revenue] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.category.count(),
        prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            delivery: true,
            payment:  true,
            items:    { include: { product: { select: { name: true } } } },
          },
        }),
        prisma.payment.aggregate({
          where: { status: 'APPROVED' },
          _sum:  { amount: true },
        }),
      ])
    return { totalProducts, totalOrders, totalCategories, recentOrders, revenue: revenue._sum.amount ?? 0 }
  } catch {
    return { totalProducts: 0, totalOrders: 0, totalCategories: 0, recentOrders: [], revenue: 0 }
  }
}

export default async function AdminPage() {
  const { totalProducts, totalOrders, totalCategories, recentOrders, revenue } = await getStats()

  const stats = [
    { icon: Package,     label: 'Produits',    value: totalProducts,              href: '/admin/produits' },
    { icon: ShoppingBag, label: 'Commandes',   value: totalOrders,                href: '/admin/commandes' },
    { icon: Tag,         label: 'Catégories',  value: totalCategories,            href: '/admin/categories' },
    { icon: TrendingUp,  label: 'Revenus',     value: formatPrice(revenue),       href: '/admin/commandes' },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminNav />

      <main className="flex-1 p-8 lg:p-12">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-2">Tableau de bord</p>
          <h1 className="font-display text-4xl font-light text-brand-white">Vue d&apos;ensemble</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map(({ icon: Icon, label, value, href }) => (
            <Link
              key={label} href={href}
              className="bg-brand-dark border border-white/5 p-6 hover:border-brand-gold/30
                transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon size={18} strokeWidth={1.5} className="text-brand-gold" />
                <span className="text-[8px] tracking-[0.4em] uppercase text-brand-gray
                  group-hover:text-brand-gold transition-colors">Voir →</span>
              </div>
              <p className="font-display text-3xl font-light text-brand-white mb-1">{value}</p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-brand-gray">{label}</p>
            </Link>
          ))}
        </div>

        {/* Commandes récentes */}
        <div className="bg-brand-dark border border-white/5">
          <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
            <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold">
              Commandes récentes
            </p>
            <Link href="/admin/commandes"
              className="text-[10px] tracking-widest uppercase text-brand-gray hover:text-brand-gold transition-colors">
              Voir tout →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-8 py-12 text-center text-brand-gray text-[12px]">
              Aucune commande pour l&apos;instant
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['N° Commande', 'Client', 'Articles', 'Total', 'Statut', 'Paiement'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-[9px] tracking-[0.4em]
                        uppercase text-brand-gray font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/commandes/${order.id}`}
                          className="text-[12px] text-brand-gold hover:underline font-mono">
                          #{order.orderNumber.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-[12px] text-brand-cream">
                        {order.delivery?.fullName ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-[12px] text-brand-gray">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-[12px] text-brand-gold-light">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4">
                        <PaymentStatusBadge status={order.payment?.status ?? 'PENDING'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING:   'bg-yellow-900/40 text-yellow-400 border-yellow-800/40',
    CONFIRMED: 'bg-blue-900/40 text-blue-400 border-blue-800/40',
    SHIPPED:   'bg-purple-900/40 text-purple-400 border-purple-800/40',
    DELIVERED: 'bg-green-900/40 text-green-400 border-green-800/40',
    CANCELLED: 'bg-red-900/40 text-red-400 border-red-800/40',
  }
  return (
    <span className={`inline-block text-[9px] tracking-[0.3em] uppercase px-3 py-1 border ${colors[status] ?? 'bg-brand-dark2 text-brand-gray border-white/10'}`}>
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  )
}

function PaymentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING:   'text-yellow-400',
    APPROVED:  'text-green-400',
    DECLINED:  'text-red-400',
    CANCELLED: 'text-brand-gray',
  }
  const labels: Record<string, string> = {
    PENDING: 'En attente', APPROVED: 'Payé', DECLINED: 'Refusé', CANCELLED: 'Annulé',
  }
  return (
    <span className={`text-[11px] ${colors[status] ?? 'text-brand-gray'}`}>
      {labels[status] ?? status}
    </span>
  )
}