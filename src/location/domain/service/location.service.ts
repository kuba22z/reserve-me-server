import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { LocationMapper } from '../../mapper/location.mapper'
import { type CreateLocationDto } from '../../api/dto/create-location.dto'
import { type LocationDomain } from '../model/location.domain'
import { type UpdateLocationDto } from '../../api/dto/update-location.dto'

@Injectable()
export class LocationService {
  public static LOCATION_NOT_FOUND_MESSAGE = `The location doesnt exist`
  public static LOCATION_NAME_ALREADY_EXISTS_MESSAGE = `The location name exists already`

  constructor(
    private readonly prisma: PrismaService,
    private readonly locationMapper: LocationMapper
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<LocationDomain> {
    await this.isLocationNameUnique(createLocationDto.name)
    return await this.prisma.location
      .create({ data: createLocationDto })
      .then((location) => this.locationMapper.toDomain(location))
  }

  async update(updateLocationDto: UpdateLocationDto) {
    const location = await this.isLocationPresent(updateLocationDto.id)
    if (updateLocationDto.name && updateLocationDto.name !== location.name) {
      await this.isLocationNameUnique(updateLocationDto.name)
    }
    const { id, ...updateLocationDtoWithoutId } = updateLocationDto
    return await this.prisma.location
      .update({
        where: { id },
        data: updateLocationDtoWithoutId,
      })
      .then((location) => this.locationMapper.toDomain(location))
  }

  async findAll() {
    return await this.prisma.location
      .findMany()
      .then((locations) =>
        locations.map((l) => this.locationMapper.toDomain(l))
      )
  }

  isLocationPresent = async (locationId: number): Promise<LocationDomain> => {
    return await this.prisma.location
      .findUnique({
        where: { id: locationId },
      })
      .then((location) => {
        if (!location) {
          throw new NotFoundException(
            [{ locationId }],
            LocationService.LOCATION_NOT_FOUND_MESSAGE
          )
        }
        return this.locationMapper.toDomain(location)
      })
  }

  isLocationNameUnique = async (locationName: string) => {
    await this.prisma.location
      .findUnique({
        where: { name: locationName },
        select: { name: true },
      })
      .then((locationName) => {
        if (locationName) {
          throw new ConflictException(
            [locationName],
            LocationService.LOCATION_NAME_ALREADY_EXISTS_MESSAGE
          )
        }
      })
  }
}
