import { render, screen } from "@testing-library/react";
import App from "./App";
import menu from "./components/MenuData";
import { restaurant } from "./components/SiteSettings";

const categoryCount = menu.reduce((n, g) => n + g.categories.length, 0);

test("shows the phone number without any interaction", () => {
  render(<App />);
  expect(screen.getAllByText(restaurant.phone).length).toBeGreaterThan(0);
});

test("shows the full week of hours without any interaction", () => {
  const { container } = render(<App />);
  // masthead and footer each carry the collapsed week
  expect(container.querySelectorAll(".mast .week-row").length).toBe(4);
  expect(container.querySelectorAll(".footer .week-row").length).toBe(4);
});

test("renders every menu category", () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll(".cat").length).toBe(categoryCount);
});

test("prices every item that has a price", () => {
  const { container } = render(<App />);
  const priced = menu
    .flatMap((g) => g.categories)
    .flatMap((c) => c.items || []).length;
  const rendered =
    container.querySelectorAll(".row-line").length +
    container.querySelectorAll(".mx-row").length;
  expect(rendered).toBe(priced);
});
