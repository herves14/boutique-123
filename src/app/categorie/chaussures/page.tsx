// src/app/categorie/chaussures/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ChaussuresClient from '@/components/sections/ChaussuresClient'

export const metadata: Metadata = {
  title: 'Chaussures — 123',
  description: 'Découvrez la collection chaussures 123. Escarpins, sneakers, boots — footwear d\'exception fabriqué en Italie et au Portugal.',
}

export default function ChaussuresPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black">

        {/* ── Hero Chaussures ── */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Fond décoratif */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,rgba(201,168,76,0.08)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(201,168,76,0.05)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

          {/* Lignes verticales décoratives */}
          <div className="absolute left-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-gold/10 to-transparent" />
          <div className="absolute right-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-gold/10 to-transparent" />

          <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
            <div className="max-w-3xl">
              <span className="section-tag">Footwear d&apos;Exception</span>
              <h1 className="font-display text-[clamp(56px,8vw,110px)] font-light leading-none text-brand-white mb-6">
                Chaus<em className="italic text-brand-gold">sures</em>
              </h1>
              <p className="text-[13px] leading-loose text-brand-gray max-w-lg">
                Chaque paire est façonnée à la main par des artisans italiens et portugais.
                Du stiletto couture au sneaker premium, l&apos;excellence à chaque pas.
              </p>

              {/* Stats */}
              <div className="flex gap-12 mt-10">
                {[
                  { num: '100%', label: 'Cuir pleine fleur' },
                  { num: 'IT/PT', label: 'Fabriqué en' },
                  { num: '14J',   label: 'Retours gratuits' },
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

        {/* ── Catalogue avec recherche intelligente ── */}
        <Suspense fallback={<ShoesSkeleton />}>
          <ChaussuresClient />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

function ShoesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="h-14 bg-brand-dark shimmer mb-8 rounded-sm" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-[2px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] shimmer" />
        ))}
      </div>
    </div>
  )
}