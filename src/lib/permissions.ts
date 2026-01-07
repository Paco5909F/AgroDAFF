export enum UserRole {
    ADMIN = 'ADMIN',
    ENCARGADO = 'ENCARGADO',
    MAQUINISTA = 'MAQUINISTA',
    TRANSPORTISTA = 'TRANSPORTISTA',
    LECTOR = 'LECTOR'
}

export const PERMISSIONS = {
    // Resources
    DASHBOARD: 'DASHBOARD',
    CLIENTES: 'CLIENTES',
    ORDENES: 'ORDENES',
    SILOS: 'SILOS',
    ESTABLECIMIENTOS: 'ESTABLECIMIENTOS',
    LOTES: 'LOTES',
    PRESUPUESTOS: 'PRESUPUESTOS',
    CARTAS_PORTE: 'CARTAS_PORTE',
    MOVIMIENTOS: 'MOVIMIENTOS',
    FACTURACION: 'FACTURACION',
    USUARIOS: 'USUARIOS',

    // Actions
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    CHANGE_STATUS: 'change_status',
    BILL: 'bill'
} as const

type PermissionCheck = (role: string) => boolean

const ROLE_PERMISSIONS: Record<string, Record<string, string[]>> = {
    [UserRole.ADMIN]: {
        '*': ['*'] // Admin can do everything
    },
    [UserRole.ENCARGADO]: {
        [PERMISSIONS.CLIENTES]: ['*'],
        [PERMISSIONS.ORDENES]: ['*'],
        [PERMISSIONS.SILOS]: ['*'],
        [PERMISSIONS.LOTES]: ['*'],
        [PERMISSIONS.PRESUPUESTOS]: ['*'],
        [PERMISSIONS.CARTAS_PORTE]: ['*'],
        [PERMISSIONS.MOVIMIENTOS]: ['*'],
        [PERMISSIONS.FACTURACION]: ['read'], // Can view but maybe not emit? Let's say yes for now or restrict
        [PERMISSIONS.USUARIOS]: ['read'],
        [PERMISSIONS.DASHBOARD]: ['read']
    },
    [UserRole.MAQUINISTA]: {
        [PERMISSIONS.ORDENES]: ['read', 'change_status'],
        [PERMISSIONS.SILOS]: ['read'],
        [PERMISSIONS.LOTES]: ['read'],
        [PERMISSIONS.CLIENTES]: ['read'],
        [PERMISSIONS.DASHBOARD]: ['read']
    },
    [UserRole.TRANSPORTISTA]: {
        [PERMISSIONS.CARTAS_PORTE]: ['*'],
        [PERMISSIONS.MOVIMIENTOS]: ['create', 'read'],
        [PERMISSIONS.SILOS]: ['read'],
        [PERMISSIONS.CLIENTES]: ['read'],
        [PERMISSIONS.DASHBOARD]: ['read']
    },
    [UserRole.LECTOR]: {
        [PERMISSIONS.DASHBOARD]: ['read'],
        '*': ['read']
    }
}

export function hasPermission(role: string, resource: string, action: string): boolean {
    const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[UserRole.LECTOR]

    // Check global admin
    if (permissions['*'] && permissions['*'].includes('*')) return true

    // Check specific resource or fallback to wildcard
    const resourcePermissions = permissions[resource] || permissions['*']

    if (!resourcePermissions) return false

    if (resourcePermissions.includes('*')) return true
    return resourcePermissions.includes(action)
}

export function checkPermission(role: string, resource: string, action: string) {
    if (!hasPermission(role, resource, action)) {
        throw new Error(`Permiso denegado: No tienes permiso para ${action} ${resource}`)
    }
}
