// src/app/api/admin/produits/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Convertit les tailles reçues du frontend vers les valeurs enum Prisma
// "35" → "EU_35", "XS" → "XS", etc.
function normalizeSizes(sizes: string[]): string[] {
  return sizes.map(s => {
    // Si c'est un nombre (pointure chaussure), préfixer EU_
    if (/^\d+$/.test(s)) return `EU_${s}`
    // Sinon c'est déjà une valeur valide (XS, S, M, L, XL, XXL, EU_35...)
    return s
  })
}

// GET — liste produits admin
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page  = Number(searchParams.get('page')  ?? '1')
    const limit = Number(searchParams.get('limit') ?? '50')

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        skip:    (page - 1) * limit,
        take:    limit,
        include: { category: true },
      }),
      prisma.product.count(),
    ])

    return NextResponse.json({ products, total })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST — créer un produit
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, description, price, stock,
      categoryId, sizes, images,
      isNew, isFeatured,
    } = body

    if (!name?.trim())        return NextResponse.json({ error: 'Nom requis' },       { status: 400 })
    if (!price || price <= 0) return NextResponse.json({ error: 'Prix invalide' },    { status: 400 })
    if (!categoryId)          return NextResponse.json({ error: 'Catégorie requise' }, { status: 400 })
    if (stock < 0)            return NextResponse.json({ error: 'Stock invalide' },    { status: 400 })

    // Générer slug unique
    const baseSlug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-')

    let slug = baseSlug
    let i = 1
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`
    }

    // Normaliser les tailles : "35" → "EU_35"
    const normalizedSizes = normalizeSizes(sizes ?? [])

    const product = await prisma.product.create({
      data: {
        name:        name.trim(),
        slug,
        description: description?.trim() || null,
        price:       Number(price),
        stock:       Number(stock) || 0,
        categoryId,
        sizes:       normalizedSizes as any,
        images:      images ?? [],
        isNew:       Boolean(isNew),
        isFeatured:  Boolean(isFeatured),
      },
      include: { category: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/admin/products]', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Un produit avec ce nom existe déjà' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}