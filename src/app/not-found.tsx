// src/app/not-found.tsx
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-black flex items-center justify-center px-6">
        <div className="text-center">
          {/* 404 décoratif */}
          <div className="relative mb-12">
            <span className="font-display text-[clamp(120px,20vw,220px)] font-light
              text-white/[0.03] select-none leading-none block">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-px bg-brand-gold mx-auto mb-6" />
                <p className="font-display text-3xl font-light text-brand-white">
                  Page introuvable
                </p>
                <div className="w-16 h-px bg-brand-gold mx-auto mt-6" />
              </div>
            </div>
          </div>

          <p className="text-[12px] tracking-[0.25em] text-brand-gray mb-12 max-w-sm mx-auto leading-loose">
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="btn-gold">
              <span>Retour à l&apos;accueil</span>
            </Link>
            <Link href="/produits" className="btn-outline-gold">
              Voir la collection
            </Link>
          </div>

          {/* Liens rapides */}
          <div className="mt-16 flex flex-wrap justify-center gap-6">
            {[
              { label: 'Jeans',      href: '/categorie/jeans' },
              { label: 'Chaussures', href: '/categorie/chaussures' },
              { label: 'Robes',      href: '/categorie/robes' },
              { label: 'Manteaux',   href: '/categorie/manteaux' },
            ].map(({ label, href }) => (
              <Link
                key={href} href={href}
                className="text-[10px] tracking-[0.4em] uppercase text-brand-gray
                  hover:text-brand-gold transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}