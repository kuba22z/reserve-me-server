/*
  Warnings:

  - The primary key for the `ServicesProvidedOnMeetings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `ServicesProvidedOnMeetings` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `ServicesProvidedOnMeetings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServicesProvidedOnMeetings" DROP CONSTRAINT "ServicesProvidedOnMeetings_userId_fkey";

-- AlterTable
ALTER TABLE "ServicesProvidedOnMeetings" DROP CONSTRAINT "ServicesProvidedOnMeetings_pkey",
DROP COLUMN "userId",
ADD COLUMN     "serviceId" INTEGER NOT NULL,
ADD CONSTRAINT "ServicesProvidedOnMeetings_pkey" PRIMARY KEY ("serviceId", "meetingId");

-- AddForeignKey
ALTER TABLE "ServicesProvidedOnMeetings" ADD CONSTRAINT "ServicesProvidedOnMeetings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
