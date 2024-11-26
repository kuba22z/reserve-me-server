import { PrismaClient } from '@prisma/client'
import type { ITXClientDenyList } from '@prisma/client/runtime/library'
import { seedId } from './fake-data'

const prisma = new PrismaClient()

async function deleteFakeData(
  txPrisma: Omit<PrismaClient, ITXClientDenyList>,
  idToDelete: number
) {
  try {
    // Delete records in reverse order to avoid foreign key constraints violations

    // Delete one record from tables with dependencies first

    // Delete one servicesProvidedOnMeetings
    await txPrisma.servicesProvidedOnMeetings.delete({
      where: {
        serviceId_meetingId: { serviceId: idToDelete, meetingId: idToDelete },
      },
    })

    // Delete one servicesBookedOnMeetings
    await txPrisma.servicesBookedOnMeetings.delete({
      where: {
        serviceId_meetingId: { serviceId: idToDelete, meetingId: idToDelete },
      },
    })

    // Delete one clientsOnMeetings
    await txPrisma.usersOnMeetings.delete({
      where: {
        userExternalRefId_meetingId: {
          userExternalRefId: idToDelete.toString(),
          meetingId: idToDelete,
        },
      },
    })

    // Delete one meetingSchedule
    await txPrisma.meetingSchedule.delete({
      where: {
        id: idToDelete,
      },
    })

    // Delete one employeeSchedule
    await txPrisma.employeeSchedule.delete({
      where: {
        id: idToDelete,
      },
    })

    // Delete one employee
    await txPrisma.employeesOnMeetings.delete({
      where: {
        id: idToDelete,
      },
    })

    // Delete one meeting
    await txPrisma.meeting.delete({
      where: {
        id: idToDelete,
      },
    })

    // Delete one service
    await txPrisma.service.delete({
      where: {
        id: idToDelete,
      },
    })

    // Delete one location
    await txPrisma.location.delete({
      where: {
        id: idToDelete,
      },
    })

    console.log('Fake data deleted successfully!')
  } catch (error) {
    console.error('Error deleting fake data:', error)
    throw error
  }
}

export const rollbackSeed = async (id: number) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await prisma.$transaction(async (tx) => {
    await deleteFakeData(tx, id)
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
