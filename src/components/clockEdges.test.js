import { getStatus, formatClock, nowInZone } from "./openStatus";
import { hours, specialClosure } from "./SiteSettings";

const SUN = 0, MON = 1, TUE = 2, WED = 3, THU = 4, FRI = 5, SAT = 6;
const hrs = (clock) => {
  const [h, m, s] = clock.split(":").map(Number);
  return h + m / 60 + s / 3600;
};

describe("the exact moments we flip", () => {
  it("is open on the stroke of opening", () => {
    const s = getStatus({ day: TUE, time: 11 });
    expect(s.isOpen).toBe(true);
    expect(formatClock(s.countdown)).toBe("09:30:00"); // the whole day
  });

  it("is shut on the stroke of closing, and counts to the next day", () => {
    const s = getStatus({ day: TUE, time: 20.5 });
    expect(s.isOpen).toBe(false);
    expect(s.countdownLabel).toBe("Opens in");
    expect(formatClock(s.countdown)).toBe("14:30:00"); // 8:30pm -> 11am Wed
  });

  it("shows one second left at one second to close", () => {
    const s = getStatus({ day: TUE, time: 20.5 - 1 / 3600 });
    expect(s.isOpen).toBe(true);
    expect(formatClock(s.countdown)).toBe("00:00:01");
  });

  it("never shows a negative or NaN clock at any minute of any day", () => {
    for (let day = 0; day < 7; day += 1) {
      for (let min = 0; min < 24 * 60; min += 1) {
        const s = getStatus({ day, time: min / 60 });
        expect(Number.isFinite(s.countdown)).toBe(true);
        expect(s.countdown).toBeGreaterThanOrEqual(0);
        expect(formatClock(s.countdown)).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      }
    }
  });
});

describe("counting across closed days", () => {
  it("bridges Monday from Sunday night", () => {
    // Sunday closes 8pm; next opening is Tuesday 11am
    const s = getStatus({ day: SUN, time: 20 });
    expect(formatClock(s.countdown)).toBe("39:00:00");
    expect(s.target).toBe("Opens Tuesday at 11am");
  });

  it("counts Monday through to Tuesday", () => {
    expect(formatClock(getStatus({ day: MON, time: 0 }).countdown)).toBe("35:00:00");
    expect(formatClock(getStatus({ day: MON, time: 23.5 }).countdown)).toBe("11:30:00");
  });

  it("says tomorrow on Saturday night, not a weekday name", () => {
    const s = getStatus({ day: SAT, time: 21 });
    expect(s.note).toBe("Back tomorrow at 12pm");
    expect(s.target).toBe("Opens tomorrow at 12pm");
  });

  it("counts to today's opening in the small hours", () => {
    const s = getStatus({ day: TUE, time: 2 });
    expect(s.countdownLabel).toBe("Opens in");
    expect(formatClock(s.countdown)).toBe("09:00:00");
    expect(s.target).toBe("Opens today at 11am");
  });

  it("never counts backwards into an opening that already passed", () => {
    // 9pm Tuesday: today's 11am is long gone, so the target is Wednesday
    const s = getStatus({ day: TUE, time: 21 });
    expect(formatClock(s.countdown)).toBe("14:00:00");
    expect(s.target).toBe("Opens tomorrow at 11am");
  });
});

describe("the countdown agrees with the published hours", () => {
  const dayKeys = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

  it("lands exactly on each day's closing time", () => {
    for (let day = 0; day < 7; day += 1) {
      const today = hours[dayKeys[day]];
      if (!today) continue;
      const mid = (today.open + today.close) / 2;
      const s = getStatus({ day, time: mid });
      expect(s.isOpen).toBe(true);
      expect(hrs(formatClock(s.countdown))).toBeCloseTo(today.close - mid, 5);
    }
  });

  it("lands exactly on the next opening time", () => {
    for (let day = 0; day < 7; day += 1) {
      const s = getStatus({ day, time: 23.75 }); // everyone is shut by then
      expect(s.isOpen).toBe(false);
      const landing = (day + Math.ceil(hrs(formatClock(s.countdown)) / 24)) % 7;
      const target = hours[dayKeys[landing]];
      expect(target).not.toBeNull();
      const arrival = (23.75 + hrs(formatClock(s.countdown))) % 24;
      expect(arrival).toBeCloseTo(target.open, 4);
    }
  });
});

describe("special closure", () => {
  it("stops the clock entirely rather than counting to a time we will not open", () => {
    const previous = { ...specialClosure };
    try {
      Object.assign(specialClosure, {
        mode: "scheduled",
        isActive: true,
        closesRestaurant: true,
        headline: "",
        message: "", from: "2026-06-14", to: "2026-06-18", reopenTime: null,
      });
      const s = getStatus({ day: FRI, time: 15, date: "2026-06-15" });
      expect(s.isOpen).toBe(false);
      expect(s.countdown).toBeNull();
      expect(s.target).toMatch(/^Reopens Friday, June/);
    } finally {
      Object.assign(specialClosure, previous);
    }
  });
});

describe("reading the wall clock", () => {
  it("reports Central time, not the visitor's timezone", () => {
    // 2026-07-01T17:30:00Z is 12:30pm in Chicago (CDT)
    const { day, time } = nowInZone(new Date("2026-07-01T17:30:00Z"));
    expect(day).toBe(WED);
    expect(time).toBeCloseTo(12.5, 3);
  });

  it("handles midnight without wrapping to 24", () => {
    // 2026-07-02T05:00:00Z is exactly midnight Thursday in Chicago
    const { day, time } = nowInZone(new Date("2026-07-02T05:00:00Z"));
    expect(day).toBe(THU);
    expect(time).toBe(0);
  });

  it("tracks the standard-time offset too", () => {
    // 2026-12-01T18:30:00Z is 12:30pm in Chicago (CST, UTC-6)
    const { time } = nowInZone(new Date("2026-12-01T18:30:00Z"));
    expect(time).toBeCloseTo(12.5, 3);
  });
});

describe("the footer names the time in context", () => {
  it("says when we close while open", () => {
    expect(getStatus({ day: TUE, time: 15 }).target).toBe("Closes today at 8:30pm");
    expect(getStatus({ day: FRI, time: 15 }).target).toBe("Closes today at 9pm");
  });

  it("distinguishes today, tomorrow and a named day", () => {
    expect(getStatus({ day: TUE, time: 9 }).target).toBe("Opens today at 11am");
    expect(getStatus({ day: TUE, time: 21 }).target).toBe("Opens tomorrow at 11am");
    expect(getStatus({ day: SUN, time: 21 }).target).toBe("Opens Tuesday at 11am");
  });

  it("derives every label from the schedule, never a hardcoded time", () => {
    const keys = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    for (let day = 0; day < 7; day += 1) {
      const s = getStatus({ day, time: 23.5 });
      const landing = keys.findIndex((k, i) => i !== day && hours[k] && s.target.includes(
        new Intl.NumberFormat().format(Math.floor(hours[k].open % 12 || 12))));
      expect(landing).toBeGreaterThan(-1);
      expect(s.target).toMatch(/^Opens (today|tomorrow|Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday) at /);
    }
  });
});
