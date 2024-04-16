import { Test } from '@nestjs/testing'
import { MeetingService } from './meeting.service'
import { type MockFunctionMetadata, ModuleMocker } from 'jest-mock'
import * as dayjs from 'dayjs'
import { PrismaService } from 'nestjs-prisma'
import { MeetingMapper } from '../../mapper/meeting.mapper'
import { DtoFactory } from '../../../common/api/dto.factory'
import { DomainFactory } from '../../../common/domain/domain.factory'
import * as duration from 'dayjs/plugin/duration'
import * as utcPlugin from 'dayjs/plugin/utc'

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
    dayjs.extend(duration)
    dayjs.extend(utcPlugin)
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
      service.findAllByInterval({ from: new Date(), to: new Date() })
    ).toStrictEqual(Promise.resolve([]))
  })

  describe('isAllowed', () => {
    test.each([
      // Test case 1: No repetition, non-overlapping ranges
      [
        { repeatRate: 0, startDate: '2024-01-01', endDate: '2024-01-05' },
        { repeatRate: 0, startDate: '2025-01-01', endDate: '2025-01-05' },
        true,
      ],
      // Test case 2: No repetition, overlapping ranges
      [
        { repeatRate: 0, startDate: '2024-01-01', endDate: '2024-01-05' },
        { repeatRate: 0, startDate: '2024-01-03', endDate: '2024-01-07' },
        true,
      ],
      // Test case 3: Daily repetition, non-overlapping ranges
      [
        { repeatRate: 1, startDate: '2024-01-01', endDate: '2024-01-05' },
        { repeatRate: 1, startDate: '2025-01-01', endDate: '2025-01-05' },
        false,
      ],
      // Test case 4: Daily repetition, overlapping ranges
      [
        { repeatRate: 1, startDate: '2024-01-01', endDate: '2024-01-05' },
        { repeatRate: 1, startDate: '2024-01-03', endDate: '2024-01-07' },
        false,
      ],
      [
        { repeatRate: 3, startDate: '2024-01-01', endDate: '2024-01-01' },
        { repeatRate: 7, startDate: '2024-01-03', endDate: '2024-01-03' },
        true,
      ],
      [
        { repeatRate: 3, startDate: '2024-01-01', endDate: '2024-01-01' },
        { repeatRate: 7, startDate: '2024-01-01', endDate: '2024-01-03' },
        false,
      ],
      [
        { repeatRate: 3, startDate: '2024-01-01', endDate: '2024-01-01' },
        { repeatRate: 2, startDate: '2024-01-02', endDate: '2024-01-02' },
        false,
      ],
      // Add more test cases as needed...
    ])('isAllowed', (toCreateData, toCheckData, expected) => {
      const toCreate = DomainFactory.meetingScheduleDomain()
      toCreate.startDate = dayjs(toCreateData.startDate).toDate()
      toCreate.endDate = dayjs(toCreateData.endDate).toDate()

      const toCheck = DomainFactory.meetingScheduleDomain()
      toCheck.startDate = dayjs(toCheckData.startDate).toDate()
      toCheck.endDate = dayjs(toCheckData.endDate).toDate()

      //     expect(service.isAllowed(toCreate, toCheck)).toEqual(expected)
    })
  })

  describe('computeAllSchedules', () => {
    test.each([
      [
        { repeatRate: 100, from: '2024-01-01', to: '2024-01-01' },
        [
          { from: '2024-01-01', to: '2024-01-01' },
          { from: '2024-04-10', to: '2024-04-10' },
          { from: '2024-07-19', to: '2024-07-19' },
          { from: '2024-10-27', to: '2024-10-27' },
          { from: '2025-02-04', to: '2025-02-04' },
        ],
      ],
      // 2024 is a leap year -> year has 366 days
      [
        {
          repeatRate: 366,
          from: '2024-01-01T00:30:00',
          to: '2024-01-01T00:30:00',
        },
        [
          { from: '2024-01-01T00:30:00', to: '2024-01-01T00:30:00' },
          { from: '2025-01-01T00:30:00', to: '2025-01-01T00:30:00' },
        ],
      ],
      // repeatRate = 0 -> only one schedule
      [
        {
          repeatRate: 0,
          from: '2024-01-01',
          to: '2024-01-01',
        },
        [{ from: '2024-01-01', to: '2024-01-01' }],
      ],
    ])('', (firstSchedule, expected) => {
      const expectedDates = expected.map((interval) => {
        return {
          from: new Date(interval.from).toISOString(),
          to: new Date(interval.to).toISOString(),
        }
      })
      // when
      const actualDates = service
        .computeAllSchedules(
          {
            from: new Date(firstSchedule.from),
            to: new Date(firstSchedule.to),
          },
          dayjs.duration({ days: firstSchedule.repeatRate })
        )
        .map((a) => {
          return { from: a.from.toISOString(), to: a.to.toISOString() }
        })

      // then
      expect(actualDates).toEqual(expectedDates)
    })
  })
})
