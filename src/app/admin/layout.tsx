// src/app/admin/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Admin — 123', template: '%s | Admin 123' },
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-brand-cream font-montserrat">
      {children}
    </div>
  )
}