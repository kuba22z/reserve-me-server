import { type RepeatRateUnit } from '@prisma/client'
import { type LocationDto } from './location.dto'
import { type MeetingDto } from './meeting.dto'
import { type DateTimeIntervalDto } from './dateTimeInterval.dto'

export class MeetingScheduleDto {
  constructor(
    public id: number,
    public intervals: DateTimeIntervalDto[],
    public repeatRate: number,
    public repeatRateUnit: RepeatRateUnit,
    public locationId: number,
    public location?: LocationDto,
    public meeting?: MeetingDto | null
  ) {}
}
