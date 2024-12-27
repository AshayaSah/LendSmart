// RenderSection.js
import React from "react";
import {
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const RenderSection = ({ section, data, formValues, onChange }) => {
  return (
    <div className="form-section">
      <Typography variant="h6">
        {section.charAt(0).toUpperCase() + section.slice(1)} Details
      </Typography>
      <div className="form-section-content-container">
        {Object.entries(data).map(([key, value]) => {
          // Ensure value is a string
          if (typeof value === "string") {
            const match = value.match(/(.*)\((.*)\)/);
            if (match) {
              // Handle `Select` type fields
              const [_, label, options] = match;
              return (
                <div className="form-section-content" key={key}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>{label.trim()}</InputLabel>
                    <Select
                      label={label}
                      name={key}
                      value={formValues[key] || ""} // Default to empty string if undefined
                      onChange={(e) => onChange(key, e.target.value)}
                    >
                      {options.split(",").map((option) => (
                        <MenuItem key={option.trim()} value={option.trim()}>
                          {option.trim()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              );
            }
            // Default to TextField for plain text fields
            return (
              <div className="form-section-content" key={key}>
                <TextField
                  label={value} // Use the value as the label
                  variant="outlined"
                  name={key}
                  value={formValues[key] || ""} // Default to empty string if undefined
                  onChange={(e) => onChange(key, e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </div>
            );
          }
          return null; // Handle cases where value is not a string
        })}
      </div>
    </div>
  );
};

export default RenderSection;
