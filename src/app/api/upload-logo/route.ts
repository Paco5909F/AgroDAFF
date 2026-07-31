import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/server/context'

export async function POST(req: NextRequest) {
    try {
        const { empresaId, rol } = await getUserContext()

        if (rol !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const supabase = await createClient()

        // Ensure bucket exists (ignoring error if it already exists)
        await supabase.storage.createBucket('logos', { public: true })

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${empresaId}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { data, error } = await supabase.storage
            .from('logos')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            })

        if (error) {
            console.error('Storage upload error:', error)
            return NextResponse.json({ error: 'Failed to upload to storage' }, { status: 500 })
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('logos')
            .getPublicUrl(filePath)

        return NextResponse.json({ 
            url: publicUrl,
            publicUrl: publicUrl 
        })
    } catch (error) {
        console.error('API /upload-logo Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
