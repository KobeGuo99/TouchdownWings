import React from "react";
import { doorDash } from "./SiteSettings";
import ActionLink from "./ActionLink";
import "./DoorDashLink.css";

// Official DoorDash mark (simple-icons), used nominatively to show where
// delivery is handled. Deliberately a quiet text link, not a CTA button —
// calling the restaurant stays the primary action.
const DoorDashMark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.071 8.409a6.09 6.09 0 00-5.396-3.228H.584A.589.589 0 00.17 6.184L3.894 9.93a1.752 1.752 0 001.242.516h12.049a1.554 1.554 0 11.031 3.108H8.91a.589.589 0 00-.415 1.003l3.725 3.747a1.75 1.75 0 001.242.516h3.757c4.887 0 8.584-5.225 5.852-10.413" />
  </svg>
);

function DoorDashLink({ className = "" }) {
  if (!doorDash.enabled) return null;

  return (
    <div className={`dd ${className}`.trim()}>
      <ActionLink
        tone="doordash"
        icon={<DoorDashMark />}
        label="Delivery on DoorDash"
        href={doorDash.url}
      />
      <small className="dd-note">DoorDash prices may differ.</small>
    </div>
  );
}

export default DoorDashLink;
