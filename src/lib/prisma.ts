import { Pool, type PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL || ''
// Strip sslmode parameter so pg honors rejectUnauthorized: false
const cleanUrl = connectionString.replace(/[?&]sslmode=[^&]+/g, '')

const poolConfig: PoolConfig = {
    connectionString: cleanUrl,
    ssl: cleanUrl && (cleanUrl.includes('supabase.com') || cleanUrl.includes('pooler'))
        ? { rejectUnauthorized: false }
        : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
}

// Global caching pattern for serverless environments
const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient
    pool?: Pool
}

const pool = globalForPrisma.pool ?? new Pool(poolConfig)
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

globalForPrisma.pool = pool
globalForPrisma.prisma = prisma

