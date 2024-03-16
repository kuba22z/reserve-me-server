import { InputType, PartialType } from '@nestjs/graphql'
import { CreateMeetingDto } from './create-meeting.dto'

@InputType()
export class UpdateMeetingDto extends PartialType(CreateMeetingDto) {}
