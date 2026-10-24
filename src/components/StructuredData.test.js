import { buildSchema } from "./StructuredData";
import { hours, restaurant } from "./SiteSettings";

const schema = buildSchema();

test("declares itself a Restaurant with the real contact details", () => {
  expect(schema["@type"]).toBe("Restaurant");
  expect(schema.name).toBe(restaurant.name);
  expect(schema.telephone).toBe("+19319132888");
  expect(schema.address).toMatchObject({
    "@type": "PostalAddress",
    streetAddress: "1408 N Jackson St.",
    addressLocality: "Tullahoma",
    addressRegion: "TN",
    postalCode: "37388",
  });
});

test("publishes every open day, and no closed ones", () => {
  const listed = schema.openingHoursSpecification.flatMap((s) => s.dayOfWeek);
  expect(listed).toHaveLength(6);
  expect(listed).not.toContain("Monday"); // hours.monday is null
  expect(new Set(listed).size).toBe(6);   // no day listed twice
});

test("converts decimal hours to clock times", () => {
  const tueThu = schema.openingHoursSpecification.find((s) =>
    s.dayOfWeek.includes("Tuesday")
  );
  expect(tueThu).toMatchObject({ opens: "11:00", closes: "20:30" });
  expect(tueThu.dayOfWeek).toEqual(["Tuesday", "Wednesday", "Thursday"]);

  const sun = schema.openingHoursSpecification.find((s) =>
    s.dayOfWeek.includes("Sunday")
  );
  expect(sun).toMatchObject({ opens: "12:00", closes: "20:00" });
});

test("stays in step with SiteSettings rather than hardcoding times", () => {
  for (const spec of schema.openingHoursSpecification) {
    for (const day of spec.dayOfWeek) {
      const source = hours[day.toLowerCase()];
      const [h, m] = spec.opens.split(":").map(Number);
      expect(h + m / 60).toBe(source.open);
    }
  }
});

test("publishes the canonical https URL", () => {
  // the live site redirects http -> https, so declaring http here would
  // point search engines at a non-canonical address
  expect(schema.url.startsWith("https://")).toBe(true);
  expect(schema.hasMenu.startsWith("https://")).toBe(true);
});

test("links the DoorDash store as sameAs", () => {
  expect(schema.sameAs).toEqual([
    expect.stringContaining("doordash.com/store/"),
  ]);
});

test("serialises to valid JSON", () => {
  expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
});
