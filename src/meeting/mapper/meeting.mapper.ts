import {
  type EmployeeSchedule,
  type EmployeesOnMeetings,
  type Location,
  type Meeting,
  type MeetingSchedule,
  type Service,
  type ServicesBookedOnMeetings,
  type ServicesProvidedOnMeetings,
  type UsersOnMeetings,
} from '@prisma/client'
import { MeetingDomain } from '../domain/model/meeting.domain'
import { Injectable } from '@nestjs/common'
import { MeetingScheduleMapper } from './meeting-schedule.mapper'
import { MeetingDto } from '../api/dto/meeting.dto'
import { type UsersOnMeetingsModel } from '../../user/mapper/user.mapper'
import * as dayjs from 'dayjs'
import * as assert from 'assert'

export type MeetingScheduleModel = MeetingSchedule & { location?: Location }
export type MeetingModel = Meeting & { schedules?: MeetingScheduleModel[] } & {
  usersOnMeetings?: UsersOnMeetingsModel[]
}

export type LocationModel = Location & { meetingSchedules?: MeetingSchedule[] }
export type EmployeeScheduleModel = EmployeeSchedule & { location?: Location }
export type EmployeesOnMeetingsModel = EmployeesOnMeetings & {
  schedule?: EmployeeScheduleModel[]
} & { meeting?: MeetingModel }
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
  } & Omit<UsersOnMeetings, 'createdAt' | 'updatedAt'> & {
    usersOnMeetingsCreatedAt: Date
    usersOnMeetingsUpdatedAt: Date
  }

@Injectable()
export class MeetingMapper {
  constructor(
    private readonly meetingScheduleMapper: MeetingScheduleMapper
    // forwardRef prevent a Circular dependency
    //  @Inject(forwardRef(() => UserMapper))
    //  private readonly clientMapper: UserMapper
  ) {}

  public toDomain(meeting: MeetingModel): MeetingDomain {
    const { repeatRate, schedules, ...reduced } = meeting
    assert(schedules)
    assert(meeting.usersOnMeetings)
    return new MeetingDomain({
      ...reduced,
      repeatRate: dayjs.duration(repeatRate ?? 'P0D'),
      schedules: schedules.map((schedule) =>
        this.meetingScheduleMapper.toDomain(schedule)
      ),
      userNames: meeting.usersOnMeetings.map((u) => u.userName),
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
      userExternalRefId,
      userName,
      usersOnMeetingsCreatedAt,
      usersOnMeetingsUpdatedAt,
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
      usersOnMeetings: [
        {
          userExternalRefId,
          userName,
          meetingId,
          updatedAt: usersOnMeetingsUpdatedAt,
          createdAt: usersOnMeetingsCreatedAt,
        },
      ],
    }
  }

  public toDto(domain: MeetingDomain): MeetingDto {
    const {
      priceFinal,
      priceExcepted,
      discount,
      priceFull,
      repeatRate,
      userNames,
      ...reduced
    } = domain
    assert(userNames)
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
      userNames,
    })
  }
}
