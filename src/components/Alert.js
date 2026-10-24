import React from "react";
import "./Alert.css";

// Banner for sudden closings. Driven by specialClosure in SiteSettings.js.
const AlertMessage = ({ isActive, message }) => {
  if (!isActive || !message) return null;

  return (
    <section className="notice-bar" aria-live="polite">
      <div className="wrap">
        <div className="notice">
          <div>
            <span className="sign">Closure notice</span>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlertMessage;
