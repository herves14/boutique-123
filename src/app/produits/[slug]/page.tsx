// src/app/produits/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductDetail from '@/components/sections/ProductDetail'
import { prisma } from '@/lib/prisma'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    })
    if (!product) return { title: 'Produit introuvable' }
    return {
      title: `${product.name} — 123`,
      description: product.description ?? '',
    }
  } catch {
    return { title: '123' }
  }
}

export default async function ProductPage({ params }: Props) {
  let product = null

  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    })
  } catch {
    // DB non connectée — affiche page vide
  }

  if (!product) notFound()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black pt-24">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  )
}