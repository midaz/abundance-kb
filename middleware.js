import { NextResponse } from 'next/server'

export function middleware(request) {
    const url = request.nextUrl
    const host = url.host
    const referer = request.headers.get('referer') || ''
    const origin = request.headers.get('origin') || ''

    // 1) Always allow local development
    const isLocal = host.startsWith('localhost:') || host.startsWith('127.0.0.1:')
    if (isLocal) {
        return NextResponse.next()
    }

    // 2) Allow all Vercel preview deployments (any *.vercel.app except the prod host)
    const isVercel = host.endsWith('.vercel.app')
    const isProdVercel = host === 'abundance-kb.vercel.app'
    if (isVercel && !isProdVercel) {
        return NextResponse.next()
    }

    // 3) For prod host, require trusted WordPress Origin/Referer
    if (isProdVercel) {
        const trustedWp = [
            'https://dev-abundance-elected.pantheonsite.io',
            'https://www.abundancenetwork.com',
            'https://abundancenetwork.com'
        ]
        const allowed = trustedWp.some(domain =>
            referer.startsWith(domain) || origin.startsWith(domain)
        )
        if (allowed) {
            return NextResponse.next()
        }
        return new NextResponse(
            '<h1>Access denied</h1>',
            {
                status: 403,
                headers: { 'content-type': 'text/html' }
            }
        )
    }

    // 4) Any other host (unlikely): allow by default
    return NextResponse.next()
}

export const config = {
    // Exclui _next, api, e ficheiros estáticos
    matcher: [
        '/((?!_next/|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|css|js)).*)',
    ],
}