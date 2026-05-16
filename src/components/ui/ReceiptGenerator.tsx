'use client'
// src/components/ui/ReceiptGenerator.tsx
import { useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/utils'

type Order = {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  delivery: {
    fullName: string
    phone: string
    address: string
    city: string
    notes?: string | null
  } | null
  payment: {
    status: string
    amount: number
    fedapayId?: string | null
  } | null
  items: {
    id: string
    quantity: number
    size: string
    price: number
    product: { name: string }
  }[]
}

export default function ReceiptGenerator({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false)

  const generatePDF = async () => {
    setLoading(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' })
      const W = 148  // A5 width mm

      // ── Fond haut ──────────────────────────────────
      doc.setFillColor(10, 10, 10)
      doc.rect(0, 0, W, 52, 'F')

      // Logo
      doc.setTextColor(201, 168, 76)
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.text('123', 12, 20)

      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(180, 180, 180)
      doc.text('MAISON DE MODE', 12, 27)
      doc.text('Cotonou, Bénin', 12, 32)

      // REÇU
      doc.setFontSize(8)
      doc.setTextColor(201, 168, 76)
      doc.text('REÇU DE COMMANDE', W - 12, 20, { align: 'right' })
      doc.setTextColor(160, 160, 160)
      doc.setFontSize(7)
      doc.text(new Date(order.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }), W - 12, 27, { align: 'right' })

      // Statut paiement
      const isPaid = order.payment?.status === 'APPROVED'
      doc.setFillColor(isPaid ? 22 : 120, isPaid ? 163 : 53, isPaid ? 74 : 53)
      doc.roundedRect(W - 44, 31, 32, 8, 1, 1, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(isPaid ? '✓ PAYÉ' : '⏳ EN ATTENTE', W - 28, 36.5, { align: 'center' })

      // ── CODE COMMANDE — élément central ────────────
      doc.setFillColor(20, 20, 20)
      doc.rect(0, 52, W, 42, 'F')

      // Ligne dorée
      doc.setDrawColor(201, 168, 76)
      doc.setLineWidth(0.4)
      doc.line(12, 54, W - 12, 54)

      doc.setTextColor(140, 140, 140)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.text('CODE DE LIVRAISON', W / 2, 61, { align: 'center' })

      // Le code 6 chiffres — TRÈS GRAND
      doc.setTextColor(201, 168, 76)
      doc.setFontSize(42)
      doc.setFont('helvetica', 'bold')
      doc.text(order.orderNumber, W / 2, 83, { align: 'center' })

      // Ligne dorée bas
      doc.line(12, 91, W - 12, 91)

      doc.setTextColor(100, 100, 100)
      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'normal')
      doc.text('Présentez ce code au livreur pour valider la réception de votre colis', W / 2, 97, { align: 'center' })

      // ── Infos client ────────────────────────────────
      const y1 = 106
      doc.setFillColor(248, 248, 248)
      doc.rect(0, y1, W, 38, 'F')

      doc.setTextColor(100, 100, 100)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('LIVRAISON À', 12, y1 + 8)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(30, 30, 30)
      doc.setFontSize(8)
      doc.text(order.delivery?.fullName ?? '—', 12, y1 + 16)
      doc.setFontSize(7)
      doc.setTextColor(80, 80, 80)
      doc.text(order.delivery?.phone ?? '', 12, y1 + 22)
      doc.text(`${order.delivery?.address ?? ''}, ${order.delivery?.city ?? ''}`, 12, y1 + 28)
      if (order.delivery?.notes) {
        doc.setTextColor(120, 120, 120)
        doc.text(`Note: ${order.delivery.notes}`, 12, y1 + 34)
      }

      // ── Articles ────────────────────────────────────
      const y2 = y1 + 42

      doc.setTextColor(30, 30, 30)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('ARTICLES COMMANDÉS', 12, y2)

      autoTable(doc, {
        startY: y2 + 3,
        head: [['Article', 'Taille', 'Qté', 'Prix unit.', 'Total']],
        body: order.items.map(item => [
          item.product.name,
          item.size,
          String(item.quantity),
          formatPrice(item.price),
          formatPrice(item.price * item.quantity),
        ]),
        theme: 'plain',
        headStyles: {
          fontSize: 6.5, fontStyle: 'bold',
          textColor: [120, 120, 120], cellPadding: 2,
        },
        bodyStyles: { fontSize: 7, cellPadding: 2, textColor: [40, 40, 40] },
        alternateRowStyles: { fillColor: [252, 252, 252] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 16, halign: 'center' },
          2: { cellWidth: 10, halign: 'center' },
          3: { cellWidth: 28, halign: 'right' },
          4: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
        },
        margin: { left: 12, right: 12 },
      })

      // ── Total ────────────────────────────────────────
      const afterTable = (doc as any).lastAutoTable.finalY + 4

      doc.setDrawColor(201, 168, 76)
      doc.setLineWidth(0.3)
      doc.line(12, afterTable, W - 12, afterTable)

      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 30, 30)
      doc.text('TOTAL', 12, afterTable + 7)
      doc.setTextColor(201, 168, 76)
      doc.text(formatPrice(order.total), W - 12, afterTable + 7, { align: 'right' })

      // ── Pied de page ─────────────────────────────────
      doc.setFillColor(10, 10, 10)
      doc.rect(0, 193, W, 17, 'F')
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(6)
      doc.setFont('helvetica', 'normal')
      doc.text('123 Maison — Merci de votre confiance', W / 2, 200, { align: 'center' })
      doc.text('Pour tout renseignement, contactez-nous', W / 2, 205, { align: 'center' })

      doc.save(`recu-123-${order.orderNumber}.pdf`)
    } catch (e) {
      console.error('PDF error:', e)
      alert('Erreur lors de la génération du reçu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={generatePDF}
        disabled={loading}
        className="flex items-center gap-2 bg-brand-gold text-brand-black
          px-5 py-3 text-[10px] font-medium tracking-[0.3em] uppercase
          hover:bg-brand-gold-light transition-colors disabled:opacity-50"
      >
        <Download size={14} strokeWidth={2} />
        <span>{loading ? 'Génération...' : 'Télécharger le reçu PDF'}</span>
      </button>

      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 border border-brand-gold/30 text-brand-cream
          px-5 py-3 text-[10px] tracking-[0.3em] uppercase
          hover:border-brand-gold hover:text-brand-gold transition-colors"
      >
        <Printer size={14} strokeWidth={1.5} />
        <span>Imprimer</span>
      </button>
    </div>
  )
}