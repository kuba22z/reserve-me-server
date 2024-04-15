import { PrismaClient } from '@prisma/client'
import type { ITXClientDenyList } from '@prisma/client/runtime/library'
import { PrismaService } from 'nestjs-prisma'

const prisma = new PrismaClient()

async function deleteFakeData(txPrisma: Omit<PrismaClient, ITXClientDenyList>) {
  // Delete records in junction tables first
  return await Promise.all([
    txPrisma.servicesBookedOnMeetings.deleteMany({}),
    txPrisma.servicesProvidedOnMeetings.deleteMany({}),
    txPrisma.clientsOnMeetings.deleteMany({}),
    // Delete records from main tables
    txPrisma.meetingSchedule.deleteMany({}),
    txPrisma.meeting.deleteMany({}),
    txPrisma.service.deleteMany({}),
    txPrisma.client.deleteMany({}),
    txPrisma.employeeSchedule.deleteMany({}),
    txPrisma.location.deleteMany({}),
    txPrisma.employee.deleteMany({}),
  ])
}

export const removeAllFakeData = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  try {
    // await prisma.$transaction(async (tx) => {
    await deleteFakeData(new PrismaService())
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
