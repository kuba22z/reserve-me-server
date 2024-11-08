/* eslint-disable @typescript-eslint/no-non-null-assertion */
// validation appears already in config-validation.ts -> disable eslint rule
import { registerAs } from '@nestjs/config'
import * as process from 'process'
import { type CognitoTokenUse } from './config-validation'

// https://medium.com/@neerajsonii/managing-configs-in-nestjs-d0705436ee95
export enum ConfigKey {
  App = 'app',
  Db = 'db',
  Cognito = 'cognito',
  CognitoTestUser = 'cognitoTestUser',
  Client = 'client',
}

export enum Environment {
  Dev = 'dev',
  Prod = 'production',
  Local = 'local',
}

const AppConfig = registerAs(ConfigKey.App, () => ({
  env:
    Environment[process.env.NODE_ENV! as keyof typeof Environment] ||
    Environment.Local,
  port: Number(process.env.PORT!),
  appName: process.env.APP_NAME!,
  authEnabled: Boolean(process.env.AUTH_ENABLED!),
}))

const DbConfig = registerAs(ConfigKey.Db, () => ({
  url: process.env.DATABASE_URL!,
}))

const CognitoConfig = registerAs(ConfigKey.Cognito, () => ({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  clientId: process.env.COGNITO_CLIENT_ID!,
  clientSecret: process.env.COGNITO_CLIENT_SECRET!,
  tokenUse: process.env.COGNITO_TOKEN_USE! as CognitoTokenUse,
  domain: process.env.COGNITO_DOMAIN!,
}))

const CognitoTestUserConfig = registerAs(ConfigKey.CognitoTestUser, () => ({
  userName: process.env.TEST_EMPLOYEE_USER_NAME!,
  name: process.env.TEST_EMPLOYEE_NAME!,
  password: process.env.TEST_EMPLOYEE_PASSWORD!,
  phoneNumber: process.env.TEST_EMPLOYEE_PHONE_NUMBER!,
}))

const ClientConfig = registerAs(ConfigKey.Client, () => ({
  domain: process.env.CLIENT_DOMAIN!,
}))

export const configurations = [
  AppConfig,
  DbConfig,
  CognitoConfig,
  ClientConfig,
  CognitoTestUserConfig,
]
