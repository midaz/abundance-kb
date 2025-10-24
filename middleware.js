import { NextResponse } from 'next/server'

export function middleware(request) {
    const referer = request.headers.get('referer')
    const { hostname: reqHost } = new URL(request.url)
    const isAllowed = (() => {
        try {
            const { hostname, protocol } = new URL(referer || '')
            const prodHosts = new Set([
                'dev-abundance-elected.pantheonsite.io',
                'www.abundancenetwork.com',
                'abundancenetwork.com',
                'abundanceelected.com'
            ])
            const isLocal = (h) => h === 'localhost' || h === '127.0.0.1' || h === '::1'
            return isLocal(reqHost) || isLocal(hostname) || (protocol === 'https:' && prodHosts.has(hostname))
        } catch {
            const isLocal = (h) => h === 'localhost' || h === '127.0.0.1' || h === '::1'
            return isLocal(reqHost)
        }
    })()

    if (!isAllowed) {
        return new NextResponse(
            '<h1>Access denied</h1>',
            {
                status: 403,
                headers: { 'content-type': 'text/html' }
            }
        )
    }

    return NextResponse.next()
}

export const config = {
    // Exclui _next, api, e ficheiros estáticos
    matcher: [
        '/((?!_next/static|_next/image|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|css|js)).*)',
    ],
}