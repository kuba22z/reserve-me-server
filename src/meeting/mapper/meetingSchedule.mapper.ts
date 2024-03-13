import { Injectable } from '@nestjs/common'
import type { MeetingSchedule } from '@prisma/client'
import { LocationMapper } from './location.mapper'
import type { MeetingScheduleModel } from './meeting.mapper'
import { type MeetingScheduleDomain } from '../domain/model/meetingSchedule.domain'
import { type MeetingScheduleDto } from '../api/dto/meetingSchedule.dto'
import dayjs from 'dayjs'
import { type DateTimeInterval } from '../domain/model/dateTimeInterval.dto'

@Injectable()
export class MeetingScheduleMapper {
  constructor(private readonly locationMapper: LocationMapper) {}

  // Map Meeting to MeetingEntity
  public toDomain(schedule: MeetingScheduleModel): MeetingScheduleDomain {
    return {
      ...schedule,
      startDate: dayjs(schedule.startDate),
      endDate: dayjs(schedule.endDate),
      //   dateTimeRanges: [],
      location: this.locationMapper.toDomain(schedule.location),
    }
  }

  // Map MeetingEntity to Meeting
  public toModel(entity: MeetingScheduleDomain): MeetingSchedule {
    return {
      ...entity,
      startDate: entity.startDate.toDate(),
      endDate: entity.endDate.toDate(),
    }
  }

  public toDto(
    domain: MeetingScheduleDomain,
    intervals: DateTimeInterval[]
  ): MeetingScheduleDto {
    return {
      id: domain.id,
      repeatRate: domain.repeatRate,
      repeatRateUnit: domain.repeatRateUnit,
      locationId: domain.locationId,
      location: this.locationMapper.toDto(domain.location),
      intervals,
    }
  }
}
