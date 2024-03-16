import { Injectable } from '@nestjs/common'
import type { MeetingSchedule } from '@prisma/client'
import { LocationMapper } from './location.mapper'
import type { MeetingScheduleModel } from './meeting.mapper'
import { MeetingScheduleDomain } from '../domain/model/meeting-schedule.domain'
import { MeetingScheduleDto } from '../api/dto/meeting-schedule.dto'
import * as dayjs from 'dayjs'
import { type DateTimeInterval } from '../domain/model/datetime-interval.domain'
import { DatetimeIntervalDto } from '../api/dto/datetime-interval.dto'

@Injectable()
export class MeetingScheduleMapper {
  constructor(private readonly locationMapper: LocationMapper) {}

  // Map Meeting to MeetingEntity
  public toDomain(schedule: MeetingScheduleModel): MeetingScheduleDomain {
    return new MeetingScheduleDomain({
      ...schedule,
      startDate: dayjs(schedule.startDate),
      endDate: dayjs(schedule.endDate),
      //   dateTimeRanges: [],
      location: this.locationMapper.toDomain(schedule.location),
    })
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
    intervals: DateTimeInterval
  ): MeetingScheduleDto {
    return new MeetingScheduleDto({
      id: domain.id,
      repeatRate: domain.repeatRate,
      repeatRateUnit: domain.repeatRateUnit,
      locationId: domain.locationId,
      location: this.locationMapper.toDto(domain.location),
      intervals: domain.computeScheduleByInterval(intervals).map(
        (interval) =>
          new DatetimeIntervalDto({
            from: interval.from.toDate(),
            to: interval.to.toDate(),
          })
      ),
    })
  }
}
