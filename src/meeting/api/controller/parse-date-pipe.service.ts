import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common'
import * as dayjs from 'dayjs'

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    if (value === undefined || !dayjs(value).isValid()) {
      throw new BadRequestException('Invalid date format.')
    }
    return new Date(dayjs(value).format())
  }
}
