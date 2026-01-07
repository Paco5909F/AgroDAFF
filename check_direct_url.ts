import 'dotenv/config'

console.log("DATABASE_URL defined:", !!process.env.DATABASE_URL)
console.log("DIRECT_URL defined:", !!process.env.DIRECT_URL)
console.log("DIRECT_URL same as DATABASE_URL:", process.env.DATABASE_URL === process.env.DIRECT_URL)
if (process.env.DIRECT_URL) {
    const url = new URL(process.env.DIRECT_URL)
    console.log("DIRECT_URL port:", url.port)
}
if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL)
    console.log("DATABASE_URL port:", url.port)
}
