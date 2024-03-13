import {
  type Location,
  type Meeting,
  type MeetingSchedule,
} from '@prisma/client'
import { type MeetingDomain } from '../domain/model/meeting.domain'
import { Injectable } from '@nestjs/common'
import { MeetingScheduleMapper } from './meetingSchedule.mapper'
import { type MeetingDto } from '../api/dto/meeting.dto'
import { type DateTimeInterval } from '../domain/model/dateTimeInterval.dto'

export type MeetingScheduleModel = MeetingSchedule & { location: Location }
export type MeetingModel = Meeting & { schedule: MeetingScheduleModel }

@Injectable()
export class MeetingMapper {
  constructor(private readonly meetingScheduleMapper: MeetingScheduleMapper) {}

  // Map Meeting to MeetingEntity
  public toDomain(meeting: MeetingModel): MeetingDomain {
    return {
      ...meeting,
      schedule: this.meetingScheduleMapper.toDomain(meeting.schedule),
    }
  }

  // Map MeetingEntity to Meeting
  public toModel(entity: MeetingDomain): Meeting {
    return { ...entity }
  }

  public toDto(
    domain: MeetingDomain,
    scheduleIntervals: DateTimeInterval[]
  ): MeetingDto {
    return {
      ...domain,
      schedule: this.meetingScheduleMapper.toDto(
        domain.schedule,
        scheduleIntervals
      ),
    }
  }
}
