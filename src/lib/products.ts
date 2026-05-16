// src/lib/products.ts
// Toutes les requêtes Prisma côté serveur (Server Components / API Routes)
import { prisma } from './prisma'
import type { FilterOptions } from '@/types'

// ─── Catalogue ────────────────────────────────────────────────────────────────
export async function getProducts(filters: FilterOptions = {}) {
  const {
    categorySlug, sizes, isNew, isFeatured,
    search, minPrice, maxPrice,
    sortBy = 'newest', page = 1, limit = 12,
  } = filters

  const where: any = { ...(isNew !== undefined && { isNew }), ...(isFeatured !== undefined && { isFeatured }) }

  if (categorySlug) {
    where.category = { slug: categorySlug }
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }
  // Filtrage sizes : produits dont le tableau sizes contient TOUTES les sizes demandées
  if (sizes && sizes.length > 0) {
    where.sizes = { hasSome: sizes }
  }

  const orderBy: any =
    sortBy === 'price_asc'  ? { price: 'asc' }  :
    sortBy === 'price_desc' ? { price: 'desc' } :
    sortBy === 'featured'   ? { isFeatured: 'desc' } :
    { createdAt: 'desc' }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ])

  return { items, total, pages: Math.ceil(total / limit), page }
}

// ─── Produit unique ───────────────────────────────────────────────────────────
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })
}

// ─── Nouveautés & Vedettes ────────────────────────────────────────────────────
export async function getNewArrivals(limit = 4) {
  return prisma.product.findMany({
    where: { isNew: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { category: true },
  })
}

export async function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { category: true },
  })
}

// ─── Catégories ───────────────────────────────────────────────────────────────
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } })
}

// ─── Commandes ────────────────────────────────────────────────────────────────
export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: { include: { product: true } },
      delivery: true,
      payment: true,
    },
  })
}

export async function getAllOrders(page = 1, limit = 20) {
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        items: { include: { product: { select: { name: true, images: true } } } },
        delivery: true,
        payment: true,
      },
    }),
    prisma.order.count(),
  ])
  return { orders, total, pages: Math.ceil(total / limit) }
}