// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Size } from '@/types'

type CartItemPayload = {
  productId: string
  size: Size
  quantity: number
  price: number
}

type OrderPayload = {
  items: CartItemPayload[]
  delivery: {
    fullName: string
    phone: string
    address: string
    city: string
    notes?: string
  }
}

// Génère un code commande unique à 6 chiffres
async function generateOrderCode(): Promise<string> {
  let code: string
  let exists = true
  while (exists) {
    // Ex: "482917"
    code = String(Math.floor(100000 + Math.random() * 900000))
    const found = await prisma.order.findUnique({ where: { orderNumber: code } })
    exists = !!found
  }
  return code!
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json()
    const { items, delivery } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }
    if (!delivery?.fullName || !delivery.phone || !delivery.address || !delivery.city) {
      return NextResponse.json({ error: 'Informations de livraison incomplètes' }, { status: 400 })
    }

    // Vérifier stock
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 400 })
      if (product.stock < item.quantity) {
        return NextResponse.json({
          error: `Stock insuffisant pour "${product.name}" (disponible: ${product.stock})`
        }, { status: 400 })
      }
    }

    const total       = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const orderNumber = await generateOrderCode()

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        orderNumber,
        total,
        status: 'PENDING',
        items: {
          create: items.map(i => ({
            productId: i.productId,
            quantity:  i.quantity,
            size:      i.size,
            price:     i.price,
          })),
        },
      },
    })

    // Livraison
    await prisma.delivery.create({
      data: {
        orderId:  order.id,
        fullName: delivery.fullName,
        phone:    delivery.phone,
        address:  delivery.address,
        city:     delivery.city,
        notes:    delivery.notes,
      },
    })

    // Paiement
    await prisma.payment.create({
      data: {
        orderId:  order.id,
        amount:   total,
        currency: 'XOF',
        status:   'PENDING',
      },
    })

    // Décrémenter stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data:  { stock: { decrement: item.quantity } },
      }).catch(e => console.warn('Stock decrement warning:', e))
    }

    return NextResponse.json({
      success:     true,
      orderNumber: order.orderNumber, // code 6 chiffres
      orderId:     order.id,
      total:       order.total,
    }, { status: 201 })

  } catch (error) {
    console.error('[POST /api/orders]', error)
    return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page  = Number(searchParams.get('page')  ?? '1')
    const limit = Number(searchParams.get('limit') ?? '20')

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        skip:    (page - 1) * limit,
        take:    limit,
        include: {
          items:    { include: { product: { select: { name: true, images: true } } } },
          delivery: true,
          payment:  true,
        },
      }),
      prisma.order.count(),
    ])

    return NextResponse.json({ orders, total, pages: Math.ceil(total / limit) })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}