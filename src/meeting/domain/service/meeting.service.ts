import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { type UpdateMeetingDto } from '../../api/dto/update-meeting.dto'
import { PrismaService } from 'nestjs-prisma'
import {
  MeetingMapper,
  type MeetingModel,
  type MeetingRawQuery,
} from '../../mapper/meeting.mapper'
import { DateTimeInterval } from '../model/datetime-interval.domain'
import { type MeetingDomain } from '../model/meeting.domain'
import { type CreateMeetingDto } from '../../api/dto/create-meeting.dto'
import { Prisma, type PrismaClient } from '@prisma/client'
import * as dayjs from 'dayjs'
import { type Duration } from 'dayjs/plugin/duration'
import type { ITXClientDenyList } from '@prisma/client/runtime/library'
import { MeetingScheduleMapper } from '../../mapper/meetingSchedule.mapper'
import { type CounterDto } from '../../api/dto/counter.dto'

@Injectable()
export class MeetingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly meetingMapper: MeetingMapper,
    private readonly scheduleMapper: MeetingScheduleMapper
  ) {}

  async create(createMeetingDto: CreateMeetingDto): Promise<MeetingDomain> {
    const allSchedules = this.computeAllSchedules(
      {
        from: createMeetingDto.schedule.startDate,
        to: createMeetingDto.schedule.endDate,
      },
      dayjs.duration(createMeetingDto.repeatRate)
    )
    return await this.prisma.$transaction(async (prisma) => {
      return await this.findNotCanceledByIntervals(
        prisma,
        allSchedules,
        createMeetingDto.schedule.locationId
      )
        .then((meetings) => meetings.map((a) => this.meetingMapper.toDomain(a)))
        .then(async (meetings) => {
          if (meetings.length === 0) {
            return await this.createMeeting(
              prisma,
              allSchedules,
              createMeetingDto
            )
          } else {
            throw new ConflictException(
              meetings.map((m) => this.meetingMapper.toDto(m)),
              'Requested Meeting Schedule collides with other Schedules'
            )
            // throw new GraphQLError(
            //   'Requested Meeting Schedule collides with other Schedules',
            //   {
            //     extensions: {
            //       code: 409,
            //       data: meetings.map((m) => this.meetingMapper.toDto(m)),
            //     },
            //   }
            // )
          }
        })
    })
  }

  private async createMeeting(
    prisma: Omit<PrismaClient, ITXClientDenyList>,
    schedules: DateTimeInterval[],
    createMeetingDto: CreateMeetingDto
  ): Promise<MeetingDomain> {
    const createSchedulesModel = schedules.map(
      (schedule): Prisma.MeetingScheduleCreateManyMeetingInput => {
        return {
          startDate: schedule.from,
          endDate: schedule.to,
          locationId: createMeetingDto.schedule.locationId,
        }
      }
    )
    const meeting: MeetingModel = await prisma.meeting.create({
      include: { schedules: true },
      data: {
        employeeIdCreated: createMeetingDto.employeeIdCreated,
        priceExcepted: createMeetingDto.priceExcepted,
        priceFinal: createMeetingDto.priceFinal,
        priceFull: createMeetingDto.priceFull,
        discount: createMeetingDto.discount,
        repeatRate: createMeetingDto.repeatRate,
        schedules: { createMany: { data: createSchedulesModel } },
      },
    })

    return this.meetingMapper.toDomain(meeting)
  }

  async findAll(): Promise<MeetingDomain[]> {
    return await this.prisma.meeting
      .findMany({
        include: {
          clientsOnMeetings: { include: { client: true } },
          schedules: {
            include: {
              location: true,
            },
          },
        },
      })
      .then((meetings) =>
        meetings.map((meeting: MeetingModel) =>
          this.meetingMapper.toDomain(meeting)
        )
      )
  }

  async findAllByInterval(
    dateTimeInterval: DateTimeInterval,
    canceled?: boolean
  ) {
    return await this.prisma.meeting
      .findMany({
        include: {
          clientsOnMeetings: { include: { client: true } },
          schedules: { include: { location: true } },
        },
        where: {
          schedules: {
            every: {
              startDate: {
                gte: dateTimeInterval.from, // Start of date range
              },
              endDate: {
                lte: dateTimeInterval.to, // End of date range
              },
              canceled,
            },
          },
        },
      })
      .then((meetings) =>
        meetings.map((meetingModel: MeetingModel) =>
          this.meetingMapper.toDomain(meetingModel)
        )
      )
  }

  async findNotCanceledByIntervals(
    prisma: Omit<PrismaClient, ITXClientDenyList>,
    dateTimeInterval: DateTimeInterval[],
    locationId: number
  ): Promise<MeetingModel[]> {
    const interval = dateTimeInterval.filter((i) => i.to && i.from)
    if (interval.length === 0) return []

    const fromValues = interval.map((interval) =>
      dayjs(interval.from).add(-1, 'hours').toDate()
    )
    const toValues = interval.map((interval) =>
      dayjs(interval.to).add(-1, 'hours').toDate()
    )
    const query = Prisma.sql`
        SELECT *, "MeetingSchedule".id as scheduleId, "MeetingSchedule"."createdAt" as scheduleCreatedAt, "MeetingSchedule"."updatedAt" as scheduleUpdatedAt
        FROM "Meeting"
                 left join "MeetingSchedule" on "Meeting".id = "MeetingSchedule"."meetingId"
        WHERE canceled = false
          AND "locationId" = ${locationId}
          AND EXISTS (SELECT 1
                      FROM unnest(ARRAY [${Prisma.join(fromValues)}], ARRAY [${Prisma.join(toValues)}]) AS range(startDate, endDate)
                      WHERE (startDate, endDate) OVERLAPS ("MeetingSchedule"."startDate", "MeetingSchedule"."endDate"))`
    const results: MeetingRawQuery[] = await prisma.$queryRaw(query)
    return results.map((result) => this.meetingMapper.toMeetingModel(result))
  }

  async updateMeeting(
    updateMeetingDto: UpdateMeetingDto,
    schedulesToUpdate: Prisma.MeetingScheduleUpdateManyWithWhereWithoutMeetingInput[],
    prisma: Omit<PrismaClient, ITXClientDenyList>
  ): Promise<MeetingDomain> {
    const { schedules, id, locationId, ...updateMeetingDto2 } = updateMeetingDto
    const meeting = await prisma.meeting.update({
      where: { id: updateMeetingDto.id },
      include: { schedules: true },
      data: {
        ...updateMeetingDto2,
        schedules: { updateMany: schedulesToUpdate },
      },
    })
    return this.meetingMapper.toDomain(meeting)
  }

  async update(updateMeetingDto: UpdateMeetingDto): Promise<MeetingDomain> {
    return await this.prisma.$transaction(async (prisma) => {
      if (
        !updateMeetingDto.schedules ||
        updateMeetingDto.schedules.length === 0
      ) {
        return await this.updateMeeting(updateMeetingDto, [], prisma)
      }

      const schedulesToChangeRequest = updateMeetingDto.schedules
        .filter((s) => s.startDate && s.endDate)
        .map((schedule) => {
          return {
            from: schedule.startDate,
            to: schedule.endDate,
          }
        })

      const actualMeetingSchedule = await prisma.meetingSchedule
        .findMany({
          where: { meetingId: updateMeetingDto.id },
        })
        .then((schedule) =>
          schedule.map((s) => this.scheduleMapper.toDomain(s))
        )

      if (updateMeetingDto.locationId) {
        await prisma.location
          .findFirst({
            where: { id: updateMeetingDto.locationId },
            select: { id: true, name: true },
          })
          .then((location) => {
            if (!location) {
              throw new NotFoundException(
                location,
                `The location ${location.name} doesnt exist`
              )
            }
          })
      }

      const locationId =
        // TODO make locationId not unique for each schedule in a meeting
        // here is [0] used because currently each schedule of a meeting sholud have the same locationId
        updateMeetingDto.locationId ?? actualMeetingSchedule[0].locationId

      const meetingsOverlapChangeRequest =
        await this.findNotCanceledByIntervals(
          prisma,
          schedulesToChangeRequest.length !== 0
            ? schedulesToChangeRequest
            : actualMeetingSchedule.map((s) => new DateTimeInterval(s)),
          locationId
        ).then((meetings) =>
          meetings.map((m) => this.meetingMapper.toDomain(m))
        )
      const schedulesOverlapChangeRequest =
        meetingsOverlapChangeRequest.flatMap((m) => m.schedules)
      const schedulesToChange = updateMeetingDto.schedules.filter(
        (schedule) =>
          !schedulesOverlapChangeRequest.find((s) => s.id === schedule.id)
      )

      const schedulesUpdateManyInput: Prisma.MeetingScheduleUpdateManyWithWhereWithoutMeetingInput[] =
        schedulesToChange.map((s) => {
          return {
            where: { id: s.id },
            data: {
              ...s,
              locationId,
            },
          }
        })

      return await this.updateMeeting(
        updateMeetingDto,
        schedulesUpdateManyInput,
        prisma
      )
    })
  }

  async remove(ids: number[]): Promise<CounterDto> {
    return await this.prisma.meeting.deleteMany({
      where: { id: { in: ids } },
    })
  }

  public computeAllSchedules(
    interval: DateTimeInterval,
    repeatRate: Duration
  ): DateTimeInterval[] {
    if (repeatRate.asDays() <= 0) {
      return [interval]
    }

    const validityPeriod = 365
    const numOfSchedules = Math.ceil(validityPeriod / repeatRate.asDays())
    return Array.from({ length: numOfSchedules + 1 }, (_, num) => ({
      from: dayjs
        .utc(interval.from)
        .add(num * repeatRate.asDays(), 'days')
        .toDate(),
      to: dayjs
        .utc(interval.to)
        .add(num * repeatRate.asDays(), 'days')
        .toDate(),
    }))
  }
}

// private readonly xprisma = this.prisma.$extends({
//   result: {
//     meetingSchedule: {
//       date: {
//         needs: { repeatRate: true, repeatRateUnit: true },
//         compute(repeat) {
//           return `${repeat.repeatRate} ${repeat.repeatRateUnit}`
//         },
//       },
//     },
//   },
// })
