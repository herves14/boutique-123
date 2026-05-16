// src/app/admin/produits/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import AdminNav from '@/components/admin/AdminNav'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import { Plus, Pencil, Eye } from 'lucide-react'

export const metadata = { title: 'Produits — Admin 123' }

async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    })
  } catch { return [] }
}

export default async function AdminProduitsPage() {
  const products = await getProducts()

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8 lg:p-12">

        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[9px] tracking-[0.5em] uppercase text-brand-gold mb-2">Catalogue</p>
            <h1 className="font-display text-4xl font-light text-brand-white">
              Produits <span className="text-brand-gray text-2xl">({products.length})</span>
            </h1>
          </div>
          <Link href="/admin/produits/nouveau" className="btn-gold flex items-center gap-2">
            <Plus size={14} />
            <span>Ajouter un produit</span>
          </Link>
        </div>

        <div className="bg-brand-dark border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Produit', 'Catégorie', 'Prix', 'Stock', 'Tailles', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-[9px] tracking-[0.4em] uppercase text-brand-gray font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-brand-gray text-[13px]">
                      Aucun produit —{' '}
                      <Link href="/admin/produits/nouveau" className="text-brand-gold hover:underline">
                        Ajouter le premier
                      </Link>
                    </td>
                  </tr>
                ) : products.map(product => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-brand-dark2 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {product.images[0]
                            ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            : <span className="font-display text-brand-gold/40 text-xs">123</span>}
                        </div>
                        <div>
                          <p className="text-[13px] text-brand-cream font-light">{product.name}</p>
                          <p className="text-[10px] text-brand-gray mt-0.5 font-mono">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-brand-gray">{product.category?.name ?? '—'}</td>
                    <td className="px-6 py-4 text-[13px] text-brand-gold-light">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[12px] font-medium ${
                        product.stock === 0 ? 'text-red-400' :
                        product.stock <= 3  ? 'text-yellow-400' : 'text-green-400'
                      }`}>{product.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.length === 0
                          ? <span className="text-[10px] text-brand-gray">—</span>
                          : product.sizes.map(s => (
                            <span key={s} className="text-[9px] border border-white/15 px-1.5 py-0.5 text-brand-gray">{s}</span>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {product.isNew && (
                          <span className="text-[8px] tracking-[0.3em] uppercase text-brand-gold border border-brand-gold/30 px-2 py-0.5 w-fit">Nouveau</span>
                        )}
                        {product.isFeatured && (
                          <span className="text-[8px] tracking-[0.3em] uppercase text-blue-400 border border-blue-400/30 px-2 py-0.5 w-fit">Vedette</span>
                        )}
                        {!product.isNew && !product.isFeatured && (
                          <span className="text-[10px] text-brand-gray">Standard</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/produits/${product.slug}`} target="_blank"
                          className="text-brand-gray hover:text-brand-cream transition-colors" title="Voir">
                          <Eye size={14} strokeWidth={1.5} />
                        </Link>
                        <Link href={`/admin/produits/${product.id}`}
                          className="text-brand-gray hover:text-brand-gold transition-colors" title="Modifier">
                          <Pencil size={14} strokeWidth={1.5} />
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}