import {
  type EmployeeScheduleModel,
  type EmployeesOnMeetingsModel,
  type LocationModel,
  type MeetingModel,
  type MeetingScheduleModel,
  type ServiceModel,
  type ServicesBookedOnMeetingsModel,
  type ServicesProvidedOnMeetingsModel,
} from '../src/meeting/mapper/meeting.mapper'
import { createMock } from 'ts-auto-mock'
import { type UsersOnMeetingsModel } from '../src/user/mapper/user.mapper'
import { Prisma } from '@prisma/client'
import { faker } from '@faker-js/faker'

let id: number

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

export const generateMeeting = (): MeetingModel =>
  createMock<MeetingModel>({
    id,
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

export const generateClientsOnMeetings = (
  userExternalRefId: string,
  meetingId: number
): UsersOnMeetingsModel =>
  createMock<UsersOnMeetingsModel>({
    userExternalRefId,
    meetingId,
  })

export const generateService = (): ServiceModel =>
  createMock<ServiceModel>({
    id,
    price: new Prisma.Decimal(faker.number.float({ multipleOf: 2 })),
  })

export const generateServicesProvidedOnMeetings = (
  serviceId: number,
  meetingId: number
): ServicesProvidedOnMeetingsModel =>
  createMock<ServicesProvidedOnMeetingsModel>({
    serviceId,
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

export const generateEmployeesOnMeetings = (
  userExternalRefId: string,
  meetingId: number
): EmployeesOnMeetingsModel =>
  createMock<EmployeesOnMeetingsModel>({
    id,
    userExternalRefId,
    meetingId,
  })

export const generateFakeData = (
  idParam: number
): {
  employees: EmployeesOnMeetingsModel[]
  employeeSchedules: EmployeeScheduleModel[]
  locations: LocationModel[]
  meetings: MeetingModel[]
  meetingSchedules: MeetingScheduleModel[]
  usersOnMeetings: UsersOnMeetingsModel[]
  services: ServiceModel[]
  servicesProvidedOnMeetings: ServicesProvidedOnMeetingsModel[]
  servicesBookedOnMeetings: ServicesBookedOnMeetingsModel[]
} => {
  id = idParam
  const locations: LocationModel[] = [generateLocation()]

  const meetings: MeetingModel[] = [generateMeeting()]
  const meetingSchedules: MeetingScheduleModel[] = [
    generateMeetingSchedule(locations[0].id, meetings[0].id),
  ]
  const employees: EmployeesOnMeetingsModel[] = [
    generateEmployeesOnMeetings(id.toString(), meetings[0].id),
  ]

  const employeeSchedules: EmployeeScheduleModel[] = [
    generateEmployeeSchedule(employees[0].id, locations[0].id),
  ]

  const clientsOnMeetings: UsersOnMeetingsModel[] = [
    generateClientsOnMeetings(id.toString(), meetings[0].id),
  ]
  const services: ServiceModel[] = [generateService()]
  const servicesProvidedOnMeetings: ServicesProvidedOnMeetingsModel[] = [
    generateServicesProvidedOnMeetings(services[0].id, meetings[0].id),
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
    usersOnMeetings: clientsOnMeetings,
    services,
    servicesProvidedOnMeetings,
    servicesBookedOnMeetings,
  }
}

// Export the method to generate fake data
export default generateFakeData
