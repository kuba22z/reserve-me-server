import { Injectable } from '@nestjs/common'
import { type CreateMeetingDto } from '../../api/dto/create-meeting.dto'
import { type UpdateMeetingDto } from '../../api/dto/update-meeting.dto'
import { PrismaService } from 'nestjs-prisma'
import { MeetingMapper, type MeetingModel } from '../../mapper/meeting.mapper'
import { type DateTimeInterval } from '../model/dateTimeInterval'
import { type MeetingScheduleDomain } from '../model/meetingSchedule.domain'

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

  create(createMeetingDto: CreateMeetingDto) {
    return 'This action adds a new meeting'
  }

  async findAll(): Promise<null> {
    const d = await this.prisma.meeting.findFirst({
      include: {
        schedule: {
          include: {
            location: true,
          },
        },
      },
    })
    console.log(d)
    return null
  }

  findOne(id: number) {
    return `This action returns a #${id} meeting`
  }

  async findMeetingsByInterval(dateTimeInterval: DateTimeInterval) {
    const meetingModels: MeetingModel[] = await this.prisma.meeting.findMany({
      include: {
        clientsOnMeetings: { include: { client: true } },
        schedule: {
          include: {
            location: true,
          },
        },
      },
      where: {
        schedule: {
          startDate: {
            gte: dateTimeInterval.from.toDate(), // Start of date range
          },
          endDate: {
            lte: dateTimeInterval.to.toDate(), // End of date range
          },
        },
      },
    })
    return meetingModels
      .map((meetingModel) => this.mapper.toDomain(meetingModel))
      .map((meeting) =>
        this.mapper.toDto(
          meeting,
          this.computeScheduleByInterval(meeting.schedule, dateTimeInterval)
        )
      )
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    return `This action updates a #${id} meeting`
  }

  remove(id: number) {
    return `This action removes a #${id} meeting`
  }

  computeScheduleByInterval(
    schedule: MeetingScheduleDomain,
    interval: DateTimeInterval
  ): DateTimeInterval[] {
    if (schedule.repeatRate <= 0) {
      return []
    }
    const numRepetitions = Math.floor(
      interval.to.diff(schedule.startDate, schedule.repeatRateUnit) /
        schedule.repeatRate
    )

    // If end date is before start date, skip this item
    if (numRepetitions < 0) return []
    const schedulesUntilIntervalEnd: DateTimeInterval[] = Array.from(
      { length: numRepetitions + 1 },
      (_, numUnit) => ({
        from: schedule.startDate.add(
          numUnit * schedule.repeatRate,
          schedule.repeatRateUnit
        ),
        to: schedule.endDate.add(
          numUnit * schedule.repeatRate,
          schedule.repeatRateUnit
        ),
      })
    )

    return schedulesUntilIntervalEnd.filter(
      (schedule) =>
        schedule.to.isBefore(interval.to) &&
        schedule.from.isAfter(interval.from)
    )
  }
}

// computeSchedulesByInterval(
//   meetings: MeetingDomain[],
//   dateTimeRange: DateTimeIntervalDto
// ) {
//   return meetings.reduce((acc, meeting) => {
//     const startDate = dayjs(meeting.schedule.startDate)
//     const endDate = dayjs(meeting.schedule.endDate)
//     const repeatRate = meeting.schedule.repeatRate
//     if (repeatRate <= 0) {
//       return acc
//     }
//     const numRepetitions = Math.floor(
//       dayjs(dateTimeRange.to).diff(
//         startDate,
//         meeting.schedule.repeatRateUnit
//       ) / repeatRate
//     )
//
//     if (numRepetitions < 0) return acc // If end date is before start date, skip this item
//     const dateRanges = Array.from(
//       { length: numRepetitions + 1 },
//       (_, index) => ({
//         startDate: startDate.add(index * repeatRate, 'day'),
//         endDate: endDate.add(index * repeatRate, 'day'),
//       })
//     )
//
//     return acc.concat(
//       dateRanges.filter(
//         (range) =>
//           range.startDate.isBefore(dateTimeRange.to) &&
//           range.startDate.isAfter(dateTimeRange.from)
//       )
//     )
//   }, [])
// }
