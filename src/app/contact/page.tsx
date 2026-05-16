'use client'
// src/app/contact/page.tsx
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [form, setForm]   = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulation envoi (à connecter à un service email comme Resend)
    await new Promise(r => setTimeout(r, 1500))
    setSent(true)
    setLoading(false)
  }

  const CONTACTS = [
    { icon: '📍', label: 'Adresse',    value: 'Cotonou, Bénin — Afrique de l\'Ouest' },
    { icon: '📞', label: 'Téléphone',  value: '+229 97 00 00 00' },
    { icon: '✉️', label: 'Email',      value: 'contact@123maison.com' },
    { icon: '🕐', label: 'Horaires',   value: 'Lun – Sam · 9h à 18h' },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black">

        {/* Hero */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,168,76,0.07)_0%,transparent_55%)]" />
          <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
            <span className="section-tag">Nous écrire</span>
            <h1 className="font-display text-[clamp(52px,7vw,90px)] font-light leading-none text-brand-white mb-6">
              <em className="italic text-brand-gold">Contact</em>
            </h1>
            <p className="text-[13px] leading-loose text-brand-gray max-w-lg mx-auto">
              Une question, une demande personnalisée, un partenariat ?
              Notre équipe vous répond dans les 24 heures.
            </p>
          </div>
        </section>

        {/* Contenu */}
        <section className="max-w-6xl mx-auto px-8 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">

            {/* Formulaire */}
            <div>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30
                    flex items-center justify-center text-3xl mb-8">
                    ✓
                  </div>
                  <h2 className="font-display text-3xl font-light text-brand-white mb-4">
                    Message envoyé !
                  </h2>
                  <p className="text-[13px] text-brand-gray max-w-sm leading-loose">
                    Nous avons bien reçu votre message. Notre équipe vous répondra dans les 24 heures.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-8">
                    Votre message
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { key: 'name',  label: 'Nom complet *',  placeholder: 'Jean Dupont',        type: 'text' },
                      { key: 'phone', label: 'Téléphone',      placeholder: '+229 97 00 00 00',   type: 'tel'  },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">{f.label}</label>
                        <input
                          type={f.type}
                          placeholder={f.placeholder}
                          value={form[f.key as keyof typeof form]}
                          onChange={setField(f.key)}
                          className="w-full bg-transparent border border-white/15 px-4 py-3.5
                            text-[13px] text-brand-cream placeholder:text-brand-gray/40
                            focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">Email *</label>
                    <input
                      type="email" placeholder="votre@email.com"
                      value={form.email} onChange={setField('email')} required
                      className="w-full bg-transparent border border-white/15 px-4 py-3.5
                        text-[13px] text-brand-cream placeholder:text-brand-gray/40
                        focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">Sujet *</label>
                    <select
                      value={form.subject} onChange={setField('subject')} required
                      className="w-full bg-brand-dark border border-white/15 px-4 py-3.5
                        text-[13px] text-brand-cream focus:outline-none focus:border-brand-gold
                        transition-colors cursor-pointer"
                    >
                      <option value="" className="bg-brand-dark">Choisir un sujet...</option>
                      {['Question sur un produit', 'Suivi de commande', 'Retour / Échange',
                        'Commande personnalisée', 'Partenariat', 'Autre'].map(s => (
                        <option key={s} value={s} className="bg-brand-dark">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">Message *</label>
                    <textarea
                      rows={6} placeholder="Décrivez votre demande..." required
                      value={form.message} onChange={setField('message')}
                      className="w-full bg-transparent border border-white/15 px-4 py-3.5
                        text-[13px] text-brand-cream placeholder:text-brand-gray/40
                        focus:outline-none focus:border-brand-gold transition-colors resize-none"
                    />
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-gold w-full flex items-center justify-center gap-3 disabled:opacity-60">
                    <span>{loading ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Infos contact */}
            <div className="space-y-4">
              <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-8">
                Nos coordonnées
              </p>

              {CONTACTS.map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-5 border border-white/5 p-6 hover:border-brand-gold/20 transition-colors">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gold mb-1">{label}</p>
                    <p className="text-[13px] text-brand-cream">{value}</p>
                  </div>
                </div>
              ))}

              {/* Réseaux sociaux */}
              <div className="border border-white/5 p-6 mt-6">
                <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gold mb-5">Réseaux sociaux</p>
                <div className="flex gap-3">
                  {['Instagram', 'TikTok', 'Facebook', 'Pinterest'].map(s => (
                    <a key={s} href="#"
                      className="flex-1 py-2.5 text-center text-[9px] tracking-[0.25em] uppercase
                        border border-white/10 text-brand-gray hover:border-brand-gold hover:text-brand-gold
                        transition-colors">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}