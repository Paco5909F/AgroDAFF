
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupStorage() {
    console.log("Setting up Supabase Storage...")

    const BUCKET_NAME = 'logos'

    // 1. Create Bucket
    const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 2097152, // 2MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    })

    if (error) {
        if (error.message.includes('already exists')) {
            console.log(`✅ Bucket '${BUCKET_NAME}' already exists.`)

            // Should update it to be public just in case?
            const { error: updateError } = await supabase.storage.updateBucket(BUCKET_NAME, {
                public: true
            })
            if (updateError) console.warn("  ⚠️ Could not update bucket to public:", updateError.message)
            else console.log("  ✅ Verified/Updated bucket to operate publicly.")

        } else {
            console.error("❌ Error creating bucket:", error.message)
            process.exit(1)
        }
    } else {
        console.log(`✅ Created bucket '${BUCKET_NAME}' successfully.`)
    }

    // 2. (Optional) Set Policy - By default "public: true" allows public reads.
    // Writes usually require RLS policies if NOT using Service Role, but here we are setting up infrastructure.
    // The Client App uploads using the standard client. 
    // Standard client uploads usually obey Storage RLS.
    // If we want ANY authenticated user to upload logos for THEIR company, we need a policy.
    // For now, let's keep it simple: Public Bucket allows public reading. 
    // Writing might require a policy if RLS is enabled on storage.objects.

    // Check if we need to inject SQL for Storage Policies.
    console.log("\n⚠️ NOTE: If uploads fail on the frontend with 'new row violates row-level security policy', run the following SQL in Supabase:")
    console.log(`
    -- Enable RLS
    alter table storage.objects enable row level security;
    
    -- Allow Authenticated users to upload to 'logos'
    create policy "Authenticated users can upload logos"
    on storage.objects for insert
    to authenticated
    with check ( bucket_id = 'logos' );

    -- Allow Public read access
    create policy "Public Access to Logos"
    on storage.objects for select
    to public
    using ( bucket_id = 'logos' );
    `)

}

setupStorage()
