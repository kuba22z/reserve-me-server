import { PrismaClient } from '@prisma/client'
import { deleteAllData } from './db-operations'

const prisma = new PrismaClient()

export const removeAllFakeData = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  try {
    // await prisma.$transaction(async (tx) => {
    await deleteAllData(prisma)
    // })
  } catch (error) {
    console.log(error)
  } finally {
    console.log('Removed!')
    await prisma.$disconnect()
  }
}

// Call the function to delete fake data
removeAllFakeData().catch((error) => {
  console.error(error)
})
