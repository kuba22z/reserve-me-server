import type { Prisma } from '@prisma/client'
import type { EntityClientsOnMeetings } from '../../../generated/nestjs-dto/clientsOnMeetings/entities/clientsOnMeetings.entity'
import type { EntityEmployee } from '../../../generated/nestjs-dto/employee/entities/employee.entity'
import type { EntityServicesBookedOnMeetings } from '../../../generated/nestjs-dto/servicesBookedOnMeetings/entities/servicesBookedOnMeetings.entity'
import type { EntityServicesProvidedOnMeetings } from '../../../generated/nestjs-dto/servicesProvidedOnMeetings/entities/servicesProvidedOnMeetings.entity'
import { type MeetingScheduleDto } from './meetingSchedule.dto'

export class MeetingDto {
  constructor(
    public id: number,
    public employeeId: number,
    public priceFull: Prisma.Decimal | null,
    public scheduleId: number,
    public discount: Prisma.Decimal,
    public priceFinal: Prisma.Decimal | null,
    public canceled: boolean,
    public cancellationReason: string,
    public employeeIdCreated: number | null,
    public priceExcepted: Prisma.Decimal,
    public createdAt: Date,
    public updatedAt: Date,
    public schedule?: MeetingScheduleDto,
    public clientsOnMeetings?: EntityClientsOnMeetings[],
    public employee?: EntityEmployee,
    public serivcesBookedOnMeetings?: EntityServicesBookedOnMeetings[],
    public serivcesProvidedOnMeetings?: EntityServicesProvidedOnMeetings[]
  ) {}
}
