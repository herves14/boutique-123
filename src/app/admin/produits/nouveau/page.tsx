'use client'
// src/app/admin/produits/nouveau/page.tsx
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import ImageUploader from '@/components/admin/ImageUploader'

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SHOE_SIZES     = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
const SHOE_SLUGS     = ['chaussures', 'shoes', 'sneakers', 'sandales', 'boots']

type Category = { id: string; name: string; slug: string }

export default function NouveauProduitPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState(false)

  const [form, setForm] = useState({
    name:        '',
    description: '',
    price:       '',
    stock:       '0',
    categoryId:  '',
    sizes:       [] as string[],
    images:      [] as string[],
    isNew:       false,
    isFeatured:  false,
  })

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  // Catégorie sélectionnée
  const selectedCategory = categories.find(c => c.id === form.categoryId)

  // Tailles selon la catégorie — chaussures ou vêtements
  const sizeOptions = useMemo(() => {
    if (!selectedCategory) return CLOTHING_SIZES
    const isShoe = SHOE_SLUGS.some(s => selectedCategory.slug.includes(s))
    return isShoe ? SHOE_SIZES : CLOTHING_SIZES
  }, [selectedCategory])

  const isShoeCategory = SHOE_SLUGS.some(s => selectedCategory?.slug.includes(s) ?? false)

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  // Quand la catégorie change, reset les tailles (évite mélange pointures/vêtements)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm(f => ({ ...f, categoryId: e.target.value, sizes: [] }))
  }

  const toggleSize = (s: string) =>
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s]
    }))

  const toggleBool = (k: string) =>
    setForm(f => ({ ...f, [k]: !(f as any)[k] }))

  const stockNum = Number(form.stock) || 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim())                      { setError('Le nom est requis.'); return }
    if (!form.price || Number(form.price) <= 0) { setError('Le prix doit être supérieur à 0.'); return }
    if (!form.categoryId)                       { setError('Sélectionnez une catégorie.'); return }

    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/admin/produits', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: stockNum }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur')
      setSuccess(true)
      setTimeout(() => router.push('/admin/produits'), 1500)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  if (success) {
    return (
      <div className="flex min-h-screen">
        <AdminNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-brand-gold/10 border border-brand-gold/30
              flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
            <p className="font-display text-3xl font-light text-brand-white mb-2">Produit créé !</p>
            <p className="text-brand-gray text-sm tracking-wider">Redirection vers le catalogue...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/admin/produits" className="text-brand-gray hover:text-brand-gold transition-colors">
            ← Retour
          </Link>
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-1">Catalogue</p>
            <h1 className="font-display text-3xl font-light text-brand-white">Nouveau Produit</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

            {/* ══ COLONNE PRINCIPALE ══ */}
            <div className="space-y-6">

              {/* Infos de base */}
              <div className="bg-brand-dark border border-white/5 p-7">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">Informations produit</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
                      Nom du produit *
                    </label>
                    <input type="text" value={form.name} onChange={setField('name')}
                      placeholder="Ex: Robe Couture Ivoire Soie"
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-[13px]
                        text-brand-cream placeholder:text-brand-gray/40 focus:outline-none
                        focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
                      Description
                    </label>
                    <textarea rows={4} value={form.description} onChange={setField('description')}
                      placeholder="Matières, coupe, finitions, style..."
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-[13px]
                        text-brand-cream placeholder:text-brand-gray/40 focus:outline-none
                        focus:border-brand-gold transition-colors resize-none" />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-brand-dark border border-white/5 p-7">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">
                  Photos du produit
                </p>
                <ImageUploader
                  images={form.images}
                  onChange={imgs => setForm(f => ({ ...f, images: imgs }))}
                  maxImages={8}
                />
              </div>

              {/* Prix & Stock */}
              <div className="bg-brand-dark border border-white/5 p-7">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">Prix & Stock</p>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
                      Prix (FCFA) *
                    </label>
                    <div className="relative">
                      <input type="number" min="0" value={form.price} onChange={setField('price')}
                        placeholder="89000"
                        className="w-full bg-transparent border border-white/15 px-4 py-3 pr-16
                          text-[13px] text-brand-cream placeholder:text-brand-gray/40
                          focus:outline-none focus:border-brand-gold transition-colors" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-brand-gray">
                        FCFA
                      </span>
                    </div>
                    {Number(form.price) > 0 && (
                      <p className="text-[11px] text-brand-gold mt-1.5">
                        {Number(form.price).toLocaleString('fr-FR')} FCFA
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
                      Stock disponible *
                    </label>
                    <div className="relative">
                      <input type="number" min="0" value={form.stock} onChange={setField('stock')}
                        className="w-full bg-transparent border border-white/15 px-4 py-3 pr-16
                          text-[13px] text-brand-cream placeholder:text-brand-gray/40
                          focus:outline-none focus:border-brand-gold transition-colors" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-brand-gray">
                        unités
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1.5 flex items-center gap-1.5 ${
                      stockNum === 0 ? 'text-red-400' : stockNum <= 3 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {stockNum === 0 ? 'Rupture de stock — achat bloqué'
                        : stockNum <= 3 ? 'Stock faible — alerte affichée'
                        : `En stock — achat autorisé`}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray mb-2">
                    Ajustement rapide du stock
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 5, 10, 20, 50, 100].map(n => (
                      <button key={n} type="button"
                        onClick={() => setForm(f => ({ ...f, stock: String(Math.max(0, Number(f.stock) + n)) }))}
                        className="px-3 py-1.5 border border-white/10 text-[10px] text-brand-gray
                          hover:border-green-500/50 hover:text-green-400 transition-colors">
                        +{n}
                      </button>
                    ))}
                    <div className="h-6 w-px bg-white/10 self-center mx-1" />
                    <button type="button"
                      onClick={() => setForm(f => ({ ...f, stock: String(Math.max(0, Number(f.stock) - 1)) }))}
                      className="px-3 py-1.5 border border-white/10 text-[10px] text-brand-gray
                        hover:border-red-500/50 hover:text-red-400 transition-colors">
                      -1
                    </button>
                    <button type="button"
                      onClick={() => setForm(f => ({ ...f, stock: '0' }))}
                      className="px-3 py-1.5 border border-red-800/30 text-[10px] text-red-400/70
                        hover:border-red-500 hover:text-red-400 transition-colors">
                      Rupture
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ══ COLONNE LATÉRALE ══ */}
            <div className="space-y-5">

              {/* Catégorie */}
              <div className="bg-brand-dark border border-white/5 p-6">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-4">Catégorie *</p>
                <select
                  value={form.categoryId}
                  onChange={handleCategoryChange}
                  className="w-full bg-brand-dark2 border border-white/15 px-4 py-3 text-[13px]
                    text-brand-cream focus:outline-none focus:border-brand-gold transition-colors cursor-pointer">
                  <option value="" className="bg-brand-dark">Sélectionner...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-brand-dark">{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Tailles — dynamiques selon catégorie */}
              <div className="bg-brand-dark border border-white/5 p-6">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-2">Tailles disponibles</p>
                <p className="text-[10px] text-brand-gray mb-4">
                  {!selectedCategory
                    ? 'Sélectionnez une catégorie d\'abord'
                    : isShoeCategory
                      ? 'Pointures (EU) — catégorie chaussures détectée'
                      : 'Laisser vide pour les produits sans taille'}
                </p>

                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(s => (
                    <button key={s} type="button" onClick={() => toggleSize(s)}
                      className={`border text-[11px] tracking-wider transition-all
                        ${isShoeCategory ? 'px-3 h-10' : 'w-12 h-12'}
                        ${form.sizes.includes(s)
                          ? 'border-brand-gold bg-brand-gold text-brand-black font-medium'
                          : 'border-white/20 text-brand-gray hover:border-brand-gold hover:text-brand-cream'}`}>
                      {s}
                    </button>
                  ))}
                </div>

                {form.sizes.length > 0 && (
                  <p className="text-[10px] text-brand-gold mt-3">{form.sizes.join(' · ')}</p>
                )}
              </div>

              {/* Visibilité */}
              <div className="bg-brand-dark border border-white/5 p-6">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-4">Affichage</p>
                <div className="space-y-3">
                  {[
                    { key: 'isNew',      label: 'Badge "Nouveau"',  desc: 'Badge doré sur la card produit' },
                    { key: 'isFeatured', label: 'Produit Vedette',  desc: "Mis en avant sur l'accueil" },
                  ].map(({ key, label, desc }) => (
                    <label key={key} className="flex items-start gap-3 cursor-pointer group p-2
                      border border-transparent hover:border-white/8 transition-colors">
                      <div onClick={() => toggleBool(key)}
                        className={`w-5 h-5 flex-shrink-0 border flex items-center justify-center
                          mt-0.5 transition-all cursor-pointer
                          ${(form as any)[key] ? 'bg-brand-gold border-brand-gold' : 'border-white/20'}`}>
                        {(form as any)[key] && <span className="text-brand-black text-[10px] font-bold">✓</span>}
                      </div>
                      <div>
                        <p className="text-[12px] text-brand-cream">{label}</p>
                        <p className="text-[10px] text-brand-gray">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Statut stock visuel */}
              <div className={`border p-5 transition-colors ${
                stockNum === 0 ? 'border-red-800/40 bg-red-900/10' :
                stockNum <= 3  ? 'border-yellow-800/40 bg-yellow-900/10' :
                'border-green-800/40 bg-green-900/10'}`}>
                <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray mb-2">
                  Vue client — stock
                </p>
                {stockNum === 0 ? (
                  <div>
                    <p className="text-red-400 font-medium text-sm mb-1">🚫 Épuisé</p>
                    <p className="text-[11px] text-brand-gray">Le bouton "Ajouter au panier" sera désactivé</p>
                  </div>
                ) : stockNum <= 3 ? (
                  <div>
                    <p className="text-yellow-400 font-medium text-sm mb-1">⚡ Plus que {stockNum} disponible{stockNum > 1 ? 's' : ''}</p>
                    <p className="text-[11px] text-brand-gray">Alerte rouge sur la fiche produit</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-green-400 font-medium text-sm mb-1">✓ En stock ({stockNum})</p>
                    <p className="text-[11px] text-brand-gray">Achat autorisé normalement</p>
                  </div>
                )}
              </div>

              {/* Erreur */}
              {error && (
                <div className="border border-red-400/20 bg-red-900/10 px-5 py-4">
                  <p className="text-red-400 text-[12px]">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-3 py-4 disabled:opacity-60">
                <span>{loading ? 'Création...' : 'Créer le produit'}</span>
              </button>

              <Link href="/admin/produits"
                className="block text-center text-[10px] tracking-[0.3em] uppercase text-brand-gray
                  hover:text-brand-gold transition-colors py-3">
                Annuler
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}