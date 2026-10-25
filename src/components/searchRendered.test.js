import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "../App";

const type = (value) => {
  fireEvent.change(screen.getByLabelText(/search the menu/i), { target: { value } });
};
const headings = (container) =>
  [...container.querySelectorAll(".cat-head h3")].map((h) => h.textContent.trim());
const itemsIn = (container, title) => {
  const cat = [...container.querySelectorAll(".cat")].find(
    (c) => c.querySelector("h3").textContent.trim() === title
  );
  return cat ? [...cat.querySelectorAll(".row-name")].map((n) => n.textContent.trim()) : null;
};

test("'boneless wings' returns the regular wing sizes, not just the kids meal", () => {
  const { container } = render(<App />);
  type("boneless wings");
  expect(headings(container)).toEqual(expect.arrayContaining(["Buffalo Wings", "Kids Meal"]));
  expect(itemsIn(container, "Buffalo Wings")).toEqual(
    expect.arrayContaining(["5 pcs", "10 pcs", "20 pcs", "30 pcs", "50 pcs", "100 pcs"])
  );
});

test("word order does not matter", () => {
  const { container } = render(<App />);
  type("boneless wings");
  const forward = headings(container);
  type("wings boneless");
  expect(headings(container)).toEqual(forward);
  type("  WINGS   BONELESS  ");
  expect(headings(container)).toEqual(forward);
});

test("'traditional wings' returns the wing sizes", () => {
  const { container } = render(<App />);
  type("traditional wings");
  expect(itemsIn(container, "Buffalo Wings")).toHaveLength(6);
});

test("'chicken fried rice' stays specific", () => {
  const { container } = render(<App />);
  type("chicken fried rice");
  const found = headings(container);
  expect(found).toContain("Fried Rice");
  // served with fried rice, but not a chicken fried rice
  expect(found).not.toContain("Sweet & Sour Chicken");
  // its note mentions fried rice, but the entree is just "Chicken"
  expect(found).not.toContain("Hibachi Entrees");
  expect(itemsIn(container, "Fried Rice")).toContain("Chicken Fried Rice");
  expect(itemsIn(container, "Fried Rice")).not.toContain("Beef Fried Rice");
});

test("a mention still counts when nothing matches outright", () => {
  const { container } = render(<App />);
  // no item is named "blue cheese"; both notes offer it as a dip
  type("blue cheese");
  expect(headings(container)).toEqual(expect.arrayContaining(["Buffalo Wings", "Fresh Salads"]));
});

test("a single word still surfaces the categories that mention it", () => {
  const { container } = render(<App />);
  type("ranch");
  expect(headings(container)).toContain("Buffalo Wings");
});

test("every word must match", () => {
  render(<App />);
  type("boneless catfish");
  expect(screen.getByText(/nothing on the menu matches/i)).toBeInTheDocument();
});

test("no duplicate rows, and prices still render", () => {
  const { container } = render(<App />);
  type("boneless wings");
  const rows = [...container.querySelectorAll(".cat")].flatMap((c) =>
    [...c.querySelectorAll(".row-name")].map(
      (n) => `${c.querySelector("h3").textContent}/${n.textContent}`
    )
  );
  expect(new Set(rows).size).toBe(rows.length);
  expect(container.querySelectorAll(".mx-p").length).toBeGreaterThan(0);
});

test("highlights each matched word", () => {
  const { container } = render(<App />);
  type("boneless wings");
  const marks = [...container.querySelectorAll("mark")].map((m) => m.textContent.toLowerCase());
  expect(marks).toEqual(expect.arrayContaining(["boneless", "wings"]));
});

test("clearing restores the whole menu", () => {
  const { container } = render(<App />);
  type("boneless wings");
  expect(headings(container).length).toBeLessThan(20);
  type("");
  expect(container.querySelectorAll(".cat")).toHaveLength(20);
});

test("the field does not offer previously typed searches", () => {
  const { container } = render(<App />);
  const input = container.querySelector("#menu-search");
  expect(input).toHaveAttribute("autocomplete", "off");
  // a name would give the browser another key to remember the field by
  expect(input).not.toHaveAttribute("name");
  // nothing here supplies our own suggestion list either
  expect(input).not.toHaveAttribute("list");
  expect(container.querySelector("datalist")).toBeNull();
  // the legacy WebKit attributes that switch on Safari's "Recent Searches"
  expect(input).not.toHaveAttribute("autosave");
  expect(input).not.toHaveAttribute("results");
  expect(input.closest("form")).toBeNull();
});

test("mobile keyboards get a search key and leave the query alone", () => {
  const { container } = render(<App />);
  const input = container.querySelector("#menu-search");
  expect(input).toHaveAttribute("enterkeyhint", "search");
  expect(input).toHaveAttribute("autocorrect", "off");
  expect(input).toHaveAttribute("autocapitalize", "none");
  expect(input).toHaveAttribute("spellcheck", "false");
});

test("the query survives interacting with the rest of the page", () => {
  const { container } = render(<App />);
  type("lo mein");
  const input = container.querySelector("#menu-search");
  expect(input.value).toBe("lo mein");

  // open the section sheet and close it again
  fireEvent.click(screen.getByRole("button", { name: /sections/i }));
  fireEvent.keyDown(document, { key: "Escape" });
  expect(input.value).toBe("lo mein");

  // use back-to-top
  window.scrollTo = jest.fn();
  fireEvent.click(screen.getByRole("button", { name: /back to top/i }));
  expect(input.value).toBe("lo mein");
  expect(container.querySelectorAll(".cat")).toHaveLength(1);
});
