// src/app/produits/page.tsx
import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CatalogueClient from '@/components/sections/CatalogueClient'

export const metadata = { title: 'Collection — 123' }

export default function ProduitsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black pt-28">
        {/* Header */}
        <div className="text-center py-20 border-b border-white/5">
          <span className="section-tag">Prêt-à-Porter</span>
          <h1 className="section-title">La <em className="italic">Collection</em></h1>
          <div className="section-divider" />
        </div>

        <Suspense fallback={<CatalogueSkeleton />}>
          <CatalogueClient />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

function CatalogueSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] mt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-[3/4] shimmer" />
      ))}
    </div>
  )
}