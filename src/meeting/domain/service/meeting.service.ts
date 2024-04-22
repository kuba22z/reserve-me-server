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
import { MeetingScheduleMapper } from '../../mapper/meeting-schedule.mapper'
import { type CounterDto } from '../../api/dto/counter.dto'

@Injectable()
export class MeetingService {
  public static CREATE_MEETING_CONFLICT_MESSAGE =
    'Requested meeting schedule creation collides with other schedules'

  public static UPDATE_MEETING_CONFLICT_MESSAGE =
    'Requested meeting schedule update collides with other schedules'

  public static LOCATION_NOT_FOUND_MESSAGE = `The location doesnt exist`

  constructor(
    private readonly prisma: PrismaService,
    private readonly meetingMapper: MeetingMapper,
    private readonly scheduleMapper: MeetingScheduleMapper
  ) {}

  async create(createMeetingDto: CreateMeetingDto): Promise<MeetingDomain> {
    const periodicSchedules = this.computePeriodicSchedules(
      {
        from: createMeetingDto.schedule.startDate,
        to: createMeetingDto.schedule.endDate,
      },
      dayjs.duration(createMeetingDto.repeatRate ?? 'P0D')
    )
    return await this.prisma.$transaction(async (prisma) => {
      return await this.findNotCanceledByIntervals(
        prisma,
        periodicSchedules,
        createMeetingDto.schedule.locationId
      )
        .then((meetings) => meetings.map((m) => this.meetingMapper.toDomain(m)))
        .then(async (meetings) => {
          if (meetings.length === 0) {
            return await this.createMeeting(
              prisma,
              periodicSchedules,
              createMeetingDto
            )
          } else {
            throw new ConflictException(
              meetings.map((m) => this.meetingMapper.toDto(m)),
              MeetingService.CREATE_MEETING_CONFLICT_MESSAGE
            )
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
    const { schedule, ...createMeetingDtoWithoutSchedule } = createMeetingDto
    const meeting: MeetingModel = await prisma.meeting.create({
      include: { schedules: true, usersOnMeetings: true },
      data: {
        ...createMeetingDtoWithoutSchedule,
        schedules: { createMany: { data: createSchedulesModel } },
      },
    })

    return this.meetingMapper.toDomain(meeting)
  }

  async findAll(): Promise<MeetingDomain[]> {
    return await this.prisma.meeting
      .findMany({
        include: {
          usersOnMeetings: true,
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
          usersOnMeetings: true,
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
    interval: DateTimeInterval[],
    locationId: number
  ): Promise<MeetingModel[]> {
    if (interval.length === 0) return []
    const fromValues = interval.map((interval) => interval.from.toISOString())
    const toValues = interval.map((interval) => interval.to.toISOString())
    const query = Prisma.sql`
        SELECT *,
               "Meeting".id                  as "id",
               "MeetingSchedule".id          as "scheduleId",
               "MeetingSchedule"."createdAt" as "scheduleCreatedAt",
               "MeetingSchedule"."updatedAt" as "scheduleUpdatedAt"
        FROM "Meeting"
                 left join "MeetingSchedule" on "Meeting".id = "MeetingSchedule"."meetingId"
        WHERE canceled = false
          AND "locationId" = ${locationId}
          AND EXISTS (SELECT 1
                      FROM unnest(ARRAY [${Prisma.join(fromValues)}::timestamp], ARRAY [${Prisma.join(toValues)}::timestamp]) AS range(startDate, endDate)
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
    const meeting: MeetingModel = await prisma.meeting.update({
      where: { id: updateMeetingDto.id },
      include: { schedules: true, usersOnMeetings: true },
      data: {
        ...updateMeetingDto2,
        schedules: { updateMany: schedulesToUpdate },
      },
    })
    return this.meetingMapper.toDomain(meeting)
  }

  async update(updateMeetingDto: UpdateMeetingDto): Promise<MeetingDomain> {
    if (updateMeetingDto.locationId) {
      await this.prisma.location
        .findUnique({
          where: { id: updateMeetingDto.locationId },
          select: { id: true },
        })
        .then((location) => {
          if (!location) {
            throw new NotFoundException(
              [{ locationId: updateMeetingDto.locationId }],
              MeetingService.LOCATION_NOT_FOUND_MESSAGE
            )
          }
        })
    }

    if (
      !updateMeetingDto.schedules ||
      updateMeetingDto.schedules.length === 0
    ) {
      return await this.updateMeeting(updateMeetingDto, [], this.prisma)
    }

    const schedulesToChangeRequest = updateMeetingDto.schedules
      .filter((s) => s.startDate && s.endDate)
      .map((schedule) => {
        return {
          from: schedule.startDate as Date,
          to: schedule.endDate as Date,
        }
      })

    const actualMeetingSchedule = await this.prisma.meetingSchedule
      .findMany({
        where: { meetingId: updateMeetingDto.id },
      })
      .then((schedule) => schedule.map((s) => this.scheduleMapper.toDomain(s)))

    const locationId =
      // TODO make locationId not unique for each schedule in a meeting
      // here is [0] used because currently each schedule of a meeting sholud have the same locationId
      updateMeetingDto.locationId ?? actualMeetingSchedule[0].locationId
    const meetingsOverlap = await this.findNotCanceledByIntervals(
      this.prisma,
      schedulesToChangeRequest.length !== 0
        ? schedulesToChangeRequest
        : actualMeetingSchedule.map((s) => new DateTimeInterval(s)),
      locationId
    ).then((meetings) =>
      meetings.map((m) =>
        this.meetingMapper.toDto(this.meetingMapper.toDomain(m))
      )
    )
    // TODO fix bug: when the meeting is periodic and I change one interval so that it collides with
    //  other interval which belongs to the meeting -> this case will be not considered and this collison
    //  will be not detected
    //  currently its fixed by catching Exception -> constraint detects this failure
    const meetingsOverlapChangeRequest = meetingsOverlap.filter(
      (m) => m.id !== updateMeetingDto.id
    )

    if (meetingsOverlapChangeRequest.length > 0) {
      throw new ConflictException(
        meetingsOverlapChangeRequest,
        MeetingService.UPDATE_MEETING_CONFLICT_MESSAGE
      )
    }
    const schedulesUpdateManyInput: Prisma.MeetingScheduleUpdateManyWithWhereWithoutMeetingInput[] =
      updateMeetingDto.schedules.map((s) => {
        return {
          where: { id: s.id },
          data: {
            ...s,
            locationId,
          },
        }
      })

    try {
      return await this.updateMeeting(
        updateMeetingDto,
        schedulesUpdateManyInput,
        this.prisma
      )
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientUnknownRequestError &&
        error.message.includes(
          'exclude_overlapping_meeting_schedules_for_each_location'
        )
      ) {
        throw new ConflictException(
          meetingsOverlap,
          MeetingService.UPDATE_MEETING_CONFLICT_MESSAGE
        )
      }
      throw error
    }
  }

  async remove(ids: number[]): Promise<CounterDto> {
    return await this.prisma.meeting.deleteMany({
      where: { id: { in: ids } },
    })
  }

  public computePeriodicSchedules(
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
