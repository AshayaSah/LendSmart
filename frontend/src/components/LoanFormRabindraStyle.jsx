import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  LinearProgress,
  Typography,
  Button,
} from "@mui/material";

const steps = [
  "Personal Details",
  "Employment Details",
  "Loan Details",
  "Confirmation",
];

const LoanForm = () => {
  const [activeSections, setActiveSections] = useState([0]); // Tracks unlocked sections
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    employmentStatus: "",
    monthlyIncome: "",
    loanAmount: "",
    loanPurpose: "",
  });

  const totalMandatoryFields = 7; // Total number of mandatory fields
  const completedFields = Object.values(formData).filter(
    (value) => value.trim() !== ""
  ).length;
  const progressPercentage = Math.round(
    (completedFields / totalMandatoryFields) * 100
  );

  // Function to check if a section is complete
  const isSectionComplete = (sectionIndex) => {
    const conditions = [
      formData.name && formData.email && formData.phone,
      formData.employmentStatus && formData.monthlyIncome,
      formData.loanAmount && formData.loanPurpose,
    ];
    return conditions[sectionIndex];
  };

  // Unlock the next section automatically when the current section is complete
  useEffect(() => {
    const lastUnlockedSection = activeSections[activeSections.length - 1];
    if (
      isSectionComplete(lastUnlockedSection) &&
      !activeSections.includes(lastUnlockedSection + 1)
    ) {
      setActiveSections((prev) => [...prev, lastUnlockedSection + 1]);
    }
  }, [formData, activeSections]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    alert("Form submitted successfully!");
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6">Personal Details</Typography>
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
          </Box>
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

  return (
    <Box sx={{ display: "flex", width: "80%", margin: "auto", mt: 5 }}>
      {/* Vertical Stepper */}
      <Box sx={{ width: "25%" }}>
        <Stepper
          activeStep={activeSections[activeSections.length - 1]}
          orientation="vertical"
        >
          {steps.map((label, index) => (
            <Step key={label} completed={activeSections.includes(index)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Form and Progress */}
      <Box sx={{ width: "75%", pl: 4 }}>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{ mb: 2 }}
        />
        {activeSections.map((section) => (
          <Box key={section} sx={{ mb: 4 }}>
            {renderStepContent(section)}
          </Box>
        ))}
        {activeSections.length === steps.length && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LoanForm;
