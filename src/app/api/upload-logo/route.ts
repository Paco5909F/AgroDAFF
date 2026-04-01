import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const fileName = formData.get('fileName') as string

        if (!file || !fileName) {
            return NextResponse.json({ error: 'File and fileName are required' }, { status: 400 })
        }

        // Convert File to ArrayBuffer for upload
        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // Upload using Admin Client (Bypasses RLS)
        const { data, error } = await supabaseAdmin.storage
            .from('logos')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (error) {
            console.error("Supabase Admin Upload Error:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Get Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('logos')
            .getPublicUrl(fileName)

        return NextResponse.json({ publicUrl })

    } catch (error: any) {
        console.error("Server Upload Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
