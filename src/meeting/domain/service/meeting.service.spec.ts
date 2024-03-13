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
})
