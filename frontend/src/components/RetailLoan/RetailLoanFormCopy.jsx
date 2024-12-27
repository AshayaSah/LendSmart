import React, { useEffect, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  LinearProgress,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Logo from "../../assets/logo.png";

const App = () => {
  const [sections, setSections] = useState({}); // State to hold all sections dynamically
  const [steps, setSteps] = useState([]); // State to hold the dynamic steps

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

    // Generate steps dynamically based on sections
    const generatedSteps = Object.keys(sectionedData).map(
      (section) =>
        section.charAt(0).toUpperCase() + section.slice(1) + " Details"
    );

    setSteps(generatedSteps); // Update the steps state

    console.log("Steps:", generatedSteps); // Log steps for verification
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

  const renderStepContent = (steps) => {
    const sectionKeys = Object.keys(sections); // Extract section names dynamically
    console.log("The section Keys", sectionKeys);
    switch (sectionKeys[steps]) {
      case "applicant":
        return (
          <div className="form-section">
            <Typography variant="h6">Applicant Details</Typography>
            <div className="form-section-content-container">
              {Object.keys(sections.applicant).map((key) => (
                <div key={key} className="form-section-content">
                  <TextField
                    fullWidth
                    label={key} // Use the key as the label
                    name={key}
                    value={sections.applicant[key]} // Fetch value from state
                    onChange={(e) =>
                      setSections((prev) => ({
                        ...prev,
                        applicant: {
                          ...prev.applicant,
                          [key]: e.target.value,
                        },
                      }))
                    }
                    margin="normal"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "beneficiary":
        return (
          <div className="form-section">
            <Typography variant="h6">Beneficiary Details</Typography>
            <div className="form-section-content-container">
              {Object.keys(sections.beneficiary).map((key) => (
                <div key={key} className="form-section-content">
                  <TextField
                    fullWidth
                    label={key}
                    name={key}
                    value={sections.beneficiary[key]}
                    onChange={(e) =>
                      setSections((prev) => ({
                        ...prev,
                        beneficiary: {
                          ...prev.beneficiary,
                          [key]: e.target.value,
                        },
                      }))
                    }
                    margin="normal"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "guarantor":
        return (
          <div className="form-section">
            <Typography variant="h6">Guarantor Details</Typography>
            <div className="form-section-content-container">
              {Object.keys(sections.guarantor).map((key) => (
                <div key={key} className="form-section-content">
                  <TextField
                    fullWidth
                    label={key}
                    name={key}
                    value={sections.guarantor[key]}
                    onChange={(e) =>
                      setSections((prev) => ({
                        ...prev,
                        guarantor: {
                          ...prev.guarantor,
                          [key]: e.target.value,
                        },
                      }))
                    }
                    margin="normal"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    alert("Form submitted successfully!");
  };
  const completionPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="form-container">
      {/* Left Side Stepper */}
      <div className="sm:w-1/4 w-full mt-6 bg-white">
        <div className="sticky top-0 z-10">
          <div className="logo p-6 pl-0">
            <img src={Logo} alt="" />
          </div>
          <Stepper orientation="vertical" activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>

      {/* Right Side Content */}
      <div className="sm:w-3/4 w-full pl-6">
        {/* Progress Bar */}
        <div className="sticky top-0 z-10 bg-white pb-1 mb-2">
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{ mb: 2, height: "16px" }} // Adjust the height here
          />
          <Typography variant="body2" color="textSecondary" align="right">
            {Math.round(completionPercentage)}%
          </Typography>
        </div>

        {/* Form Sections */}
        {[...Array(activeStep + 1).keys()].map((step) => (
          <div key={step} className="mb-4">
            {renderStepContent(step)}
          </div>
        ))}

        {/* Form Buttons */}
        <div className="mt-4 flex justify-between">
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
