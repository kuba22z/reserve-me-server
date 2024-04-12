import { type INestApplication } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { MeetingModule } from '../../src/meeting/meeting.module'
import { seed } from '../../prisma/seed'
import { rollbackSeed } from '../../prisma/rollbackSeed'

const gql = '/graphql'

describe('MeetingResolver (e2e)', () => {
  let app: INestApplication
  const seedId = 1

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MeetingModule],
    }).compile()
    await seed(seedId)
    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await rollbackSeed(seedId)
    await app.close()
  })

  describe(gql, () => {
    describe('cats', () => {
      it('should get the cats array', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({
            query:
              'query getMeetingByInterval' +
              '{' +
              'meetingsByInterval(from: "2015-01-01T00:00:00.000Z", to: "2024-03-01T23:59:59.999Z",canceled: false)\n' +
              '  {' +
              '    schedules {' +
              '   startDate,endDate' +
              '    }' +
              '  }' +
              '}',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getCats).toEqual(cats)
          })
      })
    })
  })
})
