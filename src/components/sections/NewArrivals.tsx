'use client'
// src/components/sections/NewArrivals.tsx
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Product3D, type GarmentKind } from '@/components/3d/Product3D'

const KIND_MAP: Record<string, GarmentKind> = {
  'robes':      'dress',
  't-shirts':   'tshirt',
  'hoodies':    'tshirt',
  'manteaux':   'coat',
  'vestes':     'coat',
  'pantalons':  'jeans',
  'jeans':      'jeans',
  'chaussures': 'shoe',
  'sneakers':   'shoe',
  'vetements':  'dress',
  'accessoires':'tshirt',
}

const GLOW_MAP: Record<string, string> = {
  'robes':      '#c084fc',
  't-shirts':   '#C9A84C',
  'hoodies':    '#f97316',
  'manteaux':   '#94a3b8',
  'vestes':     '#6366f1',
  'pantalons':  '#3b82f6',
  'jeans':      '#3b5a8a',
  'chaussures': '#a8a29e',
  'sneakers':   '#ef4444',
  'vetements':  '#C9A84C',
  'accessoires':'#10b981',
}

type Product = {
  id: string; name: string; slug: string; price: number
  description: string | null; stock: number; isNew: boolean
  sizes: string[]; images: string[]
  category: { id: string; name: string; slug: string }
}

interface Props { products: Product[] }

export default function NewArrivals({ products }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [activeIdx,    setActiveIdx]    = useState(0)

  const left  = products[0] ?? null
  const right = products[1] ?? null

  if (!left && !right) return null

  const active   = products[activeIdx] ?? left
  const slug     = active?.category?.slug ?? 'vetements'
  const kind     = KIND_MAP[slug]  ?? 'tshirt'
  const glow     = GLOW_MAP[slug]  ?? '#C9A84C'
  const hasImage = active?.images.length > 0

  return (
    <section id="arrivals" className="relative py-36 bg-brand-black overflow-hidden">

      {/* Glow de fond ambiant */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${glow}18, transparent 65%)` }}
      />

      {/* Header */}
      <div className="text-center mb-20 relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[9px] tracking-[0.5em] uppercase text-brand-gold"
        >
          Vient d&apos;arriver
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-5xl md:text-7xl font-light text-brand-white"
        >
          Nouvelles <em className="italic text-brand-gold">Silhouettes</em>
        </motion.h2>
        <div className="section-divider" />
      </div>

      {/* Layout principal */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-[1fr_500px_1fr] gap-12 items-center">

        {/* ── Info gauche ── */}
        {left ? (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setActiveIdx(0)}
            className={`cursor-pointer lg:text-left text-center transition-opacity duration-300
              ${activeIdx !== 0 ? 'opacity-50 hover:opacity-80' : 'opacity-100'}`}
          >
            <span className="text-[9px] tracking-[0.4em] uppercase text-brand-gold">Exclusivité</span>
            <h3 className="mt-3 font-display text-3xl font-light text-brand-white leading-snug">
              {left.name}
            </h3>
            <p className="mt-3 text-[12px] leading-loose text-brand-gray max-w-xs mx-auto lg:mx-0">
              {left.description}
            </p>

            {left.sizes.length > 0 && (
              <div className="flex gap-2 mt-5 justify-center lg:justify-start flex-wrap">
                {left.sizes.map(s => (
                  <button
                    key={s}
                    onClick={e => { e.stopPropagation(); setSelectedSize(s) }}
                    className={`w-9 h-9 rounded-full border text-[10px] tracking-wider transition-all
                      ${selectedSize === s
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                        : 'border-white/15 text-brand-gray hover:border-brand-gold/50'}`}
                  >
                    {s.startsWith('EU_') ? s.replace('EU_', '') : s}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-5 text-xl font-light text-brand-gold">{formatPrice(left.price)}</p>

            {left.stock === 0 ? (
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full
                border border-red-800/40 text-red-400 text-[10px] tracking-widest uppercase">
                <span>●</span> Rupture de stock
              </div>
            ) : (
              <Link href={`/produits/${left.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.2em]
                  uppercase text-brand-gold hover:gap-3 transition-all group">
                Voir le produit
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>
        ) : <div />}

        {/* ── Viewer central ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Card glass */}
          <div
            className="relative w-full aspect-square rounded-3xl overflow-hidden border border-white/8
              bg-[oklch(0.16_0.02_270)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
          >
            {/* Glow */}
            <div
              className="absolute inset-0 transition-colors duration-700"
              style={{ background: `radial-gradient(circle at 50% 45%, ${glow}44, transparent 65%)` }}
            />

            {/* Inner ring */}
            <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />

            {/* Contenu */}
            <div className="absolute inset-0">
              {hasImage ? (
                <img
                  src={active.images[0]}
                  alt={active.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Product3D kind={kind} color={glow} />
              )}
            </div>

            {/* Badge Nouveau */}
            <div className="absolute top-5 right-5 z-10">
              <span className="rounded-full px-4 py-1.5 text-[9px] uppercase tracking-[0.3em]
                bg-brand-gold text-brand-black font-medium">
                Nouveau
              </span>
            </div>

            {/* Selector dots si 2 produits */}
            {left && right && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {[0, 1].map(i => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`rounded-full transition-all duration-300
                      ${activeIdx === i
                        ? 'w-6 h-2 bg-brand-gold'
                        : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Halo externe */}
          <div
            className="absolute -inset-8 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: glow }}
          />
        </motion.div>

        {/* ── Info droite ── */}
        {right ? (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setActiveIdx(1)}
            className={`cursor-pointer lg:text-right text-center transition-opacity duration-300
              ${activeIdx !== 1 ? 'opacity-50 hover:opacity-80' : 'opacity-100'}`}
          >
            <span className="text-[9px] tracking-[0.4em] uppercase text-brand-gold">Best-Seller</span>
            <h3 className="mt-3 font-display text-3xl font-light text-brand-white leading-snug">
              {right.name}
            </h3>
            <p className="mt-3 text-[12px] leading-loose text-brand-gray max-w-xs mx-auto lg:ml-auto lg:mr-0">
              {right.description}
            </p>

            {right.sizes.length > 0 && (
              <div className="flex gap-2 mt-5 justify-center lg:justify-end flex-wrap">
                {right.sizes.map(s => (
                  <button
                    key={s}
                    onClick={e => { e.stopPropagation(); setSelectedSize(s) }}
                    className={`w-9 h-9 rounded-full border text-[10px] tracking-wider transition-all
                      ${selectedSize === s
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                        : 'border-white/15 text-brand-gray hover:border-brand-gold/50'}`}
                  >
                    {s.startsWith('EU_') ? s.replace('EU_', '') : s}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-5 text-xl font-light text-brand-gold">{formatPrice(right.price)}</p>

            {right.stock === 0 ? (
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full
                border border-red-800/40 text-red-400 text-[10px] tracking-widest uppercase">
                <span>●</span> Rupture de stock
              </div>
            ) : (
              <Link href={`/produits/${right.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.2em]
                  uppercase text-brand-gold hover:gap-3 transition-all group">
                Voir le produit
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>
        ) : <div />}
      </div>
    </section>
  )
}