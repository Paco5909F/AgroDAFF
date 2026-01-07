
import 'dotenv/config'; // Load env vars
import { spawn } from 'child_process';

// Force DATABASE_URL to be the DIRECT_URL (session connection)
// This is necessary because schema operations (push/migrate) fail/hang on transaction poolers (6543)
if (process.env.DIRECT_URL) {
    console.log('Using DIRECT_URL for prisma db push...');
    process.env.DATABASE_URL = process.env.DIRECT_URL;
} else {
    console.warn('DIRECT_URL not found, using default DATABASE_URL. Use at your own risk if on pooler.');
}

const cmd = 'npx';
const args = ['prisma', 'db', 'push', '--accept-data-loss'];

const child = spawn(cmd, args, {
    stdio: 'inherit',
    env: process.env // updated env
});

child.on('close', (code) => {
    console.log(`prisma db push exited with code ${code}`);
    process.exit(code ?? 1);
});
