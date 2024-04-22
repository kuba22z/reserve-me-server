/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `UsersOnMeetings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName,meetingId]` on the table `UsersOnMeetings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `UsersOnMeetings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersOnMeetings" ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UsersOnMeetings_userName_key" ON "UsersOnMeetings"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "UsersOnMeetings_userName_meetingId_key" ON "UsersOnMeetings"("userName", "meetingId");
