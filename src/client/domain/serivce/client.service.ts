import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { type ClientModel } from '../../mapper/client.mapper'
import type { DateTimeInterval } from '../../../meeting/domain/model/dateTimeInterval.domain'

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService
    // private readonly mapper: ClientMapper
  ) {}

  async findMeetingsByInterval(dateTimeInterval: DateTimeInterval) {
    const clientModel: ClientModel[] = await this.prisma.client.findMany({
      include: {
        clientsOnMeetings: {
          include: {
            meeting: true,
          },
        },
      },
    })
    return clientModel
  }
}
