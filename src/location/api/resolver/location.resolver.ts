import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { LocationMapper } from '../../mapper/location.mapper'
import { LocationService } from '../../domain/service/location.service'
import { LocationDto } from '../dto/location.dto'
import { CreateLocationDto } from '../dto/create-location.dto'
import { UpdateLocationDto } from '../dto/update-location.dto'
import { Auth } from '../../../auth/api/auth.decorator'
import { CognitoGroupDto } from '../../../auth/api/dto/cognito-groups.dto'

@Resolver()
export class LocationResolver {
  constructor(
    private readonly locationService: LocationService,
    private readonly mapper: LocationMapper
  ) {}

  @Auth([
    CognitoGroupDto.admin,
    CognitoGroupDto.client,
    CognitoGroupDto.employee,
  ])
  @Query(() => [LocationDto])
  async locations(): Promise<LocationDto[]> {
    return await this.locationService
      .findAll()
      .then((locations) =>
        locations.map((location) => this.mapper.toDto(location))
      )
  }

  @Auth([CognitoGroupDto.admin, CognitoGroupDto.employee])
  @Mutation(() => LocationDto)
  async createLocation(
    @Args('location') createLocationDto: CreateLocationDto
  ): Promise<LocationDto> {
    return await this.locationService
      .create(createLocationDto)
      .then((location) => this.mapper.toDto(location))
  }

  @Auth([CognitoGroupDto.admin, CognitoGroupDto.employee])
  @Mutation(() => LocationDto)
  async updateLocation(
    @Args('location') updateLocationDto: UpdateLocationDto
  ): Promise<LocationDto> {
    return await this.locationService
      .update(updateLocationDto)
      .then((location) => this.mapper.toDto(location))
  }

  // @Mutation(() => CounterDto)
  // async deleteLocation(
  //   @Args('ids', { type: () => [Int] }) ids: number[]
  // ): Promise<CounterDto> {
  //   return await this.locationService.remove(ids)
  // }
}
