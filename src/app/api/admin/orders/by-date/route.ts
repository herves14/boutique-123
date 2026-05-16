// src/app/api/admin/orders/by-date/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date') // format YYYY-MM-DD

    let where: any = {}

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`)
      const end   = new Date(`${date}T23:59:59.999Z`)
      where = { createdAt: { gte: start, lte: end } }
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items:    { include: { product: { select: { name: true, images: true } } } },
        delivery: true,
        payment:  true,
      },
    })

    return NextResponse.json(orders)
  } catch (e) {
    console.error(e)
    return NextResponse.json([], { status: 200 })
  }
}