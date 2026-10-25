import React, { useState, useMemo, useEffect, useRef } from "react";
import { FaPepperHot } from "react-icons/fa";
import menu from "./MenuData";
import { restaurant } from "./SiteSettings";
import "./ModernMenu.css";

// Only the peppers earned are drawn — the way a printed menu does it.
// The legend by the sauces explains that the scale runs to six.
const Heat = ({ level }) => (
  <span className="heat" role="img" aria-label={`Heat ${level} of 6`}>
    {Array.from({ length: level }, (_, i) => (
      <FaPepperHot key={i} aria-hidden="true" />
    ))}
  </span>
);

function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const at = text.toLowerCase().indexOf(query);
  // the query may have been normalised past a literal match (e.g. "b b q")
  if (at < 0) return <>{text}</>;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

// "2 liter" finds "2-liter"; "bbq" finds "B.B.Q."
export const normalise = (text) =>
  (text || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const squash = (text) => (text || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const matches = (text, q) =>
  normalise(text).includes(q) || squash(text).includes(squash(q));

// Search covers item names, descriptions, sauces, the category note, and the
// size labels — "boneless" and "traditional" live in priceColumns and the
// note, so without those a customer searching the two things we are known
// for found nothing.
export function filterCategory(category, q) {
  if (!q) return category;

  const categoryMatches =
    matches(category.title, q) ||
    matches(category.note, q) ||
    (category.priceColumns || []).some((c) => matches(c, q));

  if (category.sauceGroups) {
    if (categoryMatches) return category;
    const sauceGroups = category.sauceGroups
      .map((g) => ({ ...g, sauces: g.sauces.filter((s) => matches(s.name, q)) }))
      .filter((g) => g.sauces.length);
    return sauceGroups.length ? { ...category, sauceGroups } : null;
  }

  if (categoryMatches) return category;

  const items = (category.items || []).filter(
    (it) => matches(it.name, q) || matches(it.description, q)
  );
  return items.length ? { ...category, items } : null;
}

const countOf = (c) =>
  c.sauceGroups
    ? c.sauceGroups.reduce((n, g) => n + g.sauces.length, 0)
    : (c.items || []).length;

function ItemName({ item, query }) {
  return (
    <div className="row-name">
      <Highlight text={item.name} query={query} />
      {item.heat ? (
        <>
          {" "}
          <Heat level={item.heat} />
        </>
      ) : null}
    </div>
  );
}

function Category({ category, query }) {
  const hasColumns = category.priceColumns && category.priceColumns.length > 1;

  return (
    <section className="cat" id={category.id}>
      <div className="cat-head">
        <h3>
          <Highlight text={category.title} query={query} />
        </h3>
        <span className="bar" />
      </div>
      {category.note && <p className="cat-note">{category.note}</p>}

      {category.sauceGroups ? (
        <>
          <div className="legend">
            <b>Heat scale</b>
            <span className="key">
              <Heat level={1} /> a little kick
            </span>
            <span className="key">
              <Heat level={3} /> seriously hot
            </span>
            <span className="key">
              <Heat level={6} /> Die Hot, the hottest we make
            </span>
          </div>
          {category.sauceGroups.map((group) => (
            <div className="sub-block" key={group.title}>
              <span className="sub-h sign">{group.title}</span>
              <div className="sauce-list">
                {group.sauces.map((sauce, i) => (
                  <div className="sauce-item" key={`${group.title}-${i}`}>
                    <span className="nm">
                      <Highlight text={sauce.name} query={query} />
                      {sauce.heat ? (
                        <>
                          &nbsp;
                          <Heat level={sauce.heat} />
                        </>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : hasColumns ? (
        /* a real price matrix — columns are earned here, not a default */
        <div className="matrix">
          <div className="mx-head">
            {category.priceColumns.map((label) => (
              <span className="sign" key={label}>
                {label}
              </span>
            ))}
          </div>
          {category.items.map((item, i) => (
            <div className="mx-row" key={`${category.id}-${i}`}>
              <div className="mx-main">
                <ItemName item={item} query={query} />
                {item.description && (
                  <div className="row-desc">
                    <Highlight text={item.description} query={query} />
                  </div>
                )}
              </div>
              {item.prices.length > 1 ? (
                category.priceColumns.map((label, k) => (
                  <div className="mx-p" key={label}>
                    ${item.prices[k]}
                  </div>
                ))
              ) : (
                /* One price in a multi-column category spans and centres across
                   the whole price area. Right-aligning it would park it under
                   the last column header — "Cole Slaw, Large, $1.35". */
                <div
                  className="mx-p wide"
                  style={{ width: `calc(var(--mx-col) * ${category.priceColumns.length})` }}
                >
                  ${item.prices[0]}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* classic dot leaders: each price stays tied to its own item */
        <div className="rows">
          {category.items.map((item, i) => (
            <div className="row" key={`${category.id}-${i}`}>
              <div className="row-line">
                <span className="row-name">
                  <Highlight text={item.name} query={query} />
                  {item.heat ? (
                    <>
                      {" "}
                      <Heat level={item.heat} />
                    </>
                  ) : null}
                </span>
                <span className="lead" />
                <span className="row-price">${item.prices[0]}</span>
              </div>
              {item.description && (
                <div className="row-desc">
                  <Highlight text={item.description} query={query} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ModernMenu() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const menuRef = useRef(null);
  const sheetRef = useRef(null);
  const searchRef = useRef(null);
  const jumpRef = useRef(null);

  const query = normalise(search);

  const { groups, total } = useMemo(() => {
    let total = 0;
    const groups = [];
    for (const g of menu) {
      const categories = g.categories
        .map((c) => filterCategory(c, query))
        .filter(Boolean);
      if (!categories.length) continue;
      for (const c of categories) total += countOf(c);
      groups.push({ ...g, categories });
    }
    return { groups, total };
  }, [query]);

  // Filtering shortens the page, so a search run from deep in the menu
  // leaves the viewport stranded past the results. Pull them back under the
  // sticky controls — only when they are actually above it, so continued
  // typing does not jitter, and via window.scrollTo so the input keeps focus
  // and the mobile keyboard stays up.
  useEffect(() => {
    if (!query) return;
    const menu = menuRef.current;
    const tools = document.querySelector(".tools");
    if (!menu || !tools) return;
    const delta = menu.getBoundingClientRect().top - tools.getBoundingClientRect().bottom - 12;
    if (delta >= -4) return;
    // instant, not smooth: animating thousands of pixels means the next
    // keystroke measures mid-flight and scrolls again, which is the jitter
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollBy(0, delta);
    document.documentElement.style.scrollBehavior = previous;
  }, [query]);

  // highlight the section currently under the reader
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const sections = menuRef.current?.querySelectorAll(".cat");
    if (!sections?.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [groups]);

  // iOS ignores body{overflow:hidden}, so pin the body and restore the
  // exact scroll position when the sheet closes
  useEffect(() => {
    if (!sheetOpen) return undefined;
    const y = window.scrollY;
    document.body.style.top = `-${y}px`;
    document.body.classList.add("locked");
    return () => {
      document.body.classList.remove("locked");
      document.body.style.top = "";
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      try {
        window.scrollTo(0, y);
      } catch {
        /* no scrolling outside a real browser */
      }
      document.documentElement.style.scrollBehavior = previous;
    };
  }, [sheetOpen]);

  // While the sheet is open it is the only thing on screen, so keyboard
  // focus has to stay inside it: move focus in on open, cycle Tab within it,
  // and hand focus back to the button that opened it on close.
  useEffect(() => {
    if (!sheetOpen) return undefined;

    const sheet = sheetRef.current;
    const opener = jumpRef.current;
    const focusable = () => [
      ...sheet.querySelectorAll('a[href], button:not([disabled])'),
    ];

    focusable()[0]?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        setSheetOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (!sheet.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [sheetOpen]);

  const nav = (onPick) =>
    groups.map((g) => (
      <div className="rail-group sheet-group" key={g.group}>
        <div className="rail-h sign">{g.group}</div>
        <div className="sheet-items">
          {g.categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className={activeId === c.id ? "active" : undefined}
              onClick={onPick}
            >
              {c.title}
              <span className="n">{countOf(c)}</span>
            </a>
          ))}
        </div>
      </div>
    ));

  return (
    <>
      <div className="tools">
        <div className="wrap tools-in">
          <div className={`search${query ? " has-q" : ""}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              ref={searchRef}
              id="menu-search"
              type="search"
              value={search}
              placeholder="Search the menu…"
              aria-label="Search the menu"
              onChange={(e) => setSearch(e.target.value)}
            />
            {query && (
              <button
                className="clear"
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  // the button unmounts with the query, so hand focus back
                  // rather than dropping it on the body
                  searchRef.current?.focus();
                }}
              >
                ×
              </button>
            )}
          </div>
          <button
            ref={jumpRef}
            className="jump-btn"
            aria-expanded={sheetOpen}
            aria-haspopup="dialog"
            onClick={() => setSheetOpen((v) => !v)}
          >
            Sections
          </button>
        </div>
      </div>

      <main className="wrap layout">
        <nav className="rail" aria-label="Menu sections">
          {nav(undefined)}
        </nav>

        <div id="menu" ref={menuRef}>
          {total === 0 ? (
            <div className="empty">
              <strong>Nothing on the menu matches “{search.trim()}”</strong>
              Try “wings”, “catfish” or “lo mein” — or just call us at{" "}
              <a href={restaurant.phoneHref}>{restaurant.phone}</a>.
            </div>
          ) : (
            <>
              {query && (
                <div className="count">
                  {total} item{total === 1 ? "" : "s"} matching “{search.trim()}”
                </div>
              )}
              {groups.map((g) => (
                <React.Fragment key={g.group}>
                  <div className="yard">
                    <div className="yard-h">
                      <h2>{g.group}</h2>
                      <span className="pip" />
                      <span className="hash" />
                    </div>
                  </div>
                  {g.categories.map((c) => (
                    <Category key={c.id} category={c} query={query} />
                  ))}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </main>

      <div
        className={`sheet-bg${sheetOpen ? " on" : ""}`}
        onClick={() => setSheetOpen(false)}
      />
      <div
        ref={sheetRef}
        className={`sheet${sheetOpen ? " on" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Jump to a section"
      >
        <div className="sheet-head">
          <div className="grab" />
          <div className="sheet-head-row">
            <span className="sign">Jump to a section</span>
            <button
              type="button"
              className="sheet-close"
              onClick={() => setSheetOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
        <div className="sheet-body">{nav(() => setSheetOpen(false))}</div>
      </div>
    </>
  );
}

export default ModernMenu;
