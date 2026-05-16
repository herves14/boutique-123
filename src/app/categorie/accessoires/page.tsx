// src/app/categorie/accessoires/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CatalogueClient from '@/components/sections/CatalogueClient'

export const metadata: Metadata = {
  title: 'Accessoires — 123',
  description: 'Sacs, ceintures et accessoires 123. Cuir de veau, finitions dorées, savoir-faire artisanal.',
}

export default function AccessoiresPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(201,168,76,0.08)_0%,transparent_55%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

          {/* Motif grille décoratif */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 60px),repeating-linear-gradient(90deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 60px)' }}
          />

          <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
            <div className="max-w-3xl">
              <span className="section-tag">Finitions & Détails</span>
              <h1 className="font-display text-[clamp(48px,7vw,100px)] font-light leading-none text-brand-white mb-6">
                Acces<em className="italic text-brand-gold">soires</em>
              </h1>
              <p className="text-[13px] leading-loose text-brand-gray max-w-lg">
                Chaque accessoire est l&apos;aboutissement d&apos;un geste artisanal.
                Cuirs sélectionnés, ferrures dorées, coutures impeccables.
              </p>

              <div className="flex gap-12 mt-10">
                {[
                  { num: 'Cuir',   label: 'Pleine fleur' },
                  { num: 'Doré',   label: 'Ferrures laiton' },
                  { num: '2 ans',  label: 'Garantie' },
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

        {/* Catalogue */}
        <Suspense fallback={<div className="grid grid-cols-3 gap-[2px] px-8 py-12">{Array.from({length:6}).map((_,i)=><div key={i} className="aspect-[3/4] shimmer"/>)}</div>}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-32">
            <CatalogueClient defaultCategory="accessoires" />
          </div>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}