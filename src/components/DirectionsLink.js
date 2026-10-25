import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { restaurant } from "./SiteSettings";
import ActionLink from "./ActionLink";

function DirectionsLink({ label = "Get directions" }) {
  return (
    <ActionLink
      tone="directions"
      icon={<FaMapMarkerAlt aria-hidden="true" />}
      label={label}
      href={restaurant.directionsUrl}
    />
  );
}

export default DirectionsLink;
