/*
  Warnings:

  - You are about to drop the column `dayOfWeek` on the `EmployeeSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `repeatRateUnit` on the `EmployeeSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `canceled` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationReason` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfWeek` on the `MeetingSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `repeatRateUnit` on the `MeetingSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeeSchedule" DROP COLUMN "dayOfWeek",
DROP COLUMN "repeatRateUnit",
ADD COLUMN     "canceled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cancellationReason" TEXT,
ALTER COLUMN "repeatRate" DROP NOT NULL,
ALTER COLUMN "repeatRate" DROP DEFAULT,
ALTER COLUMN "repeatRate" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "canceled",
DROP COLUMN "cancellationReason";

-- AlterTable
ALTER TABLE "MeetingSchedule" DROP COLUMN "dayOfWeek",
DROP COLUMN "repeatRateUnit",
ADD COLUMN     "canceled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cancellationReason" TEXT,
ALTER COLUMN "repeatRate" DROP NOT NULL,
ALTER COLUMN "repeatRate" DROP DEFAULT,
ALTER COLUMN "repeatRate" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "DayOfWeek";

-- DropEnum
DROP TYPE "RepeatRateUnit";
