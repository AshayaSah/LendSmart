// App.js
import React, { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Typography,
  Button,
} from "@mui/material";
import Logo from "../../assets/logo.png";
import RenderSection from "./RenderSection"; // Import the RenderSection component

const App = () => {
  const [fetchedData, setFetchedData] = useState({});
  const [sections, setSections] = useState({});
  const [steps, setSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [finalData, setFinalData] = useState({}); // State to hold the final submission data
  const [formValues, setFormValues] = useState({}); // State to hold the values for the text fields
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFetchTable = async () => {
    const home = "ashaya.com:8000";
    const fetchRetailTableData = `http://${home}/api/method/onlinelc.api.fetch_retail_table_data`;
    const authorizationToken = "fe850d916626397:77854dc086219ac";

    try {
      document.cookie =
        "sid=a7a8133df3cbfb0084024e45cc363db40c93f40506d6c4b3d26326db";

      const response = await fetch(fetchRetailTableData, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ limit: 50 }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error ${response.status}: ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      const jsonData = data.message.data[0] || [];
      setFetchedData(jsonData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataAndProcess = async () => {
      await handleFetchTable();
    };

    fetchDataAndProcess();
  }, []); // Only run once when the component mounts
  useEffect(() => {
    if (Object.keys(fetchedData).length > 0) {
      // Process the fetchedData object only after it has been set
      const sectionedData = {};
      for (const key in fetchedData) {
        const section = key.split("_")[0];
        if (!sectionedData[section]) {
          sectionedData[section] = {};
        }
        sectionedData[section][key] = fetchedData[key];
      }

      setSections(sectionedData);
      console.log("The sectioned data is:", sectionedData);

      const initialFormValues = Object.keys(fetchedData).reduce((acc, key) => {
        acc[key] = ""; // Set initial value to empty string
        return acc;
      }, {});

      setFormValues(initialFormValues);

      const generatedSteps = Object.keys(sectionedData).map(
        (section) =>
          section.charAt(0).toUpperCase() + section.slice(1) + " Details"
      );

      setSteps(generatedSteps);
    }
  }, [fetchedData]); // Run this effect when fetchedData changes

  const handleInputChange = (key, value) => {
    // Update the formValues state to reflect the changes
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [key]: value, // Save the updated value in the formValues object
    }));

    // Log the form values to the console
    console.log("Current Form Values:", {
      ...formValues,
      [key]: value,
    });
  };

  useEffect(() => {
    console.log("The final data is ", finalData);
  }, [finalData]);

  const completionPercentage = ((activeStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    alert("Form submitted successfully!");
    console.log("Final Submission Data:", formValues); // Log the final data to be submitted
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="form-container flex flex-col md:flex-row">
      {/* Hamburger Menu Button */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="p-4">
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Stepper Section */}
      <div
        className={`md:w-1/4 w-full mt-6 bg-white ${
          isMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="sticky top-0 z-10">
          <div className="logo p-6 pl-0">
            <img src={Logo} alt="" />
          </div>
          <Stepper orientation="vertical" activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="md:w-3/4 w-full md:pl-6 sm:pl-0">
        <div className="sticky top-0 z-10 bg-white pb-1 mb-2">
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{ mb: 2, height: "16px" }}
          />
          <Typography variant="body2" color="textSecondary" align="right">
            {Math.round(completionPercentage)}%
          </Typography>
        </div>

        {/* Render all sections up to the current active step */}
        {Object.keys(sections)
          .slice(0, activeStep + 1)
          .map((section) => (
            <RenderSection
              key={section}
              section={section}
              data={sections[section]}
              formValues={formValues}
              onChange={handleInputChange}
            />
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
