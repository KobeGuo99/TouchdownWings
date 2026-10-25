import React from "react";
import "./ActionLink.css";

// The three ways to reach us — call, delivery, directions — all read the
// same way: a mark, a label, and a coloured rule. Each keeps its own tone
// so they are distinguishable without looking like three unrelated links.
function ActionLink({ tone, icon, label, href, external = true }) {
  const content = (
    <>
      {icon}
      <span>{label}</span>
    </>
  );

  if (!href) {
    return <span className={`action-link tone-${tone} is-static`}>{content}</span>;
  }

  return (
    <a
      className={`action-link tone-${tone}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </a>
  );
}

export default ActionLink;
