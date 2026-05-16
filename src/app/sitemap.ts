// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,              priority: 1.0,  changeFrequency: 'daily'   },
    { url: `${baseUrl}/produits`,priority: 0.9,  changeFrequency: 'daily'   },
    { url: `${baseUrl}/panier`,  priority: 0.3,  changeFrequency: 'never'   },
  ]

  // Catégories
  let categoryPages: MetadataRoute.Sitemap = []
  let productPages:  MetadataRoute.Sitemap = []

  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({ select: { slug: true, createdAt: true } }),
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    ])

    categoryPages = categories.map(c => ({
      url:              `${baseUrl}/categorie/${c.slug}`,
      lastModified:     c.createdAt,
      priority:         0.8,
      changeFrequency:  'weekly' as const,
    }))

    productPages = products.map(p => ({
      url:              `${baseUrl}/produits/${p.slug}`,
      lastModified:     p.updatedAt,
      priority:         0.7,
      changeFrequency:  'weekly' as const,
    }))
  } catch {}

  return [...staticPages, ...categoryPages, ...productPages]
}