// Section.js
import React from "react";

const Section = ({ title, isVisible, data, onUpdate }) => {
  if (!isVisible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ ...data, [name]: value });
  };

  return (
    <div className="section">
      <h2>{title}</h2>
      <form>
        <div>
          <label>
            Field 1:
            <input
              type="text"
              name="field1"
              value={data.field1 || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Field 2:
            <input
              type="text"
              name="field2"
              value={data.field2 || ""}
              onChange={handleChange}
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default Section;
