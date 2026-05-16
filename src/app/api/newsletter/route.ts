// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    // Vérifier si déjà inscrit
    const existing = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Cet email est déjà inscrit' },
        { status: 409 }
      )
    }

    await prisma.newsletter.create({
      data: { email: email.toLowerCase().trim() },
    })

    return NextResponse.json({ success: true }, { status: 201 })

  } catch (error) {
    console.error('[POST /api/newsletter]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// GET — pour l'admin (liste des inscrits)
export async function GET() {
  try {
    const [subscribers, total] = await Promise.all([
      prisma.newsletter.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.newsletter.count(),
    ])
    return NextResponse.json({ subscribers, total })
  } catch (error) {
    console.error('[GET /api/newsletter]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 })

    await prisma.newsletter.delete({ where: { email } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/newsletter]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}