import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

test("a skip link is the first thing a keyboard reaches, and it points at the menu", () => {
  const { container } = render(<App />);
  const first = container.querySelector("a, button");
  expect(first).toHaveClass("skip-link");
  expect(first).toHaveAttribute("href", "#menu");
  expect(container.querySelector("#menu")).toBeInTheDocument();
});

test("the Sections button announces that it opens a dialog", () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /sections/i });
  expect(button).toHaveAttribute("aria-haspopup", "dialog");
  expect(button).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-expanded", "true");
});

test("the sheet is a labelled modal dialog", () => {
  const { container } = render(<App />);
  const sheet = container.querySelector(".sheet");
  expect(sheet).toHaveAttribute("role", "dialog");
  expect(sheet).toHaveAttribute("aria-modal", "true");
  expect(sheet).toHaveAttribute("aria-label", "Jump to a section");
});

test("opening the sheet moves focus into it; Escape closes it and gives focus back", () => {
  const { container } = render(<App />);
  const button = screen.getByRole("button", { name: /sections/i });
  const sheet = container.querySelector(".sheet");

  fireEvent.click(button);
  expect(sheet.contains(document.activeElement)).toBe(true);

  fireEvent.keyDown(document, { key: "Escape" });
  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(document.activeElement).toBe(button);
});
