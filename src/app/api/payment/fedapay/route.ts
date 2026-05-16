// src/app/api/payment/fedapay/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const FEDAPAY_SECRET = process.env.FEDAPAY_SECRET_KEY ?? ''
const IS_LIVE        = process.env.FEDAPAY_ENV === 'live'
const API_BASE       = IS_LIVE
  ? 'https://api.fedapay.com/v1'
  : 'https://sandbox-api.fedapay.com/v1'
const CHECKOUT_BASE  = IS_LIVE
  ? 'https://checkout.fedapay.com'
  : 'https://sandbox-checkout.fedapay.com'

// ── POST : créer une transaction FedaPay et retourner l'URL de paiement ──
export async function POST(req: NextRequest) {
  try {
    const { orderId, customer } = await req.json()

    if (!FEDAPAY_SECRET) {
      return NextResponse.json(
        { error: 'FEDAPAY_SECRET_KEY non configurée dans .env.local' },
        { status: 500 }
      )
    }

    // Charger la commande
    const order = await prisma.order.findUnique({
      where:   { id: orderId },
      include: { payment: true, delivery: true },
    })
    if (!order)         return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
    if (!order.payment) return NextResponse.json({ error: 'Paiement introuvable' }, { status: 404 })
    if (order.payment.status === 'APPROVED') {
      return NextResponse.json({ error: 'Commande déjà payée' }, { status: 400 })
    }

    const siteUrl      = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const callbackUrl  = `${siteUrl}/checkout/confirmation?order=${order.orderNumber}`
    const customerName = customer?.firstname ?? order.delivery?.fullName?.split(' ')[0] ?? ''
    const customerLast = customer?.lastname  ?? order.delivery?.fullName?.split(' ').slice(1).join(' ') ?? ''
    const customerPhone = (customer?.phone ?? order.delivery?.phone ?? '').replace(/\D/g, '')

    // ── 1. Créer la transaction ──────────────────────────────────────────
    const txRes = await fetch(`${API_BASE}/transactions`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${FEDAPAY_SECRET}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        description:  `Commande 123 Maison N°${order.orderNumber}`,
        amount:       Math.round(order.total),
        currency:     { iso: 'XOF' },
        callback_url: callbackUrl,
        customer: {
          firstname: customerName,
          lastname:  customerLast,
          ...(customerPhone && {
            phone_number: { number: customerPhone, country: 'BJ' }
          }),
        },
      }),
    })

    const txData = await txRes.json()

    if (!txRes.ok) {
      console.error('[FedaPay create tx]', JSON.stringify(txData))
      return NextResponse.json(
        { error: txData?.message ?? 'Erreur FedaPay lors de la création', details: txData },
        { status: 502 }
      )
    }

    // FedaPay renvoie { v1: { transaction: {...} } } ou directement { transaction: {...} }
    const transaction = txData?.v1?.transaction ?? txData?.transaction ?? txData

    if (!transaction?.id) {
      console.error('[FedaPay] transaction id manquant', txData)
      return NextResponse.json({ error: 'ID transaction FedaPay manquant' }, { status: 502 })
    }

    // ── 2. Générer le token de paiement ──────────────────────────────────
    const tokenRes = await fetch(`${API_BASE}/transactions/${transaction.id}/token`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${FEDAPAY_SECRET}` },
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok) {
      console.error('[FedaPay token]', JSON.stringify(tokenData))
      return NextResponse.json(
        { error: 'Erreur génération token FedaPay', details: tokenData },
        { status: 502 }
      )
    }

    // FedaPay peut retourner le token dans plusieurs formats
    const token      = tokenData?.token ?? tokenData?.v1?.token?.token ?? tokenData
    const tokenStr   = typeof token === 'object' ? token?.token : token

    // URL de checkout FedaPay correcte
    const paymentUrl = tokenData?.url
      ?? tokenData?.v1?.token?.url
      ?? (tokenStr ? `${CHECKOUT_BASE}/pay/${tokenStr}` : null)

    if (!paymentUrl) {
      console.error('[FedaPay] URL de paiement introuvable', tokenData)
      return NextResponse.json({ error: 'URL de paiement FedaPay non générée' }, { status: 502 })
    }

    // ── 3. Sauvegarder l'ID FedaPay ─────────────────────────────────────
    await prisma.payment.update({
      where: { orderId: order.id },
      data:  { fedapayId: String(transaction.id) },
    })

    console.log('[FedaPay] ✓ Transaction créée:', transaction.id, '→', paymentUrl)

    return NextResponse.json({ paymentUrl, transactionId: transaction.id })

  } catch (error) {
    console.error('[POST /api/payment/fedapay]', error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}

// ── PUT : webhook FedaPay (callback après paiement) ──────────────────────
export async function PUT(req: NextRequest) {
  try {
    const event = await req.json()
    const { name, object } = event

    const fedapayId = String(object?.id ?? '')
    if (!fedapayId) return NextResponse.json({ received: true })

    const payment = await prisma.payment.findFirst({ where: { fedapayId } })
    if (!payment)  return NextResponse.json({ received: true })

    let payStatus:   'APPROVED' | 'DECLINED' | 'CANCELLED' = 'DECLINED'
    let orderStatus: 'CONFIRMED' | 'PENDING'  | 'CANCELLED' = 'PENDING'

    if (name === 'transaction.approved') {
      payStatus = 'APPROVED';   orderStatus = 'CONFIRMED'
    } else if (name === 'transaction.cancelled') {
      payStatus = 'CANCELLED';  orderStatus = 'CANCELLED'
    } else {
      payStatus = 'DECLINED';   orderStatus = 'PENDING'
    }

    await prisma.payment.update({ where: { id: payment.id }, data: { status: payStatus } })
    await prisma.order.update({ where: { id: payment.orderId }, data: { status: orderStatus } })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[FedaPay webhook]', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}