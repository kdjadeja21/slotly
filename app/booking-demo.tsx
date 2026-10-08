"use client";

import { useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const SAMPLE_SLOTS = [
  ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"],
  ["9:30 AM", "11:00 AM", "2:00 PM", "4:30 PM"],
  ["10:00 AM", "12:00 PM", "2:30 PM"],
] as const;

type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

function weekdayIndex(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function shiftMonth(year: number, month: number, delta: number) {
  const next = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1 };
}

function compareDates(left: CalendarDate, right: CalendarDate) {
  if (left.year !== right.year) {
    return left.year - right.year;
  }
  if (left.month !== right.month) {
    return left.month - right.month;
  }
  return left.day - right.day;
}

function sampleSlots(date: CalendarDate) {
  const weekday = weekdayIndex(date.year, date.month, date.day);
  if (weekday === 0 || weekday === 6) {
    return [];
  }
  return SAMPLE_SLOTS[date.day % SAMPLE_SLOTS.length];
}

function formatDate(date: CalendarDate) {
  const weekday = WEEKDAYS[weekdayIndex(date.year, date.month, date.day)];
  return `${weekday}, ${MONTHS[date.month - 1]} ${date.day}`;
}

function Chevron({ direction }: { direction: "previous" | "next" }) {
  const path =
    direction === "previous"
      ? "M12.5 4.5 7 10l5.5 5.5"
      : "M7.5 4.5 13 10l-5.5 5.5";

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BookingDemo({ year, month, day }: CalendarDate) {
  const today = { year, month, day };
  const [visible, setVisible] = useState({ year, month });
  const [selected, setSelected] = useState<CalendarDate>(today);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const monthLabel = `${MONTHS[visible.month - 1]} ${visible.year}`;
  const leadingBlanks = weekdayIndex(visible.year, visible.month, 1);
  const dayCount = daysInMonth(visible.year, visible.month);
  const slots = sampleSlots(selected);
  const selectedLabel = formatDate(selected);
  const selectedIsVisible =
    visible.year === selected.year && visible.month === selected.month;
  const previousMonthDisabled =
    visible.year < today.year ||
    (visible.year === today.year && visible.month <= today.month);
  const status = selectedTime
    ? `${selectedTime} selected. Nothing is saved.`
    : slots.length === 0
      ? "No sample times on this day."
      : "Select a sample time.";

  return (
    <section
      aria-label="Demo calendar"
      className="rounded-2xl bg-surface text-foreground shadow-[0_18px_40px_-24px_rgb(27_32_51/0.45)] ring-1 ring-line"
    >
      <div className="flex flex-col md:flex-row">
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-semibold tracking-tight">{monthLabel}</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-background disabled:cursor-not-allowed disabled:text-muted/45 disabled:hover:bg-transparent"
                aria-label="Previous month"
                disabled={previousMonthDisabled}
                onClick={() =>
                  setVisible((current) => shiftMonth(current.year, current.month, -1))
                }
              >
                <Chevron direction="previous" />
              </button>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-background"
                aria-label="Next month"
                onClick={() =>
                  setVisible((current) => shiftMonth(current.year, current.month, 1))
                }
              >
                <Chevron direction="next" />
              </button>
            </div>
          </div>

          <div
            className="mt-3 grid grid-cols-7 text-center text-xs font-medium text-muted"
            aria-hidden="true"
          >
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className="flex h-8 items-center justify-center">
                {weekday}
              </div>
            ))}
          </div>

          <div
            role="group"
            aria-label={monthLabel}
            className="grid grid-cols-7 justify-items-center"
          >
            {Array.from({ length: leadingBlanks }, (_, index) => (
              <div key={`blank-${index}`} className="size-11" />
            ))}
            {Array.from({ length: dayCount }, (_, index) => {
              const date = {
                year: visible.year,
                month: visible.month,
                day: index + 1,
              };
              const isSelected = compareDates(date, selected) === 0;
              const isToday = compareDates(date, today) === 0;
              const isPast = compareDates(date, today) < 0;
              const label = formatDate(date);

              return (
                <button
                  key={date.day}
                  type="button"
                  disabled={isPast}
                  aria-pressed={isSelected}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={label}
                  onClick={() => {
                    setSelected(date);
                    setSelectedTime(null);
                  }}
                  className={`demo-day inline-flex size-11 items-center justify-center rounded-full text-sm font-medium tabular-nums ${
                    isSelected
                      ? "bg-accent text-on-accent"
                      : isToday
                        ? "text-accent ring-1 ring-accent ring-inset hover:bg-background"
                        : "text-foreground hover:bg-background"
                  } disabled:cursor-not-allowed disabled:text-muted/45 disabled:hover:bg-transparent`}
                >
                  {date.day}
                </button>
              );
            })}
          </div>
          {selectedIsVisible ? null : (
            <button
              type="button"
              className="mt-2 text-sm font-semibold text-accent hover:text-accent-strong"
              onClick={() =>
                setVisible({ year: selected.year, month: selected.month })
              }
            >
              Show {selectedLabel}
            </button>
          )}
        </div>

        <div className="border-t border-line p-4 sm:p-5 md:w-56 md:border-t-0 md:border-l">
          <p className="text-base font-semibold tracking-tight">{selectedLabel}</p>
          <p className="mt-1 text-sm leading-snug text-muted">
            Demo only. Choosing a time does not book it.
          </p>
          {slots.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <li key={slot}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() =>
                        setSelectedTime((current) => (current === slot ? null : slot))
                      }
                      className={`demo-slot flex h-11 w-full items-center justify-center rounded-lg border text-sm font-semibold tabular-nums ${
                        isSelected
                          ? "border-accent bg-accent text-on-accent"
                          : "border-line bg-surface text-foreground hover:border-accent hover:text-accent"
                      }`}
                    >
                      {slot}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
          <p
            className={`mt-4 text-sm leading-snug ${
              selectedTime ? "font-semibold text-foreground" : "text-muted"
            }`}
            aria-live="polite"
          >
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
