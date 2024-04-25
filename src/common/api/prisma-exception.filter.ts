import { Catch } from '@nestjs/common'
import { type GqlExceptionFilter } from '@nestjs/graphql'

@Catch()
export class PrismaClientExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown): any {
    // if (typeof exception === 'object' && exception && ) {
    //   if (exception.body.errors.length === 1) {
    //     const error = exception.body.errors[0]
    //     if (error.statusCode && error.data) {
    //       return new UnauthorizedException([], 'Unauthorized')
    //     }
    //   }
    // }
    // switch (exception.code) {
    //   case 'P2002': {
    //     throw new ConflictException('Not Unique Email')
    //   }
    //   case 'P2003': {
    //     throw new UnprocessableEntityException('Entity Not Exist')
    //   }
    //   case 'P2025': {
    //     throw new NotFoundException('Cannot find')
    //   }
    //   default:
    //     break
    // }
    return exception
  }
}
