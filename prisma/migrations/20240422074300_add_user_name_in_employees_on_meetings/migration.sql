/*
  Warnings:

  - A unique constraint covering the columns `[userName,meetingId]` on the table `EmployeesOnMeetings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `EmployeesOnMeetings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeesOnMeetings" ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EmployeesOnMeetings_userName_meetingId_key" ON "EmployeesOnMeetings"("userName", "meetingId");
