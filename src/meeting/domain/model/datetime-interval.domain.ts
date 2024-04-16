import { type MeetingScheduleModel } from '../../mapper/meeting.mapper'
import { type MeetingScheduleDomain } from './meeting-schedule.domain'
import { type CreateMeetingScheduleDto } from '../../api/dto/create-meeting-schedule.dto'

interface DateStringInterval {
  startDate: string
  endDate: string
}
interface DateInterval {
  startDate: Date
  endDate: Date
}

export class DateTimeInterval {
  public from: Date
  public to: Date

  constructor(
    data:
      | DateTimeInterval
      | DateStringInterval
      | DateInterval
      | MeetingScheduleModel
      | MeetingScheduleDomain
      | CreateMeetingScheduleDto
  ) {
    if (data instanceof DateTimeInterval) {
      Object.assign(this, data)
    } else if (
      isCreateMeetingScheduleDto(data) ||
      isMeetingScheduleDomain(data)
    ) {
      this.from = data.startDate
      this.to = data.endDate
    }
  }
}

export const isCreateMeetingScheduleDto = (
  object: object
): object is CreateMeetingScheduleDto => {
  return (object as CreateMeetingScheduleDto).startDate !== undefined
}

export const isMeetingScheduleDomain = (
  object: object
): object is MeetingScheduleDomain => {
  return (object as MeetingScheduleDomain).canceled !== undefined
}
