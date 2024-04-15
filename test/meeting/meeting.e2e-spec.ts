import { type INestApplication } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { MeetingModule } from '../../src/meeting/meeting.module'
import { removeAllFakeData } from '../../prisma/removeAll'
import { createMock } from 'ts-auto-mock'
import { type CreateMeetingDto } from '../../src/meeting/api/dto/create-meeting.dto'
import { type CreateMeetingScheduleDto } from '../../src/meeting/api/dto/create-meeting-schedule.dto'
import { PrismaService } from 'nestjs-prisma'
import { type LocationModel } from '../../src/meeting/mapper/meeting.mapper'
import { TestingLogger } from '@nestjs/testing/services/testing-logger.service'
import { type DateTimeInterval } from '../../src/meeting/domain/model/datetime-interval.domain'

const gql = '/graphql'

describe('MeetingResolver (e2e)', () => {
  let app: INestApplication
  let location: LocationModel

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MeetingModule],
    }).compile()
    await removeAllFakeData()
    const prisma = new PrismaService()
    location = createMock<LocationModel>({ id: 1 })
    await prisma.location.createMany({ data: location })
    app = moduleFixture.createNestApplication()
    await app.init()
    const logger = new TestingLogger()
    logger.isLevelEnabled('verbose')
    app.useLogger(logger)
  })

  afterAll(async () => {
    await removeAllFakeData()
    await app.close()
  })

  describe(gql, () => {
    it('should get the cats array', async () => {
      const meeting = createMock<CreateMeetingDto>({
        schedule: createMock<CreateMeetingScheduleDto>({
          startDate: new Date('2024-01-01T00:00:00+00:00'),
          endDate: new Date('2024-01-01T01:00:00+00:00'),
          locationId: location.id,
        }),
      })

      return await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `mutation CreateMeeting2{createMeeting(meeting: ${JSON.stringify(meeting).replace(/"([^"]+)":/g, '$1:')}) {id}}`,
        })
        .expect(200)
        .catch((e) => {
          console.log(e)
        })

      // return getMeetingsByInterval(
      //   {
      //     from: new Date('2015-01-01T00:00:00.000Z'),
      //     to: new Date('2024-03-01T23:59:59.999Z'),
      //   },
      //   false
      // )
      //   .expect(200)
      //   .expect((res) => {
      //     expect(res.body.data.getCats).toEqual(cats)
      //   })
    })

    it('should get the cats array', async () => {
      return await getMeetingsByInterval(
        {
          from: new Date('2024-01-01T00:00:00+00:00'),
          to: new Date('2024-01-01T01:00:00+00:00'),
        },
        false
      ).expect(200)

      // return getMeetingsByInterval(
      //   {
      //     from: new Date('2015-01-01T00:00:00.000Z'),
      //     to: new Date('2024-03-01T23:59:59.999Z'),
      //   },
      //   false
      // )
      //   .expect(200)
      //   .expect((res) => {
      //     expect(res.body.data.getCats).toEqual(cats)
      //   })
    })
  })

  const getMeetingsByInterval = (
    interval: DateTimeInterval,
    canceled: boolean
  ) => {
    return request(app.getHttpServer())
      .post(gql)
      .send({
        query:
          'query getMeetingByInterval' +
          '{' +
          `meetingsByInterval(from: ${interval.from.toISOString()}, to: ${interval.to.toISOString()},canceled: ${canceled})` +
          '  {' +
          '    schedules {' +
          '   startDate,endDate' +
          '    }' +
          '  }' +
          '}',
      })
  }

  // const createMeeting = (meeting: CreateMeetingDto) => {
  //   console.log(
  //     `mutation CreateMeeting2{createMeeting(meeting: ${JSON.stringify(meeting).replace(/"([^"]+)":/g, '$1:')}) {id}}`
  //   )
  //   return request(app.getHttpServer())
  //     .post(gql)
  //     .send({
  //       query: `mutation CreateMeeting2{createMeeting(meeting: ${JSON.stringify(meeting).replace(/"([^"]+)":/g, '$1:')}) {id}}`,
  //     })
  // }
})
