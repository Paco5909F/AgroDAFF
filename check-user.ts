import fs from 'fs'
import path from 'path'

// Load .env manually
const envPath = path.resolve(__dirname, '.env')
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=')
        if (key && value) {
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
        }
    })
}

// import { prisma } from './src/lib/prisma'

async function main() {
    const { prisma } = await import('./src/lib/prisma')

    try {
        // Update the specific user to ADMIN and set EMAIL
        const updatedUser = await prisma.usuario.update({
            where: { id: 'aecae584-60ea-43e2-873e-c95f53bd8f73' },
            data: {
                rol: 'ADMIN',
                email: 'admin@eltrisquel.com'
            }
        })
        console.log('User updated with email:', updatedUser)
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
