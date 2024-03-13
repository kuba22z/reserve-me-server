import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common'
import * as dayjs from 'dayjs'
import { type Dayjs } from 'dayjs'

@Injectable()
export class ParseDayjsPipe implements PipeTransform<string, Dayjs> {
  transform(value: string): Dayjs {
    if (value === undefined || !dayjs(value).isValid()) {
      throw new BadRequestException('Invalid date format.')
    }
    return dayjs(dayjs(value).format())
  }
}
