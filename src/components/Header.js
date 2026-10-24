import React from "react";
// trimmed copy of tdw_logo.png — the original has ~20% transparent
// padding baked in, which pushed the mark out of alignment
import logo from "../assets/tdw_logo_mark.png";
import { restaurant } from "./SiteSettings";
import { useOpenStatus } from "./openStatus";
import "./Header.css";

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
  </svg>
);

// Slim sticky bar. Its whole job is that the phone number and the
// open/closed state are reachable from anywhere on the page.
function Header() {
  const status = useOpenStatus();

  return (
    <header className="topbar">
      <div className="wrap topbar-in">
        <button
          type="button"
          className="brand"
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label="Back to top"
        >
          {/* alt is empty: the masthead heading already names the
              restaurant, so the button's own label is what matters */}
          <img src={logo} alt="" />
        </button>
        <div className="spacer" />

        <span
          className={`pill ${status.ready ? (status.isOpen ? "is-open" : "is-closed") : "is-pending"}`}
          aria-hidden={!status.ready}
        >
          {status.ready ? (
            <>
              <span className="dot" />
              <span className="t-long">{status.short}</span>
              <span className="t-short">{status.isOpen ? "Open" : "Closed"}</span>
            </>
          ) : (
            <span aria-hidden="true">&nbsp;</span>
          )}
        </span>

        <a className="call" href={restaurant.phoneHref}>
          <PhoneIcon />
          <span>{restaurant.phone}</span>
        </a>
      </div>
    </header>
  );
}

export default Header;
