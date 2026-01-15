import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    const rog1 = await prisma.empresa.findUnique({
        where: { id: 'bd9c544b-d5db-45d6-a1de-758e5fd2b6c5' },
        include: { _count: { select: { lotes: true, miembros: true, ordenes: true } } }
    })

    const rog2 = await prisma.empresa.findUnique({
        where: { id: 'ebdbd1bf-98a8-4321-afe2-48c0c5041d2d' },
        include: { _count: { select: { lotes: true, miembros: true, ordenes: true } } }
    })

    console.log("Rogelio 1:", rog1)
    console.log("Rogelio 2:", rog2)

    // Strategy: Rename the one with less data
    if (rog1 && rog2) {
        let toRename = rog1
        if ((rog2._count.lotes + rog2._count.miembros) < (rog1._count.lotes + rog1._count.miembros)) {
            toRename = rog2
        } else if ((rog2._count.lotes + rog2._count.miembros) === (rog1._count.lotes + rog1._count.miembros)) {
            // If equal, rename the second one found
            toRename = rog2
        }
        else {
            toRename = rog1
        }

        console.log(`Renaming ${toRename.id} to '${toRename.nombre} (Old/Empty)'...`)
        await prisma.empresa.update({
            where: { id: toRename.id },
            data: { nombre: `${toRename.nombre} (Old/Empty)` }
        })
        console.log("Done.")
    }
}
main()
