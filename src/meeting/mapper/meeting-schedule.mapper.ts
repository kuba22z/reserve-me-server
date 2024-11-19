import { Injectable } from '@nestjs/common'
import { LocationMapper } from '../../location/mapper/location.mapper'
import type { MeetingScheduleWithLocation } from './meeting.mapper'
import { MeetingScheduleDomain } from '../domain/model/meeting-schedule.domain'
import { MeetingScheduleDto } from '../api/dto/meeting-schedule.dto'

@Injectable()
export class MeetingScheduleMapper {
  constructor(private readonly locationMapper: LocationMapper) {}

  // Map Meeting to MeetingEntity
  public toDomain(
    schedule: MeetingScheduleWithLocation
  ): MeetingScheduleDomain {
    const { ...reduced } = schedule
    return new MeetingScheduleDomain({
      ...reduced,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      location: this.locationMapper.toDomain(schedule.location),
    })
  }

  public toDto(domain: MeetingScheduleDomain): MeetingScheduleDto {
    const { location, startDate, endDate, ...reduced } = domain
    return new MeetingScheduleDto({
      ...reduced,
      startDate: domain.startDate,
      endDate: domain.endDate,
      location: this.locationMapper.toDto(domain.location),
    })
  }
}
