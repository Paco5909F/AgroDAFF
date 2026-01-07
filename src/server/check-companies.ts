import { prisma } from "@/lib/prisma"

async function main() {
    const count = await prisma.empresa.count()
    const first = await prisma.empresa.findFirst()
    console.log({ count, first })
}

main()
