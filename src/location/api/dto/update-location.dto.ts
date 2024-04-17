import { InputType, OmitType, PartialType } from '@nestjs/graphql'
import { LocationDto } from './location.dto'

@InputType({ description: 'UpdateLocationDto' })
export class UpdateLocationDto extends PartialType(
  OmitType(LocationDto, ['id'] as const)
) {
  id: number
}
