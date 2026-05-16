'use client'
// src/components/sections/CollectionGrid.tsx
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Product3D, type GarmentKind } from '@/components/3d/Product3D'

// Mapping catégorie → type 3D + couleur glow
const KIND_MAP: Record<string, GarmentKind> = {
  'robes':       'dress',
  't-shirts':    'tshirt',
  'hoodies':     'tshirt',
  'manteaux':    'coat',
  'vestes':      'coat',
  'pantalons':   'jeans',
  'jeans':       'jeans',
  'chaussures':  'shoe',
  'sneakers':    'shoe',
  'vetements':   'dress',
  'accessoires': 'tshirt',
}

const GLOW_MAP: Record<string, string> = {
  'robes':       '#c084fc',
  't-shirts':    '#C9A84C',
  'hoodies':     '#f97316',
  'manteaux':    '#94a3b8',
  'vestes':      '#6366f1',
  'pantalons':   '#3b82f6',
  'jeans':       '#3b5a8a',
  'chaussures':  '#1f1f24',
  'sneakers':    '#ef4444',
  'vetements':   '#C9A84C',
  'accessoires': '#10b981',
}

type Product = {
  id: string; name: string; slug: string; price: number
  stock: number; isNew: boolean; isFeatured: boolean
  sizes: string[]; images: string[]
  category: { id: string; name: string; slug: string }
}

interface Props { products: Product[] }

export default function CollectionGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <section id="collection" className="py-36 bg-brand-black text-center">
        <div className="text-center mb-20 px-8">
          <span className="section-tag">Collection 2026</span>
          <h2 className="section-title">La <em className="italic">Sélection</em></h2>
          <div className="section-divider" />
        </div>
        <p className="font-display text-2xl text-brand-gray">Aucun produit disponible</p>
      </section>
    )
  }

  return (
    <section id="collection" className="relative px-6 py-36 md:px-10 bg-brand-black">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-[9px] tracking-[0.5em] uppercase text-brand-gold">
              Collection 2026
            </span>
            <h2 className="mt-4 font-display text-5xl md:text-7xl font-light text-brand-white tracking-tight">
              La <em className="italic text-brand-gold">Sélection</em>
            </h2>
          </div>
          <p className="hidden max-w-xs text-[12px] text-brand-gray leading-loose md:block">
            Glissez, tournez, observez. Chaque pièce rendue en temps réel pour sentir la silhouette avant de la porter.
          </p>
        </div>

        {/* Grille */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/produits" className="btn-gold">
            <span>Voir toute la collection</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [hover, setHover] = useState(false)
  const slug  = product.category?.slug ?? 'vetements'
  const kind  = KIND_MAP[slug]  ?? 'tshirt'
  const glow  = GLOW_MAP[slug]  ?? '#C9A84C'

  // Si le produit a une image Cloudinary, on l'utilise comme texture de fond
  const hasImage = product.images.length > 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative"
    >
      {/* Card viewer */}
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/8
        bg-[oklch(0.16_0.02_270)] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        {/* Glow halo */}
        <div
          className="absolute inset-0 opacity-50 transition-opacity duration-700 group-hover:opacity-90"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glow}33, transparent 65%)`,
          }}
        />

        {/* Inner ring décoratif */}
        <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />

        {/* Contenu — image ou viewer 3D */}
        <div className="absolute inset-0">
          {hasImage ? (
            // Photo Cloudinary avec effet hover scale
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            // Viewer 3D si pas d'image
            <Product3D kind={kind} color={glow} paused={hover} />
          )}
        </div>

        {/* Badge tag */}
        <span className="absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] uppercase
          tracking-[0.2em] bg-black/40 backdrop-blur-md border border-white/10 text-brand-cream z-10">
          {product.isNew ? 'Nouveau' : product.isFeatured ? 'Vedette' : product.category.name}
        </span>

        {/* Badge épuisé */}
        {product.stock === 0 && (
          <span className="absolute right-5 top-5 rounded-full px-3 py-1 text-[10px] uppercase
            tracking-[0.2em] bg-red-900/60 backdrop-blur-md border border-red-500/20 text-red-300 z-10">
            Épuisé
          </span>
        )}

        {/* Lien cliquable */}
        <Link href={`/produits/${product.slug}`} className="absolute inset-0 z-20" />
      </div>

      {/* Infos sous la card */}
      <div className="mt-6 flex items-end justify-between">
        <div>
          <h3 className="font-display text-xl font-light text-brand-white">{product.name}</h3>
          <p className="mt-1 text-sm text-brand-gray">{formatPrice(product.price)}</p>
          {product.sizes.length > 0 && (
            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {product.sizes.slice(0, 4).map(s => (
                <span key={s} className="text-[9px] border border-white/15 px-1.5 py-0.5 text-brand-gray rounded-sm">
                  {s.startsWith('EU_') ? s.replace('EU_', '') : s}
                </span>
              ))}
            </div>
          )}
        </div>
        <Link
          href={`/produits/${product.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-brand-gray
            transition-colors hover:text-brand-gold group/arrow"
        >
          Voir
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/arrow:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  )
}