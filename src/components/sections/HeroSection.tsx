'use client'
// src/components/sections/HeroSection.tsx
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Image de fond plein écran ── */}
      <div className="absolute inset-0">
        <img
          src="/hero.jpg"
          alt="Hero"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay sombre pour lisibilité du texte */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Dégradé bas → haut pour le scroll indicator */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        {/* Dégradé gauche pour le texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
      </div>

      {/* ── Contenu ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-16 py-32">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-10
            bg-white/10 backdrop-blur-md border border-white/15"
        >
          <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-brand-cream">
            Collection Printemps — Été 2026
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(56px,9vw,120px)] font-light leading-none
            tracking-tight text-white max-w-3xl"
        >
          L&apos;<em className="italic text-brand-gold">Art</em>
          <br />du Vêtement
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-[14px] tracking-[0.1em] text-white/70 max-w-sm leading-loose"
        >
          Élégance intemporelle. Savoir-faire d&apos;exception.
          Chaque pièce façonnée pour durer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-12 flex items-center gap-4 flex-wrap"
        >
          <Link
            href="#arrivals"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full
              bg-brand-gold text-brand-black text-[10px] font-medium tracking-[0.35em] uppercase
              hover:bg-brand-gold-light transition-all duration-300 group
              shadow-[0_8px_32px_rgba(201,168,76,0.4)]"
          >
            Découvrir
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/produits"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full
              text-[10px] tracking-[0.35em] uppercase text-white
              border border-white/30 hover:border-white/60 hover:bg-white/10
              transition-all duration-300 group backdrop-blur-sm"
          >
            Voir la Collection
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-16 flex items-center gap-10"
        >
          {[
            { num: '100+', label: 'Pièces' },
            { num: '12',   label: 'Catégories' },
            { num: '100%', label: 'Artisanal' },
          ].map(({ num, label }) => (
            <div key={label}>
              <p className="font-display text-2xl font-light text-brand-gold">{num}</p>
              <p className="text-[9px] tracking-[0.4em] uppercase text-white/50 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[9px] tracking-[0.5em] uppercase text-white/60">Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent origin-top"
        />
      </div>
    </section>
  )
}