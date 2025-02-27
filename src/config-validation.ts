import { plainToClass } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator'
import { Environment } from './config'

export enum CognitoTokenUse {
  Access = 'access',
  Id = 'id',
}

export class EnvironmentVariables {
  // APP
  @IsNotEmpty()
  @IsEnum(Environment)
  NODE_ENV: string

  @IsNotEmpty()
  @IsNumberString()
  PORT: string

  @IsNotEmpty()
  @IsString()
  APP_NAME: string

  @IsNotEmpty()
  @IsBoolean()
  AUTH_ENABLED: boolean

  // Client
  @IsNotEmpty()
  @IsString()
  CLIENT_DOMAIN: string

  @IsNotEmpty()
  @IsString()
  CLIENT_LOGIN_REDIRECT_PATH: string

  // Database
  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string

  // COGNITO
  @IsNotEmpty()
  @IsString()
  COGNITO_USER_POOL_ID: string

  @IsNotEmpty()
  @IsString()
  COGNITO_CLIENT_ID: string

  @IsNotEmpty()
  @IsString()
  COGNITO_CLIENT_SECRET: string

  @IsNotEmpty()
  @IsString()
  @IsEnum(CognitoTokenUse)
  COGNITO_TOKEN_USE: string

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  COGNITO_DOMAIN: string

  @IsString()
  @IsNotEmpty()
  TEST_EMPLOYEE_USER_NAME: string

  @IsString()
  @IsNotEmpty()
  TEST_EMPLOYEE_NAME: string

  @IsString()
  @IsNotEmpty()
  TEST_EMPLOYEE_PHONE_NUMBER: string

  @IsString()
  @IsNotEmpty()
  TEST_EMPLOYEE_PASSWORD: string
}

export function validateConfig(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(finalConfig, { skipMissingProperties: false })

  errors.forEach((error) => {
    if (error.constraints) {
      Object.values(error.constraints).forEach((str) => {
        console.log(str)
      })
      console.log('\n ***** \n')
    }
  })
  if (errors.length > 0)
    throw new Error('Please provide the valid ENVs mentioned above')

  return finalConfig
}
