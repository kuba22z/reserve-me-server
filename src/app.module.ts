import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MeetingModule } from './meeting/meeting.module'
import { UserModule } from './user/user.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { type GraphQLFormattedError } from 'graphql/error'
import { type ErrorDto } from './common/api/dto/error.dto'
import { LocationModule } from './location/location.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { configurations } from './config'
import { validateConfig } from './config-validation'
import * as dotenv from 'dotenv'
import * as process from 'process'
import { PrismaService } from './prisma.service'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

@Module({
  imports: [
    MeetingModule,
    UserModule,
    LocationModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configurations],
      validate: validateConfig,
      expandVariables: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      formatError: (
        formattedError: GraphQLFormattedError
      ): GraphQLFormattedError | ErrorDto => {
        const originalError = formattedError.extensions?.originalError as {
          statusCode: number
          error: string
          message: object[]
        }
        if (!originalError) {
          return formattedError
        }
        return {
          statusCode: originalError.statusCode,
          message: originalError.error,
          data: originalError.message,
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
