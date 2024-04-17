import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { ClientMapper, type ClientModel } from '../../mapper/client.mapper'
import type { DateTimeInterval } from '../../../meeting/domain/model/datetime-interval.domain'
import { type ClientDomain } from '../model/client.domain'

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientMapper: ClientMapper
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

  async findById(id: number): Promise<ClientDomain> {
    return await this.prisma.client
      .findUnique({
        where: { id },
        include: {
          clientsOnMeetings: {
            include: {
              meeting: {
                include: { schedules: { include: { location: true } } },
              },
            },
          },
        },
      })
      .then((client) => this.clientMapper.toDomain(client))
  }
}
