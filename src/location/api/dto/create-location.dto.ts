import { InputType } from '@nestjs/graphql'

@InputType({ description: 'CreateLocationDto' })
export class CreateLocationDto {
  name: string
  street: string
  houseNumber: number
  city: string
  postalCode: string
}
