// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl

    const category = searchParams.get('category') ?? ''
    const sizesRaw = searchParams.get('sizes') ?? ''
    const isNew    = searchParams.get('new') === 'true'
    const sort     = searchParams.get('sort') ?? 'newest'
    const page     = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const limit    = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? '9')))
    const skip     = (page - 1) * limit

    const sizes = sizesRaw ? sizesRaw.split(',').filter(Boolean) : []

    // ── Filtres ──
    const where: any = {}

    if (category) {
      where.category = { slug: category }
    }

    if (sizes.length > 0) {
      where.sizes = { hasSome: sizes }
    }

    if (isNew) {
      where.isNew = true
    }

    // ── Tri ──
    const orderBy: any =
      sort === 'price_asc'  ? { price: 'asc' }  :
      sort === 'price_desc' ? { price: 'desc' } :
      sort === 'featured'   ? { isFeatured: 'desc' } :
      { createdAt: 'desc' } // newest (default)

    // ── Requête ──
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    })

  } catch (error) {
    console.error('[GET /api/products]', error)
    return NextResponse.json({ items: [], total: 0, page: 1, pages: 0 }, { status: 500 })
  }
}