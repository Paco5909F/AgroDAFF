import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getUserContextSafe } from '@/server/context'
import { prisma } from '@/lib/prisma'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: Request) {
    try {
        const ctx = await getUserContextSafe()
        if (!ctx || ctx.rol !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File
        const type = formData.get('type') as string // 'crt' or 'key'

        if (!file || !type || !['crt', 'key'].includes(type)) {
            return NextResponse.json({ error: 'Falta archivo o tipo inválido' }, { status: 400 })
        }

        const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB limit
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'El archivo excede el tamaño máximo permitido (1MB)' }, { status: 413 })
        }

        if (!supabaseKey) {
            console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
            return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 })
        }

        // Primero verificamos si el bucket existe, y si no, lo intentamos crear
        // Supabase JS no expone un createBucket seguro desde anon, usamos la api storage de admin
        try {
            await supabase.storage.createBucket('afip_certs', { public: false })
        } catch (e) {
            // El bucket ya existe u otro error, ignoramos
        }

        const extension = file.name.split('.').pop()
        const path = `${ctx.empresaId}/afip_cert_${Date.now()}.${extension}`

        const buffer = await file.arrayBuffer()

        const { data, error } = await supabase.storage
            .from('afip_certs')
            .upload(path, buffer, {
                contentType: file.type || 'application/octet-stream',
                upsert: true
            })

        if (error) {
            console.error('Upload Error:', error)
            return NextResponse.json({ error: 'Error subiendo a Storage' }, { status: 500 })
        }

        // Actualizamos la empresa con la ruta
        if (type === 'crt') {
            await prisma.empresa.update({
                where: { id: ctx.empresaId },
                data: { afip_crt_url: path }
            })
        } else {
            await prisma.empresa.update({
                where: { id: ctx.empresaId },
                data: { afip_key_url: path }
            })
        }

        return NextResponse.json({ success: true, path })
    } catch (error: any) {
        console.error('Cert Upload Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
