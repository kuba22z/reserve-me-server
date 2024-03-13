import { Test, TestingModule } from '@nestjs/testing'
import { MeetingController } from './meeting.controller'
import { MeetingService } from '../../domain/service/meeting.service'

describe('MeetingController', () => {
  let controller: MeetingController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingController],
      providers: [MeetingService],
    }).compile()

    controller = module.get<MeetingController>(MeetingController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
