import 'dotenv/config'
import { Pool } from 'pg'

async function test() {
    console.log("Testing DIRECT_URL...")
    const connectionString = process.env.DIRECT_URL
    if (!connectionString) {
        console.error("No DIRECT_URL found")
        process.exit(1)
    }

    try {
        const pool = new Pool({ connectionString, connectionTimeoutMillis: 5000 })
        const client = await pool.connect()
        console.log("✅ Connected to DIRECT_URL")
        const res = await client.query('SELECT 1 as val')
        console.log("✅ Query result:", res.rows[0])
        client.release()
        await pool.end()
    } catch (e) {
        console.error("❌ Connection failed:", e)
    }
}

test()
