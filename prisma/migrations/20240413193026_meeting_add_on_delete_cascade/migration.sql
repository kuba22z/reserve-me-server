-- DropForeignKey
ALTER TABLE "ClientsOnMeetings" DROP CONSTRAINT "ClientsOnMeetings_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingSchedule" DROP CONSTRAINT "MeetingSchedule_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "ServicesBookedOnMeetings" DROP CONSTRAINT "ServicesBookedOnMeetings_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "ServicesProvidedOnMeetings" DROP CONSTRAINT "ServicesProvidedOnMeetings_meetingId_fkey";

-- AddForeignKey
ALTER TABLE "MeetingSchedule" ADD CONSTRAINT "MeetingSchedule_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientsOnMeetings" ADD CONSTRAINT "ClientsOnMeetings_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesProvidedOnMeetings" ADD CONSTRAINT "ServicesProvidedOnMeetings_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesBookedOnMeetings" ADD CONSTRAINT "ServicesBookedOnMeetings_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
