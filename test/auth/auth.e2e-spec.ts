import { type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from '../../src/app.module'
import { AuthService } from '../../src/auth/domain/service/auth.service'
import {
  CognitoTokenUse,
  type EnvironmentVariables,
} from '../../src/config-validation'
import * as request from 'supertest'
import gql from 'graphql-tag'
import { type UserDto } from '../../src/user/api/dto/user.dto'
import { CognitoGroupDto } from '../../src/auth/api/dto/cognito-groups.dto'
import { type DocumentNode, print } from 'graphql/language'
import { Test as NestJsTest } from '@nestjs/testing'
import type Test from 'supertest/lib/test'
import { type ErrorDto } from '../../src/common/api/dto/error.dto'
import { type TokenDto } from '../../src/auth/api/dto/token.dto'
import { type UserWithGroupDto } from '../../src/user/api/dto/user-with-group.dto'

const gqlPath = '/graphql'

describe('Auth Module : e2e', () => {
  let app: INestApplication
  let config: ConfigService<EnvironmentVariables, true>
  let authService: AuthService
  let authToken: string
  let tokenDto: TokenDto

  beforeAll(async () => {
    const moduleFixture = await NestJsTest.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    config =
      moduleFixture.get<ConfigService<EnvironmentVariables, true>>(
        ConfigService
      )
    authService = moduleFixture.get<AuthService>(AuthService)

    await signIn()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('authentication', () => {
    it('employee-should-be-able-to-access-secured-route', async () => {
      await isEmployee(requestUser(authToken))
    })

    it('employee-should-not-be-able-to-access-secured-route', async () => {
      // TODO format this exception to default formation
      await shouldThrow(
        requestUser('123'),
        401,
        undefined,
        'Authentication failed.'
      )
      await authService.requestCognitoSignOut(tokenDto.accessToken)
      await shouldThrow(
        requestUser(authToken),
        401,
        undefined,
        'Authentication failed.'
      )
      await shouldThrow(
        requestUsers(authToken),
        401,
        undefined,
        'Authentication failed.'
      )
      await signIn()
    })
  })

  const requestUser = (token: string) => {
    const userQuery = gql`
      query {
        user {
          phoneNumber
          userName
          name
          groups
        }
      }
    `
    return requestQuery(userQuery, token)
  }

  const requestUsers = (token: string) => {
    const usersQuery = gql`
      query {
        users {
          phoneNumber
          userName
          name
        }
      }
    `
    return requestQuery(usersQuery, token)
  }

  const requestQuery = (query: DocumentNode, token: string) => {
    return request(app.getHttpServer())
      .post(gqlPath)
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: print(query),
      })
  }

  const isEmployee = async (res: Test) => {
    return await res
      .expect((res) => {
        expect(res.body.data.user.password).toEqual(undefined)
        const user = res.body.data.user as UserWithGroupDto
        expect(user.userName).toEqual(config.get('TEST_EMPLOYEE_USER_NAME'))
        expect(user.phoneNumber).toEqual(
          config.get('TEST_EMPLOYEE_PHONE_NUMBER')
        )
        expect(user.name).toEqual(config.get('TEST_EMPLOYEE_NAME'))
        expect(user.groups?.sort()).toEqual([
          CognitoGroupDto.client,
          CognitoGroupDto.employee,
        ])
      })
      .then((res) => res.body.data.user as UserDto)
  }
  const shouldThrow = async (
    test: Test,
    statusCode: number,
    message?: string,
    data?: object | string[] | string
  ) => {
    return await test
      .expect((res) => {
        expect(res.body.errors.length).toEqual(1)
        const errorDto = res.body.errors[0] as ErrorDto
        expect(errorDto.statusCode).toEqual(statusCode)
        if (message) {
          expect(errorDto.message).toEqual(message)
        }
        if (data) {
          expect(errorDto.data).toEqual(data)
        }
      })
      .then((res) => res.body.errors[0] as ErrorDto)
  }

  const signIn = async () => {
    const testUserName = config.get('TEST_EMPLOYEE_USER_NAME')
    const testUserPassword = config.get('TEST_EMPLOYEE_PASSWORD')
    tokenDto = await authService.requestCognitoSignIn({
      username: testUserName,
      password: testUserPassword,
    })
    authToken =
      config.get('COGNITO_TOKEN_USE', { infer: true }) ===
      CognitoTokenUse.Id.toString()
        ? tokenDto.idToken
        : tokenDto.accessToken
  }
})
