import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/server/context'
import { prisma } from '@/lib/prisma'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
const MAX_LOGO_SIZE = 2 * 1024 * 1024 // 2MB

export async function POST(req: NextRequest) {
    try {
        const { empresaId, rol } = await getUserContext()

        if (rol !== 'ADMIN') {
            return NextResponse.json({ error: 'No autorizado. Solo administradores pueden cambiar el logo.' }, { status: 403 })
        }

        // Verify PRO plan or Lifetime
        const empresa = await prisma.empresa.findUnique({
            where: { id: empresaId },
            select: { plan_status: true, is_lifetime: true }
        })

        const isPro = empresa?.is_lifetime || empresa?.plan_status === 'PRO'
        if (!isPro) {
            return NextResponse.json({ 
                error: 'Función exclusiva para usuarios PRO. Actualiza tu plan para personalizar el logo.' 
            }, { status: 403 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
        }

        if (file.size > MAX_LOGO_SIZE) {
            return NextResponse.json({ error: 'El archivo excede el tamaño máximo permitido (2MB)' }, { status: 413 })
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'Formato no soportado. Debe ser PNG, JPEG, WEBP o SVG.' }, { status: 415 })
        }

        const supabase = await createClient()

        // Ensure bucket exists (ignoring error if it already exists)
        await supabase.storage.createBucket('logos', { public: true }).catch(() => {})

        // Generate unique and safe filename
        const safeExt = file.type.split('/')[1] === 'svg+xml' ? 'svg' : (file.type.split('/')[1] || 'png')
        const fileName = `${empresaId}-${Date.now()}.${safeExt}`
        const filePath = `${fileName}`

        const { data, error } = await supabase.storage
            .from('logos')
            .upload(filePath, file, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: true
            })

        if (error) {
            console.error('Storage upload error:', error)
            return NextResponse.json({ error: 'Error al subir la imagen al almacenamiento' }, { status: 500 })
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
