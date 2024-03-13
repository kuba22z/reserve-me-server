import {
  type EntityEmployeeSchedule,
} from '../../../generated/nestjs-dto/employeeSchedule/entities/employeeSchedule.entity'
import {
  type EntityMeetingSchedule,
} from '../../../generated/nestjs-dto/meetingSchedule/entities/meetingSchedule.entity'

export class LocationDto {
  constructor(
    public id: number,
    public name: string,
    public street: string,
    public houseNumber: number,
    public city: string,
    public postalCode: string,
    public employeeSchedules?: EntityEmployeeSchedule[],
    public meetingSchedule?: EntityMeetingSchedule[]
  ) {}
}
