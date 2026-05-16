'use client'
// src/app/panier/page.tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'

export default function PanierPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-brand-black pt-28 flex flex-col items-center justify-center gap-8 px-6">
          <ShoppingBag size={48} strokeWidth={0.8} className="text-brand-gold/40" />
          <h1 className="font-display text-5xl font-light text-brand-white">Panier vide</h1>
          <p className="text-[12px] tracking-[0.3em] uppercase text-brand-gray">
            Vous n&apos;avez pas encore d&apos;articles
          </p>
          <Link href="/produits" className="btn-gold mt-4">
            <span>Découvrir la collection</span>
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black pt-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">

          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <div>
              <span className="section-tag">Mon Panier</span>
              <h1 className="font-display text-4xl font-light text-brand-white">
                {totalItems()} article{totalItems() > 1 ? 's' : ''}
              </h1>
            </div>
            <button
              onClick={clearCart}
              className="text-[10px] tracking-[0.3em] uppercase text-brand-gray
                hover:text-red-400 transition-colors flex items-center gap-2"
            >
              <Trash2 size={12} /> Vider le panier
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">

            {/* ── Liste articles ── */}
            <div className="space-y-0 border-t border-white/5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 py-8 border-b border-white/5
                    hover:bg-white/[0.01] transition-colors"
                >
                  {/* Image / placeholder — corrigé: imageUrl au lieu de image */}
                  <div className="w-24 h-32 bg-brand-dark2 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display text-2xl text-brand-gold/40">
                        1<span className="text-brand-gold">2</span>3
                      </span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-1">123</p>
                    <p className="font-display text-xl font-light text-brand-white mb-1">{item.name}</p>
                    {item.size && (
                      <p className="text-[10px] tracking-[0.3em] uppercase text-brand-gray mb-4">
                        Taille : {item.size.startsWith('EU_') ? item.size.replace('EU_', '') : item.size}
                      </p>
                    )}

                    {/* Quantité */}
                    <div className="flex items-center gap-0 rounded-full border border-white/10 w-fit overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-brand-gray
                          hover:text-brand-gold hover:bg-white/5 transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-brand-cream text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-brand-gray
                          hover:text-brand-gold hover:bg-white/5 transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Prix + suppr */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-brand-gray hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                    <div className="text-right">
                      <p className="text-brand-gold-light font-light text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-brand-gray mt-1">
                          {formatPrice(item.price)} / unité
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Récapitulatif ── */}
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/8 p-8 sticky top-28">
              <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-8">
                Récapitulatif
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[12px]">
                  <span className="text-brand-gray tracking-wider">Sous-total</span>
                  <span className="text-brand-cream">{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-brand-gray tracking-wider">Livraison</span>
                  <span className="text-brand-cream">Calculée à l&apos;étape suivante</span>
                </div>
              </div>

              <div className="border-t border-white/8 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.35em] uppercase text-brand-cream">Total</span>
                  <span className="font-display text-2xl font-light text-brand-gold">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
                <p className="text-[10px] text-brand-gray mt-1 tracking-wider">Taxes incluses</p>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full
                  bg-brand-gold text-brand-black text-[10px] font-medium tracking-[0.35em] uppercase
                  hover:bg-brand-gold-light transition-all shadow-[0_8px_32px_rgba(201,168,76,0.3)] mb-4"
              >
                Passer la commande
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>

              <Link
                href="/produits"
                className="block text-center text-[10px] tracking-[0.3em] uppercase
                  text-brand-gray hover:text-brand-gold transition-colors py-3"
              >
                Continuer mes achats
              </Link>

              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray text-center mb-4">
                  Paiement sécurisé via
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="rounded-full border border-white/10 px-4 py-2 text-[11px]
                    tracking-widest text-brand-gold font-medium bg-white/5">
                    FedaPay
                  </div>
                  <div className="rounded-full border border-white/10 px-4 py-2 text-[10px]
                    tracking-widest text-brand-gray bg-white/5">
                    XOF · FCFA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}