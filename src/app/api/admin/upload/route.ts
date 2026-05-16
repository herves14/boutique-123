// src/app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configuration Cloudinary (via variables d'environnement)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
const MAX_SIZE_MB   = 5
const MAX_SIZE      = MAX_SIZE_MB * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file     = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 })
    }

    // Vérifier le type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: `Format non supporté. Formats acceptés : JPG, PNG, WebP, AVIF`
      }, { status: 400 })
    }

    // Vérifier la taille
    if (file.size > MAX_SIZE) {
      return NextResponse.json({
        error: `Fichier trop lourd (max ${MAX_SIZE_MB}MB). Votre fichier : ${(file.size / 1024 / 1024).toFixed(1)}MB`
      }, { status: 400 })
    }

    // Lire le contenu et convertir en base64
    const bytes      = await file.arrayBuffer()
    const buffer     = Buffer.from(bytes)
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`

    // Uploader sur Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder:           'products',
      use_filename:     false,
      unique_filename:  true,
      overwrite:        false,
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }, // optimisation automatique
      ],
    })

    return NextResponse.json({
      success:   true,
      url:       result.secure_url,
      publicId:  result.public_id,   // nécessaire pour la suppression
      filename:  result.original_filename,
      size:      file.size,
      type:      file.type,
      width:     result.width,
      height:    result.height,
    })

  } catch (error) {
    console.error('[POST /api/admin/upload]', error)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}

// Supprimer une image Cloudinary via son public_id
export async function DELETE(req: NextRequest) {
  try {
    const { publicId } = await req.json()

    if (!publicId) {
      return NextResponse.json({ error: 'public_id requis' }, { status: 400 })
    }

    // Sécurité : le public_id ne doit contenir que des caractères valides
    if (!/^[a-zA-Z0-9/_\-\.]+$/.test(publicId)) {
      return NextResponse.json({ error: 'public_id invalide' }, { status: 400 })
    }

    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result !== 'ok') {
      return NextResponse.json({ error: 'Suppression échouée', detail: result.result }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[DELETE /api/admin/upload]', error)
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}