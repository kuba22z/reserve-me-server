import { Injectable } from '@nestjs/common'
import type { Location } from '@prisma/client'
import { type LocationDomain } from '../domain/model/location.domain'
import { type LocationDto } from '../api/dto/location.dto'

@Injectable()
export class LocationMapper {
  // Map Meeting to MeetingEntity
  public toDomain(location: Location): LocationDomain {
    return { ...location }
  }

  // Map MeetingEntity to Meeting
  public toModel(entity: LocationDomain): LocationDto {
    return {
      ...entity,
    }
  }

  public toDto(entity: LocationDomain): LocationDto {
    return {
      ...entity,
    }
  }
}
