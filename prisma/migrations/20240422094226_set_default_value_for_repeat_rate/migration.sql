/*
  Warnings:

  - Made the column `repeatRate` on table `EmployeeSchedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `repeatRate` on table `Meeting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EmployeeSchedule" ALTER COLUMN "repeatRate" SET NOT NULL,
ALTER COLUMN "repeatRate" SET DEFAULT 'P0D';

-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "repeatRate" SET NOT NULL,
ALTER COLUMN "repeatRate" SET DEFAULT 'P0D';
