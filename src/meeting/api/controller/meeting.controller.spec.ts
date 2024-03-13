import { MeetingController } from './meeting.controller'
import { MeetingService } from '../../domain/service/meeting.service'
import { Test } from '@nestjs/testing'
import { type MockFunctionMetadata, ModuleMocker } from 'jest-mock'
import * as dayjs from 'dayjs'
import { type MeetingDto } from '../dto/meeting.dto'

const moduleMocker = new ModuleMocker(global)

describe('MeetingController', () => {
  let controller: MeetingController
  let service: MeetingService

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [MeetingController],
  //     providers: [
  //       MeetingService,
  //       PrismaService,
  //       MeetingMapper,
  //       MeetingScheduleMapper,
  //       ClientMapper,
  //       LocationMapper,
  //     ],
  //   }).compile()
  //
  //   controller = module.get<MeetingController>(MeetingController)
  //   service = module.get<MeetingService>(MeetingService)
  // })

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MeetingController],
      // providers: [MeetingMapper],
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
    controller = moduleRef.get<MeetingController>(MeetingController)
    service = moduleRef.get<MeetingService>(MeetingService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAllByInterval', () => {
    it('should return an array of cats', async () => {
      const meetingDtos: MeetingDto[] = []

      jest
        .spyOn(service, 'findAllByInterval')
        .mockImplementation(async () => meetingDtos)

      expect(
        await controller.findAllByInterval(dayjs(), dayjs())
      ).toStrictEqual(meetingDtos)
    })
  })
})
