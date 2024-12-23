import React, { useState } from "react";
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

const steps = [
  "Personal Details",
  "Employment Details",
  "Loan Details",
  "Confirmation",
];

const LoanForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    isExistingCustomer: "",
    name: "",
    email: "",
    phone: "",
    employmentStatus: "",
    monthlyIncome: "",
    loanAmount: "",
    loanPurpose: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
                  value={formData.isExistingCustomer}
                  name="isExistingCustomer"
                  onChange={handleChange}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </div>
            {formData.isExistingCustomer == "Yes" ? (
              <div>
                <Typography variant="h6">Personal Details</Typography>
                <div className="form-section-content-container pt-0">
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
          <Box>
            <Typography variant="h6">Employment Details</Typography>
            <TextField
              fullWidth
              label="Employment Status"
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Monthly Income"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6">Loan Details</Typography>
            <TextField
              fullWidth
              label="Loan Amount"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Loan Purpose"
              name="loanPurpose"
              value={formData.loanPurpose}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6">Confirmation</Typography>
            <Typography>Name: {formData.name}</Typography>
            <Typography>Email: {formData.email}</Typography>
            <Typography>Phone: {formData.phone}</Typography>
            <Typography>
              Employment Status: {formData.employmentStatus}
            </Typography>
            <Typography>Monthly Income: {formData.monthlyIncome}</Typography>
            <Typography>Loan Amount: {formData.loanAmount}</Typography>
            <Typography>Loan Purpose: {formData.loanPurpose}</Typography>
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const completionPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    // <Grid container spacing={2} sx={{ width: "90%", margin: "auto" }}>
    //   {/* Left Side Stepper */}
    //   <Grid
    //     item
    //     sm={3}
    //     sx={{
    //       position: "sticky",
    //       top: 0,
    //       alignSelf: "flex-start",
    //       zIndex: 1000,
    //       background: "#fff",
    //     }}
    //   >
    //     <Stepper orientation="vertical" activeStep={activeStep}>
    //       {steps.map((label, index) => (
    //         <Step key={label}>
    //           <StepLabel>{label}</StepLabel>
    //         </Step>
    //       ))}
    //     </Stepper>
    //   </Grid>

    //   {/* Right Side Content */}
    //   <Grid item sm={9}>
    //     {/* Progress Bar  */}
    //     <Box
    //       sx={{
    //         position: "sticky",
    //         top: 0,
    //         zIndex: 1000,
    //         background: "#fff",
    //         pb: 1,
    //       }}
    //     >
    //       <LinearProgress
    //         variant="determinate"
    //         value={completionPercentage}
    //         sx={{ mb: 2, height: 10 }} // Set the height to 8px
    //       />
    //       <Typography variant="body2" color="textSecondary" align="right">
    //         {Math.round(completionPercentage)}%
    //       </Typography>
    //     </Box>

    //     {/* Form Sections  */}
    //     {[...Array(activeStep + 1).keys()].map((step) => (
    //       <Box key={step} sx={{ mb: 4 }}>
    //         {renderStepContent(step)}
    //       </Box>
    //     ))}

    //     {/* Form Buttons  */}
    //     <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
    //       <Button
    //         variant="outlined"
    //         disabled={activeStep === 0}
    //         onClick={handleBack}
    //       >
    //         Back
    //       </Button>
    //       {activeStep < steps.length - 1 ? (
    //         <Button variant="contained" onClick={handleNext}>
    //           Next
    //         </Button>
    //       ) : (
    //         <Button variant="contained" color="primary" onClick={handleSubmit}>
    //           Submit
    //         </Button>
    //       )}
    //     </Box>
    //   </Grid>
    // </Grid>
    <div className="form-container">
      {/* Left Side Stepper */}
      <div className="sm:w-1/4 w-full mt-6 sticky top-0 z-10 bg-white">
        <Stepper orientation="vertical" activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      {/* Right Side Content */}
      <div className="sm:w-3/4 w-full">
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
