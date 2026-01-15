import 'dotenv/config';
import { prisma } from "../src/lib/prisma";
import fs from 'fs';
import path from 'path';

async function main() {
    console.log("🔒 Applying RLS Policies...");

    const sqlPath = path.join(__dirname, '01-setup-rls.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split by custom delimiter
    const statements = sqlContent
        .split('-- SPLIT --')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute.`);

    for (const [index, statement] of statements.entries()) {
        try {
            await prisma.$executeRawUnsafe(statement);
            console.log(`✅ Executed statement ${index + 1}/${statements.length}`);
        } catch (error) {
            console.error(`❌ Error executing statement ${index + 1}:`);
            console.error(statement);
            console.error(error);
            // Don't break, try to continue or throw? 
            // RLS setup is critical, maybe we should stop.
            // But 'DROP POLICY IF EXISTS' might fail if table doesn't exist (unlikely).
            // Let's stop on error to be safe.
            process.exit(1);
        }
    }

    console.log("🛡️ RLS Policies Applied Successfully!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
