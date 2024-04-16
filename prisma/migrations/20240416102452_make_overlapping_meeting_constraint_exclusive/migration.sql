ALTER TABLE "MeetingSchedule"
    DROP CONSTRAINT "exclude_overlapping_meeting_schedules_for_each_location";
ALTER TABLE "EmployeeSchedule"
    DROP CONSTRAINT "exclude_overlapping_employee_schedules_for_each_location";

-- Prevent overlapping intervals for each location
-- See https://www.prisma.io/dataguide/postgresql/column-and-table-constraints
ALTER TABLE "MeetingSchedule"
    ADD CONSTRAINT "exclude_overlapping_meeting_schedules_for_each_location" EXCLUDE USING gist (
        "locationId" WITH =,
        tsrange("MeetingSchedule"."startDate",
                "MeetingSchedule"."endDate", '()') WITH &&
        );

ALTER TABLE "EmployeeSchedule"
    ADD CONSTRAINT "exclude_overlapping_employee_schedules_for_each_location" EXCLUDE USING gist (
        "locationId" WITH =,
        tsrange("EmployeeSchedule"."startDate",
                "EmployeeSchedule"."endDate", '()') WITH &&
        );