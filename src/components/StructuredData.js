import React from "react";
import { hours, restaurant, doorDash } from "./SiteSettings";

const DAY_KEYS = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
];
const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

// 20.5 -> "20:30"
const toClock = (value) => {
  const h = Math.floor(value);
  const m = Math.round((value - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// Collapse days that share hours into one entry, which is what Google expects
function openingHours() {
  const buckets = new Map();
  DAY_KEYS.forEach((key, index) => {
    const value = hours[key];
    if (!value) return;
    const id = `${value.open}-${value.close}`;
    if (!buckets.has(id)) buckets.set(id, { ...value, days: [] });
    buckets.get(id).days.push(DAY_NAMES[index]);
  });
  return [...buckets.values()].map(({ days, open, close }) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days,
    opens: toClock(open),
    closes: toClock(close),
  }));
}

export function buildSchema() {
  const [city, rest] = restaurant.cityStateZip.split(",").map((s) => s.trim());
  const [region, postalCode] = (rest || "").split(" ").filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    url: restaurant.siteUrl,
    telephone: `+1${restaurant.phone.replace(/\D/g, "")}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.street,
      addressLocality: city,
      addressRegion: region,
      postalCode,
      addressCountry: "US",
    },
    servesCuisine: ["Chicken Wings", "American", "Hibachi", "Chinese"],
    priceRange: "$",
    acceptsReservations: false,
    hasMenu: `${restaurant.siteUrl}/#menu`,
    openingHoursSpecification: openingHours(),
  };

  if (doorDash.enabled && doorDash.url) schema.sameAs = [doorDash.url];
  return schema;
}

// Rendered as part of the tree rather than injected on mount, so the
// prerendered HTML already carries it and crawlers see it without
// running any JavaScript.
function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema()) }}
    />
  );
}

export default StructuredData;
