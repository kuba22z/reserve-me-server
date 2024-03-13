import * as dayjs from 'dayjs'
import { MeetingScheduleDomain } from './meetingSchedule.domain'
import { RepeatRateUnit } from '@prisma/client'

describe('MeetingScheduleDomain', () => {
  const testCases = [
    {
      interval: {
        from: dayjs('2018-02-05T20:00:00.000Z'),
        to: dayjs('2018-02-07T21:30:00.000Z'),
      },
      expectedResults: [
        {
          from: dayjs('2018-02-05T20:00:00.000Z'),
          to: dayjs('2018-02-05T21:30:00.000Z'),
        },
        {
          from: dayjs('2018-02-07T20:00:00.000Z'),
          to: dayjs('2018-02-07T21:30:00.000Z'),
        },
      ],
    },
    {
      interval: {
        from: dayjs('2000-02-05T20:00:00.000Z'),
        to: dayjs('2018-02-07T21:30:00.000Z'),
      },
      expectedResults: [
        {
          from: dayjs('2018-02-05T20:00:00.000Z'),
          to: dayjs('2018-02-05T21:30:00.000Z'),
        },
        {
          from: dayjs('2018-02-07T20:00:00.000Z'),
          to: dayjs('2018-02-07T21:30:00.000Z'),
        },
      ],
    },
    {
      interval: {
        from: dayjs('2018-02-07T21:29:00.000Z'),
        to: dayjs('2018-02-07T21:30:00.000Z'),
      },
      expectedResults: [
        {
          from: dayjs('2018-02-07T20:00:00.000Z'),
          to: dayjs('2018-02-07T21:30:00.000Z'),
        },
      ],
    },
    {
      interval: {
        from: dayjs('2018-02-07T21:30:00.000Z'),
        to: dayjs('2018-02-08T21:30:00.000Z'),
      },
      expectedResults: [],
    },
  ]

  test.each(testCases)(
    'should return all periodic intervals of the schedule',
    async ({ interval, expectedResults }) => {
      // given
      const scheduleData: MeetingScheduleDomain = new MeetingScheduleDomain({
        id: 1,
        locationId: 1,
        startDate: dayjs('2018-02-05T20:00:00.000Z'),
        endDate: dayjs('2018-02-05T21:30:00.000Z'),
        repeatRate: 2,
        repeatRateUnit: RepeatRateUnit.day,
      })

      // when
      const intervalsActual = scheduleData.computeScheduleByInterval(interval)

      // then
      expect(intervalsActual).toStrictEqual(expectedResults)
    }
  )
})
