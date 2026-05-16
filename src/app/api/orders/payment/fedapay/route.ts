// src/app/api/payment/fedapay/route.ts
// Intégration FedaPay — passerelle de paiement Afrique de l'Ouest (XOF)
// Doc: https://docs.fedapay.com
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const FEDAPAY_SECRET = process.env.FEDAPAY_SECRET_KEY!
const FEDAPAY_BASE   = process.env.FEDAPAY_ENV === 'live'
  ? 'https://api.fedapay.com/v1'
  : 'https://sandbox-api.fedapay.com/v1'

// ── POST /api/payment/fedapay — initier une transaction ──────────────────────
export async function POST(req: NextRequest) {
  try {
    const { orderId, customer } = await req.json()

    // Charger la commande
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, delivery: true },
    })
    if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
    if (!order.payment) return NextResponse.json({ error: 'Payment introuvable' }, { status: 404 })
    if (order.payment.status === 'APPROVED') {
      return NextResponse.json({ error: 'Commande déjà payée' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    // Créer la transaction FedaPay
    const res = await fetch(`${FEDAPAY_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_SECRET}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        description:   `Commande 123 Maison — ${order.orderNumber}`,
        amount:        Math.round(order.total),
        currency:      { iso: 'XOF' },
        callback_url:  `${siteUrl}/checkout/confirmation?order=${order.orderNumber}`,
        customer: {
          firstname: customer?.firstname ?? order.delivery?.fullName.split(' ')[0] ?? '',
          lastname:  customer?.lastname  ?? order.delivery?.fullName.split(' ').slice(1).join(' ') ?? '',
          phone_number: {
            number:  order.delivery?.phone ?? customer?.phone ?? '',
            country: 'BJ',   // Bénin par défaut
          },
        },
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('[FedaPay create transaction]', err)
      return NextResponse.json({ error: 'Erreur FedaPay', details: err }, { status: 502 })
    }

    const data = await res.json()
    const transaction = data.v1?.transaction ?? data.transaction ?? data

    // Générer le lien de paiement
    const tokenRes = await fetch(`${FEDAPAY_BASE}/transactions/${transaction.id}/token`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${FEDAPAY_SECRET}` },
    })
    const tokenData = await tokenRes.json()
    const paymentUrl = tokenData.url ?? `https://checkout.fedapay.com/${tokenData.token}`

    // Sauvegarder l'ID FedaPay sur le Payment
    await prisma.payment.update({
      where: { orderId: order.id },
      data:  { fedapayId: String(transaction.id) },
    })

    return NextResponse.json({ paymentUrl, transactionId: transaction.id })

  } catch (error) {
    console.error('[POST /api/payment/fedapay]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── POST /api/payment/fedapay/webhook — callback FedaPay ─────────────────────
// À déclarer dans le dashboard FedaPay comme webhook URL
export async function PUT(req: NextRequest) {
  try {
    const event = await req.json()
    const { name, object } = event  // object = transaction FedaPay

    const fedapayId = String(object?.id ?? '')

    const payment = await prisma.payment.findFirst({ where: { fedapayId } })
    if (!payment) {
      return NextResponse.json({ received: true })  // ignorer si inconnu
    }

    let status: 'APPROVED' | 'DECLINED' | 'CANCELLED' = 'DECLINED'
    let orderStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED' = 'PENDING'

    if (name === 'transaction.approved') {
      status = 'APPROVED'; orderStatus = 'CONFIRMED'
    } else if (name === 'transaction.cancelled') {
      status = 'CANCELLED'; orderStatus = 'CANCELLED'
    } else {
      status = 'DECLINED'; orderStatus = 'PENDING'
    }

    await prisma.$transaction([
      prisma.payment.update({ where: { id: payment.id }, data: { status } }),
      prisma.order.update({ where: { id: payment.orderId }, data: { status: orderStatus } }),
    ])

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('[FedaPay webhook]', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}