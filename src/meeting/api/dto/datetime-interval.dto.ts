import { ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'DatetimeIntervalDto' })
export class DatetimeIntervalDto {
  public from: Date
  public to: Date
  constructor(data: DatetimeIntervalDto) {
    Object.assign(this, data)
  }
}
