import { type EmployeeSchedule } from '@prisma/client'
import { type MeetingScheduleDomain } from './meetingSchedule.domain'

export class LocationDomain {
  constructor(
    public id: number,
    public name: string,
    public street: string,
    public houseNumber: number,
    public city: string,
    public postalCode: string,
    public employeeSchedules?: EmployeeSchedule[],
    public meetingSchedule?: MeetingScheduleDomain[]
  ) {}
}
