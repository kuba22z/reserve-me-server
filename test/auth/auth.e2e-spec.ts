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
import { print } from 'graphql/language'
import { Test as NestJsTest } from '@nestjs/testing'
import type Test from 'supertest/lib/test'
import { type ErrorDto } from '../../src/common/api/dto/error.dto'

const gqlPath = '/graphql'

describe('Auth Module : e2e', () => {
  let app: INestApplication
  let config: ConfigService<EnvironmentVariables, true>
  let authService: AuthService

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

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('authentication', () => {
    it('employee should be able to access the private route', async () => {
      const testUserName = config.get('TEST_EMPLOYEE_USER_NAME')
      const testUserPassword = config.get('TEST_EMPLOYEE_PASSWORD')
      const tokenDto = await authService.requestCognitoSignIn({
        username: testUserName,
        password: testUserPassword,
      })
      const authToken =
        config.get('COGNITO_TOKEN_USE', { infer: true }) ===
        CognitoTokenUse.Id.toString()
          ? tokenDto.idToken
          : tokenDto.accessToken
      await isEmployee(requestUser(authToken))
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
    })
    const requestUser = (authToken: string) => {
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
      return request(app.getHttpServer())
        .post(gqlPath)
        .set('Authorization', 'Bearer ' + authToken)
        .send({
          query: print(userQuery),
        })
    }
    const isEmployee = async (res: Test) => {
      return await res
        .expect((res) => {
          expect(res.body.data.user.password).toEqual(undefined)
          const user = res.body.data.user as UserDto
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
  })
})
