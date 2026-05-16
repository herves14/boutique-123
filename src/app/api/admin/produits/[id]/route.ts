// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { name, description, price, stock, categoryId, sizes, images, isNew, isFeatured } = body
    const data: any = {}

    if (name !== undefined)        data.name        = name.trim()
    if (description !== undefined) data.description = description?.trim() || null
    if (price !== undefined)       data.price       = Number(price)
    if (stock !== undefined)       data.stock       = Math.max(0, Number(stock))
    if (categoryId !== undefined)  data.categoryId  = categoryId
    if (sizes !== undefined)       data.sizes       = sizes
    if (images !== undefined)      data.images      = images
    if (isNew !== undefined)       data.isNew       = Boolean(isNew)
    if (isFeatured !== undefined)  data.isFeatured  = Boolean(isFeatured)

    if (name !== undefined) {
      const baseSlug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
      let slug = baseSlug, i = 1
      while (await prisma.product.findFirst({ where: { slug, NOT: { id: params.id } } })) {
        slug = `${baseSlug}-${i++}`
      }
      data.slug = slug
    }

    const product = await prisma.product.update({ where: { id: params.id }, data, include: { category: true } })
    return NextResponse.json(product)
  } catch (e) { return NextResponse.json({ error: 'Erreur' }, { status: 500 }) }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 }) }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({ where: { id: params.id }, include: { category: true } })
    if (!product) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    return NextResponse.json(product)
  } catch { return NextResponse.json({ error: 'Erreur' }, { status: 500 }) }
}