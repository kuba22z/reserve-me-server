import { Injectable, NotFoundException } from '@nestjs/common'

import {
  registerDecorator,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator'
import { MeetingService } from '../../domain/service/meeting.service'
import { PrismaClient } from '@prisma/client'

export function locationIdExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: LocationExistsValidator,
    })
  }
}

@ValidatorConstraint({ name: 'location', async: true })
@Injectable()
export class LocationExistsValidator implements ValidatorConstraintInterface {
  async validate(locationId?: number): Promise<boolean> {
    if (locationId) {
      return await new PrismaClient().location
        .findFirst({
          where: { id: locationId },
          select: { id: true },
        })
        .then((location) => {
          if (!location) {
            throw new NotFoundException(
              [{ locationId }],
              MeetingService.LOCATION_NOT_FOUND_MESSAGE
            )
          }
          return true
        })
    } else {
      return true
    }
  }
}
