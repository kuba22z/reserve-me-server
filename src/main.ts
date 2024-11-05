import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as duration from 'dayjs/plugin/duration'
import * as utcPlugin from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'
import * as process from 'process'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // ValidationPipe was created to be as generic as possible, we can realize
  // its full utility by setting it up as a global-scoped pipe so that it is
  // applied to every route handler across the entire application.
  app.useGlobalPipes(new ValidationPipe())
  // define useContainer in main.ts file
  // useContainer(app.select(AppModule), { fallbackOnErrors: true })

  // app.useGlobalFilters(new PrismaClientExceptionFilter())

  // extend dayjs with plugin globally
  dayjs.extend(duration)
  dayjs.extend(utcPlugin)

  // const configService = app.get<
  //   ConfigService,
  //   ConfigService<EnvironmentVariables, true>
  // >(ConfigService)

  // app.enableCors({
  //   origin: [configService.get('CLIENT_DOMAIN')],
  //   methods: ['GET', 'POST'],
  //   credentials: true,
  // })
  await app.listen(process.env.PORT ?? 3000)
}

void bootstrap()
