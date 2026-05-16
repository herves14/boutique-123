// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET   = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'change-me-in-production-123maison'
)
const PUBLIC_PATHS = ['/admin/login']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()

  const token = req.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  try {
    await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/admin/login', req.url))
    res.cookies.delete('admin_token')
    return res
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}