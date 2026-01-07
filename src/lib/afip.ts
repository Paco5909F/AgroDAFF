import Afip from '@afipsdk/afip.js'

// Initialize AFIP SDK with env vars
const afip = new Afip({
    CUIT: process.env.AFIP_CUIT ? parseInt(process.env.AFIP_CUIT) : 0,
    cert: process.env.AFIP_CERT_PATH || './afip/cert.crt',
    key: process.env.AFIP_KEY_PATH || './afip/key.key',
    production: process.env.AFIP_PRODUCTION === 'true',
})

// Tipos de Factura (A, B, C)
export const TIPO_COMPROBANTE = {
    FACTURA_A: 1,
    FACTURA_B: 6,
    FACTURA_C: 11,
}

// Concepto (1: Productos, 2: Servicios, 3: Productos y Servicios)
export const CONCEPTO = {
    PRODUCTOS: 1,
    SERVICIOS: 2,
    PRODUCTOS_Y_SERVICIOS: 3,
}

export interface FacturaData {
    cantReg: number // Cantidad de registros (generalmente 1)
    ptoVta: number
    cbteTipo: number
    concepto: number
    docTipo: number // 80: CUIT, 96: DNI, 99: Consumidor Final
    docNro: number
    cbteFch: number // AAAAMMDD
    impTotal: number
    impTotConc: number // Importe neto no gravado
    impNeto: number // Importe neto gravado
    impOpEx: number // Importe exento
    impIVA: number
    impTrib: number // Tributos
    monId: string // 'PES'
    monCotiz: number
    ivas?: Array<{
        id: number // 5: 21%, 4: 10.5%
        baseImp: number
        importe: number
    }>
}

export const afipService = {
    getUltimoComprobante: async (ptoVta: number, tipoCbte: number) => {
        try {
            const result = await afip.ElectronicBilling.getLastVoucher(ptoVta, tipoCbte)
            return result
        } catch (error) {
            console.error('Error AFIP LastVoucher:', error)
            throw new Error(`Error al obtener último comprobante: ${error}`)
        }
    },

    crearFactura: async (data: FacturaData) => {
        try {
            // Forzar redondeo a 2 decimales para evitar problemas de validación AFIP
            /* 
               NOTA IMPORTANTE: 
               AFIP valida estrictamente: ImpTotal = ImpTotConc + ImpNeto + ImpOpEx + ImpIVA + ImpTrib 
               Cualquier diferencia de centavos rechazará la factura.
            */

            const result = await afip.ElectronicBilling.createVoucher(data)
            return {
                cae: result.CAE,
                caeFchVto: result.CAEFchVto,
            }
        } catch (error: any) {
            console.error('Error AFIP CreateVoucher:', error)
            // Parsear error común de AFIP
            const errMessage = error.message || JSON.stringify(error)
            throw new Error(`Error de Facturación AFIP: ${errMessage}`)
        }
    },

    info: async () => {
        return {
            production: process.env.AFIP_PRODUCTION === 'true',
            cuit: process.env.AFIP_CUIT,
        }
    }
}
