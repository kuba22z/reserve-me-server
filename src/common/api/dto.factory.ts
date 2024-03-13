import { type DateTimeIntervalDto } from '../../meeting/api/dto/dateTimeInterval.dto'
import { type LocationDto } from '../../meeting/api/dto/location.dto'
import { RepeatRateUnit } from '@prisma/client'
import { type MeetingScheduleDto } from '../../meeting/api/dto/meetingSchedule.dto'
import { type MeetingDto } from '../../meeting/api/dto/meeting.dto'
import * as dayjs from 'dayjs'
import { type ClientDto } from '../../client/api/dto/client.dto'

export class DtoFactory {
  static meetingDto: () => MeetingDto = () => ({
    id: 1,
    employeeId: 1,
    priceFull: null,
    scheduleId: 1,
    discount: 1,
    priceFinal: null,
    canceled: false,
    cancellationReason: '',
    employeeIdCreated: null,
    priceExcepted: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    clients: [],
    schedule: undefined,
    employee: undefined,
    serivcesBookedOnMeetings: undefined,
    serivcesProvidedOnMeetings: undefined,
  })

  static meetingscheduleDto: () => MeetingScheduleDto = () => ({
    id: 1,
    intervals: [],
    repeatRate: 1,
    repeatRateUnit: RepeatRateUnit.day,
    locationId: 1,
    location: undefined,
    meeting: undefined,
  })

  static locationDto: () => LocationDto = () => ({
    id: 1,
    name: 'Example Location',
    street: '123 Example Street',
    houseNumber: 1,
    city: 'Example City',
    postalCode: '12345',
    employeeSchedules: undefined,
    meetingSchedule: undefined,
  })

  static datetimeinterval: () => DateTimeIntervalDto = () => ({
    from: dayjs().toDate(),
    to: dayjs().toDate(),
  })

  static clientDto: () => ClientDto = () => ({
    id: 1,
    phoneNumber: '123456789',
    firstName: 'John',
    lastName: 'Doe',
    meetings: [],
  })
}
