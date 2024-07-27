import { InputType, PartialType } from '@nestjs/graphql'
import { CreateLocationDto } from './create-location.dto'

@InputType({ description: 'UpdateLocationDto' })
export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  id: number
}
