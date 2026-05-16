'use client'
// src/components/admin/ImageUploader.tsx
import { useState, useRef, useCallback } from 'react'

interface Props {
  images:   string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

type UploadStatus = {
  id:       string
  file:     File
  preview:  string
  progress: number
  status:   'uploading' | 'done' | 'error'
  error?:   string
  url?:     string
  publicId?: string  // ← nécessaire pour la suppression Cloudinary
}

export default function ImageUploader({ images, onChange, maxImages = 8 }: Props) {
  const [uploads,  setUploads]  = useState<UploadStatus[]>([])
  const [dragging, setDragging] = useState(false)
  // Map url → publicId pour pouvoir supprimer depuis images[]
  const publicIdMap = useRef<Record<string, string>>({})
  const inputRef    = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File) => {
    const id      = Math.random().toString(36).slice(2)
    const preview = URL.createObjectURL(file)

    setUploads(prev => [...prev, { id, file, preview, progress: 0, status: 'uploading' }])

    try {
      // Progression simulée (Cloudinary ne stream pas la progression côté serveur)
      const progressInterval = setInterval(() => {
        setUploads(prev => prev.map(u =>
          u.id === id && u.progress < 80
            ? { ...u, progress: u.progress + 20 }
            : u
        ))
      }, 150)

      const formData = new FormData()
      formData.append('file', file)

      const res  = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()

      clearInterval(progressInterval)

      if (!res.ok) throw new Error(data.error ?? 'Erreur upload')

      // Stocker l'association url → publicId pour la suppression future
      publicIdMap.current[data.url] = data.publicId

      setUploads(prev => prev.map(u =>
        u.id === id
          ? { ...u, progress: 100, status: 'done', url: data.url, publicId: data.publicId }
          : u
      ))

      onChange([...images, data.url])

    } catch (error: any) {
      setUploads(prev => prev.map(u =>
        u.id === id
          ? { ...u, status: 'error', error: error.message ?? 'Erreur' }
          : u
      ))
    }
  }, [images, onChange])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const remaining = maxImages - images.length
    if (remaining <= 0) return
    Array.from(files).slice(0, remaining).forEach(file => uploadFile(file))
  }, [images.length, maxImages, uploadFile])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = async (url: string, index: number) => {
    // Retirer de l'UI immédiatement
    onChange(images.filter((_, i) => i !== index))

    // Récupérer le publicId depuis la map (upload de la session en cours)
    // ou depuis l'URL Cloudinary pour les images déjà enregistrées
    const publicId = publicIdMap.current[url] ?? extractPublicId(url)

    if (publicId) {
      await fetch('/api/admin/upload', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ publicId }),
      }).catch(() => {})
    }
  }

  const removeUpload = (id: string) =>
    setUploads(prev => prev.filter(u => u.id !== id))

  const canAddMore = images.length < maxImages

  return (
    <div className="space-y-4">

      {/* Zone de dépôt */}
      {canAddMore && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-sm cursor-pointer
            flex flex-col items-center justify-center py-12 px-6 text-center
            transition-all duration-300 group
            ${dragging
              ? 'border-brand-gold bg-brand-gold/10'
              : 'border-white/15 hover:border-brand-gold/50 hover:bg-white/[0.02]'}`}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4
            transition-colors border
            ${dragging ? 'border-brand-gold bg-brand-gold/20' : 'border-white/10 bg-brand-dark2 group-hover:border-brand-gold/30'}`}>
            <svg className={`transition-colors ${dragging ? 'text-brand-gold' : 'text-brand-gray group-hover:text-brand-gold'}`}
              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>

          <p className={`text-[13px] font-light mb-1 transition-colors
            ${dragging ? 'text-brand-gold' : 'text-brand-cream group-hover:text-brand-gold'}`}>
            {dragging ? 'Déposez vos images ici' : 'Glissez & déposez vos images'}
          </p>
          <p className="text-[11px] text-brand-gray">
            ou cliquez pour sélectionner — JPG, PNG, WebP · max 5MB
          </p>
          <p className="text-[10px] text-brand-gray/60 mt-2 tracking-wider">
            {images.length}/{maxImages} images
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Aperçus */}
      {(images.length > 0 || uploads.length > 0) && (
        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase text-brand-gray mb-3">
            Images ({images.length})
          </p>

          <div className="grid grid-cols-4 gap-3">

            {/* Images confirmées */}
            {images.map((url, i) => (
              <div key={url} className="relative group aspect-square">
                <img
                  src={url} alt={`Image ${i + 1}`}
                  className="w-full h-full object-cover border border-white/10"
                />

                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-brand-gold text-brand-black
                    text-[8px] text-center py-1 tracking-wider font-medium">
                    Principale
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                  transition-opacity flex flex-col items-center justify-center gap-2">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = [...images]
                        newImages.splice(i, 1)
                        onChange([url, ...newImages])
                      }}
                      className="text-[8px] tracking-widest uppercase bg-brand-gold text-brand-black
                        px-2 py-1 hover:bg-brand-gold-light transition-colors"
                    >
                      ★ Principale
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url, i)}
                    className="text-[8px] tracking-widest uppercase bg-red-600 text-white
                      px-2 py-1 hover:bg-red-500 transition-colors"
                  >
                    ✕ Supprimer
                  </button>
                </div>

                <div className="absolute top-1 left-1 w-5 h-5 bg-black/70 flex items-center
                  justify-center text-[9px] text-brand-gray">
                  {i + 1}
                </div>
              </div>
            ))}

            {/* Uploads en cours */}
            {uploads.filter(u => u.status === 'uploading' || u.status === 'error').map(upload => (
              <div key={upload.id} className="relative aspect-square">
                <img
                  src={upload.preview} alt=""
                  className="w-full h-full object-cover border border-white/10 opacity-50"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                  {upload.status === 'uploading' ? (
                    <>
                      <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-brand-gold
                        animate-spin mb-2" />
                      <p className="text-[9px] text-brand-gold">{upload.progress}%</p>
                    </>
                  ) : (
                    <>
                      <span className="text-red-400 text-xl mb-1">✕</span>
                      <p className="text-[9px] text-red-400 text-center px-2 leading-tight">
                        {upload.error}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeUpload(upload.id)}
                        className="mt-2 text-[8px] text-brand-gray hover:text-brand-cream underline"
                      >
                        Retirer
                      </button>
                    </>
                  )}
                </div>
                {upload.status === 'uploading' && (
                  <div className="absolute bottom-0 left-0 h-0.5 bg-brand-gold transition-all"
                    style={{ width: `${upload.progress}%` }} />
                )}
              </div>
            ))}

            {/* Bouton + */}
            {canAddMore && images.length > 0 && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-white/15 flex flex-col
                  items-center justify-center hover:border-brand-gold/50 transition-colors group"
              >
                <span className="text-2xl text-brand-gray group-hover:text-brand-gold transition-colors">+</span>
                <span className="text-[9px] text-brand-gray mt-1 tracking-wider">Ajouter</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conseils */}
      <div className="flex items-start gap-3 border border-brand-gold/10 bg-brand-gold/5 p-4">
        <span className="text-brand-gold text-lg flex-shrink-0">💡</span>
        <div className="space-y-1">
          <p className="text-[11px] text-brand-gold tracking-wider">Conseils pour de belles photos produit</p>
          <ul className="text-[11px] text-brand-gray space-y-0.5">
            <li>• Fond blanc ou neutre pour la photo principale</li>
            <li>• Résolution minimum 800×800px recommandée</li>
            <li>• La 1ère image sera affichée sur les cards de la collection</li>
            <li>• Jusqu&apos;à {maxImages} images par produit</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Extrait le public_id depuis une URL Cloudinary.
 * Ex: https://res.cloudinary.com/mon-cloud/image/upload/v123/products/abc.webp
 *     → "products/abc"
 */
function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/)
    return match ? match[1] : null
  } catch {
    return null
  }
}