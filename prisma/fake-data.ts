import {
  type EmployeeModel,
  type EmployeeScheduleModel,
  type LocationModel,
  type MeetingModel,
  type MeetingScheduleModel,
  type ServiceModel,
  type ServicesBookedOnMeetingsModel,
  type ServicesProvidedOnMeetingsModel,
} from '../src/meeting/mapper/meeting.mapper'
import { createMock } from 'ts-auto-mock'
import {
  type ClientModel,
  type ClientsOnMeetingsModel,
} from '../src/client/mapper/client.mapper'
import { Prisma } from '@prisma/client'
import { faker } from '@faker-js/faker'

let id: number

export const generateEmployee = (): EmployeeModel =>
  createMock<EmployeeModel>({
    id,
  })

export const generateEmployeeSchedule = (
  employeeId: number,
  locationId: number
): EmployeeScheduleModel =>
  createMock<EmployeeScheduleModel>({
    id,
    employeeId,
    locationId,
    startDate: new Date(2018, 1, 5, 20, 30, 0, 0),
    endDate: new Date(2018, 1, 5, 22, 30, 0, 0),
    canceled: false,
    repeatRate: null,
  })

export const generateLocation = (): LocationModel =>
  createMock<LocationModel>({
    id,
  })

export const generateMeeting = (employeeId: number): MeetingModel =>
  createMock<MeetingModel>({
    id,
    employeeId,
    repeatRate: null,
    priceExcepted: new Prisma.Decimal(faker.number.float({ multipleOf: 2 })),
    priceFinal: new Prisma.Decimal(faker.number.float({ multipleOf: 2 })),
    priceFull: new Prisma.Decimal(faker.number.float({ multipleOf: 2 })),
    discount: new Prisma.Decimal(0),
  })

export const generateMeetingSchedule = (
  locationId: number,
  meetingId: number
): MeetingScheduleModel =>
  createMock<MeetingScheduleModel>({
    id,
    startDate: new Date(2018, 1, 5, 21, 0, 0, 0),
    endDate: new Date(2018, 1, 5, 22, 30, 0, 0),
    canceled: false,
    locationId,
    meetingId,
  })

export const generateClient = (): ClientModel =>
  createMock<ClientModel>({
    id,
  })

export const generateClientsOnMeetings = (
  clientId: number,
  meetingId: number
): ClientsOnMeetingsModel =>
  createMock<ClientsOnMeetingsModel>({
    clientId,
    meetingId,
  })

export const generateService = (): ServiceModel =>
  createMock<ServiceModel>({
    id,
    price: new Prisma.Decimal(faker.number.float({ multipleOf: 2 })),
  })

export const generateServicesProvidedOnMeetings = (
  clientId: number,
  meetingId: number
): ServicesProvidedOnMeetingsModel =>
  createMock<ServicesProvidedOnMeetingsModel>({
    clientId,
    meetingId,
  })

export const generateServicesBookedOnMeetings = (
  serviceId: number,
  meetingId: number
): ServicesBookedOnMeetingsModel =>
  createMock<ServicesBookedOnMeetingsModel>({
    serviceId,
    meetingId,
  })

export const generateFakeData = (
  idParam: number
): {
  employees: EmployeeModel[]
  employeeSchedules: EmployeeScheduleModel[]
  locations: LocationModel[]
  meetings: MeetingModel[]
  meetingSchedules: MeetingScheduleModel[]
  clients: ClientModel[]
  clientsOnMeetings: ClientsOnMeetingsModel[]
  services: ServiceModel[]
  servicesProvidedOnMeetings: ServicesProvidedOnMeetingsModel[]
  servicesBookedOnMeetings: ServicesBookedOnMeetingsModel[]
} => {
  id = idParam
  const employees: EmployeeModel[] = [generateEmployee()]
  const locations: LocationModel[] = [generateLocation()]
  const employeeSchedules: EmployeeScheduleModel[] = [
    generateEmployeeSchedule(employees[0].id, locations[0].id),
  ]

  const meetings: MeetingModel[] = [generateMeeting(employees[0].id)]
  const meetingSchedules: MeetingScheduleModel[] = [
    generateMeetingSchedule(locations[0].id, meetings[0].id),
  ]
  const clients: ClientModel[] = [generateClient()]
  const clientsOnMeetings: ClientsOnMeetingsModel[] = [
    generateClientsOnMeetings(clients[0].id, meetings[0].id),
  ]
  const services: ServiceModel[] = [generateService()]
  const servicesProvidedOnMeetings: ServicesProvidedOnMeetingsModel[] = [
    generateServicesProvidedOnMeetings(clients[0].id, meetings[0].id),
  ]
  const servicesBookedOnMeetings: ServicesBookedOnMeetingsModel[] = [
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
