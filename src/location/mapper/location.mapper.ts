import { Injectable } from '@nestjs/common'
import type { Location } from '@prisma/client'
import { LocationDomain } from '../domain/model/location.domain'
import { LocationDto } from '../api/dto/location.dto'

@Injectable()
export class LocationMapper {
  // Map Meeting to MeetingEntity
  public toDomain(location: Location): LocationDomain {
    return new LocationDomain({ ...location })
  }

  // Map MeetingEntity to Meeting
  public toModel(entity: LocationDomain): Location {
    return {
      ...entity,
    }
  }

  public toDto(entity: LocationDomain): LocationDto {
    return new LocationDto({
      ...entity,
    })
  }
}
