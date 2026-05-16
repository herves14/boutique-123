// src/app/tailles/page.tsx
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guide des Tailles — 123',
  description: 'Trouvez votre taille parfaite avec le guide officiel 123. Tableaux de correspondance et conseils de mesure.',
}

const VETEMENTS = [
  { taille: 'XS', poitrine: '82–86', taille_m: '62–66', hanches: '88–92', fr: '34–36' },
  { taille: 'S',  poitrine: '86–90', taille_m: '66–70', hanches: '92–96', fr: '38' },
  { taille: 'M',  poitrine: '90–94', taille_m: '70–74', hanches: '96–100', fr: '40' },
  { taille: 'L',  poitrine: '94–98', taille_m: '74–78', hanches: '100–104', fr: '42' },
  { taille: 'XL', poitrine: '98–104', taille_m: '78–84', hanches: '104–110', fr: '44' },
  { taille: 'XXL', poitrine: '104–110', taille_m: '84–90', hanches: '110–116', fr: '46' },
]

const JEANS = [
  { taille: 'XS/26', tour_taille: '62–66', tour_hanches: '88–92', entre_jambe: '76' },
  { taille: 'S/28',  tour_taille: '66–70', tour_hanches: '92–96', entre_jambe: '77' },
  { taille: 'M/30',  tour_taille: '70–74', tour_hanches: '96–100', entre_jambe: '78' },
  { taille: 'L/32',  tour_taille: '74–78', tour_hanches: '100–104', entre_jambe: '79' },
  { taille: 'XL/34', tour_taille: '78–84', tour_hanches: '104–110', entre_jambe: '80' },
  { taille: 'XXL/36', tour_taille: '84–90', tour_hanches: '110–116', entre_jambe: '81' },
]

const CHAUSSURES = [
  { fr: '35', eu: '35', uk: '2.5', us: '5',   cm: '22.5' },
  { fr: '36', eu: '36', uk: '3.5', us: '6',   cm: '23' },
  { fr: '37', eu: '37', uk: '4',   us: '6.5', cm: '23.5' },
  { fr: '38', eu: '38', uk: '5',   us: '7.5', cm: '24.5' },
  { fr: '39', eu: '39', uk: '6',   us: '8.5', cm: '25' },
  { fr: '40', eu: '40', uk: '6.5', us: '9',   cm: '25.5' },
  { fr: '41', eu: '41', uk: '7.5', us: '10',  cm: '26.5' },
]

const CONSEILS = [
  {
    icon: '📏',
    title: 'Tour de poitrine',
    text: 'Passez le mètre-ruban horizontalement autour de la partie la plus large de la poitrine, en maintenant le ruban parallèle au sol. Respirez normalement.',
  },
  {
    icon: '⭕',
    title: 'Tour de taille',
    text: 'Mesurez la partie la plus fine de votre taille, généralement 2 à 3 cm au-dessus du nombril. Ne serrez pas le ruban.',
  },
  {
    icon: '🔄',
    title: 'Tour de hanches',
    text: 'Placez le ruban autour de la partie la plus large de vos hanches et fesses, pieds joints. Maintenez le ruban parallèle au sol.',
  },
  {
    icon: '📐',
    title: 'Longueur de jambe',
    text: 'Mesurez depuis l\'entrejambe jusqu\'au sol, pieds nus. Demandez de l\'aide à quelqu\'un pour plus de précision.',
  },
]

export default function TaillesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black">

        {/* Hero */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(201,168,76,0.07)_0%,transparent_60%)]" />
          <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
            <span className="section-tag">Fitting Parfait</span>
            <h1 className="font-display text-[clamp(48px,7vw,90px)] font-light leading-none text-brand-white mb-6">
              Guide des <em className="italic text-brand-gold">Tailles</em>
            </h1>
            <p className="text-[13px] leading-loose text-brand-gray max-w-xl mx-auto">
              Trouvez votre taille idéale en quelques mesures. En cas de doute,
              notre équipe est disponible pour vous conseiller personnellement.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-8 pb-28 space-y-20">

          {/* Comment se mesurer */}
          <section>
            <div className="text-center mb-14">
              <span className="section-tag">Étape 1</span>
              <h2 className="section-title">Comment se <em className="italic">mesurer</em></h2>
              <div className="section-divider" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CONSEILS.map(({ icon, title, text }) => (
                <div key={title} className="border border-white/5 p-7 hover:border-brand-gold/20 transition-colors">
                  <span className="text-3xl block mb-5">{icon}</span>
                  <h3 className="font-display text-lg font-light text-brand-white mb-3">{title}</h3>
                  <p className="text-[12px] leading-loose text-brand-gray">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 border border-brand-gold/20 bg-brand-gold/5 p-6">
              <p className="text-[11px] tracking-wider text-brand-gold mb-2">💡 Conseil</p>
              <p className="text-[13px] text-brand-gray leading-relaxed">
                Mesurez-vous en sous-vêtements, debout droit, pour des mesures précises.
                Utilisez un mètre-ruban souple (non extensible). Notez vos mesures en centimètres.
              </p>
            </div>
          </section>

          {/* Vêtements */}
          <section>
            <div className="text-center mb-14">
              <span className="section-tag">Étape 2</span>
              <h2 className="section-title">Vêtements & <em className="italic">Robes</em></h2>
              <div className="section-divider" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-gold/20">
                    {['Taille 123', 'Tour de poitrine (cm)', 'Tour de taille (cm)', 'Tour de hanches (cm)', 'Équiv. FR'].map(h => (
                      <th key={h} className="py-4 px-5 text-left text-[9px] tracking-[0.4em] uppercase text-brand-gold font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VETEMENTS.map((row, i) => (
                    <tr key={row.taille}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors
                        ${i % 2 === 0 ? '' : 'bg-brand-dark/30'}`}>
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-[15px] text-brand-gold">{row.taille}</span>
                      </td>
                      <td className="py-4 px-5 text-[13px] text-brand-cream">{row.poitrine}</td>
                      <td className="py-4 px-5 text-[13px] text-brand-cream">{row.taille_m}</td>
                      <td className="py-4 px-5 text-[13px] text-brand-cream">{row.hanches}</td>
                      <td className="py-4 px-5 text-[12px] text-brand-gray">{row.fr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-brand-gray mt-4 tracking-wider">
              * Pour les blazers et manteaux structurés, prenez la taille au-dessus si vous êtes entre deux tailles.
            </p>
          </section>

          {/* Jeans */}
          <section>
            <div className="text-center mb-14">
              <span className="section-tag">Denim</span>
              <h2 className="section-title"><em className="italic">Jeans</em> & Pantalons</h2>
              <div className="section-divider" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-gold/20">
                    {['Taille', 'Tour de taille (cm)', 'Tour de hanches (cm)', 'Entrejambe (cm)'].map(h => (
                      <th key={h} className="py-4 px-5 text-left text-[9px] tracking-[0.4em] uppercase text-brand-gold font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {JEANS.map((row, i) => (
                    <tr key={row.taille}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors
                        ${i % 2 === 0 ? '' : 'bg-brand-dark/30'}`}>
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-[15px] text-brand-gold">{row.taille}</span>
                      </td>
                      <td className="py-4 px-5 text-[13px] text-brand-cream">{row.tour_taille}</td>
                      <td className="py-4 px-5 text-[13px] text-brand-cream">{row.tour_hanches}</td>
                      <td className="py-4 px-5 text-[13px] text-brand-cream">{row.entre_jambe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Chaussures */}
          <section>
            <div className="text-center mb-14">
              <span className="section-tag">Footwear</span>
              <h2 className="section-title">Guide <em className="italic">Chaussures</em></h2>
              <div className="section-divider" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-gold/20">
                    {['Taille FR/EU', 'UK', 'US', 'Longueur pied (cm)'].map(h => (
                      <th key={h} className="py-4 px-5 text-left text-[9px] tracking-[0.4em] uppercase text-brand-gold font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CHAUSSURES.map((row, i) => (
                    <tr key={row.fr}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors
                        ${i % 2 === 0 ? '' : 'bg-brand-dark/30'}`}>
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-[15px] text-brand-gold">{row.fr}</span>
                      </td>
                      <td className="py-4 px-5 text-[13px] text-brand-cream">{row.uk}</td>
                      <td className="py-4 px-5 text-[13px] text-brand-cream">{row.us}</td>
                      <td className="py-4 px-5 text-[13px] text-brand-cream">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 border border-brand-gold/15 bg-brand-gold/5 p-6">
              <p className="text-[11px] tracking-wider text-brand-gold mb-2">📏 Comment mesurer votre pied</p>
              <p className="text-[13px] text-brand-gray leading-relaxed">
                Posez votre pied sur une feuille de papier, tracez son contour et mesurez la distance
                entre le talon et l&apos;orteil le plus long. Prenez la mesure en fin de journée
                (le pied est légèrement plus grand). En cas de doute entre deux tailles, prenez la plus grande.
              </p>
            </div>
          </section>

          {/* Aide personnalisée */}
          <section className="bg-brand-dark border border-white/5 p-10 text-center">
            <p className="font-display text-3xl font-light text-brand-white mb-4">
              Besoin d&apos;aide pour trouver <em className="italic text-brand-gold">votre taille</em> ?
            </p>
            <p className="text-[13px] text-brand-gray mb-8 max-w-md mx-auto leading-loose">
              Notre équipe peut vous conseiller personnellement.
              Envoyez-nous vos mesures et nous vous recommanderons la taille idéale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-gold">
                <span>Demander un conseil</span>
              </Link>
              <Link href="/produits"
                className="px-8 py-4 border border-white/15 text-[10px] tracking-[0.35em] uppercase
                  text-brand-gray hover:border-brand-gold hover:text-brand-gold transition-colors">
                Voir la collection
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}