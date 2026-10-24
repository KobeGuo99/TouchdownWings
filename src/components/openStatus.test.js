import { getStatus, weekRows, formatTime, rangeText } from "./openStatus";
import { hours } from "./SiteSettings";

// Day indexes: 0 Sun, 1 Mon, 2 Tue ... 6 Sat
const DAY = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };

describe("formatTime", () => {
  it("renders whole and half hours the way the menu reads", () => {
    expect(formatTime(11)).toBe("11am");
    expect(formatTime(12)).toBe("12pm");
    expect(formatTime(20)).toBe("8pm");
    expect(formatTime(20.5)).toBe("8:30pm");
    expect(formatTime(21)).toBe("9pm");
  });
});

describe("open/closed boundaries", () => {
  // The original bug was the displayed hours and this logic drifting apart,
  // so every published day is checked against its own open/close time.
  const cases = [
    [DAY.SUN, hours.sunday],
    [DAY.TUE, hours.tuesday],
    [DAY.WED, hours.wednesday],
    [DAY.THU, hours.thursday],
    [DAY.FRI, hours.friday],
    [DAY.SAT, hours.saturday],
  ];

  it.each(cases)("day %i is shut before opening", (day, h) => {
    expect(getStatus({ day, time: h.open - 0.25 }).isOpen).toBe(false);
  });

  it.each(cases)("day %i is open at opening time", (day, h) => {
    expect(getStatus({ day, time: h.open }).isOpen).toBe(true);
  });

  it.each(cases)("day %i is still open just before close", (day, h) => {
    expect(getStatus({ day, time: h.close - 0.25 }).isOpen).toBe(true);
  });

  it.each(cases)("day %i is shut exactly at close", (day, h) => {
    expect(getStatus({ day, time: h.close }).isOpen).toBe(false);
  });

  it("is shut all day Monday", () => {
    [9, 13, 19, 23].forEach((time) => {
      expect(getStatus({ day: DAY.MON, time }).isOpen).toBe(false);
    });
  });
});

describe("what the scoreboard says", () => {
  it("names the closing time while open", () => {
    expect(getStatus({ day: DAY.TUE, time: 15 }).headline).toBe("Open until 8:30pm");
  });

  it("warns in the last hour instead of repeating today's hours", () => {
    const soon = getStatus({ day: DAY.TUE, time: 20.166 });
    expect(soon.note).toMatch(/Last call/);
    const midday = getStatus({ day: DAY.TUE, time: 15 });
    expect(midday.note).toBe("");
  });

  it("points at the next opening when shut", () => {
    expect(getStatus({ day: DAY.MON, time: 12 }).note).toBe("Back tomorrow at 11am");
    expect(getStatus({ day: DAY.TUE, time: 9 }).note).toBe("Back today at 11am");
    expect(getStatus({ day: DAY.SUN, time: 22 }).note).toBe("Back Tuesday at 11am");
  });
});

describe("weekRows", () => {
  it("collapses runs of identical days", () => {
    expect(weekRows(DAY.FRI).map((r) => `${r.label} ${r.text}`)).toEqual([
      "Monday Closed",
      "Tue – Thu 11am – 8:30pm",
      "Fri – Sat 11am – 9pm",
      "Sunday 12pm – 8pm",
    ]);
  });

  it("marks the row containing today", () => {
    const rows = weekRows(DAY.WED);
    expect(rows.filter((r) => r.isToday).map((r) => r.label)).toEqual(["Tue – Thu"]);
  });

  it("agrees with rangeText for every day", () => {
    for (let day = 0; day < 7; day += 1) {
      const row = weekRows(day).find((r) => r.isToday);
      expect(row.text).toBe(rangeText(day));
    }
  });
});
