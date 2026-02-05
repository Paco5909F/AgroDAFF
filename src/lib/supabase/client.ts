import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Supabase Key defined:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // SAFETY VALVE: Check for corrupted (double-stringified) cookies and nuke them
    // This fixes the "Cannot create property 'user' on string" error
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        try {
            const cookies = document.cookie.split(';')
            for (const cookie of cookies) {
                const [name, value] = cookie.split('=').map(c => c.trim())
                if (name.startsWith('sb-') && name.endsWith('-auth-token')) {
                    // Check if value looks like a double-encoded JSON string
                    // e.g. "{\"access_token\":...}" instead of %7B%22access_token%22... or valid token
                    // The error comes when the INNER content is a stringified JSON
                    try {
                        const decoded = decodeURIComponent(value)
                        // If it starts with a quote, it might be double stringified
                        if (decoded.startsWith('"{"') || decoded.startsWith('"{')) {
                            console.warn("Found corrupted cookie, clearing:", name)
                            // Nuke it
                            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname};`
                            // Also try clearing without domain just in case
                            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }
        } catch (e) {
            console.error("Error sanitizing cookies:", e)
        }
    }

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
