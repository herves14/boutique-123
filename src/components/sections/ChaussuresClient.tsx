'use client'
// src/components/sections/ChaussuresClient.tsx
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import OutfitViewer from '@/components/3d/OutfitViewer'
import { formatPrice } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────
type Product = {
  id: string; name: string; slug: string; price: number
  images: string[]; isNew: boolean; isFeatured: boolean; stock: number
  sizes: string[]; description: string | null
  category: { id: string; name: string; slug: string }
}

// ── Constantes ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Nouveautés' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'featured',   label: 'Coup de cœur' },
]

const PRICE_RANGES = [
  { label: 'Tous les prix', min: 0,      max: 999999 },
  { label: 'Moins de 50 000 FCFA', min: 0,  max: 50000  },
  { label: '50 000 – 100 000 FCFA', min: 50000, max: 100000 },
  { label: '100 000 – 200 000 FCFA', min: 100000, max: 200000 },
  { label: 'Plus de 200 000 FCFA', min: 200000, max: 999999 },
]

const SHOE_STYLES = [
  { label: 'Tout',        value: '' },
  { label: 'Escarpins',   value: 'escarpin' },
  { label: 'Sneakers',    value: 'sneaker' },
  { label: 'Boots',       value: 'boot' },
  { label: 'Sandales',    value: 'sandal' },
  { label: 'Mocassins',   value: 'mocassin' },
]

// ── Composant principal ─────────────────────────────────────────────────────
export default function ChaussuresClient() {
  const [products,     setProducts]     = useState<Product[]>([])
  const [suggestions,  setSuggestions]  = useState<Product[]>([])
  const [loading,      setLoading]      = useState(true)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [showSuggest,  setShowSuggest]  = useState(false)
  const [sort,         setSort]         = useState('newest')
  const [priceRange,   setPriceRange]   = useState(0)   // index dans PRICE_RANGES
  const [styleFilter,  setStyleFilter]  = useState('')
  const [inStock,      setInStock]      = useState(false)
  const [isNew,        setIsNew]        = useState(false)
  const [page,         setPage]         = useState(1)
  const [totalPages,   setTotalPages]   = useState(1)
  const [total,        setTotal]        = useState(0)

  const searchRef   = useRef<HTMLInputElement>(null)
  const suggestRef  = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  // ── Chargement produits ──────────────────────────────────────────────────
  const loadProducts = useCallback(async (query?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('category', 'chaussures')
      params.set('sort',  sort)
      params.set('page',  String(page))
      params.set('limit', '9')

      const range = PRICE_RANGES[priceRange]
      if (range.min > 0)         params.set('minPrice', String(range.min))
      if (range.max < 999999)    params.set('maxPrice', String(range.max))
      if (isNew)                 params.set('new', 'true')

      const q = query !== undefined ? query : searchQuery
      if (q.trim()) params.set('search', q.trim())

      const res  = await fetch(`/api/products?${params}`)
      const data = await res.json()

      let items: Product[] = data.items ?? []

      // Filtrage par style côté client (recherche dans le nom)
      if (styleFilter) {
        items = items.filter(p =>
          p.name.toLowerCase().includes(styleFilter) ||
          (p.description ?? '').toLowerCase().includes(styleFilter)
        )
      }

      setProducts(items)
      setTotal(data.total ?? 0)
      setTotalPages(data.pages ?? 1)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [sort, page, priceRange, isNew, styleFilter, searchQuery])

  useEffect(() => { loadProducts() }, [loadProducts])

  // ── Recherche avec suggestions (debounce 300ms) ──────────────────────────
  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setPage(1)
    clearTimeout(debounceRef.current)

    if (val.trim().length < 2) {
      setSuggestions([]); setShowSuggest(false); return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/products?category=chaussures&search=${encodeURIComponent(val)}&limit=5`)
        const data = await res.json()
        setSuggestions(data.items ?? [])
        setShowSuggest(true)
      } catch { setSuggestions([]) }
    }, 300)
  }

  const applySuggestion = (product: Product) => {
    setSearchQuery(product.name)
    setSuggestions([])
    setShowSuggest(false)
    loadProducts(product.name)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSuggestions([])
    setShowSuggest(false)
    setPage(1)
    searchRef.current?.focus()
  }

  const resetFilters = () => {
    setSearchQuery(''); setSuggestions([]); setShowSuggest(false)
    setSort('newest'); setPriceRange(0); setStyleFilter('')
    setInStock(false); setIsNew(false); setPage(1)
  }

  const activeCount = [
    searchQuery, styleFilter, priceRange > 0 ? 'price' : '', isNew ? 'new' : ''
  ].filter(Boolean).length

  // Fermer suggestions au clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!suggestRef.current?.contains(e.target as Node) &&
          !searchRef.current?.contains(e.target as Node)) {
        setShowSuggest(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Rendu ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-32">

      {/* ════ BARRE DE RECHERCHE INTELLIGENTE ════ */}
      <div className="relative mb-10">
        <div className={`flex items-center gap-4 border-b-2 pb-3 transition-colors duration-300
          ${searchQuery ? 'border-brand-gold' : 'border-white/15'}`}>

          {/* Icône recherche */}
          <svg className={`flex-shrink-0 transition-colors ${searchQuery ? 'text-brand-gold' : 'text-brand-gray'}`}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>

          {/* Input */}
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggest(true)}
            placeholder="Rechercher une chaussure... (ex: escarpin noir, sneaker blanc)"
            className="flex-1 bg-transparent text-[15px] text-brand-cream placeholder:text-brand-gray/40
              focus:outline-none tracking-wider"
            autoComplete="off"
          />

          {/* Compteur de résultats */}
          {!loading && searchQuery && (
            <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gray flex-shrink-0">
              {total} résultat{total > 1 ? 's' : ''}
            </span>
          )}

          {/* Bouton clear */}
          {searchQuery && (
            <button onClick={clearSearch}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-gray/20 flex items-center justify-center
                text-brand-gray hover:bg-brand-gold hover:text-brand-black transition-all text-xs font-bold">
              ✕
            </button>
          )}

          {/* Indicateur loading */}
          {loading && (
            <div className="flex-shrink-0 w-4 h-4 border border-brand-gold/40 border-t-brand-gold rounded-full animate-spin" />
          )}
        </div>

        {/* ── Suggestions ── */}
        {showSuggest && suggestions.length > 0 && (
          <div ref={suggestRef}
            className="absolute top-full left-0 right-0 z-50 bg-brand-dark border border-white/10
              border-t-0 shadow-2xl shadow-black/50 mt-0">
            {suggestions.map((s, i) => (
              <button
                key={s.id}
                onClick={() => applySuggestion(s)}
                className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/5
                  transition-colors border-b border-white/5 last:border-0 text-left group"
              >
                {/* Miniature */}
                <div className="w-10 h-12 bg-brand-dark2 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {s.images[0]
                    ? <img src={s.images[0]} alt="" className="w-full h-full object-cover" />
                    : <span className="font-display text-brand-gold/40 text-xs">123</span>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  {/* Nom avec highlight */}
                  <HighlightText text={s.name} query={searchQuery} />
                  <p className="text-[10px] text-brand-gray mt-0.5 tracking-wider">{s.category.name}</p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-[13px] text-brand-gold-light">{formatPrice(s.price)}</p>
                  {s.stock === 0 && (
                    <p className="text-[9px] text-red-400 tracking-wider">Épuisé</p>
                  )}
                </div>

                <svg className="flex-shrink-0 text-brand-gray/40 group-hover:text-brand-gold transition-colors"
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ))}

            {/* Voir tous les résultats */}
            <button
              onClick={() => { setShowSuggest(false); loadProducts(searchQuery) }}
              className="w-full px-5 py-3 text-[10px] tracking-[0.35em] uppercase text-brand-gold
                hover:bg-brand-gold/5 transition-colors flex items-center justify-center gap-2"
            >
              Voir tous les résultats pour &quot;{searchQuery}&quot;
            </button>
          </div>
        )}
      </div>

      {/* ════ FILTRES ════ */}
      <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-white/5">

        {/* Styles de chaussures */}
        <div className="flex items-center gap-2 flex-wrap">
          {SHOE_STYLES.map(style => (
            <button
              key={style.value}
              onClick={() => { setStyleFilter(style.value); setPage(1) }}
              className={`px-4 py-2 text-[10px] tracking-[0.25em] uppercase transition-all duration-200
                ${styleFilter === style.value
                  ? 'bg-brand-gold text-brand-black'
                  : 'border border-white/15 text-brand-gray hover:border-brand-gold/50 hover:text-brand-cream'}`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Séparateur */}
        <div className="h-5 w-px bg-white/10 hidden lg:block" />

        {/* Fourchette de prix */}
        <select
          value={priceRange}
          onChange={e => { setPriceRange(Number(e.target.value)); setPage(1) }}
          className="bg-transparent border border-white/15 px-4 py-2 text-[10px] tracking-[0.2em]
            uppercase text-brand-gray hover:border-brand-gold transition-colors focus:outline-none cursor-pointer"
        >
          {PRICE_RANGES.map((r, i) => (
            <option key={i} value={i} className="bg-brand-dark text-brand-cream text-[12px]">
              {r.label}
            </option>
          ))}
        </select>

        {/* Tri */}
        <select
          value={sort}
          onChange={e => { setSort(e.target.value); setPage(1) }}
          className="bg-transparent border border-white/15 px-4 py-2 text-[10px] tracking-[0.2em]
            uppercase text-brand-gray hover:border-brand-gold transition-colors focus:outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map(s => (
            <option key={s.value} value={s.value} className="bg-brand-dark text-brand-cream text-[12px]">
              {s.label}
            </option>
          ))}
        </select>

        {/* Nouveautés toggle */}
        <button
          onClick={() => { setIsNew(v => !v); setPage(1) }}
          className={`px-4 py-2 text-[10px] tracking-[0.25em] uppercase transition-all
            ${isNew ? 'bg-brand-gold text-brand-black' : 'border border-white/15 text-brand-gray hover:border-brand-gold/50'}`}
        >
          Nouveautés
        </button>

        {/* Reset */}
        {activeCount > 0 && (
          <button onClick={resetFilters}
            className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-brand-gray
              hover:text-red-400 transition-colors ml-auto">
            <span>✕</span> Réinitialiser ({activeCount})
          </button>
        )}

        {/* Compteur */}
        <span className="text-[11px] text-brand-gray tracking-wider ml-auto">
          {loading ? '...' : `${total} chaussure${total > 1 ? 's' : ''}`}
        </span>
      </div>

      {/* ════ GRILLE PRODUITS ════ */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] shimmer" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState query={searchQuery} onReset={resetFilters} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px]">
            {products.map((product, i) => (
              <ShoeCard key={product.id} product={product} index={i} query={searchQuery} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 border border-white/15 text-brand-gray disabled:opacity-30
                  hover:border-brand-gold hover:text-brand-gold transition-all text-sm"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-10 h-10 border text-[11px] transition-all
                    ${page === n
                      ? 'border-brand-gold bg-brand-gold text-brand-black font-medium'
                      : 'border-white/15 text-brand-gray hover:border-brand-gold hover:text-brand-gold'}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 border border-white/15 text-brand-gray disabled:opacity-30
                  hover:border-brand-gold hover:text-brand-gold transition-all text-sm"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Highlight texte recherche ───────────────────────────────────────────────
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <span className="text-[13px] text-brand-cream">{text}</span>
  }
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <span className="text-[13px] text-brand-cream">
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-brand-gold/30 text-brand-gold font-medium px-0.5 rounded-sm">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}

// ── Card produit chaussure ──────────────────────────────────────────────────
function ShoeCard({ product, index, query }: { product: Product; index: number; query: string }) {
  const [hovered, setHovered] = useState(false)

  // Couleur 3D selon le nom du produit
  const isBlack  = product.name.toLowerCase().includes('noir') || product.name.toLowerCase().includes('black')
  const isWhite  = product.name.toLowerCase().includes('blanc') || product.name.toLowerCase().includes('white')
  const shoeColor = isBlack ? 0x0D0D0D : isWhite ? 0xF5F0E8 : 0x4A2C1A
  const heelColor = 0xC9A84C

  return (
    <div
      className="product-card group relative overflow-hidden aspect-[3/4] bg-brand-dark2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Vue 3D */}
      <div className="absolute inset-0 pointer-events-none">
        <OutfitViewer
          style="blazer"
          fabricColor={0xF0EAD8}
          accentColor={0xC9A84C}
          shoeColor={shoeColor}
          heelColor={heelColor}
          autoRotateSpeed={hovered ? 0.8 : 0.25}
          className="w-full h-full"
        />
      </div>

      {/* Overlay */}
      <div className="product-overlay absolute inset-0" />

      {/* Badges */}
      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
        {product.isNew && (
          <span className="bg-brand-gold text-brand-black text-[8px] font-medium tracking-[0.4em] uppercase px-3 py-1">
            Nouveau
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-brand-dark2/90 text-brand-gray text-[8px] tracking-[0.3em] uppercase px-3 py-1 border border-white/10">
            Épuisé
          </span>
        )}
        {product.stock > 0 && product.stock <= 3 && (
          <span className="bg-red-900/80 text-red-300 text-[8px] tracking-[0.3em] uppercase px-3 py-1">
            Plus que {product.stock}
          </span>
        )}
      </div>

      {/* Lien sur toute la card */}
      <Link href={`/produits/${product.slug}`} className="absolute inset-0 z-20 flex flex-col justify-end p-6">
        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <span className="product-tag">Chaussures</span>
          {/* Nom avec highlight si recherche */}
          <div className="font-display text-xl font-light text-brand-white mb-1 leading-tight">
            {query ? <HighlightText text={product.name} query={query} /> : product.name}
          </div>
          <p className="text-sm text-brand-gold-light">{formatPrice(product.price)}</p>

          {/* Description courte */}
          {product.description && (
            <p className="text-[10px] text-brand-gray/80 mt-2 leading-relaxed line-clamp-2
              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {product.description}
            </p>
          )}

          <span className="inline-block mt-3 text-[9px] tracking-[0.4em] uppercase text-brand-gold
            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Voir le produit →
          </span>
        </div>
      </Link>
    </div>
  )
}

// ── État vide ───────────────────────────────────────────────────────────────
function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
      {/* Icône chaussure stylisée */}
      <div className="w-20 h-20 rounded-full border border-brand-gold/20 flex items-center justify-center">
        <span className="text-4xl opacity-30">👟</span>
      </div>

      <div>
        <p className="font-display text-3xl font-light text-brand-gray mb-2">
          {query ? `Aucun résultat pour "${query}"` : 'Aucune chaussure disponible'}
        </p>
        <p className="text-[12px] text-brand-gray/60 tracking-wider">
          {query ? 'Essayez un autre terme ou modifiez vos filtres.' : 'La collection arrive bientôt.'}
        </p>
      </div>

      {query && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onReset} className="btn-gold">
            <span>Voir toutes les chaussures</span>
          </button>
          <Link href="/produits" className="px-8 py-4 border border-white/15 text-[10px]
            tracking-[0.35em] uppercase text-brand-gray hover:border-brand-gold hover:text-brand-gold transition-colors">
            Toute la collection
          </Link>
        </div>
      )}
    </div>
  )
}