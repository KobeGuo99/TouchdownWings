import React from "react";
// trimmed copy of tdw_logo.png — the original has ~20% transparent
// padding baked in, which pushed the mark out of alignment
import logo from "../assets/tdw_logo_mark.png";
import { restaurant } from "./SiteSettings";
import DoorDashLink from "./DoorDashLink";
import DirectionsLink from "./DirectionsLink";
import { useOpenStatus, weekRows, formatClock } from "./openStatus";
import "./HoursContact.css";

// Printed masthead: wordmark, the scoreboard, and the three things a
// takeout customer came for — phone, address, and the full week of hours.
function HoursContact() {
  // the board shows seconds, so it reads the clock every second
  const status = useOpenStatus(1000);
  const week = weekRows(status.day);

  return (
    <section className="mast">
      <div className="wrap">
        <div className="mast-top">
          <div>
            {/* Horizontal lockup: emblem left of the wordmark, the standard
                arrangement for a site header. alt is empty on purpose — the
                wordmark beside it already says the name, so a screen reader
                would otherwise announce it twice. */}
            <h1 className="mast-mark">
              <img src={logo} alt="" />
              <span className="mast-name">
                <span className="mast-word">
                  Touchdown <b>Wings</b>
                </span>
                {/* a city line, the way a team carries its town. "Touchdown
                    Wings" is not a unique name, so the heading itself has to
                    say which one this is. */}
                <span className="mast-city">Tullahoma, Tennessee</span>
              </span>
            </h1>
          </div>

          <div className={`board ${status.isOpen ? "is-open" : "is-shut"}`}>
            <div className="board-bar">
              <span className="sign board-k">The Clock</span>
              <span className="board-lamp">
                <i />
                {status.ready ? (status.isOpen ? "Open" : "Closed") : "\u2014"}
              </span>
            </div>

            <div className="board-face">
              <span className="sign board-caption">
                {status.ready ? status.countdownLabel || "Status" : "Status"}
              </span>

              <span className="board-readout">
              {status.ready && status.countdown != null ? (
                // aria-hidden: a clock announced every second is unusable with
                // a screen reader. The sentence underneath carries the meaning.
                <span className="board-clock" aria-hidden="true">
                  <span className="seg-off">88:88:88</span>
                  <span className="seg-on">{formatClock(status.countdown)}</span>
                </span>
              ) : (
                <span className="board-clock is-text" aria-hidden="true">
                  <span className="seg-on">{status.ready ? "Closed" : "\u2014"}</span>
                </span>
              )}

              {status.ready && status.countdown != null && (
                <span className="board-units" aria-hidden="true">
                  <span>Hrs</span>
                  <span>Min</span>
                  <span>Sec</span>
                </span>
              )}
              </span>

            </div>

            <div className="board-bar board-foot">
              <span>{status.ready ? status.target || status.note : "\u00a0"}</span>
            </div>

            <span className="sr-only">
              {status.ready
                ? `${status.isOpen ? "Open now" : "Closed"}. ${status.note}`
                : "Checking whether we are open"}
            </span>
          </div>
        </div>

        <div className="facts">
          <div className="fact">
            <span className="sign">Call it in</span>
            <div className="fact-v">
              <a href={restaurant.phoneHref}>{restaurant.phone}</a>
            </div>
            <div className="fact-sub">Takeout &amp; call-ahead orders</div>
            <DoorDashLink />
          </div>

          <div className="fact">
            <span className="sign">Come get it</span>
            <div className="fact-v fact-address">
              <span>{restaurant.street}</span>
              <span>{restaurant.cityStateZip}</span>
            </div>
            <DirectionsLink />
          </div>

          <div className="fact fact-hours">
            <span className="sign">Hours</span>
            <div className="week-grid">
              {week.map((row) => (
                <div
                  key={row.key}
                  className={`week-row${row.isToday ? " today" : ""}${row.closed ? " shut" : ""}`}
                >
                  <span className="d">{row.label}</span>
                  <span className="lead" />
                  <span className="t">{row.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HoursContact;
