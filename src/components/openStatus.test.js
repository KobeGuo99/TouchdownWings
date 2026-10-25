import { getStatus, weekRows, formatTime, rangeText, formatClock } from "./openStatus";
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
  it("counts down to closing, not to an ordering allowance", () => {
    // wording that frames the window as time you may still order invites
    // orders at the buzzer; this counts the restaurant down to closing
    const midday = getStatus({ day: DAY.TUE, time: 15 });
    expect(midday.countdownLabel).toBe("Closing in");
    expect(formatClock(midday.countdown)).toBe("05:30:00"); // 3pm to 8:30pm
    expect(midday.target).toBe("Closes today at 8:30pm");
    expect(midday.note).toBe("We close at 8:30pm");
  });

  it("never invites a late order in its wording", () => {
    const phrases = [
      getStatus({ day: DAY.TUE, time: 15 }),
      getStatus({ day: DAY.TUE, time: 20.166 }),
      getStatus({ day: DAY.MON, time: 12 }),
    ].flatMap((s) => [s.countdownLabel, s.target, s.note, s.short]);
    for (const text of phrases) {
      expect(text.toLowerCase()).not.toMatch(/order|last call|kitchen/);
    }
  });

  it("counts down to opening when shut", () => {
    const beforeOpen = getStatus({ day: DAY.TUE, time: 10 });
    expect(beforeOpen.countdownLabel).toBe("Opens in");
    expect(formatClock(beforeOpen.countdown)).toBe("01:00:00");
    expect(beforeOpen.note).toBe("Back today at 11am");
    expect(beforeOpen.target).toBe("Opens today at 11am");
  });

  it("always gives the board something to count toward", () => {
    // a dark clock reads as broken, so even Monday counts down to Tuesday
    const monday = getStatus({ day: DAY.MON, time: 12 });
    expect(monday.countdown).toBeGreaterThan(0);
    expect(monday.countdownLabel).toBe("Opens in");
    expect(formatClock(monday.countdown)).toBe("23:00:00");
  });

  it("formats the clock as three padded pairs", () => {
    expect(formatClock(0)).toBe("00:00:00");
    expect(formatClock(59)).toBe("00:00:59");
    expect(formatClock(3600)).toBe("01:00:00");
    expect(formatClock(9892)).toBe("02:44:52");
    expect(formatClock(-5)).toBe("00:00:00");
  });

  it("still counts toward the next opening on a closed day", () => {
    const monday = getStatus({ day: DAY.MON, time: 12 });
    expect(monday.note).toBe("Back tomorrow at 11am");
    expect(monday.target).toBe("Opens tomorrow at 11am");
  });

  it("points at the next opening when shut", () => {
    expect(getStatus({ day: DAY.MON, time: 12 }).note).toBe("Back tomorrow at 11am");
    expect(getStatus({ day: DAY.TUE, time: 8 }).note).toBe("Back today at 11am");
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
