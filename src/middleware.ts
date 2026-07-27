import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Simple in-memory rate limiting map. For Serverless edge functions, 
// this resets frequently. Consider @upstash/ratelimit for production.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW_MS = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 300 // 300 req per IP per minute
const MAX_AUTH_REQUESTS = 50 // Stricter limit for login

function checkRateLimit(ip: string, isAuthRoute: boolean): boolean {
    const now = Date.now()
    const limit = isAuthRoute ? MAX_AUTH_REQUESTS : MAX_REQUESTS_PER_WINDOW
    
    let ipData = rateLimitMap.get(ip)
    if (!ipData) {
        ipData = { count: 0, lastReset: now }
        rateLimitMap.set(ip, ipData)
    }

    if (now - ipData.lastReset > RATE_LIMIT_WINDOW_MS) {
        ipData.count = 0
        ipData.lastReset = now
    }

    if (ipData.count >= limit) {
        return false // Rate limited
    }

    ipData.count++
    return true
}

export async function middleware(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth')
    
    if (!checkRateLimit(ip, isAuthRoute)) {
        return new NextResponse('Too Many Requests', { status: 429 })
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
