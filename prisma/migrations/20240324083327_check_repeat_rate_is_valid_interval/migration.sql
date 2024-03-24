ALTER TABLE "Meeting"
    ADD CONSTRAINT check_valid_repeat_rate_meeting
        CHECK (is_valid_interval("Meeting"."repeatRate"));
