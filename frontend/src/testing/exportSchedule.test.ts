import { buildScheduleIcs } from "@/features/schedule/utils/exportSchedule";
import type { Course } from "@/features/schedule/types/schedule";

test("builds recurring ics events for selected course meetings", () => {
  const courses: Course[] = [
    {
      id: "CSCI-1100",
      title: "Computer Science 1",
      credits: 4,
      level: "1100",
      department: "CSCI",
      school: "Computer Science",
      description: "",
      offerFrequency: "Fall",
      prereqs: [],
      coreqs: [],
      maxEnroll: 100,
      enrolled: 50,
      meetings: [
        {
          type: "LEC",
          days: ["M", "W", "F"],
          start: "09:00AM",
          end: "09:50AM",
          location: "DCC 308",
          instructor: "Dr. Alan Turing",
          section: "01",
          startDate: "2024-08-28",
          endDate: "2024-12-20",
          semester: "FALL 2024",
        },
      ],
    },
  ];

  const ics = buildScheduleIcs(courses);

  expect(ics).toContain("BEGIN:VCALENDAR");
  expect(ics).toContain("SUMMARY:CSCI-1100 Computer Science 1");
  expect(ics).toContain("LOCATION:DCC 308");
  expect(ics).toContain("DTSTART:20240828T090000");
  expect(ics).toContain("DTEND:20240828T095000");
  expect(ics).toContain("RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR;UNTIL=20241220T235900");
  expect(ics).toContain("END:VCALENDAR");
});
