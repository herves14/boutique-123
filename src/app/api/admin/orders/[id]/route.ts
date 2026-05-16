// src/app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json()
    const order = await prisma.order.update({
      where: { id: params.id },
      data:  { status },
    })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}