import { useMemo, useState } from "react";
import { BellRing, CalendarHeart, Clock, Sparkles, Wand2 } from "lucide-react";
import {
  HOLIDAY_GROUP_LABEL,
  REMINDER_WINDOW_DAYS,
  countdownLabel,
  formatHolidayDate,
  upcomingHolidays,
  type HolidayGroup,
  type HolidayWithTiming,
} from "@/lib/studio/holidays";
import { useStudio } from "./studio-context";

const GROUPS: (HolidayGroup | "all")[] = ["all", "islamic", "retail", "global", "national"];

/** Smart holiday tracker with 3–5 day reminders and one-click campaign drafting. */
export function CalendarPanel({
  onGenerate,
}: {
  onGenerate: (holiday: HolidayWithTiming) => void;
}) {
  const { brand } = useStudio();
  const [group, setGroup] = useState<HolidayGroup | "all">("all");
  const holidays = useMemo(() => upcomingHolidays(), []);
  const visible = holidays.filter((holiday) => group === "all" || holiday.group === group);
  const reminders = holidays.filter((holiday) => holiday.reminder);

  return (
    <section className="studio-panel">
      <div className="studio-panel-head">
        <div>
          <p className="studio-eyebrow">
            <CalendarHeart size={13} aria-hidden="true" /> Event &amp; holiday calendar
          </p>
          <h2>Plan ahead, never miss a season</h2>
          <p className="studio-panel-lead">
            Islamic, global, retail and national dates with a {REMINDER_WINDOW_DAYS}-day smart
            reminder. Islamic dates are expected and can shift with moon sighting.
          </p>
        </div>
        <div className="studio-reminder-count">
          <BellRing size={15} aria-hidden="true" />
          {reminders.length > 0
            ? `${reminders.length} reminder${reminders.length > 1 ? "s" : ""} active`
            : `No dates inside ${REMINDER_WINDOW_DAYS} days`}
        </div>
      </div>

      <div className="studio-tabs is-sub">
        {GROUPS.map((item) => (
          <button
            key={item}
            type="button"
            className={group === item ? "is-active" : undefined}
            onClick={() => setGroup(item)}
          >
            {item === "all" ? "All dates" : HOLIDAY_GROUP_LABEL[item]}
          </button>
        ))}
      </div>

      <div className="studio-calendar">
        {visible.map((holiday) => (
          <article
            key={holiday.id}
            className={`studio-holiday${holiday.reminder ? " is-reminder" : ""}`}
          >
            <div className="studio-holiday-date">
              <strong>{new Date(`${holiday.date}T00:00:00`).getDate()}</strong>
              <span>
                {new Date(`${holiday.date}T00:00:00`).toLocaleDateString("en-GB", {
                  month: "short",
                })}
              </span>
            </div>
            <div className="studio-holiday-body">
              <div className="studio-holiday-title">
                <h3>
                  {holiday.emoji} {holiday.name}
                </h3>
                <span className={`studio-tag is-${holiday.group}`}>
                  {HOLIDAY_GROUP_LABEL[holiday.group]}
                </span>
                {holiday.expected ? <span className="studio-tag is-muted">Expected</span> : null}
                {holiday.reminder ? (
                  <span className="studio-tag is-alert">
                    <BellRing size={11} aria-hidden="true" /> Reminder
                  </span>
                ) : null}
              </div>
              <p>{holiday.prompt}</p>
              <p className="studio-holiday-meta">
                <Clock size={12} aria-hidden="true" /> {formatHolidayDate(holiday.date)} ·{" "}
                {countdownLabel(holiday.days)}
              </p>
            </div>
            <button
              type="button"
              className="studio-btn is-primary is-small"
              onClick={() => onGenerate(holiday)}
            >
              <Wand2 size={14} /> Generate campaign
            </button>
          </article>
        ))}
        {visible.length === 0 ? <p className="studio-empty">No dates in this group yet.</p> : null}
      </div>

      <div className="studio-note">
        <Sparkles size={15} aria-hidden="true" />
        <p>
          Generating a holiday campaign loads the greeting, a tailored offer line and all three
          caption formats for <strong>{brand.name}</strong>. The flyer and motion tabs pick up the
          same brief automatically.
        </p>
      </div>
    </section>
  );
}
