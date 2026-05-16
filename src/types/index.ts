// src/types/index.ts
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'EU_35' | 'EU_36' | 'EU_37' | 'EU_38' | 'EU_39' | 'EU_40' | 'EU_41' | 'EU_42' | 'EU_43' | 'EU_44' | 'EU_45' | 'EU_46'

export type ProductWithCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  images: string[]
  isNew: boolean
  isFeatured: boolean
  sizes: Size[]
  categoryId: string
  createdAt: Date
  updatedAt: Date
  category: {
    id: string
    name: string
    slug: string
    createdAt: Date
  }
}

export type FilterOptions = {
  categorySlug?: string
  sizes?: string[]
  isNew?: boolean
  isFeatured?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  page?: number
  limit?: number
}