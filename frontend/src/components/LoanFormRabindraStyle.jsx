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
import LoanProductDetails from "./LoanProductDetails";
import Logo from "../assets/logo.png";

const steps = [
  "Personal Details",
  "Employment Details",
  "Loan Details",
  "Confirmation",
];

const LoanForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);
  const [loanData, setLoanData] = useState({
    //Info about Customer
    isExistingCustomer: "",

    //Applicant Details
    name: "",
    email: "",
    phone: "",

    //Employment Status
    employmentStatus: "",
    monthlyIncome: "",

    //Loan Details
    productType: "",
    loanAmount: "",
    loanTenure: "",
    interestRate: "",
    purposeOfLoan: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null); // New state for selected product

  useEffect(() => {
    const handleFetchTable = async () => {
      const fetchRetailTableData =
        "http://192.168.10.3/api/method/online_lc.api.fetch_retail_table_data";
      const authorizationToken = import.meta.env.VITE_API_KEY;

      try {
        const response = await fetch(fetchRetailTableData, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({
            limit: 50,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const filteredData = (data.message.data || []).map((item) => ({
          loan_amount: item.loan_amount,
          loan_tenure: item.loan_tenure,
          product_name: item.product_name,
          product_type: item.product_type,
          purpose_of_loan: item.purpose_of_loan,
        }));
        setProductData(filteredData || []);
        console.log("Fetched data:", data); // This will log only once per fetch
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    handleFetchTable();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleDataChange = (e) => {
    const { name, value, checked, type, files } = e.target;

    setLoanData((prevState) => {
      const updatedLoanData = {
        ...prevState,
        [name]:
          type === "checkbox" ? checked : type === "file" ? files[0] : value,
      };

      console.log(updatedLoanData); // This will log every time the data changes
      return updatedLoanData;
    });
  };

  const handleLoanProduct = (e) => {
    const { name, value } = e.target;

    setLoanData((prevState) => {
      const updatedLoanData = {
        ...prevState,
        [name]: value,
      };
      console.log(updatedLoanData); // This will log every time the data changes
      return updatedLoanData;
    });
    // Find the selected product based on the selected value
    const selected = productData.find(
      (product) => product.product_type === value
    );
    setSelectedProduct(selected); // Set the selected product
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    alert("Form submitted successfully!");
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="form-section">
            <div className="form-section-content-container-single">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Are you an existing CAS Bank Customer ?
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Are you an existing CAS Bank Customer ?"
                  value={loanData.isExistingCustomer}
                  name="isExistingCustomer"
                  onChange={handleDataChange}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </div>
            {loanData.isExistingCustomer == "Yes" ? (
              <div>
                <Typography variant="h6">Personal Details</Typography>
                <div className="form-section-content-container">
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={loanData.name}
                    onChange={handleDataChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={loanData.email}
                    onChange={handleDataChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={loanData.phone}
                    onChange={handleDataChange}
                    margin="normal"
                    required
                  />
                </div>
              </div>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div className="form-section">
            <Typography variant="h6">Employment Details</Typography>
            <div className="form-section-content-container">
              <TextField
                fullWidth
                label="Employment Status"
                name="employmentStatus"
                value={loanData.employmentStatus}
                onChange={handleDataChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Monthly Income"
                name="monthlyIncome"
                value={loanData.monthlyIncome}
                onChange={handleDataChange}
                margin="normal"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section">
            <Typography variant="h6">Loan Details</Typography>

            <div className="form-section-content-container py-4">
              <div className="form-section-content">
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="loan-type-label">Loan Type</InputLabel>
                  <Select
                    name="productType"
                    value={loanData.productType}
                    onChange={handleLoanProduct}
                    label="Loan Type"
                  >
                    <MenuItem value="" disabled>
                      Select a loan type
                    </MenuItem>
                    {productData.map((type, index) => (
                      <MenuItem key={index} value={type.product_type}>
                        {type.product_type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {loading && <CircularProgress />}
            {error && <p className="error-message">{error}</p>}

            {/* Display selected product details if available */}
            {selectedProduct && typeof selectedProduct === "object" && (
              <div className="form-section-content-container pt-0">
                {Object.entries(selectedProduct).map(
                  ([fieldKey, fieldValue]) => {
                    // Ensure fieldValue is a string
                    if (typeof fieldValue === "string") {
                      const match = fieldValue.match(/(.*)\((.*)\)/);
                      if (match) {
                        // Handle `Select` type fields
                        const [_, label, options] = match;
                        return (
                          <div className="form-section-content" key={fieldKey}>
                            <FormControl fullWidth margin="normal">
                              <InputLabel>{label.trim()}</InputLabel>
                              <Select
                                name={fieldKey}
                                value={loanData[fieldKey] || ""} // Default to empty string if undefined
                                onChange={handleDataChange}
                              >
                                {options.split(",").map((option) => (
                                  <MenuItem
                                    key={option.trim()}
                                    value={option.trim()}
                                  >
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
                        <div className="form-section-content" key={fieldKey}>
                          <TextField
                            label={fieldValue}
                            variant="outlined"
                            name={fieldKey}
                            value={loanData[fieldKey] || ""} // Default to empty string if undefined
                            onChange={handleDataChange}
                            fullWidth
                            margin="normal"
                          />
                        </div>
                      );
                    }

                    // Handle cases where fieldValue is not a string
                    console.warn(
                      `Unexpected fieldValue type: ${typeof fieldValue}`,
                      fieldValue
                    );
                    return null; // Skip rendering for non-string field values
                  }
                )}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6">Confirmation</Typography>
            <Typography>Name: {loanData.name}</Typography>
            <Typography>Email: {loanData.email}</Typography>
            <Typography>Phone: {loanData.phone}</Typography>
            <Typography>
              Employment Status: {loanData.employmentStatus}
            </Typography>
            <Typography>Monthly Income: {loanData.monthlyIncome}</Typography>
            <Typography>Loan Amount: {loanData.loanAmount}</Typography>
            <Typography>Loan Purpose: {loanData.loanPurpose}</Typography>
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
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

export default LoanForm;
