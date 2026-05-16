'use client'
// src/app/admin/login/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res  = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Identifiants incorrects')
      router.push('/admin')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="font-display text-4xl font-light tracking-[0.3em] text-brand-white mb-2">
            1<span className="text-brand-gold">2</span>3
          </div>
          <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gray">Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@123maison.com" autoComplete="email"
              className="w-full bg-transparent border border-white/15 px-4 py-3.5
                text-[13px] text-brand-cream placeholder:text-brand-gray/40
                focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
              Mot de passe
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password"
              className="w-full bg-transparent border border-white/15 px-4 py-3.5
                text-[13px] text-brand-cream placeholder:text-brand-gray/40
                focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-[11px] tracking-wider border border-red-400/20 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-3 mt-2"
          >
            <Lock size={14} strokeWidth={1.5} />
            <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}