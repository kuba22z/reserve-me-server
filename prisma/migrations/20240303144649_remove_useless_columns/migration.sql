/*
  Warnings:

  - You are about to drop the column `employeeScheduleId` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `meetingScheduleId` on the `Meeting` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scheduleId]` on the table `Meeting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_employeeScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_meetingScheduleId_fkey";

-- DropIndex
DROP INDEX "Meeting_meetingScheduleId_key";

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "employeeScheduleId",
DROP COLUMN "meetingScheduleId",
ADD COLUMN     "scheduleId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_scheduleId_key" ON "Meeting"("scheduleId");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "MeetingSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
