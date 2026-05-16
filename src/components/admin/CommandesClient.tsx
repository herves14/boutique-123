'use client'
// src/components/admin/CommandesClient.tsx
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Download, FileText, RefreshCw, Eye } from 'lucide-react'
import { formatPrice, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/utils'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'

type Order = {
  id: string
  orderNumber: string   // code 6 chiffres
  status: string
  total: number
  createdAt: string
  delivery: { fullName: string; phone: string; address: string; city: string; notes?: string } | null
  payment:  { status: string; amount: number; fedapayId?: string } | null
  items: { id: string; quantity: number; size: string; price: number; product: { name: string } }[]
}

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR   = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

export default function CommandesClient({ activeDates }: { activeDates: string[] }) {
  const today = new Date()
  const [viewYear,   setViewYear]   = useState(today.getFullYear())
  const [viewMonth,  setViewMonth]  = useState(today.getMonth())
  const [selected,   setSelected]   = useState<string | null>(today.toISOString().split('T')[0])
  const [orders,     setOrders]     = useState<Order[]>([])
  const [loading,    setLoading]    = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [detail,     setDetail]     = useState<Order | null>(null)
  const activeSet = new Set(activeDates)

  const loadOrders = useCallback(async (date: string | null) => {
    setLoading(true)
    try {
      const url = date ? `/api/admin/orders/by-date?date=${date}` : `/api/admin/orders/by-date`
      const res  = await fetch(url)
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch { setOrders([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadOrders(selected) }, [selected, loadOrders])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const getDays = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
  const getFirst = (y: number, m: number) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1 }
  const calDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - getFirst(viewYear, viewMonth) + 1
    if (day < 1 || day > getDays(viewYear, viewMonth)) return null
    const pad = String(day).padStart(2,'0')
    const mon = String(viewMonth + 1).padStart(2,'0')
    return `${viewYear}-${mon}-${pad}`
  })

  const exportPDF = async () => {
    if (orders.length === 0) return
    setPdfLoading(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

      const dateLabel = selected
        ? new Date(selected).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
        : 'Toutes les commandes'

      // En-tête
      doc.setFillColor(10, 10, 10)
      doc.rect(0, 0, 297, 28, 'F')
      doc.setTextColor(201, 168, 76)
      doc.setFontSize(20); doc.setFont('helvetica','bold')
      doc.text('123', 12, 16)
      doc.setFontSize(7); doc.setFont('helvetica','normal')
      doc.setTextColor(180,180,180)
      doc.text('RAPPORT DE COMMANDES — ADMIN', 12, 22)
      doc.text(dateLabel.toUpperCase(), 297 - 12, 16, { align: 'right' })
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}`, 297 - 12, 22, { align:'right' })

      doc.setDrawColor(201,168,76); doc.setLineWidth(0.4)
      doc.line(12, 30, 285, 30)

      const totalRevenu = orders.reduce((s,o) => s + o.total, 0)

      // Résumé
      doc.setTextColor(40,40,40); doc.setFontSize(8); doc.setFont('helvetica','bold')
      doc.text(`${orders.length} commandes  ·  CA total: ${formatPrice(totalRevenu)}  ·  Payées: ${orders.filter(o=>o.payment?.status==='APPROVED').length}`, 12, 38)

      // Tableau
      const rows = orders.map(o => [
        o.orderNumber,                // CODE 6 CHIFFRES
        new Date(o.createdAt).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),
        o.delivery?.fullName ?? '—',
        o.delivery?.phone ?? '—',
        o.delivery?.city ?? '—',
        o.items.map(i => `${i.product.name} ×${i.quantity} (${i.size})`).join(' | '),
        formatPrice(o.total),
        ORDER_STATUS_LABELS[o.status] ?? o.status,
        PAYMENT_STATUS_LABELS[o.payment?.status ?? 'PENDING'],
      ])

      autoTable(doc, {
        startY: 43,
        head: [['🔑 CODE', 'Heure', 'Client', 'Téléphone', 'Ville', 'Articles', 'Total', 'Statut', 'Paiement']],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor:[10,10,10], textColor:[201,168,76], fontSize:7, fontStyle:'bold', cellPadding:3 },
        bodyStyles: { fontSize:7, cellPadding:2.5, textColor:[40,40,40] },
        alternateRowStyles: { fillColor:[248,248,248] },
        columnStyles: {
          0: { cellWidth:20, fontStyle:'bold', textColor:[201,100,0], halign:'center' },
          1: { cellWidth:14 },
          2: { cellWidth:32 },
          3: { cellWidth:26 },
          4: { cellWidth:20 },
          5: { cellWidth:70 },
          6: { cellWidth:24, halign:'right', fontStyle:'bold' },
          7: { cellWidth:22 },
          8: { cellWidth:22 },
        },
        margin: { left:12, right:12 },
      })

      const pages = (doc as any).internal.getNumberOfPages()
      for (let i = 1; i <= pages; i++) {
        doc.setPage(i)
        doc.setDrawColor(201,168,76); doc.setLineWidth(0.3)
        doc.line(12, 198, 285, 198)
        doc.setFontSize(6); doc.setTextColor(160,160,160)
        doc.text('123 Maison — Document confidentiel', 12, 203)
        doc.text(`Page ${i}/${pages}`, 285, 203, { align:'right' })
      }

      const fn = selected ? `123-rapport-${selected}.pdf` : '123-rapport-complet.pdf'
      doc.save(fn)
    } catch(e) { console.error(e); alert('Erreur PDF') }
    finally { setPdfLoading(false) }
  }

  const labelDate = selected
    ? new Date(selected + 'T12:00:00').toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
    : 'Toutes les commandes'

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6 items-start">

      {/* ══ CALENDRIER ══ */}
      <div className="bg-brand-dark border border-white/5 p-5 sticky top-8">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center
            text-brand-gray hover:text-brand-gold hover:bg-white/5 transition-all">
            <ChevronLeft size={15} />
          </button>
          <span className="text-[11px] tracking-[0.3em] uppercase text-brand-cream font-medium">
            {MONTHS_FR[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center
            text-brand-gray hover:text-brand-gold hover:bg-white/5 transition-all">
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAYS_FR.map(d => (
            <div key={d} className="text-center text-[9px] tracking-wider uppercase text-brand-gray py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-[2px]">
          {calDays.map((date, i) => {
            if (!date) return <div key={i} />
            const day     = new Date(date + 'T12:00:00').getDate()
            const isToday = date === today.toISOString().split('T')[0]
            const hasOrdr = activeSet.has(date)
            const isSel   = date === selected
            return (
              <button key={date} onClick={() => setSelected(isSel ? null : date)}
                className={`relative h-8 flex flex-col items-center justify-center text-[11px]
                  transition-all rounded-sm
                  ${isSel ? 'bg-brand-gold text-brand-black font-bold'
                    : hasOrdr ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20'
                    : isToday ? 'border border-white/20 text-brand-cream'
                    : 'text-brand-gray hover:text-brand-cream hover:bg-white/5'}`}>
                {day}
                {hasOrdr && !isSel && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-brand-gold" />}
              </button>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
          <div className="flex items-center gap-2 text-[9px] text-brand-gray">
            <div className="w-3 h-3 bg-brand-gold/10 border border-brand-gold/30 rounded-sm" /> Jours avec commandes
          </div>
        </div>

        <button onClick={() => setSelected(null)}
          className={`w-full mt-3 py-2 text-[10px] tracking-[0.3em] uppercase transition-all
            ${!selected ? 'bg-brand-gold text-brand-black font-medium'
              : 'border border-white/10 text-brand-gray hover:border-brand-gold hover:text-brand-gold'}`}>
          Toutes
        </button>
      </div>

      {/* ══ TABLEAU ══ */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-1">
              {selected ? 'Commandes du' : 'Rapport complet'}
            </p>
            <h2 className="font-display text-xl font-light text-brand-white capitalize">{labelDate}</h2>
            <p className="text-[11px] text-brand-gray mt-0.5">
              {loading ? '...' : `${orders.length} commande${orders.length > 1 ? 's' : ''}`}
              {orders.length > 0 && !loading && (
                <span className="ml-2 text-brand-gold-light">· {formatPrice(orders.reduce((s,o) => s+o.total, 0))}</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => loadOrders(selected)}
              className="w-9 h-9 flex items-center justify-center border border-white/10
                text-brand-gray hover:border-brand-gold hover:text-brand-gold transition-all">
              <RefreshCw size={14} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={exportPDF} disabled={orders.length === 0 || pdfLoading}
              className={`flex items-center gap-2 px-5 py-2.5 text-[10px] tracking-[0.3em] uppercase transition-all
                ${orders.length === 0 ? 'border border-white/10 text-brand-gray/40 cursor-not-allowed'
                  : 'bg-brand-gold text-brand-black hover:bg-brand-gold-light'}`}>
              {pdfLoading ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} strokeWidth={2} />}
              <span>{pdfLoading ? 'Génération...' : 'Exporter PDF'}</span>
            </button>
          </div>
        </div>

        <div className="bg-brand-dark border border-white/5 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw size={24} strokeWidth={1} className="text-brand-gold animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <FileText size={40} strokeWidth={0.8} className="text-brand-gold/20" />
              <p className="font-display text-2xl font-light text-brand-gray">
                {selected ? 'Aucune commande ce jour' : 'Aucune commande'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['🔑 Code', 'Heure', 'Client', 'Articles', 'Total', 'Statut', 'Paiement', ''].map(h => (
                      <th key={h} className="px-4 py-4 text-left text-[9px] tracking-[0.4em] uppercase text-brand-gray font-normal whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">

                      {/* CODE 6 CHIFFRES — mis en avant */}
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center justify-center
                          font-mono font-bold text-[18px] tracking-wider px-3 py-2
                          border-2 min-w-[90px]
                          ${order.payment?.status === 'APPROVED'
                            ? 'border-brand-gold text-brand-gold bg-brand-gold/5'
                            : 'border-white/20 text-brand-cream'}`}>
                          {order.orderNumber}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-[11px] text-brand-gray whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-[12px] text-brand-cream">{order.delivery?.fullName ?? '—'}</p>
                        <p className="text-[10px] text-brand-gray">{order.delivery?.phone ?? ''}</p>
                        <p className="text-[10px] text-brand-gray">{order.delivery?.city ?? ''}</p>
                      </td>

                      <td className="px-4 py-4 max-w-[180px]">
                        {order.items.map(item => (
                          <p key={item.id} className="text-[11px] text-brand-gray leading-relaxed">
                            {item.product.name}
                            <span className="text-brand-gray/50"> ×{item.quantity} ({item.size})</span>
                          </p>
                        ))}
                      </td>

                      <td className="px-4 py-4 text-[13px] text-brand-gold-light font-light whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>

                      <td className="px-4 py-4">
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                      </td>

                      <td className="px-4 py-4">
                        <span className={`text-[11px] ${
                          order.payment?.status === 'APPROVED'  ? 'text-green-400'  :
                          order.payment?.status === 'DECLINED'  ? 'text-red-400'    :
                          order.payment?.status === 'CANCELLED' ? 'text-brand-gray' :
                          'text-yellow-400'}`}>
                          {PAYMENT_STATUS_LABELS[order.payment?.status ?? 'PENDING']}
                        </span>
                      </td>

                      {/* Voir reçu */}
                      <td className="px-4 py-4">
                        <a
                          href={`/checkout/confirmation?order=${order.orderNumber}`}
                          target="_blank"
                          className="w-8 h-8 flex items-center justify-center border border-white/10
                            text-brand-gray hover:border-brand-gold hover:text-brand-gold transition-all"
                          title="Voir le reçu"
                        >
                          <Eye size={13} strokeWidth={1.5} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Total bas */}
                <tfoot>
                  <tr className="border-t border-brand-gold/15 bg-brand-gold/5">
                    <td colSpan={4} className="px-4 py-3 text-[10px] tracking-[0.3em] uppercase text-brand-gray">
                      Total — {orders.length} commande{orders.length > 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3 font-display text-lg font-light text-brand-gold-light">
                      {formatPrice(orders.reduce((s,o) => s + o.total, 0))}
                    </td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}