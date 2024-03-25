export class DateTimeInterval {
  public from: Date
  public to: Date

  constructor(data: DateTimeInterval) {
    Object.assign(this, data)
  }
}
