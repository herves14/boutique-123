'use client'
// src/app/admin/newsletter/page.tsx
import { useState, useEffect } from 'react'
import AdminNav from '@/components/admin/AdminNav'
import { Trash2, Download } from 'lucide-react'

type Subscriber = { id: string; email: string; createdAt: string }

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [total,       setTotal]       = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [deleting,    setDeleting]    = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/newsletter')
      const data = await res.json()
      setSubscribers(data.subscribers ?? [])
      setTotal(data.total ?? 0)
    } catch { setSubscribers([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (email: string) => {
    if (!confirm(`Désinscrire ${email} ?`)) return
    setDeleting(email)
    try {
      await fetch('/api/newsletter', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      await load()
    } finally { setDeleting(null) }
  }

  const exportCSV = () => {
    const rows = ['Email,Date inscription', ...subscribers.map(s =>
      `${s.email},${new Date(s.createdAt).toLocaleDateString('fr-FR')}`
    )]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'newsletter.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-1">Admin</p>
            <h1 className="font-display text-3xl font-light text-brand-white">Newsletter</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-display text-2xl font-light text-brand-gold">{total}</p>
              <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray">inscrits</p>
            </div>
            {subscribers.length > 0 && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 border border-white/15 px-4 py-2.5
                  text-[11px] tracking-[0.2em] uppercase text-brand-gray
                  hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                <Download size={13} />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 shimmer" />
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-display text-3xl font-light text-brand-gray mb-2">Aucun inscrit</p>
            <p className="text-[11px] tracking-widest text-brand-gray uppercase">
              Les inscriptions apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="bg-brand-dark border border-white/5">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 border-b border-white/5">
              {['Email', 'Date', ''].map((h, i) => (
                <p key={i} className="text-[9px] tracking-[0.4em] uppercase text-brand-gray">{h}</p>
              ))}
            </div>
            {subscribers.map(sub => (
              <div key={sub.id}
                className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4
                  border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors">
                <p className="text-[13px] text-brand-cream">{sub.email}</p>
                <p className="text-[11px] text-brand-gray">
                  {new Date(sub.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </p>
                <button
                  onClick={() => handleDelete(sub.email)}
                  disabled={deleting === sub.email}
                  className="w-8 h-8 border border-white/10 flex items-center justify-center
                    text-brand-gray hover:border-red-500 hover:text-red-400 transition-all
                    disabled:opacity-30"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}