import { type Dayjs } from 'dayjs'

export class DateTimeInterval {
  constructor(
    public from: Dayjs,
    public to: Dayjs
  ) {}
}
