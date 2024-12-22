import {
  type Location,
  type Meeting,
  type MeetingSchedule,
  type Prisma,
  type UsersOnMeetings,
} from '@prisma/client'
import { MeetingDomain } from '../domain/model/meeting.domain'
import { Injectable } from '@nestjs/common'
import { MeetingScheduleMapper } from './meeting-schedule.mapper'
import { MeetingDto } from '../api/dto/meeting.dto'
import dayjs from 'dayjs'
import { type UserDomainWithGroup } from '../../user/domain/model/userDomainWithGroup'

export type MeetingScheduleWithLocation = Prisma.MeetingScheduleGetPayload<{
  include: { location: true }
}>

export type MeetingPrisma = Prisma.MeetingGetPayload<{
  include: {
    usersOnMeetings: true
    schedules: {
      include: {
        location: true
      }
    }
  }
}>

export type LocationWithMeetingSchedules = Prisma.LocationGetPayload<{
  include: { meetingSchedules: true }
}>

export type EmployeeScheduleModel = Prisma.EmployeeScheduleGetPayload<{
  include: { location: true }
}>

export type EmployeesOnMeetingsModel = Prisma.EmployeesOnMeetingsGetPayload<{
  include: {
    schedule: { include: { location: true } }
    meeting: true
  }
}>

export type ServiceModel = Prisma.ServiceGetPayload<{
  include: {
    servicesBookedOnMeetings: { include: { meeting: true } }
    servicesProvidedOnMeetings: { include: { meeting: true } }
  }
}>

export type ServicesBookedOnMeetingsModel =
  Prisma.ServicesBookedOnMeetingsGetPayload<{
    include: { meeting: true }
  }>

export type ServicesProvidedOnMeetingsModel =
  Prisma.ServicesProvidedOnMeetingsGetPayload<{
    include: { meeting: true }
  }>

export type MeetingRawQuery = Meeting &
  Omit<MeetingSchedule, 'createdAt' | 'updatedAt' | 'id'> & {
    scheduleCreatedAt: Date
    scheduleUpdatedAt: Date
    scheduleId: number
  } & Omit<UsersOnMeetings, 'createdAt' | 'updatedAt'> & {
    usersOnMeetingsCreatedAt: Date
    usersOnMeetingsUpdatedAt: Date
  } & Omit<Location, 'id' | 'name'> & {
    locationName: string
    id: number
  }

@Injectable()
export class MeetingMapper {
  constructor(
    private readonly meetingScheduleMapper: MeetingScheduleMapper
    // forwardRef prevent a Circular dependency
    //  @Inject(forwardRef(() => UserMapper))
    //  private readonly clientMapper: UserMapper
  ) {}

  public toDomain(meeting: MeetingPrisma): MeetingDomain {
    const { repeatRate, schedules, ...reduced } = meeting
    return new MeetingDomain({
      ...reduced,
      repeatRate: dayjs.duration(repeatRate ?? 'P0D'),
      schedules: schedules.map((schedule) =>
        this.meetingScheduleMapper.toDomain(schedule)
      ),
      userNames: meeting.usersOnMeetings.map((u) => u.userName),
    })
  }

  public toReservedMeetingDto(
    meeting: MeetingDomain,
    user: UserDomainWithGroup
  ): MeetingDto {
    const { id, schedules, userNames } = meeting
    return {
      id,
      schedules: schedules.map((schedule) =>
        this.meetingScheduleMapper.toDto(schedule)
      ),
      userNames: userNames.some((u) => u === user.userName)
        ? userNames
        : undefined,
    }
  }

  toMeetingModel(meetingRawQuery: MeetingRawQuery): MeetingPrisma {
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
      locationName,
      houseNumber,
      postalCode,
      city,
      street,
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
          location: {
            id: locationId,
            name: locationName,
            city,
            street,
            houseNumber,
            postalCode,
          },
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
    return new MeetingDto({
      ...reduced,
      priceFinal: priceFinal?.toNumber(),
      priceExcepted: priceExcepted.toNumber(),
      discount: discount.toNumber(),
      priceFull: priceFull?.toNumber(),
      repeatRate: domain.repeatRate.toISOString(),
      schedules: domain.schedules.map((schedule) =>
        this.meetingScheduleMapper.toDto(schedule)
      ),
      userNames,
    })
  }
}
