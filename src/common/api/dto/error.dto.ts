import { ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'ErrorDto' })
export class ErrorDto {
  statusCode: number
  message: string
  data: object[]

  constructor(data: ErrorDto) {
    Object.assign(this, data)
  }
}
