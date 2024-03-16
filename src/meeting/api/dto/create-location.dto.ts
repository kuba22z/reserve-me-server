import { InputType } from '@nestjs/graphql'

@InputType({ description: 'Location' })
export class CreateLocationDto {
  name: string
  street: string
  houseNumber: number
  city: string
  postalCode: string
  // employeeSchedules?: EmployeeSchedule[]
  // meetingSchedule?: MeetingScheduleDto[]

  constructor(data: CreateLocationDto) {
    Object.assign(this, data)
  }
}
