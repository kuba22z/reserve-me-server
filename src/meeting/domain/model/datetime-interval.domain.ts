import { type Dayjs } from 'dayjs'

export class DateTimeInterval {
  public from: Dayjs
  public to: Dayjs

  constructor(data: DateTimeInterval) {
    Object.assign(this, data)
  }
}
