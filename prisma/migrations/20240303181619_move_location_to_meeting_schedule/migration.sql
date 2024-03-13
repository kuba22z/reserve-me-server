/*
  Warnings:

  - You are about to drop the column `locationId` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `MeetingSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_locationId_fkey";

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "locationId";

-- AlterTable
ALTER TABLE "MeetingSchedule" ADD COLUMN     "locationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MeetingSchedule" ADD CONSTRAINT "MeetingSchedule_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
