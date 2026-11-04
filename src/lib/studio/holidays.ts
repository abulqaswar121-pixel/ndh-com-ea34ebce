/**
 * Studio holiday calendar.
 *
 * Islamic dates follow the expected (calculated) Gregorian dates for the
 * published Hijri calendar and can shift by a day with moon sighting — the UI
 * labels them "expected" so nobody prints a date we cannot defend. Global,
 * retail and Nigerian dates are fixed by calendar or by convention.
 *
 * Reminders fire 3–5 days before each date; the Studio surfaces them at the top
 * of the workspace and can draft a whole campaign in one click.
 */

export type HolidayGroup = "islamic" | "global" | "retail" | "national";

export type Holiday = {
  id: string;
  name: string;
  group: HolidayGroup;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Islamic dates are expected, not confirmed until sighting. */
  expected?: boolean;
  greeting: string;
  prompt: string;
  emoji: string;
};

export const HOLIDAY_GROUP_LABEL: Record<HolidayGroup, string> = {
  islamic: "Islamic",
  global: "Global",
  retail: "Retail & commerce",
  national: "National & African",
};

export const HOLIDAYS: Holiday[] = [
  // ---------------------------------------------------------------- Islamic
  {
    id: "ramadan-2026",
    name: "Ramadan begins",
    group: "islamic",
    date: "2026-02-18",
    expected: true,
    greeting: "Ramadan Mubarak",
    prompt: "A calm, respectful Ramadan message focused on reflection and service.",
    emoji: "🌙",
  },
  {
    id: "eid-fitr-2026",
    name: "Eid al-Fitr",
    group: "islamic",
    date: "2026-03-20",
    expected: true,
    greeting: "Eid Mubarak",
    prompt: "A joyful Eid greeting that thanks customers and wishes their family well.",
    emoji: "🌙",
  },
  {
    id: "eid-adha-2026",
    name: "Eid al-Adha",
    group: "islamic",
    date: "2026-05-27",
    expected: true,
    greeting: "Eid Mubarak",
    prompt: "Eid al-Adha greeting centred on sacrifice, generosity and community.",
    emoji: "🕌",
  },
  {
    id: "islamic-new-year-2026",
    name: "Islamic New Year (1 Muharram)",
    group: "islamic",
    date: "2026-06-16",
    expected: true,
    greeting: "Happy Islamic New Year",
    prompt: "A new Hijri year reflection: intention, renewal and steady work.",
    emoji: "🌙",
  },
  {
    id: "mawlid-2026",
    name: "Mawlid an-Nabi",
    group: "islamic",
    date: "2026-08-25",
    expected: true,
    greeting: "Mawlid Mubarak",
    prompt: "A respectful Mawlid message about character and good conduct.",
    emoji: "🕌",
  },
  {
    id: "ramadan-2027",
    name: "Ramadan begins",
    group: "islamic",
    date: "2027-02-18",
    expected: true,
    greeting: "Ramadan Mubarak",
    prompt: "A calm, respectful Ramadan message focused on reflection and service.",
    emoji: "🌙",
  },
  {
    id: "eid-fitr-2027",
    name: "Eid al-Fitr",
    group: "islamic",
    date: "2027-03-20",
    expected: true,
    greeting: "Eid Mubarak",
    prompt: "A joyful Eid greeting that thanks customers and wishes their family well.",
    emoji: "🌙",
  },
  {
    id: "eid-adha-2027",
    name: "Eid al-Adha",
    group: "islamic",
    date: "2027-05-27",
    expected: true,
    greeting: "Eid Mubarak",
    prompt: "Eid al-Adha greeting centred on sacrifice, generosity and community.",
    emoji: "🕌",
  },
  {
    id: "islamic-new-year-2027",
    name: "Islamic New Year (1 Muharram)",
    group: "islamic",
    date: "2027-06-16",
    expected: true,
    greeting: "Happy Islamic New Year",
    prompt: "A new Hijri year reflection: intention, renewal and steady work.",
    emoji: "🌙",
  },
  {
    id: "mawlid-2027",
    name: "Mawlid an-Nabi",
    group: "islamic",
    date: "2027-08-25",
    expected: true,
    greeting: "Mawlid Mubarak",
    prompt: "A respectful Mawlid message about character and good conduct.",
    emoji: "🕌",
  },

  // ---------------------------------------------------------------- Global
  {
    id: "valentine-2027",
    name: "Valentine's Day",
    group: "global",
    date: "2027-02-14",
    greeting: "Happy Valentine's Day",
    prompt: "Warm Valentine's note with a gift-friendly call to action.",
    emoji: "💛",
  },
  {
    id: "mothers-day-2027",
    name: "Mothers' Day",
    group: "global",
    date: "2027-03-14",
    greeting: "Happy Mothers' Day",
    prompt: "A sincere Mothers' Day thank-you with a gentle offer.",
    emoji: "🌷",
  },
  {
    id: "fathers-day-2027",
    name: "Fathers' Day",
    group: "global",
    date: "2027-06-20",
    greeting: "Happy Fathers' Day",
    prompt: "A warm Fathers' Day message for the people who carry the load.",
    emoji: "🧢",
  },
  {
    id: "new-year-2027",
    name: "New Year",
    group: "global",
    date: "2027-01-01",
    greeting: "Happy New Year",
    prompt: "A hopeful New Year post with one clear resolution and an invitation.",
    emoji: "✨",
  },

  // ---------------------------------------------------------------- Retail
  {
    id: "black-friday-2026",
    name: "Black Friday",
    group: "retail",
    date: "2026-11-27",
    greeting: "Black Friday",
    prompt: "A high-energy Black Friday offer with a clear deadline and price.",
    emoji: "🛍️",
  },
  {
    id: "cyber-monday-2026",
    name: "Cyber Monday",
    group: "retail",
    date: "2026-11-30",
    greeting: "Cyber Monday",
    prompt: "A digital-first Cyber Monday offer for online buyers.",
    emoji: "💻",
  },
  {
    id: "christmas-2026",
    name: "Christmas",
    group: "global",
    date: "2026-12-25",
    greeting: "Merry Christmas",
    prompt: "A warm Christmas greeting for customers and their families.",
    emoji: "🎄",
  },
  {
    id: "black-friday-2027",
    name: "Black Friday",
    group: "retail",
    date: "2027-11-26",
    greeting: "Black Friday",
    prompt: "A high-energy Black Friday offer with a clear deadline and price.",
    emoji: "🛍️",
  },
  {
    id: "cyber-monday-2027",
    name: "Cyber Monday",
    group: "retail",
    date: "2027-11-29",
    greeting: "Cyber Monday",
    prompt: "A digital-first Cyber Monday offer for online buyers.",
    emoji: "💻",
  },

  // --------------------------------------------------------------- National
  {
    id: "workers-day-2027",
    name: "Workers' Day",
    group: "national",
    date: "2027-05-01",
    greeting: "Happy Workers' Day",
    prompt: "A Workers' Day salute to the people who build the business.",
    emoji: "🛠️",
  },
  {
    id: "childrens-day-2027",
    name: "Children's Day",
    group: "national",
    date: "2027-05-27",
    greeting: "Happy Children's Day",
    prompt: "A Children's Day message about opportunity and learning.",
    emoji: "🎈",
  },
  {
    id: "youth-day-2027",
    name: "International Youth Day",
    group: "national",
    date: "2027-08-12",
    greeting: "Happy Youth Day",
    prompt: "A Youth Day post about skills, jobs and young builders.",
    emoji: "⚡",
  },
  {
    id: "independence-day-2027",
    name: "Independence Day (Nigeria)",
    group: "national",
    date: "2027-10-01",
    greeting: "Happy Independence Day",
    prompt: "An Independence Day message from a proudly Nigerian business.",
    emoji: "🇳🇬",
  },
];

export const REMINDER_WINDOW_DAYS = 5;

/** Whole days between today (local midnight) and the holiday. */
export function daysUntil(date: string, now = new Date()): number {
  const target = new Date(`${date}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export type HolidayWithTiming = Holiday & { days: number; reminder: boolean };

/** Upcoming holidays first; past ones dropped. */
export function upcomingHolidays(now = new Date(), limit = 24): HolidayWithTiming[] {
  return HOLIDAYS.map((holiday) => {
    const days = daysUntil(holiday.date, now);
    return { ...holiday, days, reminder: days >= 0 && days <= REMINDER_WINDOW_DAYS };
  })
    .filter((holiday) => holiday.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, limit);
}

/** The reminders the dashboard banner shows: everything inside the window. */
export function activeReminders(now = new Date()): HolidayWithTiming[] {
  return upcomingHolidays(now).filter((holiday) => holiday.reminder);
}

export function formatHolidayDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function countdownLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 0) return `${Math.abs(days)} days ago`;
  return `In ${days} days`;
}
