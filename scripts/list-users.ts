
import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const prisma = new PrismaClient()

async function main() {
    try {
        const users = await prisma.usuario.findMany()
        console.log('Users in DB:', JSON.stringify(users, null, 2))
    } catch (error) {
        console.error('Error listing users:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
