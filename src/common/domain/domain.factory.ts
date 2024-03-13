import { type ClientDomain } from '../../client/domain/model/client.domain'
import { type LocationDomain } from '../../meeting/domain/model/location.domain'
import { type MeetingScheduleDomain } from '../../meeting/domain/model/meetingSchedule.domain'
import { Prisma, RepeatRateUnit } from '@prisma/client'
import * as dayjs from 'dayjs'
import { type MeetingDomain } from '../../meeting/domain/model/meeting.domain'
import { type DateTimeInterval } from '../../meeting/domain/model/dateTimeInterval.domain'

export class DomainFactory {
  static meetingDomain: () => MeetingDomain = () => ({
    id: 1,
    employeeId: 1,
    priceFull: null,
    scheduleId: 1,
    discount: new Prisma.Decimal(1),
    priceFinal: null,
    canceled: false,
    cancellationReason: '',
    employeeIdCreated: null,
    priceExcepted: new Prisma.Decimal(1),
    createdAt: new Date(),
    updatedAt: new Date(),
    clients: [],
    schedule: undefined,
    employee: undefined,
    serivcesBookedOnMeetings: undefined,
    serivcesProvidedOnMeetings: undefined,
  })

  static clientDomain: () => ClientDomain = () => ({
    id: 1,
    phoneNumber: '123456789',
    firstName: 'John',
    lastName: 'Doe',
    meetings: [],
  })

  static locationDomain: () => LocationDomain = () => ({
    id: 1,
    name: 'Example Location',
    street: '123 Example Street',
    houseNumber: 1,
    city: 'Example City',
    postalCode: '12345',
    employeeSchedules: [],
    meetingSchedule: [],
  })

  static meetingScheduleDomain: () => MeetingScheduleDomain = () => ({
    id: 1,
    startDate: dayjs(),
    endDate: dayjs(),
    repeatRate: 1,
    repeatRateUnit: RepeatRateUnit.day,
    locationId: 1,
  })

  static dateTimeInterval: () => DateTimeInterval = () => ({
    from: dayjs(),
    to: dayjs(),
  })
}
