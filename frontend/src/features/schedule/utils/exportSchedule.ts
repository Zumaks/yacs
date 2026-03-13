import type { Course, Meeting } from "../types/schedule";

const DAY_TO_ICS: Record<string, string> = {
  M: "MO",
  T: "TU",
  W: "WE",
  R: "TH",
  F: "FR",
  S: "SA",
  U: "SU",
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function parseTime(time: string) {
  const [rawClock, period] = time.trim().split(/(?=[AP]M)/);
  let [hours, minutes] = rawClock.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

function formatLocalDateTime(date: Date) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    pad(date.getMinutes()),
    "00",
  ].join("");
}

function formatUtcTimestamp(date: Date) {
  return [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    "T",
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    "Z",
  ].join("");
}

function parseDate(value?: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function getFirstOccurrence(startDate: Date, meeting: Meeting) {
  const days = meeting.days
    .map((day) => ({ raw: day, value: DAY_TO_ICS[day] }))
    .filter((entry): entry is { raw: string; value: string } => Boolean(entry.value));

  if (days.length === 0) return null;

  let best: Date | null = null;
  for (const day of days) {
    const candidate = new Date(startDate);
    const targetDay = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"].indexOf(day.value);
    const delta = (targetDay - candidate.getDay() + 7) % 7;
    candidate.setDate(candidate.getDate() + delta);
    if (!best || candidate < best) best = candidate;
  }

  if (!best) return null;

  const { hours: startHours, minutes: startMinutes } = parseTime(meeting.start);
  best.setHours(startHours, startMinutes, 0, 0);
  return best;
}

function getEndDateTime(startDateTime: Date, meeting: Meeting) {
  const end = new Date(startDateTime);
  const { hours, minutes } = parseTime(meeting.end);
  end.setHours(hours, minutes, 0, 0);
  if (end <= startDateTime) {
    end.setDate(end.getDate() + 1);
  }
  return end;
}

function getUntilValue(meeting: Meeting, fallbackDate: Date) {
  const endDate = parseDate(meeting.endDate) ?? fallbackDate;
  const until = new Date(endDate);
  until.setHours(23, 59, 0, 0);
  return formatLocalDateTime(until);
}

function buildEvent(course: Course, meeting: Meeting, stamp: string) {
  const startDate = parseDate(meeting.startDate) ?? new Date();
  const startDateTime = getFirstOccurrence(startDate, meeting);
  if (!startDateTime) return null;

  const endDateTime = getEndDateTime(startDateTime, meeting);
  const byDay = meeting.days.map((day) => DAY_TO_ICS[day]).filter(Boolean).join(",");
  const fallbackEnd = new Date(startDateTime);
  fallbackEnd.setDate(fallbackEnd.getDate() + 7);

  return [
    "BEGIN:VEVENT",
    `UID:${course.id}-${meeting.type}-${meeting.section}-${formatLocalDateTime(startDateTime)}@yacs`,
    `DTSTAMP:${stamp}`,
    `SUMMARY:${escapeIcsText(`${course.id} ${course.title}`)}`,
    `DESCRIPTION:${escapeIcsText(`${meeting.type} ${meeting.section}${meeting.instructor ? ` with ${meeting.instructor}` : ""}`)}`,
    `LOCATION:${escapeIcsText(meeting.location || "TBA")}`,
    `DTSTART:${formatLocalDateTime(startDateTime)}`,
    `DTEND:${formatLocalDateTime(endDateTime)}`,
    byDay
      ? `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${getUntilValue(meeting, fallbackEnd)}`
      : "",
    "END:VEVENT",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export function buildScheduleIcs(courses: Course[]) {
  const stamp = formatUtcTimestamp(new Date());
  const events = courses.flatMap((course) =>
    course.meetings
      .map((meeting) => buildEvent(course, meeting, stamp))
      .filter((event): event is string => Boolean(event))
  );

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YACS//Schedule Export//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function downloadScheduleIcs(courses: Course[]) {
  const ics = buildScheduleIcs(courses);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const firstSemester = courses.flatMap((course) => course.meetings.map((meeting) => meeting.semester)).find(Boolean);
  const filename = firstSemester ? `yacs-schedule-${slugify(firstSemester)}.ics` : "yacs-schedule.ics";

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
