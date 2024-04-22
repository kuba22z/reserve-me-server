import { PrismaClient } from '@prisma/client'
import generateFakeData from './fake-data'
import { type ITXClientDenyList } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

async function initializeDatabase(
  tx: Omit<PrismaClient, ITXClientDenyList>,
  id: number
) {
  const fakeData = generateFakeData(id)

  await tx.location.createMany({
    data: fakeData.locations,
  })

  await tx.meeting.createMany({
    data: fakeData.meetings,
  })
  await tx.meetingSchedule.createMany({
    data: fakeData.meetingSchedules,
  })
  await tx.employeesOnMeetings.createMany({
    data: fakeData.employees,
  })
  await tx.employeeSchedule.createMany({
    data: fakeData.employeeSchedules,
  })

  await tx.usersOnMeetings.createMany({
    data: fakeData.usersOnMeetings,
  })

  await tx.service.createMany({
    data: fakeData.services,
  })

  await tx.servicesProvidedOnMeetings.createMany({
    data: fakeData.servicesProvidedOnMeetings,
  })

  await tx.servicesBookedOnMeetings.createMany({
    data: fakeData.servicesBookedOnMeetings,
  })
  // const addUsers = async () => await prisma.user.createMany({ data: users });
}
export const seed = async (id: number) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  await prisma.$transaction(async (tx) => {
    await initializeDatabase(tx, id)
  })
  return id
}
export const seedId = 2

seed(seedId)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .then((_) => {
    console.log('Database seeded successfully!')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
