import { render, screen } from "@testing-library/react";
import AlertMessage from "./Alert";
import { getStatus, closureFor } from "./openStatus";
import { specialClosure } from "./SiteSettings";

const withClosure = (patch, fn) => {
  const saved = { ...specialClosure };
  Object.assign(specialClosure, patch);
  try { return fn(); } finally { Object.assign(specialClosure, saved); }
};

// The banner checks today against the window on mount, so a scheduled
// notice needs the clock parked inside that window. 2026-06-15 18:00Z is
// the 15th in Chicago.
const onDay = (iso, fn) => {
  jest.useFakeTimers({ doNotFake: ["nextTick", "setTimeout", "queueMicrotask"] });
  jest.setSystemTime(new Date(iso));
  try { return fn(); } finally { jest.useRealTimers(); }
};

const SCHEDULED = { mode: "scheduled", isActive: true, closesRestaurant: true,
  headline: "", message: "", from: "2026-06-14", to: "2026-06-18" };
const MANUAL = { mode: "manual", isActive: true, closesRestaurant: true,
  headline: "", message: "" };

test("stays out of the way when nothing is active", () => {
  const { container } = withClosure({ isActive: false }, () => render(<AlertMessage />));
  expect(container).toBeEmptyDOMElement();
});

// ── manual mode ──────────────────────────────────────────────
// The switch has to work on its own. These run on a day years outside
// the saved June dates, which is exactly the case that used to fail.

test("a manual notice shows immediately, whatever the saved dates say", () => {
  withClosure(
    { ...MANUAL, headline: "Closed today — burst pipe", message: "Back tomorrow at 11am." },
    () => onDay("2027-03-02T18:00:00Z", () => {
      render(<AlertMessage />);
      expect(screen.getByText("Closed today — burst pipe")).toBeInTheDocument();
      expect(screen.getByText("Back tomorrow at 11am.")).toBeInTheDocument();
    })
  );
});

test("a manual notice needs no second line", () => {
  withClosure({ ...MANUAL, headline: "Closed today" }, () => onDay("2027-03-02T18:00:00Z", () => {
    const { container } = render(<AlertMessage />);
    expect(screen.getByText("Closed today")).toBeInTheDocument();
    expect(container.querySelector(".notice-reopening")).toBeNull();
  }));
});

test("manual wording survives ordinary punctuation untouched", () => {
  const headline = 'Closed Sat. 11/28 — "Turkey Trot" 5K; we reopen Sun. at noon (sorry!)';
  withClosure({ ...MANUAL, headline }, () => onDay("2027-03-02T18:00:00Z", () => {
    render(<AlertMessage />);
    // rendered as text, so punctuation is neither escaped nor interpreted
    expect(screen.getByText(headline)).toBeInTheDocument();
  }));
});

test("an empty manual headline shows nothing rather than an empty bar", () => {
  withClosure({ ...MANUAL, headline: "   " }, () => {
    expect(closureFor("2027-03-02").active).toBe(false);
  });
});

test("an announcement leaves today's hours alone", () => {
  withClosure(
    { ...MANUAL, closesRestaurant: false,
      headline: "Closed next Monday for a private event",
      message: "Open as usual the rest of the week." },
    () => {
      const c = closureFor("2026-06-19");
      expect(c.active).toBe(true);   // the banner shows
      expect(c.closes).toBe(false);  // but we are not shut
      // Friday 3pm, normal hours, still counting down to close
      const status = getStatus({ day: 5, time: 15, date: "2026-06-19" });
      expect(status.isOpen).toBe(true);
      expect(status.countdownLabel).toBe("Closing in");
      expect(status.target).toMatch(/Closes today at 9pm/);
    }
  );
});

test("a manual closure overrides the status and shares its wording", () => {
  withClosure(
    { ...MANUAL, headline: "Closed today — burst pipe", message: "Back tomorrow at 11am." },
    () => {
      const status = getStatus({ day: 5, time: 15, date: "2026-06-19" });
      expect(status.isOpen).toBe(false);
      expect(status.countdown).toBeNull();
      expect(status.target).toBe("Back tomorrow at 11am.");
    }
  );
});

test("a manual closure with no return date says only what is true", () => {
  withClosure({ ...MANUAL, headline: "Closed today" }, () => {
    const status = getStatus({ day: 5, time: 15, date: "2026-06-19" });
    expect(status.isOpen).toBe(false);
    expect(status.target).toBe("Closed until further notice");
    // nothing invented about when we are back
    expect(status.target).not.toMatch(/\d/);
  });
});

// ── scheduled mode ───────────────────────────────────────────

test("writes the range and the reopening from the dates", () => {
  withClosure({ ...SCHEDULED, reopenTime: 11 }, () => onDay("2026-06-15T18:00:00Z", () => {
    render(<AlertMessage />);
    expect(screen.getByText(/Closed June\s*14–18/)).toBeInTheDocument();
    expect(screen.getByText(/Reopening Friday, June\s*19 at 11am/)).toBeInTheDocument();
    expect(screen.getByText(/closure notice/i)).toBeInTheDocument();
  }));
});

test("shows only the date when the reopening time is not confirmed", () => {
  withClosure({ ...SCHEDULED, reopenTime: null }, () => onDay("2026-06-15T18:00:00Z", () => {
    render(<AlertMessage />);
    expect(screen.getByText(/Reopening Friday, June\s*19$/)).toBeInTheDocument();
    expect(screen.queryByText(/ at 11am/)).toBeNull();
  }));
});

test("handles a single day and a range that crosses a month", () => {
  withClosure({ ...SCHEDULED, from: "2026-07-04", to: "2026-07-04" }, () => {
    expect(closureFor().closedRange).toMatch(/^Closed July\s*4$/);
  });
  withClosure({ ...SCHEDULED, from: "2026-06-29", to: "2026-07-02" }, () => {
    expect(closureFor().closedRange).toMatch(/^Closed June\s*29 – July\s*2$/);
    expect(closureFor().reopening).toMatch(/Reopening Friday, July\s*3/);
  });
});

test("custom wording replaces the sentences but not the schedule", () => {
  withClosure(
    { ...SCHEDULED, headline: "Closed for the Smith family reunion", message: "See you Friday!" },
    () => onDay("2026-06-15T18:00:00Z", () => {
      render(<AlertMessage />);
      expect(screen.getByText("Closed for the Smith family reunion")).toBeInTheDocument();
      expect(screen.getByText("See you Friday!")).toBeInTheDocument();
      // the generated wording is gone from the page
      expect(screen.queryByText(/Closed June/)).toBeNull();
      // but the dates still drive when it runs, and the scoreboard agrees
      expect(closureFor("2026-06-13").active).toBe(false);
      expect(closureFor("2026-06-19").active).toBe(false);
      expect(getStatus({ day: 1, time: 15, date: "2026-06-15" }).target).toBe("See you Friday!");
    })
  );
});

test("a custom headline alone still gets the dates written underneath", () => {
  withClosure({ ...SCHEDULED, headline: "Closed for vacation", reopenTime: 11 }, () => {
    expect(closureFor("2026-06-15").closedRange).toBe("Closed for vacation");
    expect(closureFor("2026-06-15").reopening).toMatch(/Reopening Friday, June\s*19 at 11am/);
  });
});

test("dates in the wording are never read back as a schedule", () => {
  // the text says December; the dates say June, and the dates win
  withClosure({ ...SCHEDULED, headline: "Closed December 24 – 26" }, () => {
    expect(closureFor("2026-12-25").active).toBe(false);
    expect(closureFor("2026-06-15").active).toBe(true);
  });
});

test("an active closure overrides the normal hours", () => {
  withClosure({ ...SCHEDULED, reopenTime: 11 }, () => {
    // Friday 3pm is squarely inside normal hours
    const status = getStatus({ day: 5, time: 15, date: "2026-06-15" });
    expect(status.isOpen).toBe(false);
    expect(status.countdown).toBeNull();
    // the scoreboard repeats the banner, from the same dates
    expect(status.target).toMatch(/Reopens Friday, June\s*19 at 11am/);
  });
});

test("takes itself down once the window has passed", () => {
  withClosure({ ...SCHEDULED, reopenTime: 11 }, () => onDay("2026-06-20T18:00:00Z", () => {
    const { container } = render(<AlertMessage />);
    expect(container).toBeEmptyDOMElement();
  }));
});

test("stops once the window has passed, and the hours take over again", () => {
  withClosure({ ...SCHEDULED, reopenTime: 11 }, () => {
    expect(closureFor("2026-06-19").active).toBe(false);
    expect(closureFor("2026-06-19").finished).toBe(true);
    const back = getStatus({ day: 5, time: 15, date: "2026-06-19" });
    expect(back.isOpen).toBe(true);
    expect(back.countdownLabel).toBe("Closing in");
  });
});

test("is not yet showing before the window starts", () => {
  withClosure({ ...SCHEDULED, reopenTime: 11 }, () => {
    expect(closureFor("2026-06-13").active).toBe(false);
    expect(getStatus({ day: 6, time: 15, date: "2026-06-13" }).isOpen).toBe(true);
  });
});

test("the window is judged by the restaurant's day, not the viewer's", () => {
  // 2026-06-19 04:30Z is still the 18th — the last closed day — in Chicago
  withClosure({ ...SCHEDULED, reopenTime: 11 }, () => onDay("2026-06-19T04:30:00Z", () => {
    render(<AlertMessage />);
    expect(screen.getByText(/Closed June\s*14–18/)).toBeInTheDocument();
  }));
});

// ── the preview switch ───────────────────────────────────────

test("?preview-notice reveals a scheduled notice outside its dates", () => {
  window.history.replaceState({}, "", "?preview-notice");
  try {
    withClosure({ ...SCHEDULED, reopenTime: 11 }, () => {
      // a date years past the window
      expect(closureFor("2027-03-02").active).toBe(true);
      expect(closureFor("2027-03-02").closedRange).toMatch(/Closed June\s*14–18/);
    });
  } finally {
    window.history.replaceState({}, "", "/");
  }
});

test("the preview flag does nothing in a production build", () => {
  const saved = process.env.NODE_ENV;
  window.history.replaceState({}, "", "?preview-notice");
  process.env.NODE_ENV = "production";
  try {
    withClosure({ ...SCHEDULED, reopenTime: 11 }, () => {
      expect(closureFor("2027-03-02").active).toBe(false);
    });
  } finally {
    process.env.NODE_ENV = saved;
    window.history.replaceState({}, "", "/");
  }
});

test("preview never turns the live notice on by itself", () => {
  // the shipped config, previewed: still nothing, because isActive is off
  window.history.replaceState({}, "", "?preview-notice");
  try {
    expect(specialClosure.isActive).toBe(false);
    expect(closureFor("2026-06-15").active).toBe(false);
  } finally {
    window.history.replaceState({}, "", "/");
  }
});

test("a paragraph stays in the banner instead of filling the scoreboard", () => {
  const long =
    "Orders placed on DoorDash will not come through until we reopen " +
    "Saturday at 11am. Thank you all for a great year!";
  withClosure({ ...MANUAL, headline: "Closed Thursday & Friday", message: long }, () => {
    // the banner says all of it
    expect(closureFor("2026-06-19").reopening).toBe(long);
    // the one-line strip does not
    expect(getStatus({ day: 5, time: 15, date: "2026-06-19" }).target)
      .toBe("Closed until further notice");
  });
  withClosure({ ...MANUAL, headline: "Closed today", message: "Back tomorrow at 11am." }, () => {
    // short wording is still shared, as before
    expect(getStatus({ day: 5, time: 15, date: "2026-06-19" }).target)
      .toBe("Back tomorrow at 11am.");
  });
});
