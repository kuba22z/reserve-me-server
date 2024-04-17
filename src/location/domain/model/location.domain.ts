export class LocationDomain {
  public id: number
  public name: string
  public street: string
  public houseNumber: number
  public city: string
  public postalCode: string
  //  public employeeSchedules?: EmployeeSchedule[]
  // public meetingSchedule?: MeetingScheduleDomain[]

  constructor(data: LocationDomain) {
    Object.assign(this, data)
  }
}
