
import { NextRequest, NextResponse } from 'next/server';

function isForbiddenHost(hostname: string): boolean {
    const lower = hostname.toLowerCase();
    if (
        lower === 'localhost' ||
        lower === '127.0.0.1' ||
        lower === '0.0.0.0' ||
        lower === '::1' ||
        lower.endsWith('.local') ||
        lower.endsWith('.internal') ||
        lower.startsWith('169.254.') || // Cloud metadata
        lower.startsWith('10.') ||      // Private network class A
        lower.startsWith('192.168.')    // Private network class C
    ) {
        return true;
    }

    // Check 172.16.0.0 - 172.31.255.255 (Private network class B)
    const match172 = lower.match(/^172\.(\d+)\./);
    if (match172) {
        const octet = parseInt(match172[1], 10);
        if (octet >= 16 && octet <= 31) return true;
    }

    return false;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(targetUrl);
    } catch {
        return new NextResponse('Invalid URL format', { status: 400 });
    }

    // Allow only HTTP / HTTPS
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return new NextResponse('Invalid URL protocol', { status: 400 });
    }

    // Block private/internal hostnames (SSRF prevention)
    if (isForbiddenHost(parsedUrl.hostname)) {
        return new NextResponse('Forbidden target host', { status: 403 });
    }

    try {
        const response = await fetch(parsedUrl.toString(), {
            signal: AbortSignal.timeout(6000), // 6s timeout
            headers: {
                'User-Agent': 'AgroDAFF-ImageProxy/1.0'
            }
        });

        if (!response.ok) {
            return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status });
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) {
            return new NextResponse('Fetched resource is not an image', { status: 415 });
        }

        const blob = await response.blob();

        return new NextResponse(blob, {
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600',
                'X-Content-Type-Options': 'nosniff'
            }
        });
    } catch (error) {
        console.error('Image proxy error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
