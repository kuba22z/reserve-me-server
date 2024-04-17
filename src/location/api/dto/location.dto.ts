import { ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'LocationDto' })
export class LocationDto {
  id: number
  name: string
  street: string
  houseNumber: number
  city: string
  postalCode: string

  // employeeSchedules?: EmployeeSchedule[]
  // meetingSchedule?: MeetingScheduleDto[]

  constructor(data: LocationDto) {
    Object.assign(this, data)
  }
}
