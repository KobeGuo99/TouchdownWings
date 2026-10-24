import React from "react";
// trimmed copy of tdw_logo.png — the original has ~20% transparent
// padding baked in, which pushed the mark out of alignment
import logo from "../assets/tdw_logo_mark.png";
import { restaurant } from "./SiteSettings";
import DoorDashLink from "./DoorDashLink";
import { useOpenStatus, weekRows } from "./openStatus";
import "./HoursContact.css";

// Printed masthead: wordmark, the scoreboard, and the three things a
// takeout customer came for — phone, address, and the full week of hours.
function HoursContact() {
  const status = useOpenStatus();
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
              <span>
                Touchdown <b>Wings</b>
              </span>
            </h1>
          </div>

          <div className="board">
            <div className="sign board-k">The Kitchen</div>
            <div
              className={`board-v ${!status.ready ? "pending" : status.isOpen ? "" : "shut"}`}
            >
              {status.ready ? status.headline : "\u2014"}
            </div>
            {status.ready && status.isOpen && (
              <div className="gauge">
                <i style={{ width: `${Math.max(0, Math.min(100, status.progress))}%` }} />
              </div>
            )}
            {status.ready && status.note && (
              <div className="board-note">{status.note}</div>
            )}
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
            <div className="fact-v">{restaurant.street}</div>
            <div className="fact-sub">
              {restaurant.cityStateZip} ·{" "}
              <a href={restaurant.directionsUrl} target="_blank" rel="noopener noreferrer">
                Directions
              </a>
            </div>
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
