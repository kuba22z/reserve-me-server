
/*
Adding constraint see https://www.wking.dev/library/how-to-add-a-check-constraint-in-prisma

Prevent overlapping intervals for each location
*/

-- See for explanation:
-- https://www.prisma.io/dataguide/postgresql/column-and-table-constraints

CREATE EXTENSION btree_gist;


ALTER TABLE "EmployeeSchedule"
    ADD CONSTRAINT "exclude_overlapping_employee_schedules_for_each_location" EXCLUDE USING gist (
        "locationId" WITH =,
        tstzrange("EmployeeSchedule"."startDate" + "EmployeeSchedule"."startTime",
                  "EmployeeSchedule"."endDate" + "EmployeeSchedule"."endTime", '[]') WITH &&
        );

ALTER TABLE "EmployeeSchedule"
    drop constraint "exclude_overlapping_employee_schedules_for_each_location";

ALTER TABLE "MeetingSchedule"
    ADD CONSTRAINT "exclude_overlapping_meeting_schedules_for_each_location" EXCLUDE USING gist (
        "Meeting"."locationId" WITH =,
        tstzrange("MeetingSchedule"."startDate" + "MeetingSchedule"."startTime",
                  "MeetingSchedule"."endDate" + "MeetingSchedule"."endTime", '[]') WITH &&
        );

ALTER TABLE "MeetingSchedule"
    drop constraint "exclude_overlapping_meeting_schedules_for_each_location";

/*
For testing Testing
*/
insert into "MeetingSchedule" ("id", "startTime", "endTime", "startDate", "endDate")
values (3, '21:00:00+01', '22:00:00+01', CURRENT_DATE, CURRENT_DATE)
