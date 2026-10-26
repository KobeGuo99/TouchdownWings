import menu from "./MenuData";
import { hours, specialClosure } from "./SiteSettings";

// Development-only sanity checks on MenuData.js and SiteSettings.js.
// They never run on the deployed site — they exist so that a typo made
// while editing prices or hours shows up as a plain-English message in
// the browser console during `npm start`, instead of a silently wrong
// or blank page.
export default function checkConfig() {
  if (process.env.NODE_ENV === "production") return;

  const problems = [];
  const seenIds = new Map();

  for (const group of menu) {
    if (!group.group) problems.push("A group is missing its `group:` name.");

    for (const category of group.categories || []) {
      const where = category.title || category.id || "(untitled category)";

      if (!category.id) {
        problems.push(`"${where}" has no id. Add a unique lowercase id, e.g. id: "wraps".`);
      } else if (seenIds.has(category.id)) {
        problems.push(
          `Two categories share the id "${category.id}" ("${seenIds.get(category.id)}" and "${where}"). ` +
            `Ids must be unique — the Sections links point at them.`
        );
      } else {
        seenIds.set(category.id, where);
      }

      if (group.group && category.title && group.group.trim() === category.title.trim()) {
        problems.push(
          `The group "${group.group}" is named after the category inside it. ` +
            `Widen the group name so nothing looks misfiled.`
        );
      }

      const columns = category.priceColumns?.length || 1;

      for (const item of category.items || []) {
        const at = `${where} → ${item.name || "(unnamed item)"}`;

        if (!item.name) problems.push(`${at}: missing name.`);

        if (!Array.isArray(item.prices) || item.prices.length === 0) {
          problems.push(`${at}: no prices. Use  prices: ["0.00"]`);
          continue;
        }

        for (const price of item.prices) {
          if (typeof price !== "string") {
            problems.push(`${at}: price ${price} needs quotes around it, e.g. "6.19".`);
          } else if (price.includes("$")) {
            problems.push(`${at}: price "${price}" has a dollar sign. Write it as "${price.replace(/\$/g, "")}".`);
          } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
            problems.push(`${at}: price "${price}" should be digits only, e.g. "6.19".`);
          }
        }

        if (item.prices.length > columns) {
          problems.push(
            `${at}: ${item.prices.length} prices, but this category has ` +
              (category.priceColumns
                ? `${columns} priceColumns (${category.priceColumns.join(", ")}).`
                : `no priceColumns, so it can only show one price.`)
          );
        }

        if (item.heat != null && (item.heat < 1 || item.heat > 6)) {
          problems.push(`${at}: heat is ${item.heat}; it must be between 1 and 6.`);
        }
      }

      for (const sauceGroup of category.sauceGroups || []) {
        for (const sauce of sauceGroup.sauces || []) {
          if (!sauce.name) problems.push(`${where} → ${sauceGroup.title}: a sauce is missing its name.`);
          if (sauce.heat != null && (sauce.heat < 1 || sauce.heat > 6)) {
            problems.push(`${where} → ${sauce.name}: heat is ${sauce.heat}; it must be between 1 and 6.`);
          }
        }
      }
    }
  }

  for (const [day, value] of Object.entries(hours)) {
    if (value == null) continue;
    const { open, close } = value;
    if (typeof open !== "number" || typeof close !== "number") {
      problems.push(`hours.${day}: open and close must be numbers, e.g. { open: 11, close: 20.5 }.`);
    } else if (close <= open) {
      problems.push(
        `hours.${day}: close (${close}) must be later than open (${open}). ` +
          `Closing after midnight is not supported.`
      );
    } else if (open < 0 || close > 24) {
      problems.push(`hours.${day}: times must be between 0 and 24.`);
    }
  }

  const { mode, isActive, closesRestaurant, headline, message, from, to, reopenTime } =
    specialClosure;
  if (mode !== "manual" && mode !== "scheduled") {
    problems.push(`specialClosure: mode is "${mode}"; it must be "manual" or "scheduled".`);
  }
  if (closesRestaurant !== true && closesRestaurant !== false) {
    problems.push("specialClosure: closesRestaurant must be true or false (no quotes).");
  }
  for (const [field, value] of [["headline", headline], ["message", message]]) {
    if (value != null && typeof value !== "string") {
      problems.push(`specialClosure: ${field} must be text in quotes, or "" for none.`);
    }
  }
  if (isActive) {
    if (mode === "manual") {
      if (!String(headline || "").trim()) {
        problems.push(
          "specialClosure: manual mode is on but headline is empty, so nothing will show. " +
            'Write what you want customers to read, e.g. headline: "Closed today — burst pipe".'
        );
      }
    } else if (mode === "scheduled") {
      const iso = /^\d{4}-\d{2}-\d{2}$/;
      if (!iso.test(from || "") || !iso.test(to || "")) {
        problems.push('specialClosure: from and to must look like "2026-06-14".');
      } else if (to < from) {
        problems.push(`specialClosure: to (${to}) is before from (${from}).`);
      }
      if (reopenTime != null && (typeof reopenTime !== "number" || reopenTime < 0 || reopenTime > 24)) {
        problems.push("specialClosure: reopenTime must be a number between 0 and 24, or null.");
      }
    }
  }

  if (problems.length) {
    console.warn(
      `[Touchdown Wings] ${problems.length} thing${problems.length === 1 ? "" : "s"} to fix:\n` +
        problems.map((p) => `  • ${p}`).join("\n")
    );
  }
}
