'use client'
// src/app/admin/categories/page.tsx
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminNav from '@/components/admin/AdminNav'
import { Plus, Pencil, Trash2 } from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)
  const [deleting,   setDeleting]   = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/categories')
      const data = await res.json()
      setCategories(data ?? [])
    } catch { setCategories([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      await load()
    } finally { setDeleting(null) }
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-1">Admin</p>
            <h1 className="font-display text-3xl font-light text-brand-white">Catégories</h1>
          </div>
          <Link href="/admin/categories/nouvelle" className="btn-gold flex items-center gap-2">
            <Plus size={14} />
            <span>Nouvelle catégorie</span>
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 shimmer" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-3xl font-light text-brand-gray mb-4">Aucune catégorie</p>
            <Link href="/admin/categories/nouvelle" className="btn-gold inline-block mt-4">
              <span>Créer la première</span>
            </Link>
          </div>
        ) : (
          <div className="bg-brand-dark border border-white/5">
            {/* En-tête */}
            <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-6 py-4 border-b border-white/5">
              {['Nom', 'Slug', 'Produits', 'Actions'].map(h => (
                <p key={h} className="text-[9px] tracking-[0.4em] uppercase text-brand-gray">{h}</p>
              ))}
            </div>

            {/* Lignes */}
            {categories.map(cat => (
              <div key={cat.id}
                className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-6 py-5
                  border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors">
                <p className="text-[13px] text-brand-cream">{cat.name}</p>
                <p className="text-[11px] text-brand-gray font-mono">{cat.slug}</p>
                <span className={`text-[11px] px-2 py-1 text-center
                  ${cat._count.products > 0
                    ? 'bg-brand-gold/10 text-brand-gold'
                    : 'text-brand-gray'}`}>
                  {cat._count.products} produit{cat._count.products > 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/categories/${cat.id}/modifier`}
                    className="w-8 h-8 border border-white/10 flex items-center justify-center
                      text-brand-gray hover:border-brand-gold hover:text-brand-gold transition-all">
                    <Pencil size={12} />
                  </Link>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={deleting === cat.id || cat._count.products > 0}
                    className="w-8 h-8 border border-white/10 flex items-center justify-center
                      text-brand-gray hover:border-red-500 hover:text-red-400 transition-all
                      disabled:opacity-30 disabled:cursor-not-allowed"
                    title={cat._count.products > 0 ? 'Impossible : catégorie utilisée' : 'Supprimer'}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}