/*
  Warnings:

  - You are about to drop the column `repeatRate` on the `EmployeeSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeeSchedule" DROP COLUMN "repeatRate";

-- AlterTable
ALTER TABLE "EmployeesOnMeetings" ADD COLUMN     "repeatRate" TEXT;
