-- Prevent overlapping intervals for each location
-- See https://www.prisma.io/dataguide/postgresql/column-and-table-constraints
ALTER TABLE "MeetingSchedule" drop constraint "exclude_overlapping_meeting_schedules_for_each_location";
ALTER TABLE "EmployeeSchedule" drop constraint "exclude_overlapping_employee_schedules_for_each_location";

ALTER TABLE "MeetingSchedule"
    ADD CONSTRAINT "exclude_overlapping_meeting_schedules_for_each_location" EXCLUDE USING gist (
        "locationId" WITH =,
        tsrange("MeetingSchedule"."startDate",
                "MeetingSchedule"."endDate", '[]') WITH &&
        ) where ( canceled = false );

ALTER TABLE "EmployeeSchedule"
    ADD CONSTRAINT "exclude_overlapping_employee_schedules_for_each_location" EXCLUDE USING gist (
        "locationId" WITH =,
        tsrange("EmployeeSchedule"."startDate",
                "EmployeeSchedule"."endDate", '[]') WITH &&
        ) where ( canceled = false );
