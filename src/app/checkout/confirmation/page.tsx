// src/app/checkout/confirmation/page.tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import ReceiptGenerator from '@/components/ui/ReceiptGenerator'

interface Props {
  searchParams: { order?: string }
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { order: orderNumber } = searchParams

  let order = null
  try {
    if (orderNumber) {
      order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items:    { include: { product: { select: { name: true } } } },
          delivery: true,
          payment:  true,
        },
      })
    }
  } catch {}

  const isPaid = order?.payment?.status === 'APPROVED'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-6">

          {/* Statut */}
          <div className="text-center mb-12">
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center
              border-2 ${isPaid ? 'border-brand-gold bg-brand-gold/10' : 'border-yellow-500/50 bg-yellow-900/20'}`}>
              <span className="text-3xl">{isPaid ? '✓' : '⏳'}</span>
            </div>
            <span className="section-tag">{isPaid ? 'Paiement validé' : 'Commande enregistrée'}</span>
            <h1 className="font-display text-4xl font-light text-brand-white">
              {isPaid ? 'Merci pour votre commande !' : 'Commande en attente'}
            </h1>
          </div>

          {order ? (
            <>
              {/* ── CODE LIVRAISON — élément central ── */}
              <div className="bg-brand-dark border border-brand-gold/30 p-8 mb-6 text-center relative overflow-hidden">
                {/* Fond décoratif */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)]" />

                <div className="relative z-10">
                  <p className="text-[9px] tracking-[0.6em] uppercase text-brand-gold mb-4">
                    Code de livraison
                  </p>

                  {/* Code 6 chiffres — TRÈS visible */}
                  <div className="font-display text-[72px] font-light text-brand-gold tracking-[0.15em] leading-none mb-4">
                    {order.orderNumber}
                  </div>

                  <div className="w-24 h-px bg-brand-gold/30 mx-auto mb-4" />

                  <p className="text-[11px] text-brand-gray leading-relaxed max-w-sm mx-auto">
                    Communiquez ce code au livreur lors de la réception de votre colis.
                    <strong className="text-brand-cream"> Ne le partagez qu'avec le livreur.</strong>
                  </p>
                </div>
              </div>

              {/* ── Boutons reçu ── */}
              <div className="mb-8">
                <ReceiptGenerator order={order as any} />
              </div>

              {/* ── Détails commande ── */}
              <div className="bg-brand-dark border border-white/5 p-6 mb-6">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-5">
                  Récapitulatif
                </p>

                <div className="space-y-2 mb-5">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-[12px]">
                      <span className="text-brand-gray">
                        {item.product.name}
                        <span className="text-brand-gray/50 ml-1">×{item.quantity} ({item.size})</span>
                      </span>
                      <span className="text-brand-cream">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/8 pt-4 space-y-2">
                  {[
                    { label: 'Total',      value: formatPrice(order.total),                 gold: true },
                    { label: 'Livraison',  value: order.delivery?.fullName ?? '—',          gold: false },
                    { label: 'Ville',      value: order.delivery?.city ?? '—',              gold: false },
                    { label: 'Téléphone',  value: order.delivery?.phone ?? '—',             gold: false },
                    { label: 'Paiement',   value: isPaid ? '✓ Approuvé' : 'En attente',     gold: isPaid },
                  ].map(({ label, value, gold }) => (
                    <div key={label} className="flex justify-between text-[12px]">
                      <span className="text-brand-gray tracking-wider">{label}</span>
                      <span className={gold ? 'text-brand-gold-light font-medium' : 'text-brand-cream'}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message info livraison */}
              <div className="border border-brand-gold/15 bg-brand-gold/5 p-5 mb-8">
                <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-2">
                  Comment ça marche ?
                </p>
                <ol className="space-y-2">
                  {[
                    'Votre commande est confirmée et en préparation.',
                    'Notre équipe vous contactera pour confirmer la livraison.',
                    'Le livreur vous demandera le code à 6 chiffres ci-dessus.',
                    'Vérifiez que le code correspond avant d\'accepter le colis.',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-[12px] text-brand-gray">
                      <span className="text-brand-gold font-medium flex-shrink-0">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-brand-gray">
              <p className="font-display text-2xl mb-4">Commande introuvable</p>
              <p className="text-[12px]">Le numéro de commande est invalide.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/produits" className="btn-gold flex-1 flex items-center justify-center">
              <span>Continuer mes achats</span>
            </Link>
            <Link href="/" className="flex-1 py-4 text-center text-[10px] tracking-[0.3em]
              uppercase border border-white/15 text-brand-gray hover:border-brand-gold
              hover:text-brand-gold transition-colors">
              Accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}