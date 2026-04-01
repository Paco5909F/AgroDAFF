import { createClient } from '@supabase/supabase-js'

// WARNING: Use this client ONLY in server-side contexts (API routes, Server Actions)
// NEVER expose this to the client-side as it has full admin privileges.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})
