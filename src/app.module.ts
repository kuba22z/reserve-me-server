import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule, PrismaService } from 'nestjs-prisma'
import { MeetingModule } from './meeting/meeting.module'
import { ClientModule } from './client/client.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { type GraphQLFormattedError } from 'graphql/error'
import { type ErrorDto } from './common/api/dto/error.dto'

@Module({
  imports: [
    PrismaModule,
    MeetingModule,
    ClientModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
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
          message: originalError.error,
          statusCode: originalError.statusCode,
          data: originalError.message,
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

export const isPrismaError = (error: Error): boolean => {
  return 'clientVersion' in error
}
