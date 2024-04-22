/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Meeting` table. All the data in the column will be lost.
  - The primary key for the `ServicesProvidedOnMeetings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clientId` on the `ServicesProvidedOnMeetings` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientsOnMeetings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `ServicesProvidedOnMeetings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClientsOnMeetings" DROP CONSTRAINT "ClientsOnMeetings_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientsOnMeetings" DROP CONSTRAINT "ClientsOnMeetings_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeSchedule" DROP CONSTRAINT "EmployeeSchedule_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "ServicesProvidedOnMeetings" DROP CONSTRAINT "ServicesProvidedOnMeetings_clientId_fkey";

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "employeeId";

-- AlterTable
ALTER TABLE "ServicesProvidedOnMeetings" DROP CONSTRAINT "ServicesProvidedOnMeetings_pkey",
DROP COLUMN "clientId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "ServicesProvidedOnMeetings_pkey" PRIMARY KEY ("userId", "meetingId");

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "ClientsOnMeetings";

-- DropTable
DROP TABLE "Employee";

-- CreateTable
CREATE TABLE "UsersOnMeetings" (
    "userExternalRefId" TEXT NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsersOnMeetings_pkey" PRIMARY KEY ("userExternalRefId","meetingId")
);

-- CreateTable
CREATE TABLE "EmployeesOnMeetings" (
    "id" SERIAL NOT NULL,
    "userExternalRefId" TEXT NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeesOnMeetings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeesOnMeetings_userExternalRefId_meetingId_key" ON "EmployeesOnMeetings"("userExternalRefId", "meetingId");

-- AddForeignKey
ALTER TABLE "UsersOnMeetings" ADD CONSTRAINT "UsersOnMeetings_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeesOnMeetings" ADD CONSTRAINT "EmployeesOnMeetings_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSchedule" ADD CONSTRAINT "EmployeeSchedule_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeesOnMeetings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesProvidedOnMeetings" ADD CONSTRAINT "ServicesProvidedOnMeetings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
