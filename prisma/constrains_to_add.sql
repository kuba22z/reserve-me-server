

/*
Adding constraint see https://www.wking.dev/library/how-to-add-a-check-constraint-in-prisma
*/
/*
For Testing overlapping constraint
*/
insert into "MeetingSchedule" ("id", "startTime", "endTime", "startDate", "endDate")
values (3, '21:00:00+01', '22:00:00+01', CURRENT_DATE, CURRENT_DATE)
