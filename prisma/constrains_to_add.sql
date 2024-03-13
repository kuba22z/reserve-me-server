
/*
For Testing overlapping constraint
*/
insert into "MeetingSchedule" ("id", "startTime", "endTime", "startDate", "endDate")
values (3, '21:00:00+01', '22:00:00+01', CURRENT_DATE, CURRENT_DATE)


ALTER TABLE "MeetingSchedule"
    ADD CONSTRAINT "exclude_overlapping_meeting_schedules_for_each_location" EXCLUDE USING gist (
        "locationId" WITH =,
        tstzrange("MeetingSchedule"."startDate",
                  "MeetingSchedule"."endDate", '[]') WITH &&
        );

CREATE EXTENSION btree_gist;

ALTER TABLE "EmployeeSchedule"
    ADD CONSTRAINT "exclude_overlapping_employee_schedules_for_each_location" EXCLUDE USING gist (
        "locationId" WITH =,
        tstzrange("EmployeeSchedule"."startDate",
                  "EmployeeSchedule"."endDate", '[]') WITH &&
        );