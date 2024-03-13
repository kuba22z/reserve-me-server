import { type Client, type ClientsOnMeetings, type Location, type Meeting, type MeetingSchedule } from '@prisma/client'
import { type MeetingDomain } from '../domain/model/meeting.domain'
import { Injectable } from '@nestjs/common'
import { MeetingScheduleMapper } from './meetingSchedule.mapper'
import { type MeetingDto } from '../api/dto/meeting.dto'
import { type DateTimeInterval } from '../domain/model/dateTimeInterval'
import { ClientMapper } from '../../client/mapper/client.mapper'

export type ClientsOnMeetingsModel = ClientsOnMeetings & { client: Client }
export type MeetingScheduleModel = MeetingSchedule & { location: Location }
export type MeetingModel = Meeting & { schedule: MeetingScheduleModel } & {
  clientsOnMeetings: ClientsOnMeetingsModel[]
}
// type ValidateShape<T, Shape> = T extends Shape
//   ? Exclude<keyof T, keyof Shape> extends never
//     ? T
//     : never
//   : never

@Injectable()
export class MeetingMapper {
  constructor(
    private readonly meetingScheduleMapper: MeetingScheduleMapper,
    private readonly clientMapper: ClientMapper
  ) {}

  // Map Meeting to MeetingEntity
  public toDomain(meeting: MeetingModel): MeetingDomain {
    const { clientsOnMeetings, ...reduced } = meeting
    return {
      ...reduced,
      schedule: this.meetingScheduleMapper.toDomain(meeting.schedule),
      clients: meeting.clientsOnMeetings.map((clientOnMeetings) =>
        this.clientMapper.toDomain(clientOnMeetings.client)
      ),
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
      clients: domain.clients.map((client) => this.clientMapper.toDto(client)),
    }
  }
}
