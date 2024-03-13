-- Prevents overlapping intervals for each location
-- See https://www.prisma.io/dataguide/postgresql/column-and-table-constraints
/*
exclusion constraint checks the values of multiple rows against one another. The UNIQUE constraint is a specific
type of exclusion constraint that checks that each row has a different value for the column or columns in question.

&& operator specifies that the date range should check for overlap
[] indicate that the range should be compared inclusively
*/
CREATE EXTENSION btree_gist;

ALTER TABLE "EmployeeSchedule"
    ADD CONSTRAINT "exclude_overlapping_employee_schedules_for_each_location" EXCLUDE USING gist (
        "locationId" WITH =,
        tstzrange("EmployeeSchedule"."startDate" + "EmployeeSchedule"."startTime",
                  "EmployeeSchedule"."endDate" + "EmployeeSchedule"."endTime", '[]') WITH &&
        );