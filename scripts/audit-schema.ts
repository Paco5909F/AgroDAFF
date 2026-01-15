import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    console.log("🔍 Starting Database Audit...")

    // 1. Identify Tables that SHOULD be multi-tenant
    // We define a list of business entities.
    const TARGET_TABLES = [
        'clientes',
        'establecimientos',
        'lotes',
        'silos',
        'movimientos_stock',
        'servicios',
        'ordenes_trabajo',
        'facturas',
        'campanas',
        'presupuestos',
        'cartas_porte'
    ]

    const auditResults: any[] = []

    for (const table of TARGET_TABLES) {
        console.log(`Checking table: ${table}...`)
        const result = { table, status: 'OK', issues: [] as string[] }

        // A. Check Column Existence
        const columns: any[] = await prisma.$queryRaw`
            SELECT column_name, is_nullable, data_type 
            FROM information_schema.columns 
            WHERE table_name = ${table} AND column_name = 'empresa_id'
        `

        if (columns.length === 0) {
            result.status = 'FAIL'
            result.issues.push("Missing 'empresa_id' column")
        } else {
            const col = columns[0]
            if (col.is_nullable === 'YES') {
                result.issues.push("WARNING: 'empresa_id' is Nullable (Should be NOT NULL for strict SaaS)")
            }
        }

        // B. Check RLS Status
        const rls: any[] = await prisma.$queryRaw`
            SELECT rowsecurity 
            FROM pg_tables 
            WHERE tablename = ${table}
        `
        if (rls.length > 0 && !rls[0].rowsecurity) {
            result.status = 'FAIL'
            result.issues.push("CRITICAL: RLS is NOT enabled")
        }

        // C. Check Indexes
        const indexes: any[] = await prisma.$queryRaw`
            SELECT indexname, indexdef 
            FROM pg_indexes 
            WHERE tablename = ${table} AND indexdef ILIKE '%empresa_id%'
        `
        if (indexes.length === 0) {
            result.issues.push("WARNING: No explicit index on 'empresa_id' found")
        }

        auditResults.push(result)
    }

    // Report
    console.log("\n📊 AUDIT REPORT SUMMARY")
    console.log("=======================")
    let failCount = 0
    auditResults.forEach(r => {
        const icon = r.status === 'OK' && r.issues.length === 0 ? '✅' : (r.status === 'FAIL' ? '❌' : '⚠️')
        console.log(`${icon} Table: ${r.table}`)
        r.issues.forEach((i: string) => console.log(`   - ${i}`))
        if (r.status === 'FAIL') failCount++
    })

    if (failCount > 0) {
        console.log(`\n🛑 FAILED: ${failCount} critical issues found.`)
        process.exit(1)
    } else {
        console.log("\n✨ PASSED: Schema structure looks correct.")
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
