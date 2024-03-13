import { type Dayjs } from 'dayjs'

export class DateTimeIntervalDto {
  constructor(
    public from: Dayjs,
    public to: Dayjs
  ) {}
}
