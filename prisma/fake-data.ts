import { RepeatRateUnit } from '@prisma/client'
import { faker } from '@faker-js/faker'
import Decimal from 'decimal.js'

export function fakeMeeting() {
  return {
    priceExcepted: new Decimal(faker.number.float()),
    priceFull: undefined,
    priceFinal: undefined,
    employeeIdCreated: undefined,
    updatedAt: faker.date.anytime(),
  }
}
export function fakeMeetingComplete() {
  return {
    id: faker.number.int(),
    employeeId: faker.number.int(),
    priceExcepted: new Decimal(faker.number.float()),
    priceFull: undefined,
    discount: new Decimal(0),
    priceFinal: undefined,
    canceled: false,
    cancellationReason: '',
    employeeIdCreated: undefined,
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
    scheduleId: faker.number.int(),
  }
}
export function fakeMeetingSchedule() {
  return {
    startTime: faker.date.anytime(),
    endTime: faker.date.anytime(),
    startDate: faker.date.anytime(),
  }
}
export function fakeMeetingScheduleComplete() {
  return {
    id: faker.number.int(),
    startTime: faker.date.anytime(),
    endTime: faker.date.anytime(),
    startDate: faker.date.anytime(),
    endDate: new Date(),
    repeatRate: 0,
    repeatRateUnit: RepeatRateUnit.DAY,
    locationId: faker.number.int(),
  }
}
export function fakeClient() {
  return {
    phoneNumber: faker.lorem.words(5),
    firstName: undefined,
    lastName: undefined,
  }
}
export function fakeClientComplete() {
  return {
    id: faker.number.int(),
    phoneNumber: faker.lorem.words(5),
    firstName: undefined,
    lastName: undefined,
  }
}
export function fakeClientsOnMeetingsComplete() {
  return {
    clientId: faker.number.int(),
    meetingId: faker.number.int(),
    assignedAt: new Date(),
  }
}
export function fakeEmployee() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }
}
export function fakeEmployeeComplete() {
  return {
    id: faker.number.int(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }
}
export function fakeEmployeeSchedule() {
  return {
    startTime: faker.date.anytime(),
    endTime: faker.date.anytime(),
    startDate: faker.date.anytime(),
  }
}
export function fakeEmployeeScheduleComplete() {
  return {
    id: faker.number.int(),
    employeeId: faker.number.int(),
    locationId: faker.number.int(),
    startTime: faker.date.anytime(),
    endTime: faker.date.anytime(),
    startDate: faker.date.anytime(),
    endDate: new Date(),
    repeatRate: 0,
    repeatRateUnit: RepeatRateUnit.DAY,
  }
}
export function fakeLocation() {
  return {
    name: faker.person.fullName(),
    street: faker.lorem.words(5),
    houseNumber: faker.number.int(),
    city: faker.lorem.words(5),
    postalCode: faker.lorem.words(5),
  }
}
export function fakeLocationComplete() {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
    street: faker.lorem.words(5),
    houseNumber: faker.number.int(),
    city: faker.lorem.words(5),
    postalCode: faker.lorem.words(5),
  }
}
export function fakeService() {
  return {
    name: faker.person.fullName(),
    price: new Decimal(faker.number.float()),
  }
}
export function fakeServiceComplete() {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
    price: new Decimal(faker.number.float()),
  }
}
export function fakeServicesProvidedOnMeetingsComplete() {
  return {
    clientId: faker.number.int(),
    meetingId: faker.number.int(),
    assignedAt: new Date(),
  }
}
export function fakeServicesBookedOnMeetingsComplete() {
  return {
    serivceId: faker.number.int(),
    meetingId: faker.number.int(),
    assignedAt: new Date(),
  }
}
