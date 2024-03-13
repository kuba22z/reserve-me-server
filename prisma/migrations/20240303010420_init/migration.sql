-- CreateEnum
CREATE TYPE "RepeatRateUnit" AS ENUM ('DAY', 'WEEK', 'MONTH', 'YEAR');

-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "meetingScheduleId" INTEGER NOT NULL,
    "priceExcepted" DECIMAL(10,2) NOT NULL,
    "priceFull" DECIMAL(10,2),
    "discount" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "priceFinal" DECIMAL(8,2),
    "canceled" BOOLEAN NOT NULL DEFAULT false,
    "cancellationReason" TEXT NOT NULL DEFAULT '',
    "employeeIdCreated" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "employeeScheduleId" INTEGER,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientsOnMeetings" (
    "clientId" INTEGER NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientsOnMeetings_pkey" PRIMARY KEY ("clientId","meetingId")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSchedule" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "startTime" TIMETZ NOT NULL,
    "endTime" TIMETZ NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "repeatRate" INTEGER NOT NULL DEFAULT 0,
    "repeatRateUnit" "RepeatRateUnit" NOT NULL DEFAULT 'DAY',

    CONSTRAINT "EmployeeSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingSchedule" (
    "id" SERIAL NOT NULL,
    "startTime" TIMETZ NOT NULL,
    "endTime" TIMETZ NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "repeatRate" INTEGER NOT NULL DEFAULT 0,
    "repeatRateUnit" "RepeatRateUnit" NOT NULL DEFAULT 'DAY',

    CONSTRAINT "MeetingSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" SMALLINT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesProvidedOnMeetings" (
    "clientId" INTEGER NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServicesProvidedOnMeetings_pkey" PRIMARY KEY ("clientId","meetingId")
);

-- CreateTable
CREATE TABLE "ServicesBookedOnMeetings" (
    "serivceId" INTEGER NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServicesBookedOnMeetings_pkey" PRIMARY KEY ("serivceId","meetingId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_meetingScheduleId_key" ON "Meeting"("meetingScheduleId");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_meetingScheduleId_fkey" FOREIGN KEY ("meetingScheduleId") REFERENCES "MeetingSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_employeeScheduleId_fkey" FOREIGN KEY ("employeeScheduleId") REFERENCES "EmployeeSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientsOnMeetings" ADD CONSTRAINT "ClientsOnMeetings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientsOnMeetings" ADD CONSTRAINT "ClientsOnMeetings_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSchedule" ADD CONSTRAINT "EmployeeSchedule_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSchedule" ADD CONSTRAINT "EmployeeSchedule_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesProvidedOnMeetings" ADD CONSTRAINT "ServicesProvidedOnMeetings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesProvidedOnMeetings" ADD CONSTRAINT "ServicesProvidedOnMeetings_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesBookedOnMeetings" ADD CONSTRAINT "ServicesBookedOnMeetings_serivceId_fkey" FOREIGN KEY ("serivceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesBookedOnMeetings" ADD CONSTRAINT "ServicesBookedOnMeetings_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
