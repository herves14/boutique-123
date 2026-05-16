'use client'
// src/components/sections/MarqueeSection.tsx
import { motion } from 'framer-motion'

const ITEMS_TOP = [
  'Nouvelle Collection',
  'Prêt-à-Porter Luxe',
  'Livraison Mondiale',
  'Savoir-Faire Artisanal',
  'Matières Premières',
  'Édition Limitée',
]

const ITEMS_BOTTOM = [
  'Collection 2026',
  'Mode Africaine',
  'Élégance Intemporelle',
  'Fait à la Main',
  'Cotonou · Paris · Milan',
  'Design Exclusif',
]

function Rail({ items, direction = 1, color = '#C9A84C' }: {
  items: string[]
  direction?: 1 | -1
  color?: string
}) {
  const doubled = [...items, ...items, ...items]

  return (
    <div className="overflow-hidden py-3">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: direction === 1 ? ['0%', '-33.33%'] : ['-33.33%', '0%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 px-8 text-[10px] font-medium
              tracking-[0.4em] uppercase"
            style={{ color }}
          >
            {item}
            <span className="opacity-30 text-[8px]">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function MarqueeSection() {
  return (
    <div className="relative overflow-hidden bg-[oklch(0.13_0.02_270)] border-y border-white/5 py-1">
      {/* Glow latéral gauche */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, oklch(0.13 0.02 270), transparent)' }} />
      {/* Glow latéral droit */}
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, oklch(0.13 0.02 270), transparent)' }} />

      {/* Rail supérieur — or — gauche */}
      <Rail items={ITEMS_TOP} direction={1} color="#C9A84C" />

      {/* Séparateur */}
      <div className="h-px bg-white/5 mx-8" />

      {/* Rail inférieur — blanc — droite */}
      <Rail items={ITEMS_BOTTOM} direction={-1} color="rgba(255,255,255,0.35)" />
    </div>
  )
}