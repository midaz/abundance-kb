import { NextResponse } from 'next/server'

export function middleware(request) {
    const referer = request.headers.get('referer')

    const allowedDomains = [
        'https://dev-abundance-elected.pantheonsite.io',
        'https://www.abundancenetwork.com',
        'https://abundancenetwork.com',
        'http://localhost:3000',
        'https://abundanceelected.com/'
    ]

    const isAllowed = referer && allowedDomains.some(domain =>
        referer.startsWith(domain)
    )

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