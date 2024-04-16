import { type INestApplication, Logger } from '@nestjs/common'
import { removeAllFakeData } from '../../prisma/removeAll'
import { createMock } from 'ts-auto-mock'
import { PrismaService } from 'nestjs-prisma'
import { type LocationModel } from '../../src/meeting/mapper/meeting.mapper'
import * as request from 'supertest'
import { AppModule } from '../../src/app.module'
import { type CreateMeetingDto } from '../../src/meeting/api/dto/create-meeting.dto'
import type { CreateMeetingScheduleDto } from '../../src/meeting/api/dto/create-meeting-schedule.dto'
import * as duration from 'dayjs/plugin/duration'
import * as utcPlugin from 'dayjs/plugin/utc'
import * as dayjs from 'dayjs'
import type Test from 'supertest/lib/test'
import { Test as NestJsTest, type TestingModule } from '@nestjs/testing'
import { DateTimeInterval } from '../../src/meeting/domain/model/datetime-interval.domain'
import { type UpdateMeetingDto } from '../../src/meeting/api/dto/update-meeting.dto'
import { type UpdateMeetingScheduleDto } from '../../src/meeting/api/dto/update-meeting-schedule.dto'
import { type MeetingDto } from '../../src/meeting/api/dto/meeting.dto'
import { type MeetingSchedule } from '@prisma/client'

const gql = '/graphql'

describe('MeetingResolver (e2e)', () => {
  let app: INestApplication
  let location1: LocationModel
  let location2: LocationModel
  const prisma = new PrismaService()

  beforeAll(async () => {
    // extend dayjs with plugin globally
    dayjs.extend(duration)
    dayjs.extend(utcPlugin)

    const moduleFixture: TestingModule = await NestJsTest.createTestingModule({
      imports: [AppModule],
    })
      .setLogger(new Logger())
      .compile()
    await removeAllFakeData()
    location1 = createMock<LocationModel>({ id: 1 })
    location2 = createMock<LocationModel>({ id: 2 })
    await prisma.location.createMany({ data: [location1, location2] })
    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })
  afterEach(async () => {
    await prisma.meeting.deleteMany({})
  })

  describe('meetingsByInterval', () => {
    it('should get one meeting', async () => {
      // given
      const meetingSchedule1 = createMock<CreateMeetingScheduleDto>({
        startDate: new Date('2024-01-01T00:00:00+00:00'),
        endDate: new Date('2024-01-01T01:00:00+00:00'),
        locationId: location1.id,
      })
      const meetingSchedule2 = createMock<CreateMeetingScheduleDto>({
        startDate: new Date('2024-01-01T00:10:00+00:00'),
        endDate: new Date('2024-01-01T01:10:00+00:00'),
        locationId: location2.id,
      })

      const createMeetingDto1 = createMock<CreateMeetingDto>({
        schedule: meetingSchedule1,
      })
      const createMeetingDto2 = createMock<CreateMeetingDto>({
        schedule: meetingSchedule2,
        priceExcepted: 12,
      })
      const meeting1 = await isMeetingCreated(
        createMeeting(createMeetingDto1),
        createMeetingDto1
      )
      await isMeetingCreated(
        createMeeting(createMeetingDto2),
        createMeetingDto2
      )
      // meetingSchedule2 is outside of meetingSchedule1 -> only meeting1 should be returned
      await getMeetingsByInterval(new DateTimeInterval(meetingSchedule1), false)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.meetingsByInterval.length).toEqual(1)
          expect(res.body.data.meetingsByInterval[0]).toEqual(meeting1)
        })
    })
  })

  describe('createMeeting', () => {
    it('should not create meeting', async () => {
      // given
      const meetingSchedule1 = createMock<CreateMeetingScheduleDto>({
        startDate: new Date('2024-01-01T00:00:00+00:00'),
        endDate: new Date('2024-01-01T01:00:00+00:00'),
        locationId: location1.id,
      })
      const meetingSchedule2 = createMock<CreateMeetingScheduleDto>({
        startDate: new Date('2024-01-01T00:59:00+00:00'),
        endDate: new Date('2024-01-01T01:10:00+00:00'),
        locationId: location1.id,
      })

      const createMeetingDto1 = createMock<CreateMeetingDto>({
        schedule: meetingSchedule1,
      })
      const createMeetingDto2 = createMock<CreateMeetingDto>({
        schedule: meetingSchedule2,
      })
      await isMeetingCreated(
        createMeeting(createMeetingDto1),
        createMeetingDto1
      )
      // meetingSchedule1 collides with meetingSchedule2 -> should throw ConflictException 409
      await createMeeting(createMeetingDto2)
        //  .expect(409)
        .then((res) => {
          expect(res.body.errors.length).toEqual(1)
          expect(res.body.errors[0].code).toEqual(409)
          expect(res.body.errors[0].message).toEqual(
            'Requested Meeting Schedule collides with other Schedules'
          )
        })
    })
  })

  describe('updateMeeting', () => {
    it('should update meeting', async () => {
      // given
      const meetingSchedule1 = createMock<CreateMeetingScheduleDto>({
        startDate: new Date('2024-01-01T00:00:00+00:00'),
        endDate: new Date('2024-01-01T01:00:00+00:00'),
        locationId: location1.id,
      })
      const createMeetingDto1 = createMock<CreateMeetingDto>({
        schedule: meetingSchedule1,
      })
      const meeting1 = await isMeetingCreated(
        createMeeting(createMeetingDto1),
        createMeetingDto1
      )
      const meetingSchedule2 = createMock<CreateMeetingScheduleDto>({
        startDate: new Date('2024-01-01T02:00:00+00:00'),
        endDate: new Date('2024-01-01T03:00:00+00:00'),
        locationId: location1.id,
      })
      const createMeetingDto2 = createMock<CreateMeetingDto>({
        schedule: meetingSchedule2,
      })
      await isMeetingCreated(
        createMeeting(createMeetingDto2),
        createMeetingDto2
      )

      const updateMeetingSchedule = createMock<UpdateMeetingScheduleDto>({
        id: meeting1.schedules[0].id,
        startDate: new Date('2024-01-01T01:00:00+00:00'),
        endDate: new Date('2024-01-01T02:00:00+00:00'),
      })
      const updateMeetingDto = createMock<UpdateMeetingDto>({
        id: meeting1.id,
        priceExcepted: 10,
        schedules: [updateMeetingSchedule],
      })
      // updateMeetingSchedule2 is exclusively between meetingSchedule1 and meetingSchedule2 -> should update
      await isMeetingUpdated(updateMeeting(updateMeetingDto), updateMeetingDto)

      const updateMeetingSchedule2 = createMock<UpdateMeetingScheduleDto>({
        id: meeting1.schedules[0].id,
        startDate: new Date('2024-01-01T02:00:00+00:00'),
        endDate: new Date('2024-01-01T02:50:00+00:00'),
      })
      const updateMeetingDto2 = createMock<UpdateMeetingDto>({
        id: meeting1.id,
        schedules: [updateMeetingSchedule2],
        locationId: location2.id,
      })
      // updateMeetingSchedule2 collides with meetingSchedule2 but locationId is changed to 2 -> should update
      await isMeetingUpdated(
        updateMeeting(updateMeetingDto2),
        updateMeetingDto2
      )
    })
  })

  const getMeetingsByInterval = (
    interval: DateTimeInterval,
    canceled: boolean
  ) => {
    return request(app.getHttpServer())
      .post(gql)
      .send({
        query: `{meetingsByInterval(from:"${interval.from.toISOString()}",to:"${interval.to.toISOString()}",canceled:${canceled}){priceExcepted,id,schedules {id,startDate,endDate,locationId}}}`,
      })
  }

  const createMeeting = (meeting: CreateMeetingDto) => {
    const createMeeting = `mutation {createMeeting(meeting: ${removeQuotesOnKeys(JSON.stringify(meeting))}) {priceExcepted,id,schedules {id,startDate,endDate,locationId}}}`
    return request(app.getHttpServer()).post(gql).send({
      query: createMeeting,
    })
  }

  const updateMeeting = (meeting: UpdateMeetingDto) => {
    const updateMeeting = `mutation {updateMeeting(meeting: ${removeQuotesOnKeys(JSON.stringify(meeting))}) {priceExcepted,id,schedules {startDate,endDate,locationId}}}`
    console.log(updateMeeting)
    return request(app.getHttpServer()).post(gql).send({
      query: updateMeeting,
    })
  }

  const isMeetingCreated = async (
    meeting: Test,
    createMeetingDto: CreateMeetingDto
  ): Promise<MeetingDto> => {
    return await meeting
      .expect(200)
      .expect((res) => {
        const schedule: MeetingSchedule =
          res.body.data.createMeeting.schedules[0]
        const { id, ...scheduleWithoutId } = schedule
        expect(scheduleWithoutId).toEqual({
          startDate: createMeetingDto.schedule.startDate.toISOString(),
          endDate: createMeetingDto.schedule.endDate.toISOString(),
          locationId: createMeetingDto.schedule.locationId,
        })
        expect(res.body.data.createMeeting.priceExcepted).toEqual(
          createMeetingDto.priceExcepted
        )
      })
      .then((res) => res.body.data.createMeeting)
  }

  const isMeetingUpdated = async (
    meeting: Test,
    updateMeetingDto: UpdateMeetingDto
  ): Promise<MeetingDto> => {
    return await meeting
      .expect(200)
      .expect((res) => {
        expect(res.body.data.updateMeeting.schedules[0]).toEqual({
          startDate: updateMeetingDto.schedules[0].startDate.toISOString(),
          endDate: updateMeetingDto.schedules[0].endDate.toISOString(),
          locationId: updateMeetingDto.locationId ?? location1.id,
        })
        expect(res.body.data.updateMeeting.priceExcepted).toEqual(
          updateMeetingDto.priceExcepted
        )
      })
      .then((res) => res.body.data.updateMeeting)
  }

  const removeQuotesOnKeys = (string: string) => {
    return string.replace(/"([^"]+)":/g, '$1:')
  }
})
