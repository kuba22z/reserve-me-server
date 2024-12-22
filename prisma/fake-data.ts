// Predefined hardcoded objects
import {
  type EmployeeSchedule,
  type EmployeesOnMeetings,
  type Location,
  type Meeting,
  type MeetingSchedule,
  type Service,
  type UsersOnMeetings,
} from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export const seedId = 1

export const location: Location = {
  name: 'korty górne',
  street: 'ptasia',
  houseNumber: 8,
  city: 'Gorzów Wielkopolski',
  postalCode: '12627',
  id: seedId,
}

export const location2: Location = {
  name: 'korty dolne',
  street: 'ptasia',
  houseNumber: 8,
  city: 'Gorzów Wielkopolski',
  postalCode: '12627',
  id: 2,
}

export const service: Service = {
  name: 'Catering Service',
  price: new Decimal(150.0),
  createdAt: new Date(),
  updatedAt: new Date(),
  id: seedId,
}

export const meeting: Meeting = {
  priceExcepted: new Decimal(500.0),
  priceFull: new Decimal(600.0),
  discount: new Decimal(0.1),
  priceFinal: new Decimal(540.0),
  createdByExternalRefId: 'admin-12345',
  repeatRate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  notes: '',
  id: seedId,
}

export const usersOnMeeting: UsersOnMeetings = {
  userExternalRefId: 'user-123',
  meetingId: seedId, // Placeholder, will be updated after meeting creation
  userName: 'John Doe',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const employeesOnMeeting: EmployeesOnMeetings = {
  userExternalRefId: 'emp-123',
  meetingId: seedId, // Placeholder, will be updated after meeting creation
  userName: 'Alice Johnson',
  createdAt: new Date(),
  updatedAt: new Date(),
  id: seedId,
}

export const meetingSchedule: MeetingSchedule = {
  meetingId: seedId,
  locationId: seedId,
  startDate: new Date('2024-12-01T10:00:00Z'),
  endDate: new Date('2024-12-01T12:00:00Z'),
  canceled: false,
  cancellationReason: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  id: seedId,
}

export const employeeSchedule: EmployeeSchedule = {
  employeeId: seedId,
  locationId: seedId,
  startDate: new Date('2024-12-01T10:00:00Z'),
  endDate: new Date('2024-12-01T12:00:00Z'),
  canceled: false,
  cancellationReason: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  repeatRate: null,
  id: seedId,
}
