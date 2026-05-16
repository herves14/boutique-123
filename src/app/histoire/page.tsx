// src/app/histoire/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Notre Histoire — 123',
  description: 'L\'histoire de la Maison 123, née d\'une passion pour l\'élégance et le savoir-faire artisanal.',
}

const TIMELINE = [
  {
    year: '2010',
    title: 'La Naissance',
    text: 'La Maison 123 est fondée à Cotonou avec une vision simple : apporter l\'élégance du prêt-à-porter de luxe à l\'Afrique de l\'Ouest. Les premières pièces sont façonnées à la main dans un petit atelier de 40m².',
  },
  {
    year: '2013',
    title: 'Premier Atelier',
    text: 'Ouverture du premier atelier officiel. Une équipe de 8 artisans locaux rejoint la Maison. Développement des premières lignes signature : robes couture et blazers structurés.',
  },
  {
    year: '2016',
    title: 'L\'Expansion',
    text: 'Partenariats avec des tanneries italiennes et des tisserands japonais. La qualité des matières premières devient la marque de fabrique de 123. Première collection capsule sold-out en 48h.',
  },
  {
    year: '2019',
    title: 'La Reconnaissance',
    text: 'Présence dans les plus grands événements de mode d\'Afrique. La Maison 123 habille les personnalités influentes de Cotonou, Lagos et Abidjan. La liste d\'attente s\'allonge.',
  },
  {
    year: '2022',
    title: 'Le Digital',
    text: 'Lancement de la boutique en ligne. Pour la première fois, les collections 123 sont accessibles partout en Afrique de l\'Ouest. La livraison express s\'étend à 5 pays.',
  },
  {
    year: '2026',
    title: 'Aujourd\'hui',
    text: 'Plus de 15 artisans, des matières sélectionnées aux quatre coins du monde, et une communauté de clients fidèles qui partagent nos valeurs d\'excellence et d\'élégance intemporelle.',
  },
]

const VALUES = [
  {
    icon: '✦',
    title: 'Artisanat',
    text: 'Chaque point de couture est posé à la main. Nos artisans consacrent en moyenne 18 heures à la confection d\'une robe signature.',
  },
  {
    icon: '◆',
    title: 'Matières',
    text: 'Nous ne sélectionnons que les meilleurs tissus : soie de Lyon, cachemire d\'Écosse, denim selvedge du Japon, cuir de veau d\'Italie.',
  },
  {
    icon: '●',
    title: 'Durabilité',
    text: 'Contre la fast fashion, nous produisons en quantités limitées. Nos pièces sont conçues pour durer une vie et traverser les tendances.',
  },
  {
    icon: '★',
    title: 'Héritage',
    text: 'Nés en Afrique de l\'Ouest, nous portons l\'ambition de montrer que l\'excellence n\'a pas de frontières géographiques.',
  },
]

export default function HistoirePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black">

        {/* Hero */}
        <section className="relative pt-40 pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,168,76,0.07)_0%,transparent_60%)]" />
          <div className="absolute inset-0"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg,rgba(201,168,76,0.03) 0,rgba(201,168,76,0.03) 1px,transparent 0,transparent 80px)' }}
          />

          <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
            <span className="section-tag">Depuis 2010</span>
            <h1 className="font-display text-[clamp(52px,8vw,100px)] font-light leading-none text-brand-white mb-8">
              Notre <em className="italic text-brand-gold">Histoire</em>
            </h1>
            <p className="text-[14px] leading-loose text-brand-gray max-w-2xl mx-auto">
              La Maison 123 est née d&apos;une conviction : l&apos;élégance ne se résume pas à une adresse
              sur un boulevard parisien. Elle se cultive, partout, avec passion et savoir-faire.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="max-w-5xl mx-auto px-8 pb-28">
          <div className="relative">
            {/* Ligne centrale */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-gold/40 via-brand-gold/20 to-transparent hidden lg:block" />

            <div className="space-y-0">
              {TIMELINE.map((item, i) => (
                <div key={item.year}
                  className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 py-12 border-b border-white/5
                    ${i % 2 === 0 ? '' : 'direction-rtl'}`}>

                  {/* Année */}
                  <div className={`flex ${i % 2 === 0 ? 'lg:justify-end lg:text-right' : 'lg:col-start-2 lg:justify-start'}`}>
                    <div>
                      <p className="font-display text-[60px] font-light text-brand-gold/20 leading-none mb-2">{item.year}</p>
                      <h3 className="font-display text-2xl font-light text-brand-white mb-3">{item.title}</h3>
                      <p className="text-[13px] leading-loose text-brand-gray max-w-sm">{item.text}</p>
                    </div>
                  </div>

                  {/* Point central */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
                    <div className="w-4 h-4 rounded-full bg-brand-gold border-4 border-brand-black" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="bg-brand-dark py-28 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="section-tag">Ce qui nous guide</span>
              <h2 className="section-title">Nos <em className="italic">Valeurs</em></h2>
              <div className="section-divider" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {VALUES.map(v => (
                <div key={v.title} className="border border-white/5 p-8 hover:border-brand-gold/20 transition-colors duration-500">
                  <span className="text-brand-gold text-2xl block mb-6">{v.icon}</span>
                  <h3 className="font-display text-xl font-light text-brand-white mb-4">{v.title}</h3>
                  <p className="text-[12px] leading-loose text-brand-gray">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-28 px-8 text-center">
          <p className="font-display text-3xl font-light text-brand-white mb-4">
            Rejoignez la <em className="italic text-brand-gold">Maison</em>
          </p>
          <p className="text-[13px] text-brand-gray mb-10 max-w-md mx-auto leading-loose">
            Découvrez nos collections et faites partie de cette aventure qui célèbre l&apos;élégance africaine.
          </p>
          <Link href="/produits" className="btn-gold">
            <span>Découvrir la Collection</span>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}