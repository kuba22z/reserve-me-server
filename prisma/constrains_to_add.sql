

/*
Adding constraint see https://www.wking.dev/library/how-to-add-a-check-constraint-in-prisma
*/
/*
For Testing overlapping constraint
*/
insert into "MeetingSchedule" ("id", "startTime", "endTime", "startDate", "endDate")
values (3, '21:00:00+01', '22:00:00+01', CURRENT_DATE, CURRENT_DATE)





-- CREATE FUNCTION string_to_interval(s text) RETURNS interval AS $$
-- BEGIN
--     RETURN s::interval;
-- EXCEPTION WHEN OTHERS THEN
--     RETURN NULL;
-- END; $$ LANGUAGE plpgsql STRICT;

CREATE EXTENSION IF NOT EXISTS plpgsql;

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
    ADD CONSTRAINT valid_interval_check
        CHECK (is_valid_interval("MeetingSchedule"."repeatRate"));
SET intervalstyle = 'iso_8601';

alter table "MeetingSchedule" drop constraint if exists valid_interval_check;

-- testing function
select
is_valid_interval()


    BEGIN;
SELECT is_valid_interval('P5Y4M3DT2H1M1S'); -- note: 'ret'
FETCH ALL IN ret; -- works for any rowtype

COMMIT;  -- or ROLLBACK;
