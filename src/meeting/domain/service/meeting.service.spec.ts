import { Test } from '@nestjs/testing'
import { MeetingService } from './meeting.service'
import { type MockFunctionMetadata, ModuleMocker } from 'jest-mock'
import * as dayjs from 'dayjs'
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
      toCreate.startDate = dayjs(toCreateData.startDate)
      toCreate.endDate = dayjs(toCreateData.endDate)
      toCreate.repeatRate = toCreateData.repeatRate
      toCreate.repeatRateUnit = 'day'

      const toCheck = DomainFactory.meetingScheduleDomain()
      toCheck.startDate = dayjs(toCheckData.startDate)
      toCheck.endDate = dayjs(toCheckData.endDate)
      toCheck.repeatRate = toCheckData.repeatRate
      toCheck.repeatRateUnit = 'day'

      expect(service.isAllowed(toCreate, toCheck)).toEqual(expected)
    })
  })
})
