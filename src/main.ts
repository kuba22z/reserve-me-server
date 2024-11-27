import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { type EnvironmentVariables } from './config-validation'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // ValidationPipe was created to be as generic as possible, we can realize
  // its full utility by setting it up as a global-scoped pipe so that it is
  // applied to every route handler across the entire application.
  app.useGlobalPipes(new ValidationPipe())
  // define useContainer in main.ts file
  // useContainer(app.select(AppModule), { fallbackOnErrors: true })

  // app.useGlobalFilters(new PrismaClientExceptionFilter())

  const configService = app.get<
    ConfigService,
    ConfigService<EnvironmentVariables, true>
  >(ConfigService)

  app.enableCors({
    origin: [configService.get('CLIENT_DOMAIN')],
    methods: ['GET', 'POST'],
    credentials: true,
  })
  await app.listen(configService.get('PORT') ?? 8080)
}

void bootstrap()
