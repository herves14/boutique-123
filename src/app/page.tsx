// src/app/page.tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import MarqueeSection from '@/components/sections/MarqueeSection'
import NewArrivals from '@/components/sections/NewArrivals'
import CollectionGrid from '@/components/sections/CollectionGrid'
import FeaturedBanner from '@/components/sections/FeaturedBanner'
import { prisma } from '@/lib/prisma'

async function getHomeProducts() {
  try {
    const all = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    })

    const newProducts      = all.filter(p => p.isNew).slice(0, 2)
    const featuredProducts = all.filter(p => p.isFeatured).slice(0, 6)
    // Premier produit vedette pour FeaturedBanner, sinon le plus récent
    const bannerProduct    = featuredProducts[0] ?? all[0] ?? null

    return { newProducts, featuredProducts, bannerProduct }
  } catch (e) {
    console.error('[HomePage] Erreur Prisma:', e)
    return { newProducts: [], featuredProducts: [], bannerProduct: null }
  }
}

export default async function HomePage() {
  const { newProducts, featuredProducts, bannerProduct } = await getHomeProducts()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <NewArrivals products={newProducts} />
        <CollectionGrid products={featuredProducts} />
        <FeaturedBanner product={bannerProduct} />
      </main>
      <Footer />
    </>
  )
}