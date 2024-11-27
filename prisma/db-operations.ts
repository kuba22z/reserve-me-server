import { type PrismaClient } from '@prisma/client'
import type { ITXClientDenyList } from '@prisma/client/runtime/library'

export async function deleteAllData(
  txPrisma: Omit<PrismaClient, ITXClientDenyList>
) {
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

export async function deleteDataById(
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
