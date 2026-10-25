import { getStatus } from "./openStatus";

const SUN = 0, MON = 1, TUE = 2, WED = 3, THU = 4, FRI = 5, SAT = 6;
const label = (day, time) => getStatus({ day, time }).target;

describe("what the footer says just after closing", () => {
  it("Friday 10pm -> tomorrow", () => {
    expect(label(FRI, 22)).toBe("Opens tomorrow at 11am");
  });

  it("Saturday 10pm -> tomorrow, with Sunday's later opening", () => {
    expect(label(SAT, 22)).toBe("Opens tomorrow at 12pm");
  });

  it("Sunday 9pm -> names Tuesday, because Monday is closed", () => {
    expect(label(SUN, 21)).toBe("Opens Tuesday at 11am");
  });

  it("Thursday 9pm -> tomorrow", () => {
    expect(label(THU, 21)).toBe("Opens tomorrow at 11am");
  });
});

describe("after midnight, the same opening is 'today'", () => {
  it("Saturday 12:30am -> today", () => {
    expect(label(SAT, 0.5)).toBe("Opens today at 11am");
  });

  it("Sunday 2am -> today", () => {
    expect(label(SUN, 2)).toBe("Opens today at 12pm");
  });

  it("Monday 12:30am -> tomorrow, since Monday never opens", () => {
    expect(label(MON, 0.5)).toBe("Opens tomorrow at 11am");
  });
});

describe("the word matches the calendar day, every hour of the week", () => {
  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  it("uses today / tomorrow / a weekday name and never contradicts itself", () => {
    for (let day = 0; day < 7; day += 1) {
      for (let h = 0; h < 24; h += 1) {
        const s = getStatus({ day, time: h + 0.5 });
        if (s.isOpen) {
          expect(s.target).toMatch(/^Closes today at /);
          continue;
        }
        const m = s.target.match(/^Opens (today|tomorrow|[A-Z][a-z]+) at /);
        expect(m).not.toBeNull();
        const word = m[1];
        // "today" only before that day's own opening; never a name for +1 day
        if (word === "today") expect(s.countdown / 3600).toBeLessThan(24);
        if (word === "tomorrow") expect(DAYS).not.toContain(word);
        if (DAYS.includes(word)) expect(s.countdown / 3600).toBeGreaterThan(24);
      }
    }
  });
});
