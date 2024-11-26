import { PrismaClient } from '@prisma/client'
import {
  employeeSchedule,
  employeesOnMeeting,
  location,
  meeting,
  meetingSchedule,
  service,
  usersOnMeeting,
} from './fake-data'

const prisma = new PrismaClient()

// Function to create data in the database
async function createData() {
  await prisma.$transaction(async (prisma) => {
    // Create Location
    const createdLocation = await prisma.location.create({
      data: location,
    })

    // Create Service
    await prisma.service.create({
      data: service,
    })

    // Create Meeting
    const createdMeeting = await prisma.meeting.create({
      data: meeting,
    })

    // Update the users and employees' meeting with correct meetingId
    usersOnMeeting.meetingId = createdMeeting.id
    await prisma.usersOnMeetings.create({
      data: usersOnMeeting, // createdAt and updatedAt will be automatically handled by Prisma
    })

    employeesOnMeeting.meetingId = createdMeeting.id
    const createdEmployeeOnMeeting = await prisma.employeesOnMeetings.create({
      data: employeesOnMeeting, // createdAt and updatedAt will be automatically handled by Prisma
    })

    // Update the meeting schedule with correct meetingId and locationId
    meetingSchedule.meetingId = createdMeeting.id
    meetingSchedule.locationId = createdLocation.id
    await prisma.meetingSchedule.create({
      data: meetingSchedule,
    })

    // Update employee schedule with correct employeeId and locationId
    employeeSchedule.employeeId = createdEmployeeOnMeeting.id
    employeeSchedule.locationId = createdLocation.id
    await prisma.employeeSchedule.create({
      data: employeeSchedule,
    })

    console.log('Data created successfully!')
  })
}

// Call the function to create data
createData()
  .catch((error) => {
    console.error('Error creating data:', error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

// removeAllFakeData().catch((error) => {
//   console.error(error)
// })
