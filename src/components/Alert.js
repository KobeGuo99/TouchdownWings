import React, { useEffect, useState } from "react";
import { closureFor, nowInZone } from "./openStatus";
import "./Alert.css";

// Hard-edged outline rather than a filled glyph, so it matches the 2px
// borders used everywhere else on the page.
const NoticeMark = () => (
  <svg className="notice-mark" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 3 22.6 21.2H1.4z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path d="M11 9.6h2v5.6h-2zM11 16.9h2v2.1h-2z" fill="currentColor" />
  </svg>
);

// A full-bleed band, not a card. The top bar and footer are bands too, so
// this reads as the site speaking rather than as another block of content.
function AlertMessage() {
  // First render ignores the date so the markup matches what was
  // prerendered; the browser then checks today against the window and
  // drops the banner once a scheduled closure has passed. A manual
  // notice does not consult the date at all, so it shows straight away.
  const [today, setToday] = useState(null);
  useEffect(() => setToday(nowInZone().date), []);

  const closure = closureFor(today);
  if (!closure.active) return null;

  return (
    <section className="notice-bar" aria-live="polite">
      <div className="wrap notice-inner">
        <p className="notice-label">
          <NoticeMark />
          <span className="sign">Closure notice</span>
        </p>
        <p className="notice-message">{closure.closedRange}</p>
        {/* the second line is optional — a one-line notice keeps its
            headline as the single, strongest statement */}
        {closure.reopening ? (
          <p className="notice-reopening">{closure.reopening}</p>
        ) : null}
      </div>
    </section>
  );
}

export default AlertMessage;
