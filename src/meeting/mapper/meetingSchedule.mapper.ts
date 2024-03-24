import { Injectable } from '@nestjs/common'
import { LocationMapper } from './location.mapper'
import type { MeetingScheduleModel } from './meeting.mapper'
import { MeetingScheduleDomain } from '../domain/model/meeting-schedule.domain'
import { MeetingScheduleDto } from '../api/dto/meeting-schedule.dto'
import * as dayjs from 'dayjs'

// type ValidateShape<T, Shape> = T extends Shape
//   ? Exclude<keyof T, keyof Shape> extends never
//     ? T
//     : never
//   : never

@Injectable()
export class MeetingScheduleMapper {
  constructor(private readonly locationMapper: LocationMapper) {}

  // Map Meeting to MeetingEntity
  public toDomain(schedule: MeetingScheduleModel): MeetingScheduleDomain {
    const { ...reduced } = schedule
    return new MeetingScheduleDomain({
      ...reduced,
      startDate: dayjs(schedule.startDate),
      endDate: dayjs(schedule.endDate),
      location: this.locationMapper.toDomain(schedule.location),
    })
  }

  public toDto(domain: MeetingScheduleDomain): MeetingScheduleDto {
    const { location, startDate, endDate, ...reduced } = domain
    return new MeetingScheduleDto({
      ...reduced,
      startDate: domain.startDate.toDate(),
      endDate: domain.endDate.toDate(),
      location: this.locationMapper.toDto(domain.location),
    })
  }
}
