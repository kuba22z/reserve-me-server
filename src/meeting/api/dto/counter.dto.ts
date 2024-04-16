import { ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'Counter' })
export class CounterDto {
  public count: number

  constructor(data: CounterDto) {
    Object.assign(this, data)
  }
}
