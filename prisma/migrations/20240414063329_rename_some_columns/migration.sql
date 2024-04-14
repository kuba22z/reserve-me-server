/*
  Warnings:

  - The primary key for the `ServicesBookedOnMeetings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serivceId` on the `ServicesBookedOnMeetings` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `ServicesBookedOnMeetings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServicesBookedOnMeetings" DROP CONSTRAINT "ServicesBookedOnMeetings_serivceId_fkey";

-- AlterTable
ALTER TABLE "ServicesBookedOnMeetings" DROP CONSTRAINT "ServicesBookedOnMeetings_pkey",
DROP COLUMN "serivceId",
ADD COLUMN     "serviceId" INTEGER NOT NULL,
ADD CONSTRAINT "ServicesBookedOnMeetings_pkey" PRIMARY KEY ("serviceId", "meetingId");

-- AddForeignKey
ALTER TABLE "ServicesBookedOnMeetings" ADD CONSTRAINT "ServicesBookedOnMeetings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
