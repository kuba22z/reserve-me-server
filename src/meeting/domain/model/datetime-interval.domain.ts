import { type MeetingScheduleDomain } from './meeting-schedule.domain'
import { type CreateMeetingScheduleDto } from '../../api/dto/create-meeting-schedule.dto'
import { InternalServerErrorException } from '@nestjs/common'

// interface DateStringInterval {
//   startDate: string
//   endDate: string
// }
// interface DateInterval {
//   startDate: Date
//   endDate: Date
// }

export class DateTimeInterval {
  public from: Date
  public to: Date

  constructor(
    data:
      | DateTimeInterval
      // | DateStringInterval
      // | DateInterval
      // | MeetingScheduleModel
      | MeetingScheduleDomain
      | CreateMeetingScheduleDto
  ) {
    if (isDateTimeInterval(data)) {
      Object.assign(this, data)
    } else if (
      isCreateMeetingScheduleDto(data) ||
      isMeetingScheduleDomain(data)
    ) {
      this.from = data.startDate
      this.to = data.endDate
    }
    throw new InternalServerErrorException(
      data,
      "This data couldn't be caste to DateTimeInterval"
    )
  }
}

export const isCreateMeetingScheduleDto = (
  object: object
): object is CreateMeetingScheduleDto => {
  return (object as CreateMeetingScheduleDto).startDate !== undefined
}

export const isDateTimeInterval = (
  object: object
): object is DateTimeInterval => {
  return (object as DateTimeInterval).from !== undefined
}

export const isMeetingScheduleDomain = (
  object: object
): object is MeetingScheduleDomain => {
  return (object as MeetingScheduleDomain).canceled !== undefined
}
