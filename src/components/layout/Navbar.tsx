'use client'
// src/components/layout/Navbar.tsx
import Link from 'next/link'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Search, Menu, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-store'
import CartDrawer from './CartDrawer'
import { formatPrice } from '@/lib/utils'

const navLinks = [
  { label: 'Femme',       href: '/categorie/vetements' },
  { label: 'Jeans',       href: '/categorie/jeans' },
  { label: 'Chaussures',  href: '/categorie/chaussures' },
  { label: 'Accessoires', href: '/categorie/accessoires' },
  { label: 'Nouveautés',  href: '/produits?new=true' },
]

type SearchResult = {
  id: string; name: string; slug: string; price: number
  images: string[]; category: { name: string; slug: string }
}

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [mounted,      setMounted]      = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [query,        setQuery]        = useState('')
  const [results,      setResults]      = useState<SearchResult[]>([])
  const [searching,    setSearching]    = useState(false)
  const [activeIdx,    setActiveIdx]    = useState(-1)
  const inputRef  = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const { openCart, totalItems } = useCart()

  useEffect(() => {
    setMounted(true)
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Focus automatique à l'ouverture
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100)
    else { setQuery(''); setResults([]); setActiveIdx(-1) }
  }, [searchOpen])

  // Fermer avec Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Recherche avec debounce 300ms
  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) { setResults([]); return }
    setSearching(true)
    try {
      const res  = await fetch(`/api/products?sort=newest&limit=6&search=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.items ?? [])
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  const handleQueryChange = (val: string) => {
    setQuery(val)
    setActiveIdx(-1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 300)
  }

  // Navigation clavier dans les résultats
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0 && results[activeIdx]) {
        router.push(`/produits/${results[activeIdx].slug}`)
        setSearchOpen(false)
      } else if (query.trim()) {
        router.push(`/produits?search=${encodeURIComponent(query)}`)
        setSearchOpen(false)
      }
    }
  }

  const count = mounted ? totalItems() : 0

  return (
    <>
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled ? 'py-3' : 'py-5'}`}
      >
        <div className={`mx-4 lg:mx-8 flex items-center justify-between px-6 lg:px-8
          transition-all duration-500 rounded-2xl
          ${scrolled
            ? 'bg-black/80 backdrop-blur-xl border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
          }`}
          style={{ paddingTop: scrolled ? '12px' : '0', paddingBottom: scrolled ? '12px' : '0' }}
        >
          {/* Logo */}
          <Link href="/"
            className="font-display text-2xl font-light tracking-[0.3em] text-brand-white
              hover:text-brand-gold transition-colors flex-shrink-0">
            1<span className="text-brand-gold">2</span>3
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/8
            bg-black/30 backdrop-blur-md px-2 py-1.5">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className="px-4 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase
                  text-brand-gray hover:text-brand-white hover:bg-white/8 transition-all duration-200">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Bouton search */}
            <button
              onClick={() => setSearchOpen(v => !v)}
              className={`w-9 h-9 rounded-full border flex items-center justify-center
                transition-all backdrop-blur-sm
                ${searchOpen
                  ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                  : 'border-white/10 text-brand-gray hover:text-brand-gold hover:border-brand-gold/40'}`}
              aria-label="Rechercher"
            >
              {searchOpen ? <X size={15} strokeWidth={1.5} /> : <Search size={15} strokeWidth={1.5} />}
            </button>

            <button
              onClick={openCart}
              className="relative w-9 h-9 rounded-full border border-white/10 flex items-center
                justify-center text-brand-gray hover:text-brand-gold hover:border-brand-gold/40
                transition-all backdrop-blur-sm"
              aria-label="Panier"
            >
              <ShoppingBag size={15} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold text-brand-black
                  text-[9px] font-bold flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </button>

            <button
              className="lg:hidden w-9 h-9 rounded-full border border-white/10 flex items-center
                justify-center text-brand-gray hover:text-brand-gold hover:border-brand-gold/40 transition-all"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={15} strokeWidth={1.5} /> : <Menu size={15} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Barre de recherche ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-40 pt-20 px-4 lg:px-8"
          >
            <div className="max-w-2xl mx-auto">
              {/* Input */}
              <div className="relative rounded-2xl border border-white/15
                bg-black/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                overflow-hidden">

                <div className="flex items-center gap-4 px-5 py-4">
                  <Search size={18} strokeWidth={1.5} className="text-brand-gold flex-shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => handleQueryChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Rechercher un produit, une catégorie..."
                    className="flex-1 bg-transparent text-[14px] text-brand-cream
                      placeholder:text-brand-gray/50 focus:outline-none tracking-wide"
                  />
                  {searching && (
                    <div className="w-4 h-4 rounded-full border-2 border-brand-gold/30
                      border-t-brand-gold animate-spin flex-shrink-0" />
                  )}
                  {query && !searching && (
                    <button onClick={() => handleQueryChange('')}
                      className="text-brand-gray hover:text-brand-cream transition-colors flex-shrink-0">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Résultats */}
                <AnimatePresence>
                  {(results.length > 0 || (query.length >= 2 && !searching)) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/8"
                    >
                      {results.length > 0 ? (
                        <>
                          <div className="px-5 py-3">
                            <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray">
                              {results.length} résultat{results.length > 1 ? 's' : ''}
                            </p>
                          </div>
                          {results.map((r, i) => (
                            <Link
                              key={r.id}
                              href={`/produits/${r.slug}`}
                              onClick={() => setSearchOpen(false)}
                              className={`flex items-center gap-4 px-5 py-3 transition-colors
                                ${activeIdx === i ? 'bg-white/8' : 'hover:bg-white/5'}`}
                            >
                              {/* Miniature */}
                              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0
                                bg-white/5 border border-white/8">
                                {r.images[0] ? (
                                  <img src={r.images[0]} alt={r.name}
                                    className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Search size={14} className="text-brand-gray" />
                                  </div>
                                )}
                              </div>

                              {/* Infos */}
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-brand-cream truncate">{r.name}</p>
                                <p className="text-[10px] text-brand-gray tracking-wider">
                                  {r.category.name}
                                </p>
                              </div>

                              {/* Prix */}
                              <p className="text-[13px] text-brand-gold flex-shrink-0">
                                {formatPrice(r.price)}
                              </p>

                              <ArrowRight size={13} className="text-brand-gray flex-shrink-0" />
                            </Link>
                          ))}

                          {/* Voir tous les résultats */}
                          <Link
                            href={`/produits?search=${encodeURIComponent(query)}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center justify-center gap-2 px-5 py-4
                              border-t border-white/8 text-[10px] tracking-[0.3em] uppercase
                              text-brand-gold hover:bg-white/5 transition-colors group"
                          >
                            Voir tous les résultats
                            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                          </Link>
                        </>
                      ) : (
                        <div className="px-5 py-8 text-center">
                          <p className="text-[13px] text-brand-gray">
                            Aucun résultat pour <span className="text-brand-cream">"{query}"</span>
                          </p>
                          <p className="text-[11px] text-brand-gray/60 mt-1 tracking-wider">
                            Essayez un autre terme
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Suggestions rapides si query vide */}
                {!query && (
                  <div className="border-t border-white/8 px-5 py-4">
                    <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray mb-3">
                      Recherches populaires
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Robes', 'Jeans', 'Chaussures', 'Nouveautés', 'Manteaux'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleQueryChange(tag)}
                          className="rounded-full px-3 py-1.5 text-[10px] tracking-wider
                            border border-white/10 text-brand-gray hover:border-brand-gold/40
                            hover:text-brand-gold transition-all"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Backdrop cliquable pour fermer */}
            <div
              className="fixed inset-0 -z-10"
              onClick={() => setSearchOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Menu mobile ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative z-10 flex flex-col items-center justify-center h-full gap-2"
            >
              {navLinks.map((l, i) => (
                <motion.div key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <Link href={l.href} onClick={() => setMobileOpen(false)}
                    className="block font-display text-4xl font-light text-brand-white
                      hover:text-brand-gold transition-colors text-center py-3">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="mt-8 flex gap-4">
                <button
                  onClick={() => { setSearchOpen(true); setMobileOpen(false) }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                    border border-white/20 text-brand-cream text-[10px] tracking-[0.3em] uppercase"
                >
                  <Search size={14} /> Rechercher
                </button>
                <button
                  onClick={() => { openCart(); setMobileOpen(false) }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                    bg-brand-gold text-brand-black text-[10px] font-medium tracking-[0.35em] uppercase"
                >
                  <ShoppingBag size={14} />
                  Panier {count > 0 && `(${count})`}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  )
}