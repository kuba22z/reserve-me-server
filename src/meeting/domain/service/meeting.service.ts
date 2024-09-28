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
import { UserService } from '../../../user/domain/serivce/user.service'
import * as assert from 'assert'
import { PeriodicScheduleService } from './periodic-schedules.service'
import type { CounterDto } from '../../api/dto/counter.dto'

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
    private readonly scheduleMapper: MeetingScheduleMapper,
    private readonly userService: UserService
  ) {}

  public async create(
    createMeetingDto: CreateMeetingDto
  ): Promise<MeetingDomain> {
    const periodicSchedules = this.computePeriodicSchedules(
      {
        from: createMeetingDto.schedule.startDate,
        to: createMeetingDto.schedule.endDate,
      },
      dayjs.duration(createMeetingDto.repeatRate ?? 'P0D')
    )
    await this.assertPeriodicSchedulesNotCollides(
      createMeetingDto.schedule.locationId,
      periodicSchedules
    )

    return await this.createMeeting(periodicSchedules, createMeetingDto)
  }

  public async update(
    updateMeetingDto: UpdateMeetingDto
  ): Promise<MeetingDomain> {
    await this.assertLocationExists(updateMeetingDto.locationId)

    if (
      !updateMeetingDto.schedules ||
      updateMeetingDto.schedules.length === 0
    ) {
      return await this.updateMeeting(updateMeetingDto, this.prisma)
    }

    const meetingsOverlap =
      await this.assertSchedulesNotCollides(updateMeetingDto)

    try {
      return await this.updateMeeting(updateMeetingDto, this.prisma)
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

  public async findAll(): Promise<MeetingDomain[]> {
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

  public async findByIds(ids: number[]): Promise<MeetingDomain[]> {
    return await this.prisma.meeting
      .findMany({
        where: { id: { in: ids } },
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

  public async findAllByInterval(
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

  public async remove(ids: number[]): Promise<CounterDto> {
    return await this.prisma.meeting.deleteMany({
      where: { id: { in: ids } },
    })
  }

  private async createMeeting(
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
    const { schedule, userNames, ...createOnlyMeeting } = createMeetingDto
    const meeting: MeetingModel = await this.prisma.meeting.create({
      include: {
        schedules: { include: { location: true } },
        usersOnMeetings: true,
      },
      data: {
        ...createOnlyMeeting,
        schedules: { createMany: { data: createSchedulesModel } },
        usersOnMeetings: {
          createMany: {
            data: await this.findUsersOnMeetings(userNames),
          },
        },
      },
    })
    return this.meetingMapper.toDomain(meeting)
  }

  private async findUsersOnMeetings(
    userNames: string[]
  ): Promise<Prisma.UsersOnMeetingsCreateManyMeetingInput[]> {
    return await this.userService.findAll().then((users) => {
      return userNames.map((userName) => {
        const user = users.find((user) => user.userName === userName)
        assert(user)
        return {
          userExternalRefId: user.id,
          userName: user.userName,
        }
      })
    })
  }

  private async findNotCanceledByIntervals(
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
               "MeetingSchedule"."updatedAt" as "scheduleUpdatedAt",
               "UsersOnMeetings"."createdAt" as "usersOnMeetingsCreatedAt",
               "UsersOnMeetings"."updatedAt" as "usersOnMeetingsUpdatedAt"
        FROM "Meeting"
                 left join "MeetingSchedule" on "Meeting".id = "MeetingSchedule"."meetingId"
                 left join "UsersOnMeetings" on "Meeting".id = "UsersOnMeetings"."meetingId"
        WHERE canceled = false
          AND "locationId" = ${locationId}
          AND EXISTS (SELECT 1
                      FROM unnest(ARRAY [${Prisma.join(fromValues)}::timestamp], ARRAY [${Prisma.join(toValues)}::timestamp]) AS range(startDate, endDate)
                      WHERE (startDate, endDate) OVERLAPS ("MeetingSchedule"."startDate", "MeetingSchedule"."endDate"))`
    const results: MeetingRawQuery[] = await this.prisma.$queryRaw(query)
    return results.map((result) => this.meetingMapper.toMeetingModel(result))
  }

  async updateMeeting(
    updateMeetingDto: UpdateMeetingDto,
    prisma: Omit<PrismaClient, ITXClientDenyList>
  ): Promise<MeetingDomain> {
    assert(updateMeetingDto)
    const { schedules, id, locationId, userNames, ...meetingUpdateInput } =
      updateMeetingDto
    const schedulesUpdateManyInput: Prisma.MeetingScheduleUpdateManyWithWhereWithoutMeetingInput[] =
      schedules
        ? schedules.map((s) => {
            return {
              where: { id: s.id },
              data: {
                ...s,
                locationId,
              },
            }
          })
        : []

    const meeting: MeetingModel = await prisma.meeting.update({
      where: { id: updateMeetingDto.id },
      include: { schedules: true, usersOnMeetings: true },
      data: {
        ...meetingUpdateInput,
        schedules: { updateMany: schedulesUpdateManyInput },
      },
    })

    // TODO user names of a meeting are not updated currently -> update also usersOnMeetings when update meeting
    // const existingUserNamesOnMeetingsToUpdate = await prisma.usersOnMeetings
    //   .findMany({
    //     where: {
    //       meetingId: updateMeetingDto.id,
    //     },
    //   })
    //   .then((a) => a.map((c) => c.userExternalRefId))
    // const userOnMeetingsWithUserNames = await prisma.usersOnMeetings.findMany({
    //   where: {
    //     userName: { in: userNames },
    //   },
    // })
    // const uniqueUserOnMeetingsWithUserNames =
    //   userOnMeetingsWithUserNames.filter(
    //     (obj, index, self) =>
    //       index ===
    //       self.findIndex((o) => o.userExternalRefId === obj.userExternalRefId)
    //   )
    //
    // uniqueUserOnMeetingsWithUserNames.forEach((a) => {
    //   await prisma.usersOnMeetings.update({
    //     where: {
    //       meetingId: updateMeetingDto.id,
    //     },
    //     data: {},
    //   })
    // })

    return this.meetingMapper.toDomain(meeting)
  }

  computePeriodicSchedules(
    interval: DateTimeInterval,
    repeatRate: Duration
  ): DateTimeInterval[] {
    if (repeatRate.asDays() <= 0) {
      return [interval]
    }

    const numOfSchedules = Math.ceil(
      PeriodicScheduleService.scheduleValidityPeriodInDays / repeatRate.asDays()
    )
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

  private async assertLocationExists(locationId: number | undefined) {
    if (locationId) {
      await this.prisma.location
        .findUnique({
          where: { id: locationId },
          select: { id: true },
        })
        .then((location) => {
          if (!location) {
            throw new NotFoundException(
              [{ locationId }],
              MeetingService.LOCATION_NOT_FOUND_MESSAGE
            )
          }
        })
    }
  }

  private async assertPeriodicSchedulesNotCollides(
    scheduleLocationId: number,
    periodicSchedules: DateTimeInterval[]
  ) {
    await this.findNotCanceledByIntervals(periodicSchedules, scheduleLocationId)
      .then((meetings) => meetings.map((m) => this.meetingMapper.toDomain(m)))
      .then(async (meetings) => {
        if (meetings.length > 0) {
          throw new ConflictException(
            meetings.map((m) => this.meetingMapper.toDto(m)),
            MeetingService.CREATE_MEETING_CONFLICT_MESSAGE
          )
        }
      })
  }

  private async assertSchedulesNotCollides(updateMeetingDto: UpdateMeetingDto) {
    if (
      !updateMeetingDto.schedules ||
      updateMeetingDto.schedules.length === 0
    ) {
      return []
    }

    const schedulesToChangeRequest = updateMeetingDto.schedules
      .filter((s) => s.startDate && s.endDate)
      .map((schedule) => {
        return {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          from: schedule.startDate!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          to: schedule.endDate!,
        }
      })

    const actualMeetingSchedule = await this.prisma.meetingSchedule
      .findMany({
        where: { meetingId: updateMeetingDto.id },
      })
      .then((schedule) => schedule.map((s) => this.scheduleMapper.toDomain(s)))

    const locationId =
      // TODO make locationId not unique for each schedule in a meeting
      // here is [0] used because currently each schedule of a meeting should have the same locationId
      updateMeetingDto.locationId ?? actualMeetingSchedule[0].locationId
    const meetingsOverlap = await this.findNotCanceledByIntervals(
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
    return meetingsOverlap
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
