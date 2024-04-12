import { PrismaClient } from '@prisma/client'
import generateFakeData from './fake-data2'
import { type ITXClientDenyList } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

async function initializeDatabase(
  tx: Omit<PrismaClient, ITXClientDenyList>,
  id: number
) {
  /*  await prisma.client.upsert({
    where: { id: 1 },
    create: fakeClient(),
    update: {},
  }) */

  // const addUsers = async () => await prisma.user.createMany({ data: users });

  const fakeData = generateFakeData(id)

  await tx.employee.createMany({
    data: fakeData.employees,
  })

  await tx.location.createMany({
    data: fakeData.locations,
  })

  await tx.employeeSchedule.createMany({
    data: fakeData.employeeSchedules,
  })

  await tx.meeting.createMany({
    data: fakeData.meetings,
  })
  await tx.meetingSchedule.createMany({
    data: fakeData.meetingSchedules,
  })

  await tx.client.createMany({
    data: fakeData.clients,
  })

  await tx.clientsOnMeetings.createMany({
    data: fakeData.clientsOnMeetings,
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
export const seedId = 1

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
