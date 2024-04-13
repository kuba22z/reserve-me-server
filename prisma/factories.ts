/*
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import {
  type Client,
  type ClientsOnMeetings,
  type Employee,
  type EmployeeSchedule,
  type Location,
  type Meeting,
  type MeetingSchedule,
  Prisma,
  type Service,
  type ServicesBookedOnMeetings,
  type ServicesProvidedOnMeetings,
} from '@prisma/client'

const idFactory = new Factory(() => faker.number)

export const EmployeeFactory = Factory.define<Employee>(({ sequence }) => ({
  id: 1,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
}))

export const EmployeeScheduleFactory = Factory.define<EmployeeSchedule>(() => ({
  id: idFactory.build(),
  employeeId: 1,
  locationId: 1,
  startDate: new Date(2018, 1, 5, 20, 30, 0, 0),
  endDate: new Date(2018, 1, 5, 22, 30, 0, 0),
  canceled: false,
  cancellationReason: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  repeatRate: null,
}))

export const LocationFactory = Factory.define<Location>(() => ({
  id: idFactory.build(),
  name: faker.company.name,
  street: faker.address.streetName(),
  houseNumber: faker.datatype.number({ min: 1, max: 300 }),
  city: faker.address.city(),
  postalCode: faker.address.zipCode(),
}))

export const MeetingFactory = Factory.define<Meeting>(() => ({
  id: idFactory.build(),
  employeeId: 1,
  repeatRate: null,
  employeeIdCreated: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  priceExcepted: new Prisma.Decimal(faker.datatype.float({ multipleOf: 2 })),
  priceFinal: new Prisma.Decimal(faker.datatype.float({ multipleOf: 2 })),
  priceFull: new Prisma.Decimal(faker.datatype.float({ multipleOf: 2 })),
  discount: new Prisma.Decimal(0),
}))

export const MeetingScheduleFactory = Factory.define<MeetingSchedule>(() => ({
  id: idFactory.build(),
  locationId: 1,
  meetingId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  startDate: new Date(2018, 1, 5, 21, 0, 0, 0),
  endDate: new Date(2018, 1, 5, 22, 30, 0, 0),
  canceled: false,
  cancellationReason: '',
}))

export const ClientFactory = Factory.define<Client>(() => ({
  id: idFactory.build(),
  phoneNumber: faker.phone.phoneNumber(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  createdAt: new Date(),
  updatedAt: new Date(),
}))

export const ClientsOnMeetingsFactory = Factory.define<ClientsOnMeetings>(
  () => ({
    clientId: 1,
    meetingId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
)

export const ServiceFactory = Factory.define<Service>(() => ({
  id: idFactory.build(),
  name: faker.commerce.productName(),
  price: new Prisma.Decimal(faker.datatype.float({ multipleOf: 2 })),
  createdAt: new Date(),
  updatedAt: new Date(),
}))

export const ServicesProvidedOnMeetingsFactory =
  Factory.define<ServicesProvidedOnMeetings>(() => ({
    clientId: 1,
    meetingId: 1,
  }))
export const ServicesBookedOnMeetingsFactory =
  Factory.define<ServicesBookedOnMeetings>(() => ({
    serviceId: 1,
    meetingId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

export default {
  EmployeeFactory,
  EmployeeScheduleFactory,
  LocationFactory,
  MeetingFactory,
  MeetingScheduleFactory,
  ClientFactory,
  ClientsOnMeetingsFactory,
  ServiceFactory,
  ServicesProvidedOnMeetingsFactory,
  ServicesBookedOnMeetingsFactory,
}
*/
