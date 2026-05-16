'use client'
// src/components/sections/ProductDetail.tsx
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, ChevronRight, RotateCcw, ArrowRight } from 'lucide-react'
import { useCart } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import { Product3D, type GarmentKind } from '@/components/3d/Product3D'
import type { Size } from '@/types'

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
  id: string; name: string; slug: string
  description: string | null; price: number; stock: number
  images: string[]; isNew: boolean; isFeatured: boolean
  sizes: string[]
  category: { id: string; name: string; slug: string }
}

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [quantity,     setQuantity]     = useState(1)
  const [sizeError,    setSizeError]    = useState(false)
  const [added,        setAdded]        = useState(false)
  const [rotating,     setRotating]     = useState(true)
  const [activeImg,    setActiveImg]    = useState(0)
  const { addItem } = useCart()

  const slug     = product.category?.slug ?? 'vetements'
  const kind     = KIND_MAP[slug] ?? 'tshirt'
  const glow     = GLOW_MAP[slug] ?? '#C9A84C'
  const hasImage = product.images.length > 0
  const imageUrl = hasImage ? product.images[activeImg] : undefined

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 2500)
      return
    }
    addItem({
      productId: product.id,
      name:      product.name,
      price:     product.price,
      imageUrl: product.images[0] ?? undefined,
      size:      selectedSize ?? ('UNIQUE' as Size),
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-brand-gray mb-12 flex-wrap">
        <Link href="/" className="hover:text-brand-gold transition-colors">Accueil</Link>
        <ChevronRight size={10} />
        <Link href="/produits" className="hover:text-brand-gold transition-colors">Collection</Link>
        <ChevronRight size={10} />
        <Link href={`/categorie/${product.category.slug}`} className="hover:text-brand-gold transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight size={10} />
        <span className="text-brand-cream">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* ── Visionneuse ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="sticky top-28"
        >
          {/* Card viewer principale */}
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/8
            bg-[oklch(0.16_0.02_270)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">

            {/* Glow */}
            <div
              className="absolute inset-0 transition-colors duration-700"
              style={{ background: `radial-gradient(circle at 50% 45%, ${glow}44, transparent 65%)` }}
            />

            {/* Inner ring */}
            <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />

            {/* Contenu */}
            <div className="absolute inset-0">
              {hasImage ? (
                <img
                  key={activeImg}
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Product3D
                  kind={kind}
                  color={glow}
                  paused={!rotating}
                />
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-5 left-5 flex flex-col gap-2 z-10 pointer-events-none">
              {product.isNew && (
                <span className="rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.2em]
                  bg-brand-gold text-brand-black font-medium">
                  Nouveau
                </span>
              )}
              {product.stock <= 3 && product.stock > 0 && (
                <span className="rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.2em]
                  bg-red-900/60 backdrop-blur-md border border-red-500/20 text-red-300">
                  Plus que {product.stock}
                </span>
              )}
              {product.stock === 0 && (
                <span className="rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.2em]
                  bg-black/50 backdrop-blur-md border border-white/10 text-brand-gray">
                  Épuisé
                </span>
              )}
            </div>

            {/* Contrôle rotation (seulement si pas d'image) */}
            {!hasImage && (
              <div className="absolute bottom-5 right-5 z-10">
                <button
                  onClick={() => setRotating(v => !v)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all
                    ${rotating
                      ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                      : 'border-white/20 text-brand-gray hover:border-brand-gold'}`}
                >
                  <RotateCcw size={13} strokeWidth={1.5} />
                </button>
              </div>
            )}

            {/* Label Vue 360° */}
            <p className="absolute bottom-5 left-5 text-[9px] tracking-[0.3em] uppercase
              text-brand-gray/50 pointer-events-none z-10">
              Vue 360°
            </p>
          </div>

          {/* Halo externe */}
          <div
            className="absolute -inset-4 rounded-full opacity-15 blur-3xl pointer-events-none -z-10"
            style={{ background: glow }}
          />

          {/* Miniatures */}
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((url, i) => (
                <button
                  key={url}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl
                    border-2 transition-all duration-300
                    ${activeImg === i
                      ? 'border-brand-gold shadow-[0_0_12px_rgba(201,168,76,0.4)]'
                      : 'border-white/10 hover:border-white/30'}`}
                >
                  <img src={url} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Informations produit ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="py-4"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase text-brand-gray">
            {product.category.name}
          </span>
          <h1 className="mt-3 font-display text-[clamp(32px,4vw,52px)] font-light
            text-brand-white leading-tight">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-light tracking-wide"
            style={{ color: glow }}>
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="mt-6 text-[13px] leading-loose text-brand-gray max-w-md">
              {product.description}
            </p>
          )}

          {/* Sélecteur taille */}
          {product.sizes.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] tracking-[0.4em] uppercase text-brand-cream">Taille</p>
                <button className="text-[10px] tracking-widest uppercase text-brand-gold hover:underline">
                  Guide des tailles
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => {
                  const label = s.startsWith('EU_') ? s.replace('EU_', '') : s
                  return (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s as Size); setSizeError(false) }}
                      className={`min-w-[44px] h-11 px-3 rounded-full border text-[11px]
                        tracking-wider transition-all duration-200
                        ${selectedSize === s
                          ? 'border-brand-gold bg-brand-gold text-brand-black font-medium'
                          : sizeError
                            ? 'border-red-500/50 text-red-400'
                            : 'border-white/20 text-brand-gray hover:border-brand-gold hover:text-brand-cream'}`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {sizeError && (
                <p className="text-red-400 text-[10px] tracking-widest uppercase mt-3 flex items-center gap-2">
                  <span>⚠</span> Veuillez sélectionner une taille
                </p>
              )}
            </div>
          )}

          {/* Quantité */}
          <div className="mt-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-brand-cream mb-4">Quantité</p>
            <div className="flex items-center gap-0 rounded-full border border-white/20 w-fit overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center text-brand-gray
                  hover:text-brand-gold hover:bg-white/5 transition-all text-lg"
              >−</button>
              <span className="w-12 text-center text-brand-cream text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stock || 10, q + 1))}
                className="w-11 h-11 flex items-center justify-center text-brand-gray
                  hover:text-brand-gold hover:bg-white/5 transition-all text-lg"
              >+</button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full
                text-[10px] font-medium tracking-[0.35em] uppercase transition-all duration-300
                ${added
                  ? 'bg-green-600 text-white'
                  : product.stock === 0
                    ? 'bg-white/5 text-brand-gray cursor-not-allowed border border-white/10'
                    : 'bg-brand-gold text-brand-black hover:bg-brand-gold-light shadow-[0_8px_24px_rgba(201,168,76,0.3)]'
                }`}
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              <span>
                {added ? '✓ Ajouté au panier'
                  : product.stock === 0 ? 'Épuisé'
                  : 'Ajouter au panier'}
              </span>
            </button>

            {/* <Link
              href="/checkout"
              className="w-full py-4 rounded-full text-center text-[10px] tracking-[0.35em]
                uppercase border border-white/15 text-brand-cream
                hover:border-brand-gold hover:text-brand-gold transition-all duration-300
                flex items-center justify-center gap-2 group"
            >
              Commander directement
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link> */}
          </div>

          {/* Détails */}
          <div className="mt-10 rounded-2xl border border-white/8 bg-[oklch(0.16_0.02_270)] p-6 space-y-3">
            {[
              
              { label: 'Catégorie',     value: product.category.name },
              { label: 'Disponibilité', value: product.stock > 0 ? `En stock (${product.stock})` : 'Épuisé' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gray">{label}</span>
                <span className="text-[12px] text-brand-cream">{value}</span>
              </div>
            ))}
          </div>

          {/* Livraison */}
          <div className="mt-4 rounded-2xl border p-5 transition-colors"
            style={{ borderColor: `${glow}30`, background: `${glow}08` }}>
            <p className="text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: glow }}>
              Livraison & Retours
            </p>
            <p className="text-[12px] leading-loose text-brand-gray">
              Livraison disponible à Cotonou et dans toute l&apos;Afrique de l&apos;Ouest.
              Retours acceptés sous 14 jours dans l&apos;état d&apos;origine.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}