// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind className merge ─────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Prix en XOF (Franc CFA) ─────────────────────────────────────────────────
// Exemples : 89000 → "89 000 FCFA"
export function formatPrice(amount: number, currency: string = 'XOF'): string {
  if (currency === 'XOF') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

// ─── Slug ─────────────────────────────────────────────────────────────────────
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // retire les accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ─── Texte ────────────────────────────────────────────────────────────────────
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '…'
}

// ─── Numéro de commande lisible ───────────────────────────────────────────────
// cuid → "123-2024-ABCD"
export function formatOrderNumber(raw: string): string {
  const year = new Date().getFullYear()
  const short = raw.slice(-6).toUpperCase()
  return `123-${year}-${short}`
}

// ─── Image produit (premier élément de images[]) ─────────────────────────────
export function getProductImage(images: string[], fallback = '/images/placeholder.jpg'): string {
  return images[0] ?? fallback
}

// ─── Label statut commande ────────────────────────────────────────────────────
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING:    'En attente',
  CONFIRMED:  'Confirmée',
  SHIPPED:    'Expédiée',
  DELIVERED:  'Livrée',
  CANCELLED:  'Annulée',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING:   'En attente',
  APPROVED:  'Approuvé',
  DECLINED:  'Refusé',
  CANCELLED: 'Annulé',
}