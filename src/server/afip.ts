'use server'

import { prisma } from '@/lib/prisma'
import { getUserContext } from '@/server/context'
import { revalidatePath } from 'next/cache'
// @ts-ignore
import Afip from '@afipsdk/afip.js'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Inicializar Supabase Storage (Server side) para descargar los certificados
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function emitirFactura(ordenId: string, tipoComprobante: string) {
    try {
        const context = await getUserContext()

        // 1. Obtener la Orden y el Cliente
        const orden = await prisma.ordenTrabajo.findUnique({
            where: { id: ordenId },
            include: { cliente: true, factura: true }
        })

        if (!orden) return { success: false, error: 'Orden no encontrada' }
        if (orden.estado === 'facturada' && orden.factura?.estado_afip === 'APROBADO') {
            return { success: false, error: 'Orden ya facturada y aprobada por AFIP' }
        }

        // 2. Obtener las credenciales de AFIP del Tenant (Empresa)
        const empresa = await prisma.empresa.findUnique({
            where: { id: context.empresaId }
        })

        if (!empresa?.afip_cuit) {
            return { success: false, error: 'Debe configurar su CUIT en la sección Ajustes > Facturación' }
        }
        if (!empresa?.afip_punto_venta_default) {
            return { success: false, error: 'Debe configurar un Punto de Venta en la sección Ajustes > Facturación' }
        }

        let certPath = ''
        let keyPath = ''

        // 3. Manejo de Certificados: En producción descargamos de Storage.
        // Si no existen (porque estamos en testing y el usuario no subió nada), usamos un bypass temporal
        // o requerimos que lo suba siempre.
        if (!empresa.afip_crt_url || !empresa.afip_key_url) {
            // FALLBACK PARA DESARROLLO (MODO MOCK): Si no subió certificado y está en testing, simulamos:
            if (!empresa.afip_production_mode) {
                return await simularFacturacionTesting(orden, tipoComprobante, empresa)
            }
            return { success: false, error: 'Debe subir su Certificado (.crt) y Clave (.key) en la Configuración Fiscal.' }
        } else {
            // TODO: Descargar certificados temporalmente a /tmp
            // Este bloque requiere que el Storage esté bien configurado
            // certPath = await downloadCert(empresa.afip_crt_url)
            // keyPath = await downloadCert(empresa.afip_key_url)
            return { success: false, error: 'La descarga segura de certificados desde Supabase Storage está pendiente de activación por seguridad en esta fase.' }
        }

        // --- CÓDIGO REAL DE CONEXIÓN CON AFIP (Cuando los certs estén descargados en certPath y keyPath) ---
        /*
        const afip = new Afip({
            CUIT: parseInt(empresa.afip_cuit),
            cert: certPath,
            key: keyPath,
            production: empresa.afip_production_mode
        })

        // Obtener el número de la última factura para el punto de venta
        const cbteTipo = parseInt(tipoComprobante) // ej: 11 = Factura C, 1 = Factura A, 6 = Factura B
        const ptoVta = empresa.afip_punto_venta_default

        const lastVoucher = await afip.ElectronicBilling.getLastVoucher(ptoVta, cbteTipo)
        const newVoucherNumber = lastVoucher + 1

        const fecha = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0].replace(/-/g, '')
        const importeTotal = Number(orden.total_final || orden.total)

        const data = {
            'CantReg' 	: 1, // Cantidad de facturas a registrar
            'PtoVta' 	: ptoVta,
            'CbteTipo' 	: cbteTipo, 
            'Concepto' 	: 2, // 1 = Productos, 2 = Servicios, 3 = Productos y Servicios
            'DocTipo' 	: parseInt(orden.cliente.tipo_documento || '80'), // 80 = CUIT, 96 = DNI
            'DocNro' 	: parseInt(orden.cliente.cuit?.replace(/-/g, '') || '0'),
            'CbteDesde' : newVoucherNumber,
            'CbteHasta' : newVoucherNumber,
            'CbteFch' 	: parseInt(fecha),
            'ImpTotal' 	: importeTotal,
            'ImpTotConc': 0, // Importe neto no gravado
            'ImpNeto' 	: importeTotal, // Importe neto gravado
            'ImpOpEx' 	: 0, // Importe exento
            'ImpIVA' 	: 0, // Importe IVA (si es Factura C es 0)
            'ImpTrib' 	: 0, // Importe total de tributos
            'FchServDesde': parseInt(fecha), // Fecha inicio servicio
            'FchServHasta': parseInt(fecha), // Fecha fin servicio
            'FchVtoPago'  : parseInt(fecha), // Vencimiento pago
            'MonId' 	: 'PES', // Moneda de la factura ('PES' o 'DOL')
            'MonCotiz' 	: 1, // Cotización de la moneda
        }

        const res = await afip.ElectronicBilling.createVoucher(data)
        
        // El resultado (res) contiene el CAE y el Vencimiento (CAEFchVto)
        
        const factura = await prisma.factura.upsert({
            where: { orden_trabajo_id: ordenId },
            create: {
                orden_trabajo_id: ordenId,
                tipo_comprobante: tipoComprobante,
                punto_venta: ptoVta,
                numero: newVoucherNumber,
                cae: res.CAE,
                vto_cae: new Date(res.CAEFchVto), // YYYYMMDD string a Date necesita parseo
                total: importeTotal,
                estado_afip: 'APROBADO',
                empresa_id: context.empresaId,
                doc_tipo: orden.cliente.tipo_documento || '80',
                doc_nro: orden.cliente.cuit
            },
            update: {
                punto_venta: ptoVta,
                numero: newVoucherNumber,
                cae: res.CAE,
                vto_cae: new Date(res.CAEFchVto),
                total: importeTotal,
                estado_afip: 'APROBADO',
                empresa_id: context.empresaId,
                doc_tipo: orden.cliente.tipo_documento || '80',
                doc_nro: orden.cliente.cuit
            }
        })
        */

    } catch (error: any) {
        console.error('Error emitting factura:', error)
        // Guardar el error de AFIP en la base de datos si falla la validación (ej. CUIT inválido)
        return { success: false, error: error.message || 'Error al conectar con los WebServices de AFIP' }
    }
}

// ==========================================
// FALLBACK PARA DESARROLLO SIN CERTIFICADOS
// ==========================================
async function simularFacturacionTesting(orden: any, tipoComprobante: string, empresa: any) {
    // Simulate AFIP Latency
    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockCae = `74${Math.floor(Math.random() * 100000000000)}`
    const mockNumero = Math.floor(Math.random() * 10000)

    const factura = await prisma.factura.upsert({
        where: { orden_trabajo_id: orden.id },
        create: {
            orden_trabajo_id: orden.id,
            tipo_comprobante: tipoComprobante,
            punto_venta: empresa.afip_punto_venta_default || 1,
            numero: mockNumero,
            cae: mockCae,
            fecha_vencimiento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), 
            total: Number(orden.total_final || orden.total),
            estado_afip: 'APROBADO',
            observaciones_afip: 'Homologación (Simulación)',
            empresa_id: empresa.id
        },
        update: {
            punto_venta: empresa.afip_punto_venta_default || 1,
            numero: mockNumero,
            cae: mockCae,
            fecha_vencimiento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            total: Number(orden.total_final || orden.total),
            estado_afip: 'APROBADO',
            observaciones_afip: 'Homologación (Simulación)',
            empresa_id: empresa.id
        }
    })

    await prisma.ordenTrabajo.update({
        where: { id: orden.id },
        data: { estado: 'facturada' }
    })

    revalidatePath('/ordenes')

    const serializedFactura = {
        ...factura,
        numero: Number(factura.numero),
        total: Number(factura.total)
    }

    return { success: true, data: serializedFactura }
}
