import { Injectable } from '@nestjs/common'
import { MeetingMapper } from '../../mapper/meeting.mapper'
import assert from 'assert'
import dayjs from 'dayjs'

import { type MeetingScheduleDomain } from '../model/meeting-schedule.domain'
import { type Duration } from 'dayjs/plugin/duration'
import { type MeetingDomain } from '../model/meeting.domain'
import { PrismaService } from '../../../prisma.service'

@Injectable()
export class PeriodicScheduleService {
  // private readonly logger = new Logger(PeriodicScheduleService.name)
  public static readonly scheduleValidityPeriodInDays: number = 365

  constructor(
    private readonly prisma: PrismaService,
    private readonly meetingMapper: MeetingMapper
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_11PM)
  // async handleCron() {
  //   const schedulesToCreate = await this.nextSchedulesToCreate()
  //   await this.prisma.meetingSchedule.createMany({
  //     data: schedulesToCreate.map(({ schedule, meetingId }) => {
  //       return {
  //         meetingId,
  //         locationId: schedule.locationId,
  //         startDate: schedule.startDate,
  //         endDate: schedule.endDate,
  //       }
  //     }),
  //   })
  // }

  async findPeriodicMeetings() {
    const meetings = await this.prisma.meeting.findMany({
      include: {
        schedules: { include: { location: true } },
        usersOnMeetings: true,
      },
      where: { repeatRate: { not: null } },
    })

    return meetings.map((meeting) => this.meetingMapper.toDomain(meeting))
  }

  async nextSchedulesToCreate() {
    const periodicMeetings = await this.findPeriodicMeetings()
    const latestSchedules = this.findFurthestSchedule(periodicMeetings)
    return this.calcuateNextSchedules(latestSchedules)
  }

  calcuateNextSchedules(
    furthestSchedules: ReadonlyArray<{
      repeatRate: Duration
      meetingId: number
      schedule: MeetingScheduleDomain
    }>
  ) {
    return furthestSchedules
      .filter((meeting) =>
        dayjs(meeting.schedule.endDate)
          .add(meeting.repeatRate)
          .isBefore(
            dayjs().add(
              PeriodicScheduleService.scheduleValidityPeriodInDays,
              'days'
            )
          )
      )
      .map((meeting) => {
        const { startDate, endDate, ...reduced } = meeting.schedule
        return {
          schedule: {
            ...reduced,
            startDate: dayjs(meeting.schedule.startDate)
              .add(meeting.repeatRate)
              .toDate(),
            endDate: dayjs(meeting.schedule.endDate)
              .add(meeting.repeatRate)
              .toDate(),
          },
          meetingId: meeting.meetingId,
        }
      })
  }

  findFurthestSchedule(periodicMeetings: MeetingDomain[]) {
    return periodicMeetings
      .filter(({ schedules }) => schedules.length > 0)
      .map((meeting) => {
        const firstSchedule = meeting.schedules.at(0)
        assert(firstSchedule)
        const schedule = meeting.schedules.reduce((latest, current) => {
          return current.startDate > latest.startDate ? current : latest
        }, firstSchedule)
        return {
          repeatRate: meeting.repeatRate,
          meetingId: meeting.id,
          schedule,
        }
      })
  }
}
