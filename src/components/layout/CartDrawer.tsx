'use client'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-store'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className={`fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-brand-dark z-[70]
        flex flex-col border-l border-brand-gold/10
        transition-transform duration-500 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/6">
          <h2 className="font-display text-xl font-light tracking-widest text-brand-white">
            Votre Panier
          </h2>
          <button onClick={closeCart} className="text-brand-gray hover:text-brand-gold transition-colors">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
              <p className="font-display text-3xl font-light text-brand-gray">Panier vide</p>
              <p className="text-[11px] tracking-widest text-brand-gray uppercase">
                Découvrez notre collection
              </p>
              <Link href="/produits" onClick={closeCart} className="btn-gold mt-4">
                <span>Explorer</span>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-6 border-b border-white/5">
                {/* Image placeholder */}
                <div className="w-20 h-24 bg-brand-dark2 flex-shrink-0 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-brand-gold text-2xl font-display">1<span>2</span>3</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-1">123</p>
                  <p className="text-sm font-light text-brand-white truncate">{item.name}</p>
                  {item.size && (
                    <p className="text-[10px] tracking-widest text-brand-gray mt-1 uppercase">
                      {item.color && `${item.color} · `}Taille {item.size}
                    </p>
                  )}
                  <p className="text-brand-gold-light text-sm mt-2">
                    {(item.price * item.quantity).toLocaleString('fr-FR')} €
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="w-6 h-6 border border-white/15 flex items-center justify-center
                        hover:border-brand-gold text-brand-gray hover:text-brand-gold transition-colors"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-xs text-brand-cream w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="w-6 h-6 border border-white/15 flex items-center justify-center
                        hover:border-brand-gold text-brand-gray hover:text-brand-gold transition-colors"
                    >
                      <Plus size={10} />
                    </button>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="ml-auto text-brand-gray hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-white/6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-widest uppercase text-brand-gray">Sous-total</span>
              <span className="text-brand-gold-light font-light">
                {totalPrice().toLocaleString('fr-FR')} €
              </span>
            </div>
            <p className="text-[10px] tracking-widest text-brand-gray uppercase">
              Livraison calculée à la commande
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-gold w-full flex items-center justify-center"
            >
              <span>Commander</span>
            </Link>
            <button onClick={closeCart} className="w-full text-center btn-outline-gold">
              Continuer mes achats
            </button>
          </div>
        )}
      </aside>
    </>
  )
}