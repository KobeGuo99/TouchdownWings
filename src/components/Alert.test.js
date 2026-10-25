import { render, screen } from "@testing-library/react";
import AlertMessage from "./Alert";
import { getStatus } from "./openStatus";
import { specialClosure } from "./SiteSettings";

test("stays out of the way when no closure is active", () => {
  const { container } = render(<AlertMessage isActive={false} message="anything" />);
  expect(container).toBeEmptyDOMElement();
});

test("stays out of the way when the message is blank", () => {
  const { container } = render(<AlertMessage isActive message="" />);
  expect(container).toBeEmptyDOMElement();
});

test("shows the closure message when switched on", () => {
  render(<AlertMessage isActive message="Closed Thursday for a private event." />);
  expect(screen.getByText("Closed Thursday for a private event.")).toBeInTheDocument();
});

test("an active closure overrides the normal hours everywhere", () => {
  const previous = specialClosure.isActive;
  try {
    specialClosure.isActive = true;
    // Friday 3pm is squarely inside normal hours
    const status = getStatus({ day: 5, time: 15 });
    expect(status.isOpen).toBe(false);
    expect(status.note).toBe("Closed today");
    expect(status.countdown).toBeNull();
  } finally {
    specialClosure.isActive = previous;
  }
});
