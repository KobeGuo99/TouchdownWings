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
    timeZone, weekday: "short",
    year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric", hour12: false,
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get("weekday")];
  let hour = parseInt(get("hour"), 10);
  if (hour === 24) hour = 0; // some engines report midnight as 24
  const minute = parseInt(get("minute"), 10);
  const second = parseInt(get("second"), 10);
  const iso = `${get("year")}-${get("month").padStart(2, "0")}-${get("day").padStart(2, "0")}`;
  return { day, date: iso, time: hour + minute / 60 + second / 3600 };
}

// 9892 -> "02:44:52". Always three pairs so the digits never reflow and the
// unlit segments behind them stay aligned.
export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

// Hours from "now" until a given day-of-week + opening hour, wrapping weeks.
function hoursUntil(fromDay, fromTime, toDay, toTime) {
  let dayGap = (toDay - fromDay + 7) % 7;
  let diff = dayGap * 24 + toTime - fromTime;
  if (diff < 0) diff += 7 * 24;
  return diff;
}

const MONTHS = ["January","February","March","April","May","June","July",
  "August","September","October","November","December"];

// parsed as plain calendar numbers, never through UTC, so a date cannot
// slide a day either side depending on where the visitor is
const parseDay = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  return new Date(y, m - 1, d);
};
const isoOf = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// a month and its day should not be split across a line break
const dayLabel = (d) => `${MONTHS[d.getMonth()]}\u00a0${d.getDate()}`;

// Lets a scheduled notice be checked outside its dates while developing.
// Two separate guards: the build strips this to `false` in production, and
// even in a dev build it needs the flag in the address. A visitor to the
// live site cannot turn a notice on.
function previewing() {
  return (
    process.env.NODE_ENV !== "production" &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("preview-notice")
  );
}

// Everything the banner and the scoreboard say about a closure comes from
// here, so the two cannot drift apart. Returns:
//   active  — show the banner
//   closes  — and treat the restaurant as shut
// Those are deliberately separate: a notice can announce next week's
// closure while today's hours run normally.
export function closureFor(todayISO) {
  const { mode, isActive, closesRestaurant,
          headline, message, from, to, reopenTime } = specialClosure;

  if (!isActive) return { active: false, closes: false };

  const ownHeadline = (headline || "").trim();
  const ownMessage = (message || "").trim();
  // only an explicit false opts out, so an older config without the field
  // keeps behaving the way it always did
  const closes = closesRestaurant !== false;
  // The scoreboard is a one-line status strip, not a second notice board.
  // Short wording is shared with it; a paragraph stays in the banner, where
  // there is room to read it, and the strip keeps a plain closed state.
  const forBoard = ownMessage.length <= 60 ? ownMessage : "";

  // MANUAL — on means on. No dates are consulted, so stale example dates
  // can never stop the switch from working.
  if (mode !== "scheduled") {
    // nothing to say means nothing to show, rather than an empty gold bar
    if (!ownHeadline) return { active: false, closes: false };
    return {
      active: true,
      closes,
      closedRange: ownHeadline,
      reopening: ownMessage,
      // the scoreboard shares the wording; with none given, getStatus
      // falls back to a plain closed state rather than inventing a return
      reopensShort: forBoard,
    };
  }

  // SCHEDULED — the dates decide when it appears and when it stops.
  if (!from || !to) return { active: false, closes: false };
  // ISO dates compare correctly as plain strings
  const outside = todayISO && (todayISO < from || todayISO > to);
  if (outside && !previewing()) {
    return { active: false, closes: false, finished: todayISO > to };
  }

  const start = parseDay(from);
  const end = parseDay(to);
  const back = new Date(end);
  back.setDate(back.getDate() + 1);

  let range;
  if (from === to) range = dayLabel(start);
  else if (start.getMonth() === end.getMonth())
    range = `${dayLabel(start)}–${end.getDate()}`;
  else range = `${dayLabel(start)} – ${dayLabel(end)}`;

  const weekday = back.toLocaleDateString("en-US", { weekday: "long" });
  const backDate = `${weekday}, ${dayLabel(back)}`;
  // no invented opening time: without one, the date stands alone
  const at = typeof reopenTime === "number" ? ` at ${formatTime(reopenTime)}` : "";
  const reopening = `Reopening ${backDate}${at}`;

  // Custom wording replaces the generated sentence but never the dates —
  // the text is only ever displayed, never read back for scheduling.
  return {
    active: true,
    closes,
    reopensISO: isoOf(back),
    closedRange: ownHeadline || `Closed ${range}`,
    reopening: ownMessage || reopening,
    reopensShort: forBoard || `Reopens ${backDate}${at}`,
  };
}

export function getStatus({ day, time, date }) {
  // A notice on its own changes nothing; only closesRestaurant does.
  const closure = closureFor(date);
  if (closure.active && closure.closes) {
    return {
      isOpen: false,
      short: "Closed",
      note: closure.reopening,
      countdown: null,
      countdownLabel: "",
      // the same sentence the banner shows. With no return given, say the
      // one thing that is certainly true rather than guessing a date.
      target: closure.reopensShort || "Closed until further notice",
    };
  }

  const today = hoursForDay(day);
  if (today && time >= today.open && time < today.close) {
    const left = today.close - time;
    return {
      isOpen: true,
      short: left <= 1 ? `Closing ${formatTime(today.close)}` : `Open till ${formatTime(today.close)}`,
      note: `We close at ${formatTime(today.close)}`,
      countdown: left * 3600,
      // Counts down to closing, not to some ordering deadline. Framing it as
      // time you are entitled to order invites orders at the buzzer; a clock
      // visibly running out does the opposite without having to say so.
      countdownLabel: "Closing in",
      target: `Closes today at ${formatTime(today.close)}`,
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

  if (!next) {
    return {
      isOpen: false, short: "Closed", note: "",
      countdown: null, countdownLabel: "", target: "",
    };
  }

  const when = added === 0 ? "today" : added === 1 ? "tomorrow" : DAY_LABELS[d];
  return {
    isOpen: false,
    short: "Closed",
    note: `Back ${when} at ${formatTime(next.open)}`,
    // always something to count toward — a dark clock reads as broken
    countdown: hoursUntil(day, time, d, next.open) * 3600,
    countdownLabel: "Opens in",
    // "today" / "tomorrow" / the weekday name, straight from the schedule
    target: `Opens ${when} at ${formatTime(next.open)}`,
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
export function useOpenStatus(tickMs = 60000) {
  const [clock, setClock] = useState(null);

  useEffect(() => {
    const read = () => setClock(nowInZone());
    read();
    let id = setInterval(read, tickMs);
    // a clock the viewer cannot see does not need to tick
    const onVisibility = () => {
      clearInterval(id);
      if (!document.hidden) {
        read();
        id = setInterval(read, tickMs);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [tickMs]);

  if (!clock) {
    return {
      ready: false, isOpen: false, short: "", note: "",
      countdown: null, countdownLabel: "", target: "", day: -1,
    };
  }
  return { ready: true, ...getStatus(clock), day: clock.day };
}
