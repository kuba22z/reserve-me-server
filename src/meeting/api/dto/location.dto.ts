import { type EmployeeSchedule } from '@prisma/client'
import { type MeetingScheduleDto } from './meetingSchedule.dto'

export class LocationDto {
  constructor(
    public id: number,
    public name: string,
    public street: string,
    public houseNumber: number,
    public city: string,
    public postalCode: string,
    public employeeSchedules?: EmployeeSchedule[],
    public meetingSchedule?: MeetingScheduleDto[]
  ) {}
}
