'use client'
// src/components/sections/CatalogueClient.tsx
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Product3D, type GarmentKind } from '@/components/3d/Product3D'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SORTS = [
  { value: 'newest',     label: 'Nouveautés' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'featured',   label: 'Coup de cœur' },
]

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

type Category = { id: string; name: string; slug: string }
type Product  = {
  id: string; name: string; slug: string; price: number
  images: string[]; isNew: boolean; isFeatured: boolean; stock: number
  sizes: string[]; category: Category
}

export default function CatalogueClient({ defaultCategory }: { defaultCategory?: string } = {}) {
  const searchParams = useSearchParams()
  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total,      setTotal]      = useState(0)
  const [pages,      setPages]      = useState(1)
  const [loading,    setLoading]    = useState(true)
  const [filtersOpen,setFiltersOpen]= useState(false)

  const [category, setCategory] = useState(defaultCategory ?? searchParams.get('category') ?? '')
  const [sizes,    setSizes]    = useState<string[]>([])
  const [sort,     setSort]     = useState('newest')
  const [page,     setPage]     = useState(1)
  const [isNew,    setIsNew]    = useState(searchParams.get('new') === 'true')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (sizes.length) params.set('sizes', sizes.join(','))
      if (isNew) params.set('new', 'true')
      params.set('sort',  sort)
      params.set('page',  String(page))
      params.set('limit', '9')
      const res  = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.items ?? [])
      setTotal(data.total ?? 0)
      setPages(data.pages ?? 1)
    } catch { setProducts([]) }
    finally  { setLoading(false) }
  }, [category, sizes, sort, page, isNew])

  useEffect(() => { loadProducts() }, [loadProducts])

  const toggleSize = (s: string) =>
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const resetFilters = () => {
    setCategory(''); setSizes([]); setIsNew(false); setSort('newest'); setPage(1)
  }

  const activeFiltersCount = [category, ...sizes, isNew ? 'new' : ''].filter(Boolean).length

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

      {/* ── Barre de contrôles ── */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(v => !v)}
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2
              text-[11px] tracking-[0.2em] uppercase text-brand-cream backdrop-blur-sm
              hover:border-brand-gold hover:text-brand-gold transition-all"
          >
            <SlidersHorizontal size={13} strokeWidth={1.5} />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 bg-brand-gold text-brand-black rounded-full
                text-[9px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-[10px] tracking-widest rounded-full
                uppercase text-brand-gray hover:text-brand-gold transition-colors px-3 py-2
                border border-white/10 hover:border-brand-gold/30"
            >
              <X size={11} /> Réinitialiser
            </button>
          )}

          <span className="text-[11px] text-brand-gray tracking-wider">
            {total} produit{total > 1 ? 's' : ''}
          </span>
        </div>

        {/* Tri */}
        <div className="relative">
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1) }}
            className="appearance-none rounded-full bg-transparent border border-white/15
              px-4 py-2 pr-8 text-[11px] tracking-[0.2em] uppercase text-brand-cream
              hover:border-brand-gold transition-colors cursor-pointer focus:outline-none"
          >
            {SORTS.map(s => (
              <option key={s.value} value={s.value} className="bg-brand-dark text-brand-cream">
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" />
        </div>
      </div>

      {/* ── Panel filtres ── */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <div className="rounded-3xl border border-white/8 bg-[oklch(0.16_0.02_270)]
              backdrop-blur-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Catégories */}
              <div>
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">Catégorie</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setCategory(''); setPage(1) }}
                    className={`text-left text-[12px] tracking-wider transition-colors rounded-full
                      px-3 py-1.5 ${!category
                        ? 'bg-brand-gold/10 text-brand-gold'
                        : 'text-brand-gray hover:text-brand-cream hover:bg-white/5'}`}
                  >
                    Toutes
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setCategory(cat.slug); setPage(1) }}
                      className={`text-left text-[12px] tracking-wider transition-colors rounded-full
                        px-3 py-1.5 ${category === cat.slug
                          ? 'bg-brand-gold/10 text-brand-gold'
                          : 'text-brand-gray hover:text-brand-cream hover:bg-white/5'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tailles */}
              <div>
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">Taille</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => { toggleSize(s); setPage(1) }}
                      className={`w-10 h-10 rounded-full border text-[10px] tracking-wider transition-all
                        ${sizes.includes(s)
                          ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                          : 'border-white/15 text-brand-gray hover:border-brand-gold/50'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Autres */}
              <div>
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">Filtrer par</p>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => { setIsNew(v => !v); setPage(1) }}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                      ${isNew ? 'border-brand-gold bg-brand-gold' : 'border-white/20 group-hover:border-brand-gold/50'}`}
                  >
                    {isNew && <span className="text-brand-black text-[10px] font-bold">✓</span>}
                  </div>
                  <span className="text-[12px] text-brand-gray tracking-wider group-hover:text-brand-cream transition-colors">
                    Nouveautés uniquement
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Grille produits ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-3xl shimmer" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32">
          <p className="font-display text-4xl font-light text-brand-gray mb-4">Aucun résultat</p>
          <p className="text-[12px] tracking-widest text-brand-gray uppercase mb-8">
            Essayez d&apos;autres filtres
          </p>
          <button onClick={resetFilters} className="btn-gold">
            <span>Voir tout</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <CatalogueCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-16">
          {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-10 h-10 rounded-full border text-[11px] transition-all
                ${page === n
                  ? 'border-brand-gold bg-brand-gold text-brand-black'
                  : 'border-white/15 text-brand-gray hover:border-brand-gold hover:text-brand-gold'}`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CatalogueCard({ product, index }: { product: Product; index: number }) {
  const [hover, setHover] = useState(false)
  const slug     = product.category?.slug ?? 'vetements'
  const kind     = KIND_MAP[slug]  ?? 'tshirt'
  const glow     = GLOW_MAP[slug]  ?? '#C9A84C'
  const hasImage = product.images.length > 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative"
    >
      {/* Card */}
      <div
        className="relative aspect-square overflow-hidden rounded-3xl border border-white/8
          bg-[oklch(0.16_0.02_270)] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
      >
        {/* Glow */}
        <div
          className="absolute inset-0 transition-opacity duration-700 opacity-40 group-hover:opacity-80"
          style={{ background: `radial-gradient(circle at 50% 50%, ${glow}44, transparent 65%)` }}
        />

        {/* Inner ring */}
        <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />

        {/* Image ou 3D */}
        <div className="absolute inset-0">
          {hasImage ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <Product3D kind={kind} color={glow} paused={hover} />
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          {product.isNew && (
            <span className="rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.2em]
              bg-brand-gold text-brand-black font-medium">
              Nouveau
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.2em]
              bg-black/50 backdrop-blur-md border border-white/10 text-brand-gray">
              Épuisé
            </span>
          )}
          {product.stock > 0 && product.stock <= 3 && (
            <span className="rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.2em]
              bg-red-900/60 backdrop-blur-md border border-red-500/20 text-red-300">
              Plus que {product.stock}
            </span>
          )}
        </div>

        {/* Lien */}
        <Link href={`/produits/${product.slug}`} className="absolute inset-0 z-20" />
      </div>

      {/* Infos sous la card */}
      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-brand-gray mb-1">
            {product.category?.name}
          </p>
          <h3 className="font-display text-lg font-light text-brand-white leading-tight">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-brand-gold">{formatPrice(product.price)}</p>
          {product.sizes.length > 0 && (
            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {product.sizes.slice(0, 5).map(s => (
                <span key={s} className="text-[9px] border border-white/15 px-1.5 py-0.5
                  text-brand-gray rounded-sm">
                  {s.startsWith('EU_') ? s.replace('EU_', '') : s}
                </span>
              ))}
            </div>
          )}
        </div>
        <Link
          href={`/produits/${product.slug}`}
          className="inline-flex items-center gap-1 text-[11px] text-brand-gray
            hover:text-brand-gold transition-colors group/arrow flex-shrink-0"
        >
          Voir
          <ArrowRight size={13} className="transition-transform group-hover/arrow:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  )
}