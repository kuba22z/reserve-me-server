ALTER TABLE "EmployeeSchedule"
    ADD CONSTRAINT "check_enddate_after_startdate" CHECK ( "endDate" > "startDate" );

ALTER TABLE "MeetingSchedule"
    ADD CONSTRAINT "check_enddate_after_startdate" CHECK ( "endDate" > "startDate" );