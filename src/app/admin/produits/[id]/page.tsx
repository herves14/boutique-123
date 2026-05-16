'use client'
// src/app/admin/produits/[id]/page.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import ImageUploader from '@/components/admin/ImageUploader'

const SIZES_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

type Category = { id: string; name: string; slug: string }
type Product  = {
  id: string; name: string; slug: string; description: string | null
  price: number; stock: number; images: string[]; sizes: string[]
  isNew: boolean; isFeatured: boolean; categoryId: string
  category: Category; createdAt: string; updatedAt: string
}

export default function EditProduitPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product,    setProduct]    = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')
  const [stockHistory, setStockHistory] = useState<{ date: string; action: string; qty: number }[]>([])

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

  // Charger le produit
  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${params.id}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([prod, cats]) => {
      if (prod.error) { setError('Produit introuvable'); setLoading(false); return }
      setProduct(prod)
      setCategories(cats)
      setForm({
        name:        prod.name,
        description: prod.description ?? '',
        price:       String(prod.price),
        stock:       String(prod.stock),
        categoryId:  prod.categoryId,
        sizes:       prod.sizes ?? [],
        images:      prod.images ?? [],
        isNew:       prod.isNew,
        isFeatured:  prod.isFeatured,
      })
      setLoading(false)
    }).catch(() => { setError('Erreur chargement'); setLoading(false) })
  }, [params.id])

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const toggleSize = (s: string) =>
    setForm(f => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s] }))

  const toggleBool = (k: string) =>
    setForm(f => ({ ...f, [k]: !(f as any)[k] }))

  const stockNum    = Number(form.stock) || 0
  const origStock   = product?.stock ?? 0
  const stockDiff   = stockNum - origStock

  // Ajuster stock
  const adjustStock = (delta: number) =>
    setForm(f => ({ ...f, stock: String(Math.max(0, Number(f.stock) + delta)) }))

  // Sauvegarder
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim())          { setError('Le nom est requis.'); return }
    if (Number(form.price) <= 0)    { setError('Le prix est invalide.'); return }
    if (!form.categoryId)           { setError('Sélectionnez une catégorie.'); return }

    setError(''); setSaving(true)
    try {
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: stockNum }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur')
      setProduct(data)
      setSuccess('Produit mis à jour avec succès !')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  // Supprimer
  const handleDelete = async () => {
    if (!confirm(`Supprimer définitivement "${product?.name}" ?\nCette action est irréversible.`)) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/products/${params.id}`, { method: 'DELETE' })
      router.push('/admin/produits')
    } catch { setError('Erreur suppression') }
    finally { setDeleting(false) }
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border border-brand-gold/40 border-t-brand-gold rounded-full animate-spin" />
            <p className="text-[11px] tracking-widest uppercase text-brand-gray">Chargement...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="flex min-h-screen">
        <AdminNav />
        <main className="flex-1 flex items-center justify-center text-center">
          <div>
            <p className="font-display text-3xl font-light text-brand-gray mb-4">Produit introuvable</p>
            <Link href="/admin/produits" className="btn-gold"><span>Retour au catalogue</span></Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/produits" className="text-brand-gray hover:text-brand-gold transition-colors">
              ← Retour
            </Link>
            <div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-1">Édition produit</p>
              <h1 className="font-display text-3xl font-light text-brand-white truncate max-w-lg">
                {product?.name}
              </h1>
              <p className="text-[10px] text-brand-gray mt-1 font-mono">
                ID : {params.id.slice(-8).toUpperCase()} · Slug : /{product?.slug}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Voir sur le site */}
            <Link href={`/produits/${product?.slug}`} target="_blank"
              className="flex items-center gap-2 border border-white/15 px-4 py-2.5 text-[10px]
                tracking-[0.2em] uppercase text-brand-gray hover:border-brand-gold hover:text-brand-gold
                transition-colors">
              👁 Voir
            </Link>
            {/* Supprimer */}
            <button onClick={handleDelete} disabled={deleting}
              className="flex items-center gap-2 border border-red-800/40 px-4 py-2.5 text-[10px]
                tracking-[0.2em] uppercase text-red-400 hover:bg-red-900/20 transition-colors
                disabled:opacity-50">
              {deleting ? '...' : '🗑 Supprimer'}
            </button>
          </div>
        </div>

        {/* ── Notifications ── */}
        {success && (
          <div className="mb-6 border border-green-500/30 bg-green-900/15 px-6 py-4 flex items-center gap-3">
            <span className="text-green-400 text-lg">✓</span>
            <p className="text-green-400 text-[13px] tracking-wider">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-6 border border-red-400/20 bg-red-900/10 px-6 py-4">
            <p className="text-red-400 text-[12px]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

            {/* ══ COLONNE PRINCIPALE ══ */}
            <div className="space-y-6">

              {/* Infos de base */}
              <div className="bg-brand-dark border border-white/5 p-7">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">
                  Informations produit
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
                      Nom du produit *
                    </label>
                    <input type="text" value={form.name} onChange={setField('name')}
                      className="w-full bg-transparent border border-white/15 px-4 py-3 text-[13px]
                        text-brand-cream focus:outline-none focus:border-brand-gold transition-colors" />
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

              {/* Stock — section dédiée avec historique */}
              <div className="bg-brand-dark border border-white/5 p-7">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold">
                    Gestion du Stock
                  </p>
                  <div className={`flex items-center gap-2 text-[11px] font-medium px-3 py-1.5 border ${
                    stockNum === 0
                      ? 'border-red-800/40 bg-red-900/10 text-red-400'
                      : stockNum <= 3
                        ? 'border-yellow-800/40 bg-yellow-900/10 text-yellow-400'
                        : 'border-green-800/40 bg-green-900/10 text-green-400'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {stockNum === 0 ? 'Rupture' : stockNum <= 3 ? 'Stock faible' : 'En stock'}
                  </div>
                </div>

                {/* Compteur visuel */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-0 border border-white/20">
                    <button type="button" onClick={() => adjustStock(-10)}
                      className="w-11 h-14 flex items-center justify-center text-brand-gray
                        hover:bg-red-900/20 hover:text-red-400 transition-all text-lg border-r border-white/10">
                      −10
                    </button>
                    <button type="button" onClick={() => adjustStock(-1)}
                      className="w-10 h-14 flex items-center justify-center text-brand-gray
                        hover:bg-red-900/20 hover:text-red-400 transition-all text-xl border-r border-white/10">
                      −
                    </button>
                    <div className="px-6 h-14 flex items-center justify-center min-w-[80px]">
                      <input
                        type="number" min="0" value={form.stock}
                        onChange={setField('stock')}
                        className="w-16 text-center bg-transparent text-[22px] font-display font-light
                          text-brand-cream focus:outline-none"
                      />
                    </div>
                    <button type="button" onClick={() => adjustStock(1)}
                      className="w-10 h-14 flex items-center justify-center text-brand-gray
                        hover:bg-green-900/20 hover:text-green-400 transition-all text-xl border-l border-white/10">
                      +
                    </button>
                    <button type="button" onClick={() => adjustStock(10)}
                      className="w-11 h-14 flex items-center justify-center text-brand-gray
                        hover:bg-green-900/20 hover:text-green-400 transition-all text-lg border-l border-white/10">
                      +10
                    </button>
                  </div>

                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-brand-gray">unités</p>
                    {stockDiff !== 0 && (
                      <p className={`text-[12px] mt-1 font-medium ${stockDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stockDiff > 0 ? `+${stockDiff}` : stockDiff} vs actuel ({origStock})
                      </p>
                    )}
                  </div>
                </div>

                {/* Boutons preset */}
                <div className="space-y-3">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray">
                    Quantités rapides
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[5, 10, 20, 30, 50, 100].map(n => (
                      <button key={n} type="button"
                        onClick={() => setForm(f => ({ ...f, stock: String(n) }))}
                        className={`px-4 py-2 border text-[10px] tracking-wider transition-all
                          ${stockNum === n
                            ? 'border-brand-gold bg-brand-gold text-brand-black'
                            : 'border-white/10 text-brand-gray hover:border-brand-gold hover:text-brand-gold'}`}>
                        {n} unités
                      </button>
                    ))}
                    <button type="button"
                      onClick={() => setForm(f => ({ ...f, stock: '0' }))}
                      className="px-4 py-2 border border-red-800/30 text-[10px] tracking-wider
                        text-red-400/70 hover:border-red-500 hover:text-red-400 transition-all">
                      Rupture (0)
                    </button>
                  </div>
                </div>

                {/* Info décrémentation auto */}
                <div className="mt-5 border border-brand-gold/10 bg-brand-gold/5 p-4">
                  <p className="text-[11px] text-brand-gold mb-1">⚡ Décrémentation automatique</p>
                  <p className="text-[11px] text-brand-gray leading-relaxed">
                    Le stock se décrémente automatiquement à chaque commande validée.
                    Si le stock atteint <strong className="text-brand-cream">0</strong>, le bouton
                    "Ajouter au panier" est désactivé côté client et un message
                    <span className="text-red-400"> "Rupture de stock"</span> s&apos;affiche.
                  </p>
                </div>
              </div>

              {/* Prix */}
              <div className="bg-brand-dark border border-white/5 p-7">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">Prix</p>
                <div className="relative max-w-xs">
                  <input type="number" min="0" value={form.price} onChange={setField('price')}
                    className="w-full bg-transparent border border-white/15 px-4 py-3 pr-16
                      text-[20px] font-display font-light text-brand-cream focus:outline-none
                      focus:border-brand-gold transition-colors" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-brand-gray">
                    FCFA
                  </span>
                </div>
                {Number(form.price) > 0 && (
                  <p className="text-[13px] text-brand-gold mt-3">
                    {Number(form.price).toLocaleString('fr-FR')} FCFA
                  </p>
                )}
              </div>
            </div>

            {/* ══ COLONNE LATÉRALE ══ */}
            <div className="space-y-5">

              {/* Statut stock client */}
              <div className={`border p-6 ${
                stockNum === 0 ? 'border-red-800/40 bg-red-900/10'
                  : stockNum <= 3 ? 'border-yellow-800/40 bg-yellow-900/10'
                  : 'border-green-800/40 bg-green-900/10'}`}>
                <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray mb-3">
                  Affichage côté client
                </p>
                {stockNum === 0 ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🚫</span>
                      <span className="text-red-400 font-medium">Rupture de stock</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-brand-gray">
                      <li>• Badge "Épuisé" sur la card</li>
                      <li>• Bouton panier désactivé</li>
                      <li>• Message d&apos;erreur si tentative d&apos;achat</li>
                      <li>• Commande refusée par l&apos;API</li>
                    </ul>
                  </>
                ) : stockNum <= 3 ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">⚡</span>
                      <span className="text-yellow-400 font-medium">Plus que {stockNum} !</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-brand-gray">
                      <li>• Badge rouge "Plus que {stockNum}" affiché</li>
                      <li>• Achat encore autorisé</li>
                      <li>• Urgence visible pour le client</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">✅</span>
                      <span className="text-green-400 font-medium">En stock ({stockNum})</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-brand-gray">
                      <li>• Achat autorisé normalement</li>
                      <li>• Bouton panier actif</li>
                      <li>• Stock décrémenté à chaque vente</li>
                    </ul>
                  </>
                )}
              </div>

              {/* Catégorie */}
              <div className="bg-brand-dark border border-white/5 p-6">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-4">Catégorie *</p>
                <select value={form.categoryId} onChange={setField('categoryId')}
                  className="w-full bg-brand-dark2 border border-white/15 px-4 py-3 text-[13px]
                    text-brand-cream focus:outline-none focus:border-brand-gold transition-colors cursor-pointer">
                  <option value="">Sélectionner...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-brand-dark">{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Tailles */}
              <div className="bg-brand-dark border border-white/5 p-6">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-4">Tailles</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES_OPTIONS.map(s => (
                    <button key={s} type="button" onClick={() => toggleSize(s)}
                      className={`w-12 h-12 border text-[11px] tracking-wider transition-all
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

              {/* Affichage */}
              <div className="bg-brand-dark border border-white/5 p-6">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-4">Affichage</p>
                <div className="space-y-3">
                  {[
                    { key: 'isNew',      label: 'Badge "Nouveau"',  desc: 'Badge doré sur la card' },
                    { key: 'isFeatured', label: 'Produit Vedette',  desc: 'Mis en avant sur l\'accueil' },
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

              {/* Métadonnées */}
              <div className="bg-brand-dark border border-white/5 p-6">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-4">Informations</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'ID',         value: params.id.slice(-8).toUpperCase() },
                    { label: 'Slug',       value: `/${product?.slug}` },
                    { label: 'Créé le',    value: product?.createdAt ? new Date(product.createdAt).toLocaleDateString('fr-FR') : '—' },
                    { label: 'Modifié le', value: product?.updatedAt ? new Date(product.updatedAt).toLocaleDateString('fr-FR') : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-[11px]">
                      <span className="text-brand-gray tracking-wider">{label}</span>
                      <span className="text-brand-cream font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton sauvegarde */}
              <button type="submit" disabled={saving}
                className="btn-gold w-full flex items-center justify-center gap-3 py-4 disabled:opacity-60">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
                    <span>Sauvegarde...</span>
                  </>
                ) : (
                  <span>💾 Sauvegarder les modifications</span>
                )}
              </button>

              {/* Sauvegarder et voir */}
              <button type="button" disabled={saving}
                onClick={async (e) => {
                  await handleSave(e as any)
                  if (!error) window.open(`/produits/${product?.slug}`, '_blank')
                }}
                className="w-full py-3 border border-white/15 text-[10px] tracking-[0.3em] uppercase
                  text-brand-gray hover:border-brand-gold hover:text-brand-gold transition-colors
                  disabled:opacity-40">
                Sauvegarder & Voir le produit
              </button>

              <Link href="/admin/produits"
                className="block text-center text-[10px] tracking-[0.3em] uppercase text-brand-gray
                  hover:text-brand-gold transition-colors py-2">
                Annuler
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}