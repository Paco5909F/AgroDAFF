const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const sql = `
        insert into storage.buckets (id, name, public, file_size_limit)
        values ('afip_certs', 'afip_certs', false, 5242880)
        on conflict (id) do update set public = false;
    `
    await prisma.$executeRawUnsafe(sql)
    console.log("Bucket afip_certs creado.")
}

main().finally(() => prisma.$disconnect())
