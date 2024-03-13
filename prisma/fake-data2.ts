import { faker } from '@faker-js/faker'
import {
  Client,
  ClientsOnMeetings,
  Employee,
  EmployeeSchedule,
  Location,
  Meeting,
  MeetingSchedule,
  Prisma,
  Service,
  ServicesBookedOnMeetings,
  ServicesProvidedOnMeetings,
} from '@prisma/client' // Replace './prisma-schema' with the path to your Prisma schema file

export const generateEmployee = (): Employee => ({
  id: 1,
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
})

export const generateEmployeeSchedule = (
  employeeId: number,
  locationId: number
): EmployeeSchedule => ({
  id: 1,
  employeeId,
  locationId: locationId,
  startTime: new Date(),
  endTime: new Date(),
  startDate: new Date(),
  endDate: new Date(),
  repeatRate: 0,
  repeatRateUnit: 'DAY',
})

export const generateLocation = (): Location => ({
  id: 1,
  name: faker.company.name(),
  street: faker.location.street.name,
  houseNumber: faker.number.int({ min: 1, max: 300 }),
  city: faker.location.city(),
  postalCode: faker.location.zipCode(),
})

export const generateMeeting = (
  employeeId: number,
  scheduleId: number
): Meeting => ({
  id: 1,
  employeeId,
  scheduleId,
  canceled: false,
  cancellationReason: '',
  employeeIdCreated: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  priceExcepted: new Prisma.Decimal(faker.number.float({ precision: 2 })),
  priceFinal: new Prisma.Decimal(faker.number.float({ precision: 2 })),
  priceFull: new Prisma.Decimal(faker.number.float({ precision: 2 })),
  discount: new Prisma.Decimal(0),
})

export const generateMeetingSchedule = (
  locationId: number
): MeetingSchedule => ({
  id: 1,
  locationId: locationId,
  startTime: new Date(),
  endTime: new Date(),
  startDate: new Date(),
  endDate: new Date(),
  repeatRate: 0,
  repeatRateUnit: 'DAY',
})

export const generateClient = (): Client => ({
  id: 1,
  phoneNumber: faker.phone.number(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
})

export const generateClientsOnMeetings = (
  clientId: number,
  meetingId: number
): ClientsOnMeetings => ({
  clientId,
  meetingId,
  assignedAt: new Date(),
})

export const generateService = (): Service => ({
  id: 1,
  name: faker.commerce.productName(),
  price: new Prisma.Decimal(faker.number.float({ precision: 2 })),
})

export const generateServicesProvidedOnMeetings = (
  clientId: number,
  meetingId: number
): ServicesProvidedOnMeetings => ({
  clientId,
  meetingId,
  assignedAt: new Date(),
})

export const generateServicesBookedOnMeetings = (
  serviceId: number,
  meetingId: number
): ServicesBookedOnMeetings => ({
  serivceId: serviceId,
  meetingId,
  assignedAt: new Date(),
})

export const generateFakeData = (): {
  employees: Employee[]
  employeeSchedules: EmployeeSchedule[]
  locations: Location[]
  meetings: Meeting[]
  meetingSchedules: MeetingSchedule[]
  clients: Client[]
  clientsOnMeetings: ClientsOnMeetings[]
  services: Service[]
  servicesProvidedOnMeetings: ServicesProvidedOnMeetings[]
  servicesBookedOnMeetings: ServicesBookedOnMeetings[]
} => {
  const employees: Employee[] = [generateEmployee()]
  const locations: Location[] = [generateLocation()]
  const employeeSchedules: EmployeeSchedule[] = [
    generateEmployeeSchedule(employees[0].id, locations[0].id),
  ]
  const meetingSchedules: MeetingSchedule[] = [
    generateMeetingSchedule(locations[0].id),
  ]
  const meetings: Meeting[] = [
    generateMeeting(employees[0].id, meetingSchedules[0].id),
  ]
  const clients: Client[] = [generateClient()]
  const clientsOnMeetings: ClientsOnMeetings[] = [
    generateClientsOnMeetings(clients[0].id, meetings[0].id),
  ]
  const services: Service[] = [generateService()]
  const servicesProvidedOnMeetings: ServicesProvidedOnMeetings[] = [
    generateServicesProvidedOnMeetings(clients[0].id, meetings[0].id),
  ]
  const servicesBookedOnMeetings: ServicesBookedOnMeetings[] = [
    generateServicesBookedOnMeetings(services[0].id, meetings[0].id),
  ]

  return {
    employees,
    employeeSchedules,
    locations,
    meetings,
    meetingSchedules,
    clients,
    clientsOnMeetings,
    services,
    servicesProvidedOnMeetings,
    servicesBookedOnMeetings,
  }
}

// Export the method to generate fake data
export default generateFakeData
