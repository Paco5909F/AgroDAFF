
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const prisma = new PrismaClient();

async function seedUser() {
    const email = 'admin@eltrisquel.com';
    const password = 'admin123';

    console.log(`Seeding user: ${email}...`);

    // 1. Check if user exists in Supabase Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    let user = users.find(u => u.email === email);

    if (!user) {
        // 2. Create user if not exists
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'admin' }
        });

        if (error) {
            console.error('Error creating user:', error);
            return;
        }
        user = data.user;
        console.log('User created in Supabase Auth:', user.id);
    } else {
        console.log('User already exists in Supabase Auth:', user.id);
    }

    // 3. Ensure user exists in public.usuarios via Prisma 
    // (Note: Trigger usually handles this, but for safety/updates we do upsert)

    // Wait a sec for trigger
    await new Promise(r => setTimeout(r, 2000));

    try {
        const dbUser = await prisma.usuario.upsert({
            where: { id: user.id },
            update: { role: 'admin' },
            create: {
                id: user.id,
                email: email,
                role: 'admin'
            }
        });
        console.log('User verified in DB:', dbUser);
    } catch (dbError) {
        console.error('Error syncing to DB:', dbError);
    }
}

seedUser()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
