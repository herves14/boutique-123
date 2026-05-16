'use client'
// src/components/admin/DeleteProductButton.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string
  productName: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${productName}" ? Cette action est irréversible.`)) return
    setLoading(true)
    try {
      await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
      router.refresh()
    } catch {
      alert('Erreur lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-brand-gray hover:text-red-400 transition-colors disabled:opacity-40"
      title="Supprimer"
    >
      <Trash2 size={14} strokeWidth={1.5} />
    </button>
  )
}