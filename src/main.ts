import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import * as duration from 'dayjs/plugin/duration'
import * as utcPlugin from 'dayjs/plugin/utc'

import * as dayjs from 'dayjs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // ValidationPipe was created to be as generic as possible, we can realize
  // its full utility by setting it up as a global-scoped pipe so that it is
  // applied to every route handler across the entire application.
  app.useGlobalPipes(new ValidationPipe())
  // app.useGlobalFilters(new PrismaClientExceptionFilter())

  // extend dayjs with plugin globally
  dayjs.extend(duration)
  dayjs.extend(utcPlugin)

  const config = new DocumentBuilder()
    .setTitle('Reserve Me')
    .setDescription('The Reserve Me API description')
    .setVersion('0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(3000)
}

void bootstrap()
