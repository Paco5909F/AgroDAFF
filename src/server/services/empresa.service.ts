import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export class EmpresaService {
    // --- EMPRESA ---
    static async updateEmpresaProfile(empresaId: string, data: any) {
        return prisma.empresa.update({
            where: { id: empresaId },
            data: {
                nombre: data.nombre,
                cuit: data.cuit,
                direccion: data.direccion,
                telefono: data.telefono || null,
                email: data.email || null,
                logo_url: data.logo_url || null
            }
        })
    }

    static async updateEmpresaAfip(empresaId: string, data: any) {
        return prisma.empresa.update({
            where: { id: empresaId },
            data: {
                afip_cuit: data.afip_cuit,
                condicion_iva: data.condicion_iva,
                afip_punto_venta_default: data.afip_punto_venta_default,
                afip_production_mode: data.afip_production_mode
            }
        })
    }

    static async generateCompanyInviteCode(empresaId: string) {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
        const code = `TEAM-${randomString}`

        await prisma.empresa.update({
            where: { id: empresaId },
            data: { shared_invite_code: code }
        })
        return code
    }

    static async getCompanyInviteCode(empresaId: string) {
        const empresa = await prisma.empresa.findUnique({
            where: { id: empresaId },
            select: { shared_invite_code: true }
        })
        return empresa?.shared_invite_code
    }

    static async updateOrganizacionName(empresaId: string, nombre: string) {
        return prisma.empresa.update({
            where: { id: empresaId },
            data: { nombre }
        })
    }

    static async updateEmpresaLogo(empresaId: string, logo_url: string) {
        return prisma.empresa.update({
            where: { id: empresaId },
            data: { logo_url }
        })
    }

    // --- USUARIOS ---
    static async getUserProfileData(userId: string) {
        return prisma.usuario.findUnique({
            where: { id: userId },
            include: {
                miembros: {
                    include: {
                        empresa: {
                            select: { plan_status: true, nombre: true, id: true, is_lifetime: true, logo_url: true }
                        }
                    }
                }
            }
        })
    }

    static async updateUserProfile(userId: string, nombre: string) {
        return prisma.usuario.update({
            where: { id: userId },
            data: { nombre }
        })
    }

    // --- TEAM / MIEMBROS ---
    static async getTeamMembers(empresaId: string) {
        return prisma.miembro.findMany({
            where: { empresa_id: empresaId },
            include: { usuario: true },
            orderBy: { created_at: 'asc' }
        })
    }

    static async repairMissingEmail(userId: string, email: string) {
        const existing = await prisma.usuario.findUnique({
            where: { email }
        })
        if (!existing) {
            await prisma.usuario.update({
                where: { id: userId },
                data: { email }
            })
        }
    }

    static async updateUserRole(userId: string, empresaId: string, newRole: UserRole) {
        return prisma.miembro.update({
            where: {
                usuario_id_empresa_id: {
                    usuario_id: userId,
                    empresa_id: empresaId
                }
            },
            data: { rol: newRole }
        })
    }

    static async removeUser(userId: string, empresaId: string) {
        return prisma.miembro.delete({
            where: {
                usuario_id_empresa_id: {
                    usuario_id: userId,
                    empresa_id: empresaId
                }
            }
        })
    }
}
