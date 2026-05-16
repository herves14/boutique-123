// src/app/categorie/[slug]/page.tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CatalogueClient from '@/components/sections/CatalogueClient'
import { prisma } from '@/lib/prisma'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  try {
    const cat = await prisma.category.findUnique({ where: { slug: params.slug } })
    return { title: `${cat?.name ?? 'Catégorie'} — 123` }
  } catch {
    return { title: '123' }
  }
}

export default async function CategoriePage({ params }: Props) {
  let category = null
  try {
    category = await prisma.category.findUnique({ where: { slug: params.slug } })
  } catch {}

  if (!category) notFound()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black pt-28">
        <div className="text-center py-20 border-b border-white/5">
          <span className="section-tag">Collection 2026</span>
          <h1 className="section-title">
            <em className="italic">{category.name}</em>
          </h1>
          <div className="section-divider" />
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-3 gap-[2px] mt-8">
            {Array.from({length:6}).map((_,i) => <div key={i} className="aspect-[3/4] shimmer" />)}
          </div>
        }>
          <CatalogueClient defaultCategory={params.slug} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}