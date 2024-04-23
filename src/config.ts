/* eslint-disable @typescript-eslint/no-non-null-assertion */
// validation appears already in config-validation.ts -> disable eslint rule
import { registerAs } from '@nestjs/config'
import * as process from 'process'
import { type CognitoTokenUse } from './config-validation'

export enum ConfigKey {
  App = 'app',
  Db = 'db',
  Cognito = 'cognito',
  Client = 'client',
}

export enum Environment {
  Dev = 'dev',
  Prod = 'prod',
  Test = 'test',
}

export const AppConfig = registerAs(ConfigKey.App, () => ({
  env: Environment[process.env.NODE_ENV! as keyof typeof Environment] || 'dev',
  port: Number(process.env.APP_PORT!),
  appName: process.env.APP_NAME!,
  authEnabled: Boolean(process.env.AUTH_ENABLED!),
}))

export const DbConfig = registerAs(ConfigKey.Db, () => ({
  url: process.env.DATABASE_URL!,
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  port: Number(process.env.DATABASE_PORT!),
}))

export const CognitoConfig = registerAs(ConfigKey.Cognito, () => ({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  clientId: process.env.COGNITO_CLIENT_ID!,
  clientSecret: process.env.COGNITO_CLIENT_SECRET!,
  tokenUse: process.env.COGNITO_TOKEN_USE! as CognitoTokenUse,
  domain: process.env.COGNITO_DOMAIN!,
  profile: process.env.COGNITO_PROFILE!,
}))

export const ClientConfig = registerAs(ConfigKey.Client, () => ({
  domain: process.env.CLIENT_DOMAIN!,
}))

export const configurations = [AppConfig, DbConfig, CognitoConfig, ClientConfig]
