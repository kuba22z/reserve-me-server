-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');

-- AlterTable
ALTER TABLE "EmployeeSchedule" ADD COLUMN     "dayOfWeek" "DayOfWeek" NOT NULL DEFAULT 'mon';

-- AlterTable
ALTER TABLE "MeetingSchedule" ADD COLUMN     "dayOfWeek" "DayOfWeek" NOT NULL DEFAULT 'mon';
