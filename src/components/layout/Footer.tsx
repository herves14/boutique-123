'use client'
// src/components/layout/Footer.tsx
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const links = {
  Collection: [
    { label: 'Femme',       href: '/categorie/vetements' },
    { label: 'Jeans',       href: '/categorie/jeans' },
    { label: 'Chaussures',  href: '/categorie/chaussures' },
    { label: 'Accessoires', href: '/categorie/accessoires' },
    { label: 'Nouveautés',  href: '/produits?new=true' },
  ],
  Maison: [
    { label: 'Notre Histoire', href: '/histoire' },
    { label: "L'Atelier",     href: '/atelier' },
    { label: 'Artisans',      href: '/artisans' },
    { label: 'Presse',        href: '/presse' },
  ],
  Service: [
    { label: 'Livraison',         href: '/livraison' },
    { label: 'Retours',           href: '/retours' },
    { label: 'Guide des Tailles', href: '/tailles' },
    { label: 'Contact',           href: '/contact' },
    { label: 'FAQ',               href: '/faq' },
  ],
}

export default function Footer() {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleNewsletter = async () => {
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res  = await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setMessage(data.error ?? 'Erreur')
      } else {
        setStatus('success')
        setMessage('Inscription confirmée ✓')
        setEmail('')
      }
    } catch {
      setStatus('error')
      setMessage('Erreur réseau')
    }
  }

  return (
    <footer className="relative bg-[oklch(0.10_0.02_270)] border-t border-white/5 overflow-hidden">

      {/* Glow ambiant */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #C9A84C, transparent)' }} />

      <div className="max-w-7xl mx-auto px-10 lg:px-16 pt-20 pb-10">

        {/* ── Newsletter card glass ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border border-white/8 bg-[oklch(0.16_0.02_270)]
            backdrop-blur-xl p-8 lg:p-10 mb-20
            shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-3">Newsletter</p>
              <p className="font-display text-2xl lg:text-3xl font-light text-brand-white">
                Restez au cœur de la <em className="italic text-brand-gold">Maison</em>
              </p>
              <p className="mt-2 text-[12px] text-brand-gray tracking-wider">
                Nouveautés, offres exclusives, coulisses de l&apos;atelier.
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full lg:w-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setStatus('idle'); setMessage('') }}
                  onKeyDown={e => e.key === 'Enter' && handleNewsletter()}
                  placeholder="votre@email.com"
                  disabled={status === 'loading' || status === 'success'}
                  className="flex-1 lg:w-64 rounded-full bg-white/5 border border-white/15
                    px-5 py-3 text-[11px] tracking-widest text-brand-cream
                    placeholder:text-brand-gray focus:outline-none focus:border-brand-gold
                    transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleNewsletter}
                  disabled={status === 'loading' || status === 'success' || !email.trim()}
                  className={`flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full
                    text-[9px] font-medium tracking-[0.3em] uppercase transition-all duration-300
                    disabled:cursor-not-allowed disabled:opacity-50
                    ${status === 'success'
                      ? 'bg-green-600 text-white'
                      : 'bg-brand-gold text-brand-black hover:bg-brand-gold-light shadow-[0_4px_16px_rgba(201,168,76,0.3)]'
                    }`}
                >
                  {status === 'loading' ? '...' : status === 'success' ? '✓' : (
                    <>OK <ArrowRight size={11} /></>
                  )}
                </button>
              </div>
              {message && (
                <p className={`text-[10px] tracking-wider px-2 ${
                  status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Liens ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div>
            <div className="font-display text-3xl font-light tracking-[0.25em] text-brand-white mb-5">
              1<span className="text-brand-gold">2</span>3
            </div>
            <p className="text-[12px] leading-loose text-brand-gray max-w-xs">
              Maison de mode fondée avec passion. Chaque pièce façonnée avec soin artisanal pour une élégance intemporelle.
            </p>
            <div className="flex gap-3 mt-8">
              {['Instagram', 'TikTok', 'Pinterest'].map(s => (
                <a key={s} href="#"
                  className="text-[9px] tracking-[0.2em] uppercase text-brand-gray
                    rounded-full border border-white/10 px-3 py-2
                    hover:border-brand-gold hover:text-brand-gold transition-all duration-300">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-6">{title}</p>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.href}>
                    <Link href={item.href}
                      className="text-[12px] text-brand-gray hover:text-brand-cream
                        tracking-wider transition-colors duration-300">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom ── */}
        <div className="pt-8 border-t border-white/5
          flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-brand-gray tracking-wider">
            © {new Date().getFullYear()} 123 Maison. Tous droits réservés.
          </p>
          <div className="flex gap-6 flex-wrap justify-center">
            {['Politique de Confidentialité', 'CGV', 'Mentions Légales'].map(t => (
              <a key={t} href="#"
                className="text-[10px] text-brand-gray hover:text-brand-cream tracking-wider transition-colors">
                {t}
              </a>
            ))}
          </div>
          <p className="text-[11px] text-brand-gray tracking-wider">Paris · Milan · Cotonou</p>
        </div>
      </div>
    </footer>
  )
}