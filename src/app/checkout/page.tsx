'use client'
// src/app/checkout/page.tsx
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'

type DeliveryForm = {
  fullName: string
  phone: string
  address: string
  city: string
  notes: string
}

// Déclaration globale FedaPay widget
declare global {
  interface Window { FedaPay: any }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [mounted,   setMounted]   = useState(false)
  const [step,      setStep]      = useState<'livraison' | 'recap'>('livraison')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [orderId,   setOrderId]   = useState('')
  const [orderCode, setOrderCode] = useState('')
  const scriptLoaded = useRef(false)

  const [form, setForm] = useState<DeliveryForm>({
    fullName: '', phone: '', address: '', city: '', notes: '',
  })

  useEffect(() => {
    setMounted(true)
    // Précharger le script FedaPay
    if (!scriptLoaded.current) {
      const script = document.createElement('script')
      script.src   = 'https://cdn.fedapay.com/checkout.js?v=1.1.7'
      script.async = true
      script.onload = () => { scriptLoaded.current = true }
      document.head.appendChild(script)
    }
  }, [])

  const setField = (k: keyof DeliveryForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  // ── Étape 1 : créer la commande ─────────────────────────────────────────
  const handleLivraison = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      setError('Veuillez remplir tous les champs obligatoires.'); return
    }
    setError(''); setLoading(true)
    try {
      const res  = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.productId, size: i.size,
            quantity: i.quantity,   price: i.price,
          })),
          delivery: {
            fullName: form.fullName, phone:   form.phone,
            address:  form.address,  city:    form.city,
            notes:    form.notes || undefined,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')
      setOrderId(data.orderId)
      setOrderCode(data.orderNumber)
      setStep('recap')
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  // ── Étape 2 : paiement FedaPay INLINE (popup) ──────────────────────────
  const handlePaiementInline = () => {
    if (!window.FedaPay) {
      setError('Widget FedaPay non chargé. Rechargez la page.'); return
    }

    const publicKey = process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY ?? ''
    if (!publicKey) {
      setError('NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY manquante dans .env.local'); return
    }

    setError('')

    try {
      window.FedaPay.init({
        public_key:  publicKey,
        transaction: {
          amount:      Math.round(totalPrice()),
          description: `Commande 123 Maison N°${orderCode}`,
          currency:    { iso: 'XOF' },
        },
        customer: {
          firstname: form.fullName.split(' ')[0] ?? '',
          lastname:  form.fullName.split(' ').slice(1).join(' ') ?? '',
        },
        onComplete: async (resp: any) => {
          // Dismissé sans payer
          if (!resp?.transaction) return

          const status = resp.transaction.status

          if (status === 'approved') {
            // Mettre à jour le paiement en base
            await fetch(`/api/orders/${orderId}/confirm`, {
              method:  'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fedapayId: String(resp.transaction.id ?? ''),
                status:    'APPROVED',
              }),
            }).catch(() => {})

            clearCart()
            window.location.href = `/checkout/confirmation?order=${orderCode}`
          } else {
            setError(`Paiement non complété (statut: ${status}). Réessayez.`)
          }
        },
      }).open()
    } catch (err: any) {
      setError('Erreur ouverture FedaPay : ' + (err?.message ?? err))
    }
  }

  if (!mounted) return null

  // Panier vide
  if (items.length === 0 && step === 'livraison') {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-6 px-6">
        <div className="font-display text-4xl font-light tracking-[0.3em] text-brand-white mb-4">
          1<span className="text-brand-gold">2</span>3
        </div>
        <p className="font-display text-3xl font-light text-brand-gray">Panier vide</p>
        <Link href="/produits" className="btn-gold"><span>Voir la collection</span></Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-light tracking-[0.3em] text-brand-white">
          1<span className="text-brand-gold">2</span>3
        </Link>
        <div className="flex items-center gap-4 text-[9px] tracking-[0.4em] uppercase text-brand-gray">
          <span className={step === 'livraison' ? 'text-brand-gold' : 'opacity-40'}>1. Livraison</span>
          <span className="text-white/20">—</span>
          <span className={step === 'recap' ? 'text-brand-gold' : 'opacity-40'}>2. Paiement</span>
        </div>
        <Link href="/panier" className="text-[10px] tracking-widest uppercase text-brand-gray hover:text-brand-gold transition-colors">
          ← Retour
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">

        {/* ══ FORMULAIRE ══ */}
        <div>

          {/* ÉTAPE 1 : Livraison */}
          {step === 'livraison' && (
            <form onSubmit={handleLivraison} className="space-y-5">
              <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-8">
                Informations de livraison
              </p>

              {([
                { key: 'fullName', label: 'Nom complet *',   placeholder: 'Jean Dupont',             type: 'text' },
                { key: 'phone',    label: 'Téléphone *',     placeholder: '+229 97 00 00 00',         type: 'tel'  },
                { key: 'address',  label: 'Adresse *',       placeholder: 'Rue de la Paix, Akpakpa', type: 'text' },
                { key: 'city',     label: 'Ville *',         placeholder: 'Cotonou',                  type: 'text' },
              ] as const).map(field => (
                <div key={field.key}>
                  <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={setField(field.key)}
                    className="w-full bg-transparent border border-white/15 px-4 py-3.5
                      text-[13px] text-brand-cream placeholder:text-brand-gray/40
                      focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-[10px] tracking-[0.35em] uppercase text-brand-gray mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  rows={3}
                  placeholder="Point de repère, instructions de livraison..."
                  value={form.notes}
                  onChange={setField('notes')}
                  className="w-full bg-transparent border border-white/15 px-4 py-3.5
                    text-[13px] text-brand-cream placeholder:text-brand-gray/40
                    focus:outline-none focus:border-brand-gold transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-red-400 text-[11px] tracking-wider border border-red-400/20 px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit" disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-3 mt-4 disabled:opacity-60"
              >
                <span>{loading ? 'Validation...' : 'Continuer vers le paiement →'}</span>
              </button>
            </form>
          )}

          {/* ÉTAPE 2 : Récapitulatif + Paiement inline */}
          {step === 'recap' && (
            <div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-8">
                Récapitulatif de commande
              </p>

              {/* Articles */}
              <div className="space-y-3 mb-8">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b border-white/5">
                    <div className="flex-1">
                      <p className="text-[13px] text-brand-white font-light">{item.name}</p>
                      <p className="text-[10px] text-brand-gray mt-0.5">
                        Taille {item.size} · Qté {item.quantity}
                      </p>
                    </div>
                    <p className="text-brand-gold-light text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Adresse */}
              <div className="bg-brand-dark border border-white/5 p-5 mb-8">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-3">
                  Livraison à
                </p>
                <p className="text-[13px] text-brand-cream">{form.fullName}</p>
                <p className="text-[12px] text-brand-gray">{form.address}, {form.city}</p>
                <p className="text-[12px] text-brand-gray">{form.phone}</p>
                <button
                  onClick={() => setStep('livraison')}
                  className="text-[10px] uppercase tracking-widest text-brand-gold hover:underline mt-3 block"
                >
                  Modifier
                </button>
              </div>

              {error && (
                <p className="text-red-400 text-[11px] tracking-wider border border-red-400/20 px-4 py-3 mb-6">
                  {error}
                </p>
              )}

              {/* Bouton paiement FedaPay inline */}
              <button
                onClick={handlePaiementInline}
                className="btn-gold w-full flex items-center justify-center gap-3 py-5"
              >
                <span className="text-lg">🔒</span>
                <span className="text-[11px] tracking-[0.35em] uppercase font-medium">
                  Payer {formatPrice(totalPrice())} via FedaPay
                </span>
              </button>

              <div className="mt-5 flex items-center justify-center gap-3 text-[10px] text-brand-gray">
                <span>Mobile Money</span>
                <span className="text-white/20">·</span>
                <span>MTN</span>
                <span className="text-white/20">·</span>
                <span>Moov</span>
                <span className="text-white/20">·</span>
                <span>Visa / Mastercard</span>
              </div>
            </div>
          )}
        </div>

        {/* ══ SIDEBAR ══ */}
        <div className="bg-brand-dark border border-white/5 p-6 sticky top-8">
          <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">
            Ma commande
          </p>

          <div className="space-y-3 mb-5">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-[12px]">
                <span className="text-brand-gray truncate pr-3">
                  {item.name}
                  <span className="text-brand-gray/50 ml-1">×{item.quantity}</span>
                </span>
                <span className="text-brand-cream flex-shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/8 pt-4 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-[0.35em] uppercase text-brand-cream">Total</span>
              <span className="font-display text-xl font-light text-brand-gold-light">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <p className="text-[10px] text-brand-gray mt-1">Livraison offerte</p>
          </div>

          {orderCode && (
            <div className="border border-brand-gold/30 bg-brand-gold/5 p-4 text-center mb-5">
              <p className="text-[8px] tracking-[0.5em] uppercase text-brand-gold mb-1">
                Code commande
              </p>
              <p className="font-mono font-bold text-2xl text-brand-gold tracking-widest">
                {orderCode}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-white/5 flex items-start gap-3">
            <span className="text-brand-gold flex-shrink-0">🔒</span>
            <p className="text-[10px] text-brand-gray leading-relaxed">
              Paiement sécurisé via FedaPay.
              Vos données sont cryptées et protégées.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}