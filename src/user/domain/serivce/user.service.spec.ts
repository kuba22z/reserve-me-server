import { Test, type TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { UserMapper } from '../../mapper/user.mapper'
import { HttpService } from '@nestjs/axios'
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider'
import { MeetingMapper } from '../../../meeting/mapper/meeting.mapper'
import { MeetingScheduleMapper } from '../../../meeting/mapper/meeting-schedule.mapper'
import { LocationMapper } from '../../../location/mapper/location.mapper'
import { ConfigService } from '@nestjs/config'

describe('UserService', () => {
  let service: UserService
  let userMapper: UserMapper

  const cognitoIdentityProviderMock = {
    send: jest.fn(),
  }
  const httpServiceMock = {
    send: jest.fn(),
    axiosRef: {
      get: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserMapper,
        MeetingMapper,
        MeetingScheduleMapper,
        LocationMapper,
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
        {
          provide: CognitoIdentityProvider,
          useValue: cognitoIdentityProviderMock,
        },
        {
          provide: 'COGNITO_IDENTITY_PROVIDER_INSTANCE_TOKEN',
          useValue: {},
        },
        ConfigService,
      ],
    }).compile()

    service = module.get<UserService, UserService>(UserService)
    userMapper = module.get<UserMapper, UserMapper>(UserMapper)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(userMapper).toBeDefined()
  })
})
