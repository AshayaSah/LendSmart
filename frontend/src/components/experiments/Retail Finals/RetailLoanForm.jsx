import React, { useEffect, useState } from "react";

const App = () => {
  const [sections, setSections] = useState({}); // State to hold all sections dynamically

  useEffect(() => {
    // Simulate fetching the data
    const fetchedData = {
      applicant_name: "John Doe",
      applicant_age: 30,
      beneficiary_name: "Jane Doe",
      beneficiary_age: 28,
      guarantor_name: "Richard Roe",
      guarantor_contact: "123-456-7890",
    };

    // Segregate the data into sections dynamically
    const sectionedData = {};
    for (const key in fetchedData) {
      const section = key.split("_")[0]; // Extract section name from the prefix
      if (!sectionedData[section]) {
        sectionedData[section] = {}; // Initialize section if not exists
      }
      console.log("Divided Data into Sections:", sectionedData); // Log the divided data
      sectionedData[section][key] = fetchedData[key]; // Use the same key and value
    }

    setSections(sectionedData); // Update state with dynamic sections
  }, []);

  // Handle input changes dynamically
  const handleInputChange = (section, key, value) => {
    setSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <div>
      <h1>Dynamic Form</h1>

      {Object.keys(sections).map((section) => (
        <div key={section}>
          <h2>{section.charAt(0).toUpperCase() + section.slice(1)} Details</h2>
          <form>
            {Object.keys(sections[section]).map((key) => (
              <div key={key}>
                <label>
                  {key}: {/* Use the same key as label */}
                  <input
                    type="text"
                    name={key}
                    value={sections[section][key]}
                    onChange={(e) =>
                      handleInputChange(section, key, e.target.value)
                    }
                  />
                </label>
              </div>
            ))}
          </form>
        </div>
      ))}
    </div>
  );
};

export default App;
