// src/app/layout.tsx
import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: '123 — Prêt-à-Porter', template: '%s | 123' },
  description: "Maison de mode 123. Vêtements, jeans, chaussures et accessoires prêt-à-porter de luxe. Livraison à Cotonou et partout en Afrique de l'Ouest.",
  keywords: ['mode', 'luxe', 'prêt-à-porter', 'vêtements', 'jeans', 'chaussures', '123', 'Cotonou', 'Bénin'],
  authors: [{ name: '123 Maison' }],
  creator: '123 Maison',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: '123 — Prêt-à-Porter',
    description: "Élégance intemporelle. Savoir-faire d'exception.",
    type: 'website',
    locale: 'fr_FR',
    siteName: '123 Maison',
  },
  twitter: {
    card: 'summary_large_image',
    title: '123 — Prêt-à-Porter',
    description: "Élégance intemporelle. Savoir-faire d'exception.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="bg-brand-black text-brand-cream font-montserrat antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}