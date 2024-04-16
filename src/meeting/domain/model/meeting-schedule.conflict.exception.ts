import { ConflictException } from '@nestjs/common'
import { type MeetingDto } from '../../api/dto/meeting.dto'
import { type HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception'

export class MeetingScheduleConflictException extends ConflictException {
  statusCode: number
  conflictingMeetings: MeetingDto[]
  constructor(data: {
    conflictingMeetings: MeetingDto[]
    message: string
    cause?: HttpExceptionOptions
  }) {
    super(data.message, data.cause)
    this.statusCode = 409
    this.conflictingMeetings = data.conflictingMeetings
  }
}
