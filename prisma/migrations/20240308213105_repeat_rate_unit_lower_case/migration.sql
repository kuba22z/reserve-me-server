/*
  Warnings:

  - The values [DAY,WEEK,MONTH,YEAR] on the enum `RepeatRateUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RepeatRateUnit_new" AS ENUM ('day', 'week', 'month', 'year');
ALTER TABLE "EmployeeSchedule" ALTER COLUMN "repeatRateUnit" DROP DEFAULT;
ALTER TABLE "MeetingSchedule" ALTER COLUMN "repeatRateUnit" DROP DEFAULT;
ALTER TABLE "MeetingSchedule" ALTER COLUMN "repeatRateUnit" TYPE "RepeatRateUnit_new" USING ("repeatRateUnit"::text::"RepeatRateUnit_new");
ALTER TABLE "EmployeeSchedule" ALTER COLUMN "repeatRateUnit" TYPE "RepeatRateUnit_new" USING ("repeatRateUnit"::text::"RepeatRateUnit_new");
ALTER TYPE "RepeatRateUnit" RENAME TO "RepeatRateUnit_old";
ALTER TYPE "RepeatRateUnit_new" RENAME TO "RepeatRateUnit";
DROP TYPE "RepeatRateUnit_old";
ALTER TABLE "EmployeeSchedule" ALTER COLUMN "repeatRateUnit" SET DEFAULT 'day';
ALTER TABLE "MeetingSchedule" ALTER COLUMN "repeatRateUnit" SET DEFAULT 'day';
COMMIT;

-- AlterTable
ALTER TABLE "EmployeeSchedule" ALTER COLUMN "repeatRateUnit" SET DEFAULT 'day';

-- AlterTable
ALTER TABLE "MeetingSchedule" ALTER COLUMN "repeatRateUnit" SET DEFAULT 'day';
