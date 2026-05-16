// src/app/categorie/vetements/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CatalogueClient from '@/components/sections/CatalogueClient'

export const metadata: Metadata = {
  title: 'Femme — 123',
  description: 'Collection femme 123. Robes, blazers, ensembles et vêtements prêt-à-porter de luxe.',
}

export default function VetementsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(201,168,76,0.07)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(93,26,46,0.15)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
          <div className="absolute left-[20%] top-20 bottom-0 w-px bg-gradient-to-b from-brand-gold/20 to-transparent" />

          <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
            <div className="max-w-3xl">
              <span className="section-tag">Collection 2026</span>
              <h1 className="font-display text-[clamp(56px,8vw,110px)] font-light leading-none text-brand-white mb-6">
                <em className="italic text-brand-gold">Femme</em>
              </h1>
              <p className="text-[13px] leading-loose text-brand-gray max-w-lg">
                Des silhouettes qui subliment. Robes sculptées, blazers architecturaux,
                ensembles fluides — chaque pièce est pensée pour la femme moderne.
              </p>

              <div className="flex gap-12 mt-10">
                {[
                  { num: '+50',    label: 'Références' },
                  { num: '100%',   label: 'Fait à la main' },
                  { num: 'XS–XXL', label: 'Toutes tailles' },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <p className="font-display text-2xl font-light text-brand-gold">{num}</p>
                    <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Catalogue toutes catégories femme */}
        <Suspense fallback={<div className="grid grid-cols-3 gap-[2px] px-8 py-12">{Array.from({length:6}).map((_,i)=><div key={i} className="aspect-[3/4] shimmer"/>)}</div>}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-32">
            <CatalogueClient defaultCategory="vetements" />
          </div>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}