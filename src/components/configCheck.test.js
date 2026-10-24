import checkConfig from "./configCheck";

describe("configCheck", () => {
  let warn;
  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    warn.mockRestore();
    jest.resetModules();
  });

  it("says nothing about the real menu and hours", () => {
    checkConfig();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe("configCheck catches bad edits", () => {
  const load = (menu, hours) => {
    jest.resetModules();
    jest.doMock("./MenuData", () => ({ __esModule: true, default: menu }));
    jest.doMock("./SiteSettings", () => ({
      __esModule: true,
      hours: hours ?? { sunday: null, monday: null, tuesday: null,
        wednesday: null, thursday: null, friday: null, saturday: null },
      specialClosure: { isActive: false, message: "" },
      restaurant: {},
    }));
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    require("./configCheck").default();
    const output = warn.mock.calls.map((c) => c[0]).join("\n");
    warn.mockRestore();
    return output;
  };

  const wrap = (category) => [{ group: "Test Group", categories: [category] }];

  it("flags a dollar sign in a price", () => {
    expect(load(wrap({ id: "a", title: "A", items: [{ name: "Fries", prices: ["$3.69"] }] })))
      .toMatch(/dollar sign/);
  });

  it("flags a price that is not in quotes", () => {
    expect(load(wrap({ id: "a", title: "A", items: [{ name: "Fries", prices: [3.69] }] })))
      .toMatch(/needs quotes/);
  });

  it("flags duplicate category ids", () => {
    const menu = [{ group: "G", categories: [
      { id: "dup", title: "One", items: [{ name: "x", prices: ["1.00"] }] },
      { id: "dup", title: "Two", items: [{ name: "y", prices: ["1.00"] }] },
    ]}];
    expect(load(menu)).toMatch(/share the id "dup"/);
  });

  it("flags more prices than there are columns", () => {
    expect(load(wrap({ id: "a", title: "A", items: [{ name: "Fries", prices: ["1.00", "2.00"] }] })))
      .toMatch(/no priceColumns/);
  });

  it("flags a group named after its own category", () => {
    const menu = [{ group: "Wings", categories: [
      { id: "w", title: "Wings", items: [{ name: "5 pcs", prices: ["6.19"] }] },
    ]}];
    expect(load(menu)).toMatch(/named after the category/);
  });

  it("flags a heat value outside 1-6", () => {
    expect(load(wrap({ id: "a", title: "A", items: [{ name: "x", prices: ["1.00"], heat: 9 }] })))
      .toMatch(/heat is 9/);
  });

  it("flags a closing time before the opening time", () => {
    const ok = wrap({ id: "a", title: "A", items: [{ name: "x", prices: ["1.00"] }] });
    expect(load(ok, { sunday: null, monday: null, tuesday: { open: 11, close: 1 },
      wednesday: null, thursday: null, friday: null, saturday: null }))
      .toMatch(/must be later than open/);
  });
});
