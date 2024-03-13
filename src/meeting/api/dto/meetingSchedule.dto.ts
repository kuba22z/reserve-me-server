import { type RepeatRateUnit } from '@prisma/client'
import { type LocationDto } from './location.dto'
import { type MeetingDto } from './meeting.dto'
import { type DateTimeInterval } from './dateTimeInterval'

export class MeetingScheduleDto {
  constructor(
    public id: number,
    public intervals: DateTimeInterval[],
    public repeatRate: number,
    public repeatRateUnit: RepeatRateUnit,
    public locationId: number,
    public location?: LocationDto,
    public meeting?: MeetingDto | null
  ) {}
}
