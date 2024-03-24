import { Injectable, NotFoundException } from '@nestjs/common'
import { type UpdateMeetingDto } from '../../api/dto/update-meeting.dto'
import { PrismaService } from 'nestjs-prisma'
import { MeetingMapper, type MeetingModel } from '../../mapper/meeting.mapper'
import { type DateTimeInterval } from '../model/datetime-interval.domain'
import { type MeetingDomain } from '../model/meeting.domain'
import { type CreateMeetingDto } from '../../api/dto/create-meeting.dto'
import { Prisma, type PrismaClient } from '@prisma/client'
import * as dayjs from 'dayjs'
import { type Duration } from 'dayjs/plugin/duration'
import type { ITXClientDenyList } from '@prisma/client/runtime/library'

@Injectable()
export class MeetingService {
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

  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: MeetingMapper
  ) {}

  async create(createMeetingDto: CreateMeetingDto): Promise<MeetingDomain> {
    const allSchedules = this.computeAllSchedules(
      {
        from: dayjs(createMeetingDto.schedule.startDate),
        to: dayjs(createMeetingDto.schedule.endDate),
      },
      dayjs.duration(createMeetingDto.repeatRate)
    )
    return await this.prisma.$transaction(async (prisma) => {
      return await this.findNotCanceledByIntervals(
        prisma,
        allSchedules,
        createMeetingDto.schedule.locationId
      )
        .then((meetings) => meetings.map((a) => this.mapper.toDomain(a)))
        .then(async (meetings) => {
          if (meetings.length === 0) {
            return await this.createMeetings(
              prisma,
              allSchedules,
              createMeetingDto
            )
          } else {
            throw new NotFoundException('Meeting Schedule already exists')
          }
        })
    })
  }

  async createMeetings(
    tx: Omit<PrismaClient, ITXClientDenyList>,
    schedules: DateTimeInterval[],
    createMeetingDto: CreateMeetingDto
  ): Promise<MeetingDomain> {
    const meeting: MeetingModel = await tx.meeting.create({
      include: { schedules: true },
      data: {
        employeeIdCreated: createMeetingDto.employeeIdCreated,
        priceExcepted: createMeetingDto.priceExcepted,
        priceFinal: createMeetingDto.priceFinal,
        priceFull: createMeetingDto.priceFull,
        discount: createMeetingDto.discount,
        repeatRate: createMeetingDto.repeatRate,
      },
    })
    const createSchedulesModel = schedules.map(
      (schedule): Prisma.MeetingScheduleCreateManyInput => {
        return {
          meetingId: meeting.id,
          startDate: schedule.from.toDate(),
          endDate: schedule.to.toDate(),
          locationId: createMeetingDto.schedule.locationId,
        }
      }
    )

    await tx.meetingSchedule.createMany({
      data: createSchedulesModel,
    })
    return this.mapper.toDomain(meeting)
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
        meetings.map((meeting: MeetingModel) => this.mapper.toDomain(meeting))
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
          schedules: {
            where: {
              startDate: {
                gte: dateTimeInterval.from.toDate(), // Start of date range
              },
              endDate: {
                lte: dateTimeInterval.to.toDate(), // End of date range
              },
              canceled,
            },
            include: {
              location: true,
            },
          },
        },
      })
      .then((meetings) =>
        meetings.map((meetingModel: MeetingModel) =>
          this.mapper.toDomain(meetingModel)
        )
      )
  }

  async findNotCanceledByIntervals(
    prisma: Omit<PrismaClient, ITXClientDenyList>,
    dateTimeInterval: DateTimeInterval[],
    locationId: number
  ): Promise<MeetingModel[]> {
    const fromValues = dateTimeInterval.map((a) => a.from.toDate())
    const toValues = dateTimeInterval.map((a) => a.from.toDate())

    const query = Prisma.sql`
        SELECT *, "MeetingSchedule".id as scheduleId, "MeetingSchedule"."createdAt" as scheduleCreatedAt, "MeetingSchedule"."updatedAt" as scheduleUpdatedAt
        FROM "Meeting"
                 left join "MeetingSchedule" on "Meeting".id = "MeetingSchedule"."meetingId"
        WHERE canceled = false
          AND "locationId" = ${locationId}
          AND EXISTS (SELECT 1
                      FROM unnest(ARRAY [${Prisma.join(fromValues)}], ARRAY [${Prisma.join(toValues)}]) AS range(startDate, endDate)
                      WHERE (startDate, endDate) OVERLAPS ("MeetingSchedule"."startDate", "MeetingSchedule"."endDate"))`
    console.log('await tx.$queryRaw(query)')
    console.log(await prisma.$queryRaw(query))
    const results: Array<{
      id: number
      employeeId: number
      priceExcepted: Prisma.Decimal
      priceFull: Prisma.Decimal
      discount: Prisma.Decimal
      priceFinal: Prisma.Decimal
      employeeIdCreated: number
      createdAt: Date
      updatedAt: Date
      startDate: Date
      endDate: Date
      meetingId: number
      repeatRate: string
      locationId: number
      canceled: boolean
      cancellationReason: string
      scheduleId: number
      scheduleCreatedAt: Date
      scheduleUpdatedAt: Date
    }> = await prisma.$queryRaw(query)

    return results.map((result) => {
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
        ...meeting
      } = result

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
      }
    })
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    return `This action updates a #${id} meeting`
  }

  remove(id: number) {
    return `This action removes a #${id} meeting`
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
    return Array.from({ length: numOfSchedules }, (_, num) => ({
      from: dayjs.utc(interval.from).add(num * repeatRate.asDays(), 'days'),
      to: dayjs.utc(interval.to).add(num * repeatRate.asDays(), 'days'),
    }))
  }
}
