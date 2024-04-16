import { Catch } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { type GqlExceptionFilter } from '@nestjs/graphql'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements GqlExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError): any {
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
