// ProgressIndicator.js
import React from "react";

const ProgressIndicator = ({ sections, activeSection }) => {
  return (
    <div className="progress-indicator">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`progress-step ${
            activeSection > index
              ? "completed"
              : activeSection === index + 1
              ? "active"
              : ""
          }`}
        >
          {section.title}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
