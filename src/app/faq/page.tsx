'use client'
// src/app/faq/page.tsx
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const FAQ_CATEGORIES = [
  {
    title: 'Commandes & Paiement',
    icon: '🛍️',
    items: [
      {
        q: 'Comment passer une commande ?',
        a: 'Ajoutez vos articles au panier, sélectionnez votre taille, puis cliquez sur "Commander". Renseignez vos informations de livraison et procédez au paiement via FedaPay (Mobile Money, Visa, Mastercard).',
      },
      {
        q: 'Quels modes de paiement acceptez-vous ?',
        a: 'Nous acceptons : MTN Mobile Money, Moov Money, Carte Visa et Mastercard via FedaPay. Tous les paiements sont sécurisés et cryptés.',
      },
      {
        q: 'Ma commande est-elle confirmée immédiatement ?',
        a: 'Oui. Dès que votre paiement est validé, vous recevez un code de commande à 6 chiffres. Conservez ce code — il servira à valider la livraison.',
      },
      {
        q: 'Puis-je modifier ou annuler ma commande ?',
        a: 'Vous pouvez annuler votre commande dans les 2 heures suivant la validation. Passé ce délai, la commande est en préparation et ne peut plus être modifiée. Contactez-nous par téléphone pour toute urgence.',
      },
      {
        q: 'Que signifie le code à 6 chiffres ?',
        a: 'Ce code unique identifie votre commande. Le livreur vous le demandera à la réception pour s\'assurer que le colis vous appartient bien. Ne le communiquez qu\'au livreur en face-à-face.',
      },
    ],
  },
  {
    title: 'Tailles & Fitting',
    icon: '📏',
    items: [
      {
        q: 'Comment choisir ma taille ?',
        a: 'Consultez notre guide des tailles disponible sur chaque fiche produit. En cas de doute entre deux tailles, nous recommandons de prendre la plus grande pour les pièces structurées (blazers, manteaux) et la plus petite pour les pièces fluides (robes, jupes).',
      },
      {
        q: 'Les tailles sont-elles standard ?',
        a: 'Nos tailles correspondent aux standards européens. Un S chez 123 correspond à un tour de poitrine 86-90cm, tour de taille 68-72cm, tour de hanches 92-96cm.',
      },
      {
        q: 'Et si la taille ne me convient pas à la livraison ?',
        a: 'Nos pièces peuvent être ajustées par nos ateliers partenaires à Cotonou. Pour les retours de taille, vous disposez de 14 jours. Consultez notre politique de retour.',
      },
    ],
  },
  {
    title: 'Livraison',
    icon: '🚚',
    items: [
      {
        q: 'Livrez-vous dans toute l\'Afrique de l\'Ouest ?',
        a: 'Nous livrons actuellement au Bénin (Cotonou et principales villes), Togo, Côte d\'Ivoire, Sénégal et Nigeria. D\'autres destinations arrivent prochainement.',
      },
      {
        q: 'Quel est le délai de livraison ?',
        a: 'À Cotonou : 24 à 48h. Autres villes du Bénin : 2 à 4 jours. International Afrique de l\'Ouest : 4 à 7 jours ouvrés selon la destination.',
      },
      {
        q: 'La livraison est-elle gratuite ?',
        a: 'La livraison est offerte pour toute commande. Pas de minimum d\'achat requis.',
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Notre équipe vous contactera par téléphone pour confirmer la livraison et vous donner une fenêtre horaire. Vous pouvez aussi nous appeler directement.',
      },
    ],
  },
  {
    title: 'Retours & Échanges',
    icon: '🔄',
    items: [
      {
        q: 'Puis-je retourner un article ?',
        a: 'Oui, sous 14 jours après réception, pour les articles non portés, non lavés, avec leurs étiquettes d\'origine. Les articles en promotion ne sont pas échangeables.',
      },
      {
        q: 'Comment initier un retour ?',
        a: 'Contactez-nous par email ou téléphone avec votre code de commande. Nous organisons le retour et le remboursement ou l\'échange dans les 5 jours ouvrés.',
      },
      {
        q: 'Le remboursement prend combien de temps ?',
        a: 'Après réception et vérification de l\'article, le remboursement est effectué sous 3 à 5 jours ouvrés sur le même moyen de paiement utilisé.',
      },
    ],
  },
  {
    title: 'Entretien des Pièces',
    icon: '✨',
    items: [
      {
        q: 'Comment entretenir mes vêtements 123 ?',
        a: 'Chaque pièce est livrée avec ses instructions d\'entretien. En règle générale : lavage à la main à 30°C, séchage à plat, repassage à basse température à l\'envers. Les soies et cachemires nécessitent un nettoyage à sec.',
      },
      {
        q: 'Proposez-vous un service de nettoyage ?',
        a: 'Nous collaborons avec des pressings de confiance à Cotonou. Contactez-nous pour obtenir nos recommandations selon votre quartier.',
      },
    ],
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-5 px-0 text-left group"
      >
        <span className={`text-[13px] font-light leading-relaxed transition-colors
          ${open ? 'text-brand-gold' : 'text-brand-cream group-hover:text-brand-gold'}`}>
          {q}
        </span>
        <span className={`flex-shrink-0 ml-6 text-brand-gold text-lg font-light transition-transform duration-300
          ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-[13px] leading-loose text-brand-gray">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black">

        {/* Hero */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,168,76,0.06)_0%,transparent_60%)]" />
          <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
            <span className="section-tag">Aide & Support</span>
            <h1 className="font-display text-[clamp(52px,7vw,90px)] font-light leading-none text-brand-white mb-6">
              Questions <em className="italic text-brand-gold">Fréquentes</em>
            </h1>
            <p className="text-[13px] leading-loose text-brand-gray max-w-xl mx-auto">
              Trouvez rapidement les réponses à vos questions.
              Si vous ne trouvez pas ce que vous cherchez,
              <Link href="/contact" className="text-brand-gold hover:underline ml-1">contactez-nous</Link>.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-5xl mx-auto px-8 pb-28">
          {/* Catégories */}
          <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-white/5">
            {FAQ_CATEGORIES.map((cat, i) => (
              <button
                key={cat.title}
                onClick={() => setActiveCategory(i)}
                className={`flex items-center gap-2 px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase transition-all
                  ${activeCategory === i
                    ? 'bg-brand-gold text-brand-black'
                    : 'border border-white/15 text-brand-gray hover:border-brand-gold/50 hover:text-brand-cream'}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-light text-brand-white mb-8">
              {FAQ_CATEGORIES[activeCategory].title}
            </h2>
            {FAQ_CATEGORIES[activeCategory].items.map(item => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </section>

        {/* CTA Contact */}
        <section className="bg-brand-dark border-t border-white/5 py-20 px-8 text-center">
          <p className="font-display text-2xl font-light text-brand-white mb-3">
            Vous n&apos;avez pas trouvé votre réponse ?
          </p>
          <p className="text-[13px] text-brand-gray mb-8">
            Notre équipe est disponible du lundi au samedi, 9h–18h.
          </p>
          <Link href="/contact" className="btn-gold"><span>Nous Contacter</span></Link>
        </section>
      </main>
      <Footer />
    </>
  )
}