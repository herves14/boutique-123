// src/app/atelier/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "L'Atelier — 123",
  description: "Découvrez l'atelier 123, où chaque pièce prend vie entre les mains de nos artisans.",
}

const STEPS = [
  {
    num: '01',
    title: 'La Sélection des Matières',
    text: 'Tout commence par le choix du tissu. Nos acheteurs parcourent les meilleures maisons de tissus en Italie, au Japon et en France pour sélectionner des matières d\'exception : soie, cachemire, denim selvedge, cuir pleine fleur.',
    detail: 'Jusqu\'à 6 mois de sélection pour une nouvelle matière',
  },
  {
    num: '02',
    title: 'La Conception',
    text: 'Nos designers créent les patrons à la main sur papier calque. Chaque pièce est pensée pour sublimer la silhouette, travaillée jusqu\'à ce que la coupe soit parfaite. Des dizaines de toiles sont réalisées avant le modèle définitif.',
    detail: 'En moyenne 3 semaines de conception par modèle',
  },
  {
    num: '03',
    title: 'La Coupe',
    text: 'Le tissu est découpé à la main, pli par pli, pour garantir la régularité du fil. Cette étape demande une précision absolue : un millimètre d\'écart peut changer la silhouette entière.',
    detail: 'Coupé à la main, jamais au laser',
  },
  {
    num: '04',
    title: 'L\'Assemblage',
    text: 'Nos couturières assemblent les pièces avec soin. Les coutures sont cousues deux fois pour la solidité. Les finitions intérieures sont aussi soignées que l\'extérieur — un vêtement 123 est beau sous toutes les coutures.',
    detail: '18h de travail en moyenne pour une robe signature',
  },
  {
    num: '05',
    title: 'Les Finitions',
    text: 'Boutonnières à la main, ourlets au point invisible, étiquettes cousues à plat — les finitions sont le signe distinctif d\'un vêtement de qualité. Chaque pièce est vérifiée point par point avant d\'être acceptée.',
    detail: 'Contrôle qualité en 47 points',
  },
  {
    num: '06',
    title: 'Le Contrôle Final',
    text: 'Avant de rejoindre la boutique, chaque pièce est essayée sur mannequin vivant. Si quelque chose ne va pas — une asymétrie, une tension — la pièce repart en atelier. Nous ne commercialisons que l\'excellence.',
    detail: '5% des pièces retournent en atelier pour corrections',
  },
]

export default function AtelierPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black">

        {/* Hero */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_60%,rgba(201,168,76,0.07)_0%,transparent_55%)]" />
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-gold/3 to-transparent" />

          <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-10">
            <div className="max-w-3xl">
              <span className="section-tag">Savoir-Faire</span>
              <h1 className="font-display text-[clamp(52px,8vw,100px)] font-light leading-none text-brand-white mb-8">
                L&apos;<em className="italic text-brand-gold">Atelier</em>
              </h1>
              <p className="text-[14px] leading-loose text-brand-gray max-w-xl">
                Derrière chaque vêtement 123, il y a des mains expertes, des heures de patience
                et une quête incessante de perfection. Voici comment naît une pièce d&apos;exception.
              </p>
            </div>
          </div>
        </section>

        {/* Citation */}
        <section className="bg-brand-dark py-20 px-8 text-center border-y border-white/5">
          <blockquote className="max-w-3xl mx-auto">
            <p className="font-display text-[clamp(24px,3vw,38px)] font-light italic text-brand-white leading-relaxed mb-6">
              &quot;Un vêtement bien fait ne se remarque pas. Il se sent.
              Il donne confiance, il épouse le corps, il dure.&quot;
            </p>
            <cite className="text-[10px] tracking-[0.5em] uppercase text-brand-gold not-italic">
              — Fondateur de la Maison 123
            </cite>
          </blockquote>
        </section>

        {/* Process */}
        <section className="max-w-6xl mx-auto px-8 py-28">
          <div className="text-center mb-20">
            <span className="section-tag">Notre Processus</span>
            <h2 className="section-title">De la Matière <em className="italic">à la Pièce</em></h2>
            <div className="section-divider" />
          </div>

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <div key={step.num}
                className={`grid grid-cols-1 lg:grid-cols-[120px_1fr_240px] gap-8 py-12 border-b border-white/5
                  hover:bg-white/[0.01] transition-colors group`}>

                {/* Numéro */}
                <div className="flex items-start">
                  <span className="font-display text-[60px] font-light text-brand-gold/20 leading-none
                    group-hover:text-brand-gold/40 transition-colors">
                    {step.num}
                  </span>
                </div>

                {/* Contenu */}
                <div>
                  <h3 className="font-display text-2xl font-light text-brand-white mb-4">{step.title}</h3>
                  <p className="text-[13px] leading-loose text-brand-gray max-w-2xl">{step.text}</p>
                </div>

                {/* Détail */}
                <div className="flex items-center lg:justify-end">
                  <div className="border border-brand-gold/20 px-5 py-3 bg-brand-gold/5">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-brand-gold">{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Chiffres */}
        <section className="bg-brand-dark py-20 px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { num: '15+', label: 'Artisans' },
              { num: '18h', label: 'Par robe signature' },
              { num: '47',  label: 'Points de contrôle' },
              { num: '0',   label: 'Machine pour les finitions' },
            ].map(({ num, label }) => (
              <div key={label} className="border border-white/5 p-8">
                <p className="font-display text-[48px] font-light text-brand-gold leading-none mb-3">{num}</p>
                <p className="text-[10px] tracking-[0.35em] uppercase text-brand-gray">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-8 text-center">
          <h2 className="font-display text-3xl font-light text-brand-white mb-4">
            Portez l&apos;<em className="italic text-brand-gold">Excellence</em>
          </h2>
          <p className="text-[13px] text-brand-gray mb-10 max-w-md mx-auto">
            Chaque pièce que vous achetez est le fruit de ce savoir-faire.
          </p>
          <Link href="/produits" className="btn-gold"><span>Voir la Collection</span></Link>
        </section>
      </main>
      <Footer />
    </>
  )
}