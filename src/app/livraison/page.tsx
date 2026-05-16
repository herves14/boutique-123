// src/app/livraison/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Livraison — 123',
  description: 'Informations sur la livraison 123. Délais, zones, tarifs et suivi de commande.',
}

const ZONES = [
  {
    zone: 'Cotonou & environs',
    pays: 'Bénin',
    flag: '🇧🇯',
    delai: '24 – 48h',
    tarif: 'Gratuite',
    detail: 'Cotonou, Abomey-Calavi, Sèmè-Kpodji, Porto-Novo',
    color: 'border-brand-gold/30 bg-brand-gold/5',
  },
  {
    zone: 'Autres villes',
    pays: 'Bénin',
    flag: '🇧🇯',
    delai: '2 – 4 jours',
    tarif: 'Gratuite',
    detail: 'Parakou, Bohicon, Lokossa, Natitingou et toutes villes',
    color: 'border-white/10',
  },
  {
    zone: 'Lomé & Abidjan',
    pays: 'Togo · Côte d\'Ivoire',
    flag: '🇹🇬🇨🇮',
    delai: '3 – 5 jours',
    tarif: 'Gratuite',
    detail: 'Livraison express disponible sur demande',
    color: 'border-white/10',
  },
  {
    zone: 'Dakar · Lagos',
    pays: 'Sénégal · Nigeria',
    flag: '🇸🇳🇳🇬',
    delai: '5 – 7 jours',
    tarif: 'Gratuite',
    detail: 'Suivi en temps réel inclus',
    color: 'border-white/10',
  },
  {
    zone: 'Autres pays',
    pays: 'Afrique de l\'Ouest',
    flag: '🌍',
    delai: '7 – 12 jours',
    tarif: 'Sur devis',
    detail: 'Contactez-nous pour un devis personnalisé',
    color: 'border-white/10',
  },
]

const ETAPES = [
  {
    num: '01',
    icon: '✅',
    title: 'Commande confirmée',
    text: 'Dès que votre paiement est validé, vous recevez votre code de livraison à 6 chiffres. Votre commande entre en préparation immédiatement.',
    timing: 'Instantané',
  },
  {
    num: '02',
    icon: '📦',
    title: 'Préparation & Emballage',
    text: 'Votre article est soigneusement vérifié, repassé si nécessaire, puis emballé dans notre packaging signature avec papier de soie et ruban doré.',
    timing: '2 à 6 heures',
  },
  {
    num: '03',
    icon: '📞',
    title: 'Prise de contact',
    text: 'Notre équipe vous appelle pour confirmer votre adresse exacte et définir une fenêtre horaire de livraison qui vous convient.',
    timing: 'Le jour même',
  },
  {
    num: '04',
    icon: '🚗',
    title: 'En route vers vous',
    text: 'Notre livreur partenaire prend en charge votre colis. Il vous contactera 30 minutes avant d\'arriver.',
    timing: 'Selon zone',
  },
  {
    num: '05',
    icon: '🔑',
    title: 'Validation à la livraison',
    text: 'À la réception, le livreur vous demande votre code à 6 chiffres pour confirmer que le colis vous appartient bien. Ne le donnez qu\'en face-à-face.',
    timing: 'À la réception',
  },
]

const FAQ_LIVRAISON = [
  {
    q: 'La livraison est-elle vraiment gratuite ?',
    a: 'Oui, pour toutes les commandes sans minimum d\'achat, dans toutes les zones indiquées. Aucun frais caché.',
  },
  {
    q: 'Puis-je choisir l\'heure de livraison ?',
    a: 'Oui. Notre équipe vous contacte pour convenir d\'une fenêtre horaire qui vous arrange : matin, après-midi ou soirée (jusqu\'à 20h).',
  },
  {
    q: 'Que se passe-t-il si je suis absent ?',
    a: 'Le livreur vous recontacte pour planifier un second passage. Vous pouvez aussi désigner quelqu\'un de confiance pour réceptionner en votre nom (avec le code à 6 chiffres).',
  },
  {
    q: 'Comment suivre ma commande ?',
    a: 'Notre équipe vous informe par appel téléphonique à chaque étape. Pas de traceur en ligne — un vrai contact humain.',
  },
  {
    q: 'Livrez-vous les week-ends et jours fériés ?',
    a: 'Nous livrons du lundi au samedi. Les commandes passées le week-end sont traitées le lundi suivant.',
  },
  {
    q: 'Mon colis est-il assuré ?',
    a: 'Oui, chaque colis est assuré pour sa valeur totale pendant le transport. En cas de problème, nous remplaçons l\'article sans frais supplémentaires.',
  },
]

export default function LivraisonPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black">

        {/* ── Hero ── */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(201,168,76,0.08)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,168,76,0.04)_0%,transparent_50%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

          {/* Lignes décoratives */}
          <div className="absolute left-[10%] top-20 bottom-0 w-px bg-gradient-to-b from-brand-gold/20 to-transparent" />
          <div className="absolute right-[10%] top-20 bottom-0 w-px bg-gradient-to-b from-brand-gold/20 to-transparent" />

          <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
            <span className="section-tag">Livraison Offerte</span>
            <h1 className="font-display text-[clamp(52px,8vw,100px)] font-light leading-none text-brand-white mb-8">
              <em className="italic text-brand-gold">Livraison</em>
            </h1>
            <p className="text-[14px] leading-loose text-brand-gray max-w-xl mx-auto">
              Votre commande livrée à domicile, avec soin et ponctualité.
              Partout en Afrique de l&apos;Ouest, sans frais de livraison.
            </p>

            {/* Stats clés */}
            <div className="flex items-center justify-center gap-12 mt-14">
              {[
                { num: '100%',   label: 'Livraison gratuite' },
                { num: '24h',    label: 'À Cotonou' },
                { num: '5 pays', label: 'Couverts' },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-3xl font-light text-brand-gold mb-1">{num}</p>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-8 pb-28 space-y-24">

          {/* ── Zones & Délais ── */}
          <section>
            <div className="text-center mb-16">
              <span className="section-tag">Zones de livraison</span>
              <h2 className="section-title">Où livrons-<em className="italic">nous</em> ?</h2>
              <div className="section-divider" />
            </div>

            <div className="space-y-3">
              {ZONES.map((zone) => (
                <div
                  key={zone.zone}
                  className={`grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_2fr] gap-6 items-center
                    border p-7 hover:border-brand-gold/30 transition-all duration-300 group
                    ${zone.color}`}
                >
                  {/* Destination */}
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{zone.flag}</span>
                    <div>
                      <p className="font-display text-xl font-light text-brand-white group-hover:text-brand-gold-light transition-colors">
                        {zone.zone}
                      </p>
                      <p className="text-[11px] text-brand-gray tracking-wider mt-0.5">{zone.pays}</p>
                    </div>
                  </div>

                  {/* Délai */}
                  <div>
                    <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray mb-1">Délai</p>
                    <p className="text-[15px] font-light text-brand-cream">{zone.delai}</p>
                  </div>

                  {/* Tarif */}
                  <div>
                    <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray mb-1">Tarif</p>
                    <p className={`text-[15px] font-light ${zone.tarif === 'Gratuite' ? 'text-green-400' : 'text-brand-gold'}`}>
                      {zone.tarif}
                    </p>
                  </div>

                  {/* Détail */}
                  <div>
                    <p className="text-[12px] text-brand-gray leading-relaxed">{zone.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border border-brand-gold/15 bg-brand-gold/5 p-6">
              <p className="text-[11px] tracking-wider text-brand-gold mb-2">🌍 Vous êtes dans un autre pays ?</p>
              <p className="text-[13px] text-brand-gray">
                Nous étudions toutes les demandes. Contactez-nous pour obtenir un devis personnalisé.{' '}
                <Link href="/contact" className="text-brand-gold hover:underline">Nous écrire →</Link>
              </p>
            </div>
          </section>

          {/* ── Processus de livraison ── */}
          <section>
            <div className="text-center mb-16">
              <span className="section-tag">Comment ça marche</span>
              <h2 className="section-title">Le Parcours de <em className="italic">votre Colis</em></h2>
              <div className="section-divider" />
            </div>

            <div className="relative">
              {/* Ligne connecteur */}
              <div className="absolute left-[28px] top-12 bottom-12 w-px bg-gradient-to-b from-brand-gold/40 via-brand-gold/20 to-transparent hidden lg:block" />

              <div className="space-y-4">
                {ETAPES.map((etape) => (
                  <div
                    key={etape.num}
                    className="grid grid-cols-1 lg:grid-cols-[60px_1fr_160px] gap-6 items-start
                      border border-white/5 p-8 hover:border-brand-gold/20 transition-all group"
                  >
                    {/* Icône */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full
                      bg-brand-dark border border-white/10 group-hover:border-brand-gold/40
                      transition-colors flex-shrink-0 text-2xl">
                      {etape.icon}
                    </div>

                    {/* Contenu */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[9px] tracking-[0.5em] uppercase text-brand-gold/60">
                          {etape.num}
                        </span>
                        <h3 className="font-display text-xl font-light text-brand-white">
                          {etape.title}
                        </h3>
                      </div>
                      <p className="text-[13px] leading-loose text-brand-gray">{etape.text}</p>
                    </div>

                    {/* Timing */}
                    <div className="flex items-start justify-end lg:justify-end">
                      <div className="border border-brand-gold/20 bg-brand-gold/5 px-4 py-2 text-center">
                        <p className="text-[9px] tracking-[0.35em] uppercase text-brand-gray mb-1">Durée</p>
                        <p className="text-[12px] text-brand-gold font-medium">{etape.timing}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Packaging ── */}
          <section className="bg-brand-dark border border-white/5 p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-tag">Notre Promesse</span>
                <h2 className="font-display text-[clamp(32px,4vw,52px)] font-light text-brand-white mb-6">
                  Un packaging <em className="italic text-brand-gold">à la hauteur</em>
                </h2>
                <p className="text-[13px] leading-loose text-brand-gray mb-8">
                  Chaque commande est emballée avec soin dans notre packaging signature :
                  boîte rigide noir mat, papier de soie ivoire, ruban doré et carte manuscrite.
                  Un moment d&apos;ouverture qui fait partie de l&apos;expérience 123.
                </p>
                <ul className="space-y-3">
                  {[
                    'Boîte rigide noire mate siglée 123',
                    'Papier de soie ivoire parfumé',
                    'Ruban doré noué à la main',
                    'Carte de remerciement manuscrite',
                    'Instructions d\'entretien incluses',
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-[12px] text-brand-gray">
                      <span className="text-brand-gold">✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '📦', label: 'Emballage Premium' },
                  { icon: '🎀', label: 'Ruban Doré' },
                  { icon: '✍️', label: 'Carte Manuscrite' },
                  { icon: '🛡️', label: 'Colis Assuré' },
                ].map(({ icon, label }) => (
                  <div key={label}
                    className="border border-white/10 p-8 text-center hover:border-brand-gold/30 transition-colors">
                    <span className="text-4xl block mb-4">{icon}</span>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-brand-gray">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ Livraison ── */}
          <section>
            <div className="text-center mb-16">
              <span className="section-tag">Questions fréquentes</span>
              <h2 className="section-title">Tout sur la <em className="italic">livraison</em></h2>
              <div className="section-divider" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-5xl mx-auto">
              {FAQ_LIVRAISON.map((item, i) => (
                <div
                  key={item.q}
                  className={`p-8 border-b border-white/5
                    ${i % 2 === 0 ? 'lg:border-r lg:border-white/5' : ''}
                    hover:bg-white/[0.015] transition-colors`}
                >
                  <h3 className="font-display text-lg font-light text-brand-white mb-3 leading-snug">
                    {item.q}
                  </h3>
                  <p className="text-[12px] leading-loose text-brand-gray">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA Contact ── */}
          <section className="text-center">
            <p className="font-display text-3xl font-light text-brand-white mb-4">
              Une question sur votre <em className="italic text-brand-gold">livraison</em> ?
            </p>
            <p className="text-[13px] text-brand-gray mb-10 max-w-md mx-auto leading-loose">
              Notre équipe est disponible du lundi au samedi de 9h à 18h pour
              vous accompagner et répondre à toutes vos questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-gold">
                <span>Nous Contacter</span>
              </Link>
              <Link href="/produits"
                className="px-8 py-4 border border-white/15 text-[10px] tracking-[0.35em] uppercase
                  text-brand-gray hover:border-brand-gold hover:text-brand-gold transition-colors">
                Commander maintenant
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}