// src/app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('[GET /api/admin/categories]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, slug } = await req.json()

    if (!name?.trim()) return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    if (!slug?.trim()) return NextResponse.json({ error: 'Slug requis' }, { status: 400 })

    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 400 })

    const category = await prisma.category.create({
      data: { name: name.trim(), slug: slug.trim() },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/admin/categories]', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ce slug existe déjà' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}