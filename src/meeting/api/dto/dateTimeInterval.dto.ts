import { ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'DateTimeIntervalDto' })
export class DateTimeIntervalDto {
  public from: Date
  public to: Date
  constructor(data: DateTimeIntervalDto) {
    Object.assign(this, data)
  }
}
