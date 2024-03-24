CREATE EXTENSION IF NOT EXISTS plpgsql;
SET intervalstyle = 'iso_8601';

CREATE OR REPLACE FUNCTION is_valid_interval(interval_string text)
    RETURNS BOOLEAN AS $$
BEGIN
    PERFORM interval_string::interval;
    RETURN TRUE;
EXCEPTION
    WHEN others THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE "MeetingSchedule"
    ADD CONSTRAINT check_valid_repeat_rate_meeting_schedule
        CHECK (is_valid_interval("MeetingSchedule"."repeatRate"));

ALTER TABLE "EmployeeSchedule"
    ADD CONSTRAINT check_valid_repeat_rate_employee_schedule
        CHECK (is_valid_interval("EmployeeSchedule"."repeatRate"));
