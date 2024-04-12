import { PrismaClient } from '@prisma/client'
import type { ITXClientDenyList } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

async function deleteFakeData(txPrisma: Omit<PrismaClient, ITXClientDenyList>) {
  try {
    // Delete records in reverse order to avoid foreign key constraints violations

    // Delete records in junction tables first
    await txPrisma.servicesBookedOnMeetings.deleteMany({})
    await txPrisma.servicesProvidedOnMeetings.deleteMany({})
    await txPrisma.clientsOnMeetings.deleteMany({})

    // Delete records from main tables
    await txPrisma.meetingSchedule.deleteMany({})
    await txPrisma.meeting.deleteMany({})
    await txPrisma.service.deleteMany({})
    await txPrisma.client.deleteMany({})
    await txPrisma.employeeSchedule.deleteMany({})
    await txPrisma.location.deleteMany({})
    await txPrisma.employee.deleteMany({})

    console.log('Fake data deleted successfully!')
  } catch (error) {
    console.error('Error deleting fake data:', error)
    throw error
  }
}

export const removeAllFakeData = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await prisma.$transaction(async (tx) => {
    await deleteFakeData(tx)
  })
}

// Call the function to delete fake data
removeAllFakeData()
  .catch((error) => {
    console.error(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
