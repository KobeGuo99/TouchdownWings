import { useEffect, useState } from "react";
import { hours, specialClosure, restaurant } from "./SiteSettings";

const DAY_KEYS = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
];
const DAY_LABELS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export const hoursForDay = (dayIndex) => hours[DAY_KEYS[dayIndex]] || null;

// 20.5 -> "8:30pm", 11 -> "11am"
export function formatTime(value) {
  const h = Math.floor(value);
  const m = Math.round((value - h) * 60);
  const suffix = h >= 12 ? "pm" : "am";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour12}:${String(m).padStart(2, "0")}${suffix}` : `${hour12}${suffix}`;
}

export const rangeText = (dayIndex) => {
  const d = hoursForDay(dayIndex);
  return d ? `${formatTime(d.open)} – ${formatTime(d.close)}` : "Closed";
};

// Read the real clock in the restaurant's timezone. Intl is used rather than
// re-parsing a locale string, which is engine-dependent.
export function nowInZone(date = new Date(), timeZone = restaurant.timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, weekday: "short", hour: "numeric", minute: "numeric", hour12: false,
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get("weekday")];
  let hour = parseInt(get("hour"), 10);
  if (hour === 24) hour = 0; // some engines report midnight as 24
  return { day, time: hour + parseInt(get("minute"), 10) / 60 };
}

export function getStatus({ day, time }) {
  if (specialClosure.isActive) {
    return { isOpen: false, short: "Closed", headline: "Closed today", note: "", progress: 0 };
  }

  const today = hoursForDay(day);
  if (today && time >= today.open && time < today.close) {
    const left = today.close - time;
    return {
      isOpen: true,
      short: left <= 1 ? `Closing ${formatTime(today.close)}` : `Open till ${formatTime(today.close)}`,
      headline: `Open until ${formatTime(today.close)}`,
      // today's span is already in the hours list with today highlighted,
      // so only speak up when there is something new to say
      note: left <= 1 ? `Last call in about ${Math.round(left * 60)} minutes` : "",
      progress: ((time - today.open) / (today.close - today.open)) * 100,
    };
  }

  // find the next day we open (today counts if we simply have not opened yet)
  let d = day;
  let added = 0;
  if (!(today && time < today.open)) {
    do {
      d = (d + 1) % 7;
      added += 1;
    } while (!hoursForDay(d) && added < 8);
  }
  const next = hoursForDay(d);
  const when = added === 0 ? "today" : added === 1 ? "tomorrow" : DAY_LABELS[d];
  return {
    isOpen: false,
    short: "Closed",
    headline: "Closed",
    note: next ? `Back ${when} at ${formatTime(next.open)}` : "",
    progress: 0,
  };
}

// Mon, Tue–Thu, Fri–Sat, Sun — consecutive days with identical hours collapse
export function weekRows(todayIndex) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups = [];
  for (const d of order) {
    const text = rangeText(d);
    const last = groups[groups.length - 1];
    if (last && last.text === text) last.days.push(d);
    else groups.push({ text, days: [d] });
  }
  return groups.map((g) => ({
    key: g.days.join("-"),
    label:
      g.days.length === 1
        ? DAY_LABELS[g.days[0]]
        : `${DAY_LABELS[g.days[0]].slice(0, 3)} – ${DAY_LABELS[g.days[g.days.length - 1]].slice(0, 3)}`,
    text: g.text,
    closed: g.text === "Closed",
    isToday: g.days.includes(todayIndex),
  }));
}

// Deliberately computed only in the browser. The prerendered HTML is built
// once at deploy time, so baking "Open until 9pm" into it would show stale —
// and sometimes flatly wrong — information until React took over. Everything
// that does not depend on the current moment (the week's hours, the menu,
// the contact details) still prerenders.
export function useOpenStatus() {
  const [clock, setClock] = useState(null);

  useEffect(() => {
    setClock(nowInZone());
    const id = setInterval(() => setClock(nowInZone()), 60000);
    return () => clearInterval(id);
  }, []);

  if (!clock) {
    return {
      ready: false, isOpen: false, short: "", headline: "", note: "",
      progress: 0, day: -1,
    };
  }
  return { ready: true, ...getStatus(clock), day: clock.day };
}
