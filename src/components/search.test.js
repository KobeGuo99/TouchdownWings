import { filterCategory, tokenise } from "./ModernMenu";
import menu from "./MenuData";

const categories = menu.flatMap((g) => g.categories);

// Returns the category titles a query surfaces, the way the page does.
const search = (term) =>
  categories
    .map((c) => filterCategory(c, tokenise(term)))
    .filter(Boolean)
    .map((c) => c.title);

describe("queries a real customer types", () => {
  // These all returned nothing before: "boneless" and "traditional" live in
  // priceColumns, "blue cheese" lives in the category note.
  it("finds Buffalo Wings from the two words we are known for", () => {
    expect(search("boneless")).toContain("Buffalo Wings");
    expect(search("traditional")).toContain("Buffalo Wings");
  });

  it("finds wings from the dips named in the note", () => {
    expect(search("blue cheese")).toContain("Buffalo Wings");
    expect(search("ranch")).toContain("Buffalo Wings");
  });

  it("matches across punctuation", () => {
    expect(search("bbq")).toContain("Sauces");          // "B.B.Q. Chipotle"
    expect(search("2 liter")).toContain("Family Meal Deals"); // "2-liter soda"
  });

  it("still finds plain item names", () => {
    expect(search("lo mein")).toContain("Lo Mein");
    expect(search("catfish")).toEqual(expect.arrayContaining(["Catfish Filet"]));
    expect(search("mango")).toContain("Sauces");
  });

  it("is case and spacing insensitive", () => {
    expect(search("  LO   MEIN ")).toContain("Lo Mein");
  });

  it("returns nothing for things we do not sell", () => {
    expect(search("sushi")).toHaveLength(0);
    expect(search("zzzz")).toHaveLength(0);
  });

  it("narrows a category to only the matching items", () => {
    const wings = filterCategory(
      categories.find((c) => c.id === "sideorders"),
      tokenise("egg roll")
    );
    expect(wings.items).toHaveLength(2);
    expect(wings.items.every((i) => i.name.includes("Egg Roll"))).toBe(true);
  });
});

describe("multiword queries", () => {
  // "boneless" is a size label, "wings" is the category heading — they never
  // sit next to each other, so a contiguous-phrase match excluded the wings
  it("finds the regular wing sizes for 'boneless wings'", () => {
    const hit = categories
      .map((c) => filterCategory(c, tokenise("boneless wings")))
      .filter(Boolean);
    const wings = hit.find((c) => c.title === "Buffalo Wings");
    expect(wings).toBeTruthy();
    expect(wings.items.map((i) => i.name)).toEqual(
      expect.arrayContaining(["5 pcs", "10 pcs", "100 pcs"])
    );
    expect(hit.map((c) => c.title)).toContain("Kids Meal");
  });

  it("ignores word order, case and extra whitespace", () => {
    const forms = ["boneless wings", "wings boneless", "  WINGS   boneless ", "Boneless Wings"];
    const results = forms.map((f) =>
      categories.map((c) => filterCategory(c, tokenise(f))).filter(Boolean).map((c) => c.title)
    );
    for (const r of results) expect(r).toEqual(results[0]);
    expect(results[0]).toContain("Buffalo Wings");
  });

  it("finds the wing sizes for 'traditional wings'", () => {
    const wings = categories
      .map((c) => filterCategory(c, tokenise("traditional wings")))
      .filter(Boolean)
      .find((c) => c.title === "Buffalo Wings");
    expect(wings).toBeTruthy();
    expect(wings.items).toHaveLength(6);
  });

  it("keeps 'chicken fried rice' specific", () => {
    const hit = categories
      .map((c) => filterCategory(c, tokenise("chicken fried rice")))
      .filter(Boolean);
    const names = hit.flatMap((c) => (c.items || []).map((i) => i.name));
    expect(names).toContain("Chicken Fried Rice");
    // the hibachi note mentions fried rice, but a plain "Chicken" entree
    // is not a chicken fried rice
    expect(hit.map((c) => c.title)).not.toContain("Hibachi Entrees");
    expect(names).not.toContain("Beef Fried Rice");
    expect(names).not.toContain("Lo Mein");
  });

  it("requires every word, not just one", () => {
    const hit = categories
      .map((c) => filterCategory(c, tokenise("boneless catfish")))
      .filter(Boolean);
    expect(hit).toHaveLength(0);
  });

  it("returns each item once", () => {
    const names = categories
      .map((c) => filterCategory(c, tokenise("boneless wings")))
      .filter(Boolean)
      .flatMap((c) => (c.items || []).map((i) => `${c.title}/${i.name}`));
    expect(new Set(names).size).toBe(names.length);
  });

  it("still handles single words, punctuation and no matches", () => {
    expect(search("boneless")).toContain("Buffalo Wings");
    expect(search("bbq")).toContain("Sauces");
    expect(search("lo mein")).toContain("Lo Mein");
    expect(search("sushi")).toHaveLength(0);
  });
});
