import { PrismaClient } from '@prisma/client'
import type { ITXClientDenyList } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

async function deleteFakeData(txPrisma: Omit<PrismaClient, ITXClientDenyList>) {
  // Delete records in junction tables first

  await txPrisma.servicesBookedOnMeetings.deleteMany({})
  await txPrisma.servicesProvidedOnMeetings.deleteMany({})
  await txPrisma.usersOnMeetings.deleteMany({})
  await txPrisma.employeeSchedule.deleteMany({})
  await txPrisma.employeesOnMeetings.deleteMany({})
  // Delete records from main tables
  await txPrisma.meetingSchedule.deleteMany({})
  await txPrisma.meeting.deleteMany({})
  await txPrisma.service.deleteMany({})

  await txPrisma.location.deleteMany({})
}

export const removeAllFakeData = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  try {
    // await prisma.$transaction(async (tx) => {
    await deleteFakeData(prisma)
    // })
  } catch (error) {
    console.log(error)
  } finally {
    await prisma.$disconnect()
  }
}

// Call the function to delete fake data
removeAllFakeData().catch((error) => {
  console.error(error)
})
console.log('Removed!')
