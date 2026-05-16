'use client'
// src/components/sections/FeaturedBanner.tsx
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Product3D, type GarmentKind } from '@/components/3d/Product3D'
import OutfitViewer from '@/components/3d/OutfitViewer'
import { formatPrice } from '@/lib/utils'

const KIND_MAP: Record<string, GarmentKind> = {
  't-shirts':   'tshirt',
  'hoodies':    'tshirt',
  'vetements':  'tshirt',
  'accessoires':'tshirt',
  'pantalons':  'jeans',
  'jeans':      'jeans',
  'chaussures': 'shoe',
  'sneakers':   'shoe',
  'robes':      'dress',
  'manteaux':   'coat',
  'vestes':     'coat',
}

const GLOW_MAP: Record<string, string> = {
  't-shirts':   '#c084fc',
  'hoodies':    '#f97316',
  'vetements':  '#c084fc',
  'accessoires':'#10b981',
  'pantalons':  '#3b5a8a',
  'jeans':      '#3b5a8a',
  'chaussures': '#a8a29e',
  'sneakers':   '#ef4444',
  'robes':      '#c084fc',
  'manteaux':   '#94a3b8',
  'vestes':     '#6366f1',
}

type Product = {
  id: string; name: string; slug: string; price: number
  stock: number; isNew: boolean; isFeatured: boolean
  sizes: string[]; images: string[]
  category: { id: string; name: string; slug: string }
} | null

interface Props { product: Product }

export default function FeaturedBanner({ product }: Props) {
  const slug     = product?.category?.slug ?? 't-shirts'
  const kind     = KIND_MAP[slug]  ?? 'tshirt'
  const glow     = GLOW_MAP[slug]  ?? '#c084fc'
  const hasImage = (product?.images?.length ?? 0) > 0
  const imageUrl = hasImage ? product!.images[0] : undefined

  return (
    <section className="relative px-6 py-32 md:px-10 md:py-40 bg-brand-black overflow-hidden">

      {/* Aurora bg — dégradé animé comme Chic Revolver */}
      <div className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.07), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(192,132,252,0.07), transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(59,130,246,0.05), transparent 50%)',
        }}
      />

      {/* Glow produit */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(ellipse at 80% 40%, ${glow}22, transparent 60%)` }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

        {/* ── Texte gauche ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gray">
            Collection Capsule
          </span>

          {product ? (
            <>
              <h2 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl text-brand-white">
                {product.name.split(' ').slice(0, 2).join(' ')}
                <br />
                {/* text-gradient : dégradé or → violet comme Chic Revolver */}
                <span className="italic"
                  style={{ background: `linear-gradient(135deg, #C9A84C, ${glow})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {product.name.split(' ').slice(2).join(' ') || 'Exclusif'}
                </span>
              </h2>
              <p className="mt-6 font-display text-3xl text-brand-white/90">
                {formatPrice(product.price)}
              </p>
            </>
          ) : (
            <h2 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl text-brand-white">
              Le Noir
              <br />
              <span className="italic"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Éternel
              </span>
            </h2>
          )}

          <p className="mt-8 max-w-md text-[13px] leading-relaxed text-brand-gray">
            Une capsule dédiée à l&apos;élégance absolue. Matières nobles, coupes architecturales,
            silhouettes sculpturales pour toutes les occasions.
          </p>

          {/* Stats — séparées par une border comme Chic Revolver */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-y border-white/8 py-6">
            {[
              { num: '12',   label: 'Nouvelles Pièces' },
              { num: '6',    label: 'Catégories' },
              { num: '100%', label: 'Artisanal' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-display text-3xl text-brand-white">{num}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-brand-gray">{label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={product ? `/produits/${product.slug}` : '/produits'}
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3
                text-[11px] tracking-[0.2em] uppercase text-brand-black font-medium
                transition-all duration-300 hover:shadow-[0_8px_32px_rgba(201,168,76,0.4)]"
              style={{ background: `linear-gradient(135deg, #C9A84C, ${glow})` }}
            >
              {product ? 'Voir le produit' : 'Explorer la Capsule'}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/produits"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3
                text-[11px] tracking-[0.2em] uppercase text-brand-cream
                border border-white/15 backdrop-blur-md bg-white/5
                hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              Toute la collection
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* ── Viewer droite ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Card glass — style "glass-strong" de Chic Revolver */}
          <div className="relative aspect-square overflow-hidden rounded-3xl
            bg-white/5 backdrop-blur-2xl border border-white/10
            shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]">

            {/* Glow interne */}
            <div className="absolute inset-0 opacity-70"
              style={{ background: `radial-gradient(circle at 50% 50%, ${glow}33, transparent 65%)` }} />

            {/* Inner ring */}
            <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />

            {/* Contenu — OutfitViewer rotatif si image, sinon Product3D */}
            <div className="absolute inset-0 pointer-events-none">
              {imageUrl ? (
                <OutfitViewer
                  imageUrl={imageUrl}
                  accentColor={0xC9A84C}
                  autoRotateSpeed={0.38}
                  className="w-full h-full"
                />
              ) : (
                <Product3D kind={kind} color={glow} />
              )}
            </div>

            {/* Badge — style "glass-strong" pill */}
            <span className="absolute left-5 top-5 z-10 rounded-full px-3 py-1.5
              bg-white/10 backdrop-blur-md border border-white/15
              text-[10px] uppercase tracking-[0.2em] text-brand-cream">
              {product?.isNew ? 'Nouveau' : 'Capsule'}
            </span>

            {/* Info bas droite */}
            <div className="absolute bottom-5 right-5 z-10 text-right">
              <div className="text-[10px] uppercase tracking-[0.2em] text-brand-gray">
                Édition limitée
              </div>
              <div className="font-display text-lg text-brand-white">Hiver 2026</div>
            </div>
          </div>

          {/* Halo externe */}
          <div
            className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-50 blur-3xl"
            style={{ background: `radial-gradient(circle, ${glow}33, transparent 70%)` }}
          />

          {/* Card flottante bas gauche — style Chic Revolver */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-6 z-10 rounded-2xl px-5 py-4
              bg-white/8 backdrop-blur-2xl border border-white/10
              shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            <div className="text-[10px] uppercase tracking-[0.2em] text-brand-gray">Disponible</div>
            <div className="mt-1 font-display text-xl text-brand-white">
              {product ? `${product.stock} en stock` : '12 pièces'}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}