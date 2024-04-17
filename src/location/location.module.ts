import { Module } from '@nestjs/common'
import { LocationMapper } from './mapper/location.mapper'
import { PrismaModule } from 'nestjs-prisma'
import { LocationService } from './domain/service/location.service'
import { LocationResolver } from './api/resolver/location.resolver'

@Module({
  providers: [LocationService, LocationMapper, LocationResolver],
  imports: [PrismaModule],
})
export class LocationModule {}
