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
  APP_PORT: string

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

  // Database
  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string

  @IsNotEmpty()
  @IsNumberString()
  DATABASE_PORT: string

  @IsNotEmpty()
  @IsString()
  POSTGRES_USER: string

  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string

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
  COGNITO_PROFILE: string
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
