import { filterCategory, normalise } from "./ModernMenu";
import menu from "./MenuData";

const categories = menu.flatMap((g) => g.categories);

// Returns the category titles a query surfaces, the way the page does.
const search = (term) => {
  const q = normalise(term);
  return categories
    .map((c) => filterCategory(c, q))
    .filter(Boolean)
    .map((c) => c.title);
};

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
      normalise("egg roll")
    );
    expect(wings.items).toHaveLength(2);
    expect(wings.items.every((i) => i.name.includes("Egg Roll"))).toBe(true);
  });
});
