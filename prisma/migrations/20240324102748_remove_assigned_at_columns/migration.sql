/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `ClientsOnMeetings` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `ServicesBookedOnMeetings` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `ServicesProvidedOnMeetings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClientsOnMeetings" DROP COLUMN "assignedAt";

-- AlterTable
ALTER TABLE "ServicesBookedOnMeetings" DROP COLUMN "assignedAt";

-- AlterTable
ALTER TABLE "ServicesProvidedOnMeetings" DROP COLUMN "assignedAt";
