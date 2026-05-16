// src/app/categorie/jeans/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CatalogueClient from '@/components/sections/CatalogueClient'

export const metadata: Metadata = {
  title: 'Jeans — 123',
  description: 'Collection jeans 123. Denim japonais selvedge, coupes slim, wide leg et droites. Qualité artisanale.',
}

export default function JeansPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(44,58,90,0.3)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(201,168,76,0.05)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

          <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
            <div className="max-w-3xl">
              <span className="section-tag">Denim d&apos;Exception</span>
              <h1 className="font-display text-[clamp(56px,8vw,110px)] font-light leading-none text-brand-white mb-6">
                <em className="italic text-brand-gold">Jeans</em>
              </h1>
              <p className="text-[13px] leading-loose text-brand-gray max-w-lg">
                Tissés sur des métiers vintage japonais, nos denims développent
                une patine unique avec le temps. Chaque paire raconte votre histoire.
              </p>

              <div className="flex gap-12 mt-10">
                {[
                  { num: 'Japon',  label: 'Denim selvedge' },
                  { num: '14oz',   label: 'Grammage premium' },
                  { num: '100%',   label: 'Coton naturel' },
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
            <CatalogueClient defaultCategory="jeans" />
          </div>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}