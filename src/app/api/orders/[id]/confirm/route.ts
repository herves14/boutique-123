// src/app/api/orders/[id]/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { fedapayId, status } = await req.json()

    await prisma.payment.update({
      where: { orderId: params.id },
      data:  {
        status:    status === 'APPROVED' ? 'APPROVED' : 'DECLINED',
        fedapayId: fedapayId ?? undefined,
      },
    })

    if (status === 'APPROVED') {
      await prisma.order.update({
        where: { id: params.id },
        data:  { status: 'CONFIRMED' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PATCH confirm]', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}