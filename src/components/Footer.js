import React from "react";
import { restaurant } from "./SiteSettings";
import DoorDashLink from "./DoorDashLink";
import { useOpenStatus, weekRows } from "./openStatus";
import "./Footer.css";

function Footer() {
  const status = useOpenStatus();
  const week = weekRows(status.day);

  return (
    <footer className="footer">
      <div className="wrap foot">
        <div>
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

        <div>
          <span className="sign">Find us</span>
          <p>
            <a href={restaurant.phoneHref}>{restaurant.phone}</a>
          </p>
          <p>
            {restaurant.street}
            <br />
            {restaurant.cityStateZip}
          </p>
          <p>
            <a href={restaurant.directionsUrl} target="_blank" rel="noopener noreferrer">
              Get directions
            </a>
          </p>
          <DoorDashLink />
        </div>

        <div>
          <span className="sign">{restaurant.name}</span>
          <p>
            Prices and availability subject to change. Call ahead for large or
            catering orders.
          </p>
          <p>&copy; {restaurant.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
