/*
  Warnings:

  - Made the column `endDate` on table `EmployeeSchedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `MeetingSchedule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EmployeeSchedule" ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "endDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MeetingSchedule" ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "endDate" SET DEFAULT CURRENT_TIMESTAMP;
