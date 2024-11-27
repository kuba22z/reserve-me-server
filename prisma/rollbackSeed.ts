import { PrismaClient } from '@prisma/client'
import { seedId } from './fake-data'
import { deleteDataById } from './db-operations'

const prisma = new PrismaClient()

export const rollbackSeed = async (id: number) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await prisma.$transaction(async (tx) => {
    await deleteDataById(tx, id)
  })
}

// Define the ID to delete for each table
// Call the function to delete one record from each table
rollbackSeed(seedId)
  .catch((error) => {
    console.error(error)
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect()
  })
