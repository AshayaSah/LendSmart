// LoanApplicationForm.js
import React, { useState } from "react";
import Section from "./Section";
import ProgressIndicator from "./ProgressIndicator";
import "./LoanApplicationForm.css"; // Import styling

const LoanApplicationForm = () => {
  const [activeSection, setActiveSection] = useState(1); // Tracks the active section
  const [formData, setFormData] = useState({
    personalDetails: {},
    employmentDetails: {},
    loanDetails: {},
  });

  const sections = [
    { id: "personalDetails", title: "Personal Details" },
    { id: "employmentDetails", title: "Employment Details" },
    { id: "loanDetails", title: "Loan Details" },
  ];

  const handleSectionUpdate = (sectionId, data) => {
    setFormData((prev) => ({ ...prev, [sectionId]: data }));
  };

  const handleNext = () => {
    if (formIsValid(activeSection)) {
      setActiveSection((prev) => prev + 1);
    }
  };

  const formIsValid = (sectionIndex) => {
    // Add section-specific validation here
    const sectionId = sections[sectionIndex - 1].id;
    const data = formData[sectionId];
    return Object.values(data).every((value) => value); // Example validation
  };

  return (
    <div className="form-container">
      <ProgressIndicator sections={sections} activeSection={activeSection} />
      {sections.map((section, index) => (
        <Section
          key={index}
          title={section.title}
          isVisible={activeSection >= index + 1}
          data={formData[section.id]}
          onUpdate={(data) => handleSectionUpdate(section.id, data)}
        />
      ))}
      {activeSection < sections.length && (
        <button className="next-button" onClick={handleNext}>
          Next
        </button>
      )}
    </div>
  );
};

export default LoanApplicationForm;
