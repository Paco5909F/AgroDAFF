import 'dotenv/config';
import { prisma } from "../src/lib/prisma";
import { v4 as uuidv4 } from 'uuid';

async function main() {
    console.log("🧪 Starting SaaS Integrity Test...");

    // 1. Create a Fake User (Simulation)
    const testUserId = uuidv4();
    const testEmail = `test-verify-${Date.now()}@check.com`;

    console.log(`👤 Creating Test User: ${testEmail}`);
    const user = await prisma.usuario.create({
        data: {
            id: testUserId,
            nombre: "Test User",
            email: testEmail,
            rol: "LECTOR"
        }
    });

    // 2. Simulate "Onboarding" (Create Company)
    console.log("🏢 Simulating 'Create Company' flow...");
    const companyName = "Test Company " + Date.now();

    const empresa = await prisma.empresa.create({
        data: {
            nombre: companyName,
            cuit: '11111111',
            direccion: 'Test Address'
        }
    });

    // 3. Simulate Logic from onboarding.ts
    // Update User active context
    await prisma.usuario.update({
        where: { id: user.id },
        data: {
            active_empresa_id: empresa.id,
            rol: 'ADMIN' // Global role update
        }
    });

    // Create Membership (Critical)
    await prisma.miembro.create({
        data: {
            usuario_id: user.id,
            empresa_id: empresa.id,
            rol: 'ADMIN'
        }
    });

    console.log("✅ Onboarding Logic executed.");

    // 4. VERIFICATION CHECKS
    console.log("🔍 Verifying Data Integrity...");

    // Check 1: Does the user have the active_empresa_id?
    const updatedUser = await prisma.usuario.findUnique({
        where: { id: user.id },
        include: { miembros: true }
    });

    if (updatedUser?.active_empresa_id !== empresa.id) {
        throw new Error("❌ FAILURE: active_empresa_id was not set correctly.");
    }
    console.log("✅ Check 1 User has active context set.");

    // Check 2: Is the user a member of the company?
    const membership = await prisma.miembro.findUnique({
        where: {
            usuario_id_empresa_id: {
                usuario_id: user.id,
                empresa_id: empresa.id
            }
        }
    });

    if (!membership) {
        throw new Error("❌ FAILURE: Miembro record was NOT created.");
    }
    console.log("✅ Check 2: Membership record exists.");
    console.log("   - Role:", membership.rol);


    // 5. CLEANUP
    console.log("🧹 Cleaning up test data...");
    await prisma.miembro.deleteMany({ where: { usuario_id: testUserId } });
    await prisma.usuario.delete({ where: { id: testUserId } });
    await prisma.empresa.delete({ where: { id: empresa.id } });

    console.log("✨ TEST PASSED: SaaS Logic Integrity Verified.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
