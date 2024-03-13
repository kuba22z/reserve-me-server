import { Test } from '@nestjs/testing'
import { MeetingService } from './meeting.service'
import { type MockFunctionMetadata, ModuleMocker } from 'jest-mock'
import * as dayjs from 'dayjs'
import { type MeetingScheduleDomain } from '../model/meetingSchedule.domain'
import { RepeatRateUnit } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { MeetingMapper } from '../../mapper/meeting.mapper'
import { DtoFactory } from '../../../common/api/dto.factory'
import { DomainFactory } from '../../../common/domain/domain.factory'

const moduleMocker = new ModuleMocker(global)

describe('MeetingService', () => {
  let service: MeetingService
  let meetingMapper: MeetingMapper

  const prismaMock = {
    meeting: {
      findMany: jest.fn(),
    },
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MeetingService,
        MeetingMapper,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
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
    service = moduleRef.get<MeetingService>(MeetingService)
    meetingMapper = moduleRef.get<MeetingMapper>(MeetingMapper)
    prismaMock.meeting.findMany.mockClear()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('findAllByInterval should return empty array', () => {
    prismaMock.meeting.findMany.mockResolvedValue([])

    meetingMapper.toDomain = jest
      .fn()
      .mockReturnValueOnce([DomainFactory.meetingDomain()])
    meetingMapper.toDto = jest
      .fn()
      .mockReturnValueOnce([DtoFactory.meetingDto()])

    expect(
      service.findAllByInterval({ from: dayjs(), to: dayjs() })
    ).toStrictEqual(Promise.resolve([]))
  })

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
    'should return an array of cats',
    async ({ interval, expectedResults }) => {
      // given
      const scheduleData: MeetingScheduleDomain = {
        id: 1,
        locationId: 1,
        startDate: dayjs('2018-02-05T20:00:00.000Z'),
        endDate: dayjs('2018-02-05T21:30:00.000Z'),
        repeatRate: 2,
        repeatRateUnit: RepeatRateUnit.day,
      }

      // when
      const intervalsActual = service.computeScheduleByInterval(
        scheduleData,
        interval
      )

      // then
      expect(intervalsActual).toStrictEqual(expectedResults)
    }
  )
})
