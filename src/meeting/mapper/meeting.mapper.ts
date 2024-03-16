import {
  type Client,
  type ClientsOnMeetings,
  type Location,
  type Meeting,
  type MeetingSchedule,
} from '@prisma/client'
import { MeetingDomain } from '../domain/model/meeting.domain'
import { Injectable } from '@nestjs/common'
import { MeetingScheduleMapper } from './meetingSchedule.mapper'
import { MeetingDto } from '../api/dto/meeting.dto'
import { type DateTimeInterval } from '../domain/model/datetime-interval.domain'
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
    return new MeetingDomain({
      ...reduced,
      schedule: this.meetingScheduleMapper.toDomain(meeting.schedule),
      clients: meeting.clientsOnMeetings.map((clientOnMeetings) =>
        this.clientMapper.toDomain(clientOnMeetings.client)
      ),
    })
  }

  // Map MeetingEntity to Meeting
  public toModel(entity: MeetingDomain): Meeting {
    return { ...entity }
  }

  public toDto(
    domain: MeetingDomain,
    scheduleIntervals?: DateTimeInterval
  ): MeetingDto {
    const { priceFinal, priceExcepted, discount, priceFull, ...reduced } =
      domain
    return new MeetingDto({
      ...reduced,
      priceFinal: priceFinal.toNumber(),
      priceExcepted: priceExcepted.toNumber(),
      discount: discount.toNumber(),
      priceFull: priceFull.toNumber(),
      schedule:
        scheduleIntervals !== undefined
          ? this.meetingScheduleMapper.toDto(domain.schedule, scheduleIntervals)
          : undefined,
      clients: domain.clients.map((client) => this.clientMapper.toDto(client)),
    })
  }
}
