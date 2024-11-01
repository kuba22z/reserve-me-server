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
import { type DateTimeInterval } from '../../src/meeting/domain/model/datetime-interval.domain'
import { type UpdateMeetingDto } from '../../src/meeting/api/dto/update-meeting.dto'
import { type MeetingDto } from '../../src/meeting/api/dto/meeting.dto'
import { type MeetingSchedule } from '@prisma/client'
import { type ErrorDto } from '../../src/common/api/dto/error.dto'
import { MeetingService } from '../../src/meeting/domain/service/meeting.service'
import { type UpdateMeetingScheduleDto } from '../../src/meeting/api/dto/update-meeting-schedule.dto'
import gql from 'graphql-tag'
import { print } from 'graphql/language'
import * as assert from 'assert'
import { ConfigService } from '@nestjs/config'
import type { EnvironmentVariables } from '../../src/config-validation'

const gqlPath = '/graphql'

describe('MeetingResolver (e2e)', () => {
  let app: INestApplication
  let location1: LocationModel
  let location2: LocationModel
  const prisma = new PrismaService()
  let config: ConfigService<EnvironmentVariables, true>

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
    location1 = createMock<LocationModel>({ id: 1, name: 'location1' })
    location2 = createMock<LocationModel>({ id: 2, name: 'location2' })
    await prisma.location.createMany({ data: [location1, location2] })
    config = moduleFixture.get<
      ConfigService,
      ConfigService<EnvironmentVariables, true>
    >(ConfigService)
    config.set('AUTH_ENABLED', false)
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
      await getMeetingsByInterval(
        {
          from: meetingSchedule1.startDate,
          to: meetingSchedule1.endDate,
        },
        false
      )
        .expect(200)
        .expect((res) => {
          expect(res.body.data.meetingsByInterval.length).toEqual(1)
          expect(res.body.data.meetingsByInterval[0]).toEqual(meeting1)
        })
    })
  })

  describe('createMeeting', () => {
    it('should not create meeting', async () => {
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
      await shouldThrow(
        createMeeting(createMeetingDto2),
        409,
        MeetingService.CREATE_MEETING_CONFLICT_MESSAGE
      )
    })
  })

  describe('updateMeeting', () => {
    it('should-update-meeting', async () => {
      // given
      const meetingSchedule1 = createMock<CreateMeetingScheduleDto>({
        startDate: new Date('2024-01-01T00:10:00+00:00'),
        endDate: new Date('2024-01-01T00:20:00+00:00'),
        locationId: location1.id,
      })
      const createMeetingDto1 = createMock<CreateMeetingDto>({
        schedule: meetingSchedule1,
      })

      const meeting1 = await isMeetingCreated(
        createMeeting(createMeetingDto1),
        createMeetingDto1
      )

      const updateMeetingSchedule1 = createMock<UpdateMeetingScheduleDto>({
        id: meeting1.schedules?.[0].id,
        startDate: new Date('2024-01-01T00:00:00+00:00'),
        endDate: new Date('2024-01-01T01:00:00+00:00'),
      })
      const updateMeetingDto1 = createMock<UpdateMeetingDto>({
        id: meeting1.id,
        priceExcepted: 10,
        schedules: [updateMeetingSchedule1],
      })

      // updateMeetingSchedule1 collides with meetingSchedule1, but it's the same meeting -> should update schedule
      await isMeetingUpdated(
        updateMeeting(updateMeetingDto1),
        updateMeetingDto1
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

      const updateMeetingSchedule2 = createMock<UpdateMeetingScheduleDto>({
        id: meeting1.schedules?.[0].id,
        startDate: new Date('2024-01-01T01:00:00+00:00'),
        endDate: new Date('2024-01-01T02:00:00+00:00'),
      })
      const updateMeetingDto2 = createMock<UpdateMeetingDto>({
        id: meeting1.id,
        priceExcepted: 10,
        schedules: [updateMeetingSchedule2],
      })
      // updateMeetingSchedule2 doesn't collides exclusively with meetingSchedule2 -> should update
      await isMeetingUpdated(
        updateMeeting(updateMeetingDto2),
        updateMeetingDto2
      )

      const updateMeetingSchedule3 = createMock<UpdateMeetingScheduleDto>({
        id: meeting1.schedules?.[0].id,
        startDate: new Date('2024-01-01T02:00:00+00:00'),
        endDate: new Date('2024-01-01T02:50:00+00:00'),
      })
      const updateMeetingDto3 = createMock<UpdateMeetingDto>({
        id: meeting1.id,
        schedules: [updateMeetingSchedule3],
        locationId: location2.id,
      })
      // updateMeetingSchedule3 collides with meetingSchedule2 but locationId is changed to 2 -> should update
      await isMeetingUpdated(
        updateMeeting(updateMeetingDto3),
        updateMeetingDto3
      )
    })

    it('should not update meeting', async () => {
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
      const meeting2 = await isMeetingCreated(
        createMeeting(createMeetingDto2),
        createMeetingDto2
      )

      const updateMeetingSchedule = createMock<UpdateMeetingScheduleDto>({
        id: meeting1.schedules?.[0].id,
        startDate: new Date('2024-01-01T01:00:00+00:00'),
        endDate: new Date('2024-01-01T02:01:00+00:00'),
      })
      const updateMeetingDto = createMock<UpdateMeetingDto>({
        id: meeting1.id,
        priceExcepted: 10,
        schedules: [updateMeetingSchedule],
      })
      // updateMeetingSchedule collides with meetingSchedule1 -> should not update schedules
      await shouldThrow(
        updateMeeting(updateMeetingDto),
        409,
        MeetingService.UPDATE_MEETING_CONFLICT_MESSAGE
      ).then((errorDto) => {
        expect((errorDto.data[0] as MeetingDto).id).toEqual(meeting2.id)
      })

      updateMeetingDto.locationId = 99
      // updateMeetingDto has not existing locationId -> should throw Not Found 404
      await shouldThrow(
        updateMeeting(updateMeetingDto),
        404,
        MeetingService.LOCATION_NOT_FOUND_MESSAGE,
        [{ locationId: updateMeetingDto.locationId }]
      )
    })
  })

  const getMeetingsByInterval = (
    interval: DateTimeInterval,
    canceled: boolean
  ) => {
    return request(app.getHttpServer())
      .post(gqlPath)
      .send({
        query: `{meetingsByInterval(from:"${interval.from.toISOString()}",to:"${interval.to.toISOString()}",canceled:${canceled}){priceExcepted,id,schedules {id,startDate,endDate,locationId}}}`,
      })
  }

  const createMeeting = (meeting: CreateMeetingDto) => {
    const createMeeting = `mutation {createMeeting(meeting: ${removeQuotesOnKeys(JSON.stringify(meeting))}) {priceExcepted,id,schedules {id,startDate,endDate,locationId}}}`
    return request(app.getHttpServer()).post(gqlPath).send({
      query: createMeeting,
    })
  }

  const updateMeeting = (meeting: UpdateMeetingDto) => {
    const updateMeeting = gql`
        mutation {
            updateMeeting(meeting: ${removeQuotesOnKeys(JSON.stringify(meeting))}) {
                priceExcepted
                id
                schedules {
                    startDate
                    endDate
                    locationId
                }
            }
        }
    `
    return request(app.getHttpServer())
      .post(gqlPath)
      .send({
        query: print(updateMeeting),
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
    assert(updateMeetingDto.schedules)
    assert(updateMeetingDto.schedules[0])
    assert(updateMeetingDto)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const startDate = updateMeetingDto.schedules[0].startDate.toISOString()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const endDate = updateMeetingDto.schedules[0].endDate.toISOString()
    return await meeting
      .expect(200)
      .expect((res) => {
        expect(res.body.data.updateMeeting.schedules[0]).toEqual({
          startDate,
          endDate,
          locationId: updateMeetingDto.locationId ?? location1.id,
        })
        expect(res.body.data.updateMeeting.priceExcepted).toEqual(
          updateMeetingDto.priceExcepted
        )
      })
      .then((res) => res.body.data.updateMeeting)
  }

  const shouldThrow = async (
    test: Test,
    statusCode: number,
    message: string,
    data?: object[]
  ) => {
    return await test
      .expect((res) => {
        expect(res.body.errors.length).toEqual(1)
        const errorDto = res.body.errors[0] as ErrorDto
        expect(errorDto.statusCode).toEqual(statusCode)
        expect(errorDto.message).toEqual(message)
        if (data) {
          expect(errorDto.data).toEqual(data)
        }
      })
      .then((res) => res.body.errors[0] as ErrorDto)
  }

  const removeQuotesOnKeys = (string: string) => {
    return string.replace(/"([^"]+)":/g, '$1:')
  }
})
