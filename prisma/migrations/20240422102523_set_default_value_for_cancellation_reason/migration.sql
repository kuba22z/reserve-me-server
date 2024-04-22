/*
  Warnings:

  - Made the column `cancellationReason` on table `EmployeeSchedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cancellationReason` on table `MeetingSchedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EmployeeSchedule" ALTER COLUMN "cancellationReason" SET NOT NULL,
ALTER COLUMN "cancellationReason" SET DEFAULT '';

-- AlterTable
ALTER TABLE "MeetingSchedule" ALTER COLUMN "cancellationReason" SET NOT NULL,
ALTER COLUMN "cancellationReason" SET DEFAULT '';
