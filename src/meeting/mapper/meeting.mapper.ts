import {
  type Client,
  type ClientsOnMeetings,
  type Employee,
  type EmployeeSchedule,
  type Location,
  type Meeting,
  type MeetingSchedule,
  type Service,
  type ServicesBookedOnMeetings,
  type ServicesProvidedOnMeetings,
} from '@prisma/client'
import { MeetingDomain } from '../domain/model/meeting.domain'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { MeetingScheduleMapper } from './meeting-schedule.mapper'
import { MeetingDto } from '../api/dto/meeting.dto'
import { ClientMapper } from '../../client/mapper/client.mapper'
import * as dayjs from 'dayjs'

export type ClientsOnMeetingsModel = ClientsOnMeetings & { client?: Client }
export type MeetingScheduleModel = MeetingSchedule & { location?: Location }
export type MeetingModel = Meeting & { schedules?: MeetingScheduleModel[] } & {
  clientsOnMeetings?: ClientsOnMeetingsModel[]
}

export type LocationModel = Location & { meetingSchedules?: MeetingSchedule[] }
export type EmployeeModel = Employee & { schedule?: EmployeeScheduleModel[] }
export type EmployeeScheduleModel = EmployeeSchedule & { location?: Location }
export type ServiceModel = Service & {
  servicesBookedOnMeetings?: ServicesBookedOnMeetingsModel[]
} & { servicesProvidedOnMeetings?: ServicesProvidedOnMeetings[] }
export type ServicesBookedOnMeetingsModel = ServicesBookedOnMeetings & {
  meeting?: Meeting
}
export type ServicesProvidedOnMeetingsModel = ServicesProvidedOnMeetings & {
  meeting?: Meeting
}

export type MeetingRawQuery = Meeting &
  Omit<MeetingSchedule, 'createdAt' | 'updatedAt' | 'id'> & {
    scheduleCreatedAt: Date
    scheduleUpdatedAt: Date
    scheduleId: number
  }
type ValidateShape<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never

@Injectable()
export class MeetingMapper {
  constructor(
    private readonly meetingScheduleMapper: MeetingScheduleMapper,
    // forwardRef prevent a Circular dependency
    @Inject(forwardRef(() => ClientMapper))
    private readonly clientMapper: ClientMapper
  ) {}

  public toDomain<T>(meeting: ValidateShape<T, MeetingModel>): MeetingDomain {
    const { clientsOnMeetings, repeatRate, schedules, ...reduced } = meeting
    return new MeetingDomain({
      ...reduced,
      repeatRate: repeatRate === null ? null : dayjs.duration(repeatRate),
      schedules: schedules.map((schedule) =>
        this.meetingScheduleMapper.toDomain(schedule)
      ),
      clients: meeting.clientsOnMeetings?.map((clientOnMeetings) =>
        this.clientMapper.toDomain(clientOnMeetings.client)
      ),
    })
  }

  toMeetingModel(meetingRawQuery: MeetingRawQuery): MeetingModel {
    const {
      canceled,
      cancellationReason,
      startDate,
      endDate,
      locationId,
      meetingId,
      scheduleCreatedAt,
      scheduleUpdatedAt,
      scheduleId,
      ...meeting
    } = meetingRawQuery
    return {
      ...meeting,
      schedules: [
        {
          id: scheduleId,
          createdAt: scheduleCreatedAt,
          updatedAt: scheduleUpdatedAt,
          meetingId,
          canceled,
          cancellationReason,
          startDate,
          endDate,
          locationId,
        },
      ],
    }
  }

  public toDto<T>(domain: ValidateShape<T, MeetingDomain>): MeetingDto {
    const {
      schedules,
      priceFinal,
      priceExcepted,
      discount,
      priceFull,
      repeatRate,
      ...reduced
    } = domain
    return new MeetingDto({
      ...reduced,
      priceFinal: priceFinal?.toNumber(),
      priceExcepted: priceExcepted.toNumber(),
      discount: discount.toNumber(),
      priceFull: priceFull?.toNumber(),
      repeatRate: domain.repeatRate?.toISOString(),
      schedules: domain.schedules.map((schedule) =>
        this.meetingScheduleMapper.toDto(schedule)
      ),
      clients: domain.clients?.map((client) => this.clientMapper.toDto(client)),
    })
  }
}
