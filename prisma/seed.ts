import { PrismaClient } from '@prisma/client'
import { fakeClient } from '../types/fake-data'

const prisma = new PrismaClient()

async function initializeDatabase() {
  await prisma.client.upsert({
    where: { id: 1 },
    create: fakeClient(),
    update: {},
  })

  //const addUsers = async () => await prisma.user.createMany({ data: users });
}

initializeDatabase()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
