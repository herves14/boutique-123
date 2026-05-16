'use client'
// src/app/admin/categories/nouvelle/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'

// Tailles vêtements
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// Tailles chaussures (EU)
const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

// Slugs qui déclenchent les tailles chaussures
const SHOE_SLUGS = ['chaussures', 'shoes', 'sneakers', 'sandales', 'boots']

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NouvelleCategorePage() {
  const router = useRouter()
  const [name,         setName]         = useState('')
  const [slug,         setSlug]         = useState('')
  const [slugManual,   setSlugManual]   = useState(false)
  const [defaultSizes, setDefaultSizes] = useState<string[]>([])
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')

  const isShoeCategory = SHOE_SLUGS.some(s => slug.includes(s))
  const sizeOptions    = isShoeCategory ? SHOE_SIZES : CLOTHING_SIZES

  const handleNameChange = (val: string) => {
    setName(val)
    if (!slugManual) setSlug(slugify(val))
  }

  const handleSlugChange = (val: string) => {
    setSlug(val)
    setSlugManual(true)
    // Reset tailles si le slug change de type
    setDefaultSizes([])
  }

  const toggleSize = (s: string) =>
    setDefaultSizes(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Le nom est requis.'); return }
    if (!slug.trim())  { setError('Le slug est requis.'); return }

    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim(), slug: slug.trim(), defaultSizes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur')
      router.push('/admin/categories')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/admin/categories" className="text-brand-gray hover:text-brand-gold transition-colors">
            ← Retour
          </Link>
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-1">Catégories</p>
            <h1 className="font-display text-3xl font-light text-brand-white">Nouvelle Catégorie</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">

          {/* Nom */}
          <div className="bg-brand-dark border border-white/5 p-7">
            <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">Informations</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Ex: Chaussures"
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-[13px]
                    text-brand-cream placeholder:text-brand-gray/40 focus:outline-none
                    focus:border-brand-gold transition-colors"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={e => handleSlugChange(e.target.value)}
                  placeholder="ex: chaussures"
                  className="w-full bg-transparent border border-white/15 px-4 py-3 text-[13px]
                    text-brand-cream font-mono placeholder:text-brand-gray/40 focus:outline-none
                    focus:border-brand-gold transition-colors"
                />
                <p className="text-[10px] text-brand-gray/60 mt-1.5">
                  Utilisé dans les URLs — généré automatiquement depuis le nom
                </p>
              </div>
            </div>
          </div>

          {/* Tailles par défaut */}
          <div className="bg-brand-dark border border-white/5 p-7">
            <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-2">
              Tailles disponibles par défaut
            </p>
            <p className="text-[10px] text-brand-gray mb-5">
              {isShoeCategory
                ? 'Tailles pointures (EU) détectées pour cette catégorie'
                : 'Tailles vêtements — laisser vide si sans taille'}
            </p>

            <div className="flex flex-wrap gap-2">
              {sizeOptions.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`h-10 px-3 border text-[11px] tracking-wider transition-all
                    ${defaultSizes.includes(s)
                      ? 'border-brand-gold bg-brand-gold text-brand-black font-medium'
                      : 'border-white/20 text-brand-gray hover:border-brand-gold hover:text-brand-cream'}`}
                >
                  {isShoeCategory ? s : s}
                </button>
              ))}
            </div>

            {defaultSizes.length > 0 && (
              <p className="text-[10px] text-brand-gold mt-3">
                Sélectionnées : {defaultSizes.join(' · ')}
              </p>
            )}
          </div>

          {/* Erreur */}
          {error && (
            <div className="border border-red-400/20 bg-red-900/10 px-5 py-4">
              <p className="text-red-400 text-[12px]">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-3 py-4 disabled:opacity-60"
          >
            <span>{loading ? 'Création...' : 'Créer la catégorie'}</span>
          </button>

          <Link href="/admin/categories"
            className="block text-center text-[10px] tracking-[0.3em] uppercase text-brand-gray
              hover:text-brand-gold transition-colors py-3">
            Annuler
          </Link>
        </form>
      </main>
    </div>
  )
}