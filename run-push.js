require('dotenv').config();
const { execSync } = require('child_process');

console.log("Starting DB push with DIRECT_URL...");
// Force DATABASE_URL to be DIRECT_URL to bypass pooler for migration
if (process.env.DIRECT_URL) {
    process.env.DATABASE_URL = process.env.DIRECT_URL;
    console.log("Swapped DATABASE_URL with DIRECT_URL (port 5432 likely)");
} else {
    console.error("DIRECT_URL not found!");
    process.exit(1);
}

try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });
    console.log("DB Push Completed Successfully!");
} catch (e) {
    console.error("DB Push Failed");
    process.exit(1);
}
