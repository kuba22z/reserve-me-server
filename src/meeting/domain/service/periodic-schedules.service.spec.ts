import * as duration from 'dayjs/plugin/duration'
import * as utcPlugin from 'dayjs/plugin/utc'
import * as dayjs from 'dayjs'
import { Test } from '@nestjs/testing'
import { PeriodicScheduleService } from './periodic-schedules.service'
import { createMock } from 'ts-auto-mock'
import type { MeetingScheduleDomain } from '../model/meeting-schedule.domain'
import { type MeetingDomain } from '../model/meeting.domain'
import { type MockFunctionMetadata, ModuleMocker } from 'jest-mock'

const moduleMocker = new ModuleMocker(global)

describe('PeriodicScheduleService', () => {
  let service: PeriodicScheduleService

  beforeEach(async () => {
    dayjs.extend(duration)
    dayjs.extend(utcPlugin)
    const moduleRef = await Test.createTestingModule({
      providers: [PeriodicScheduleService],
    })
      .useMocker((token) => {
        // const results: MeetingDto[] = []
        // if (token === MeetingService) {
        //   return {
        //     findMeetingsByInterval: jest.fn().mockResolvedValue(results),
        //   }
        // }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>
          const Mock = moduleMocker.generateFromMetadata(mockMetadata)
          return new Mock()
        }
      })
      .compile()
    service = moduleRef.get<PeriodicScheduleService>(PeriodicScheduleService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findFurthestSchedule', () => {
    test.each([
      [
        [{ from: '2024-01-01' }, { from: '2024-01-02' }],
        { from: '2024-01-02' },
      ],
      [
        [{ from: '2025-01-01' }, { from: '2025-01-02' }],
        { from: '2025-01-02' },
      ],
      [
        [{ from: '2025-01-01' }, { from: '2024-12-31' }],
        { from: '2025-01-01' },
      ],
    ])('', (periodicSchedules, expectedFurthestSchedule) => {
      const meeting = createMock<MeetingDomain>()
      meeting.id = 1
      meeting.repeatRate = dayjs.duration('P7D')
      const meetingSchedule = createMock<MeetingScheduleDomain>()

      meeting.schedules = periodicSchedules.map((dateString) => {
        meetingSchedule.startDate = new Date(dateString.from)
        return meetingSchedule
      })

      // when
      const furthestSchedule = service.findFurthestSchedule([meeting])
      meetingSchedule.startDate = new Date(expectedFurthestSchedule.from)
      // then
      expect(furthestSchedule).toEqual([
        {
          repeatRate: meeting.repeatRate,
          meetingId: meeting.id,
          schedule: meetingSchedule,
        },
      ])
    })
  })

  describe('calcuateNextSchdules', () => {
    test.each([
      [
        { from: '2024-01-01', to: '2024-01-02', repeatRate: 'P1D' },
        { from: '2024-01-02', to: '2024-01-03' },
      ],
      [
        { from: '2024-01-01', to: '2024-01-01', repeatRate: 'P7D' },
        { from: '2024-01-08', to: '2024-01-08' },
      ],
      [
        { from: '2024-01-01', to: '2024-01-04', repeatRate: 'P1M' },
        { from: '2024-02-01', to: '2024-02-04' },
      ],
      [
        {
          from: dayjs()
            .add(
              PeriodicScheduleService.scheduleValidityPeriodInDays - 1,
              'days'
            )
            .toISOString(),
          to: dayjs()
            .add(PeriodicScheduleService.scheduleValidityPeriodInDays, 'days')
            .toISOString(),
          repeatRate: 'P1D',
        },
        { from: null, to: null },
      ],
    ])('', (furthestDate, expectedNextSchedule) => {
      const meetingSchedule = createMock<MeetingScheduleDomain>()
      meetingSchedule.startDate = new Date(furthestDate.from)
      meetingSchedule.endDate = new Date(furthestDate.to)

      const duration = dayjs.duration(furthestDate.repeatRate)
      const meetingId = 1
      const furthestSchedule = {
        repeatRate: duration,
        meetingId,
        schedule: meetingSchedule,
      }

      // when
      const nextSchedules = service.calcuateNextSchedules([furthestSchedule])
      if (
        expectedNextSchedule.from === null ||
        expectedNextSchedule.to === null
      ) {
        expect(nextSchedules).toEqual([])
      } else {
        meetingSchedule.startDate = new Date(expectedNextSchedule.from)
        meetingSchedule.endDate = new Date(expectedNextSchedule.to)

        // then
        expect(nextSchedules).toEqual([
          {
            meetingId,
            schedule: meetingSchedule,
          },
        ])
      }
    })
  })
})
