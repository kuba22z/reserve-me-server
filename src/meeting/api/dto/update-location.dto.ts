import { InputType, PartialType } from '@nestjs/graphql'
import { CreateLocationDto } from './create-location.dto'

@InputType({ description: 'Location' })
export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
