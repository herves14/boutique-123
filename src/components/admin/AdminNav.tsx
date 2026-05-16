'use client'
// src/components/admin/AdminNav.tsx
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, Tag,
  LogOut, ExternalLink
} from 'lucide-react'

const links = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/produits',   icon: Package,         label: 'Produits' },
  { href: '/admin/commandes',  icon: ShoppingBag,     label: 'Commandes' },
  { href: '/admin/categories', icon: Tag,             label: 'Catégories' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-brand-dark border-r border-white/5
      flex flex-col flex-shrink-0">

      {/* Logo */}
      <div className="px-8 py-8 border-b border-white/5">
        <div className="font-display text-2xl font-light tracking-[0.3em] text-brand-white">
          1<span className="text-brand-gold">2</span>3
        </div>
        <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray mt-1">
          Administration
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 text-[11px] tracking-[0.2em]
                uppercase transition-all duration-200 rounded-sm
                ${active
                  ? 'bg-brand-gold/10 text-brand-gold border-l-2 border-brand-gold pl-[14px]'
                  : 'text-brand-gray hover:text-brand-cream hover:bg-white/5'}`}
            >
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-white/5 space-y-1">
        <Link
          href="/" target="_blank"
          className="flex items-center gap-3 px-4 py-3 text-[11px] tracking-[0.2em]
            uppercase text-brand-gray hover:text-brand-cream hover:bg-white/5 transition-all"
        >
          <ExternalLink size={15} strokeWidth={1.5} />
          Voir le site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-[11px] tracking-[0.2em]
            uppercase text-brand-gray hover:text-red-400 hover:bg-red-900/10 transition-all"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}