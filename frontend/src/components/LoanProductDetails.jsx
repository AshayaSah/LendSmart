import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
} from "@mui/material";

const LoanProductDetails = () => {
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
        setProductData(data.message.data || []);
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

    // Find the selected product based on the selected value
    const selected = productData.find(
      (product) => product.product_type === value
    );
    setSelectedProduct(selected); // Set the selected product
  };

  return (
    <>
      <div className="form-section">
        <Typography variant="h6">Loan Details</Typography>

        <div className="form-section-content-container py-4">
          <div className="form-section-content">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="loan-type-label">Loan Type</InputLabel>
              <Select
                labelId="loan-type-label"
                name="productType"
                value={loanData.productType}
                onChange={handleDataChange}
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
        {selectedProduct && (
          <div className="form-section-content-container pt-0">
            {/* Loan Amount */}
            <div className="form-section-content">
              <TextField
                label={selectedProduct.loan_amount}
                variant="outlined"
                name="loanAmount"
                value={loanData.loanAmount}
                onChange={handleDataChange}
                fullWidth
                margin="normal"
              />
            </div>

            {/* Loan Tenure */}
            <div className="form-section-content">
              <TextField
                label={selectedProduct.loan_tenure}
                variant="outlined"
                name="loanTenure"
                value={loanData.loanTenure}
                onChange={handleDataChange}
                fullWidth
                margin="normal"
              />
            </div>

            {/* Interest Rate */}
            <div className="form-section-content">
              <TextField
                label={selectedProduct.interest_rate}
                variant="outlined"
                name="interestRate"
                value={loanData.interestRate}
                onChange={handleDataChange}
                fullWidth
                margin="normal"
              />
            </div>

            {/* Purpose of Loan */}
            <div className="form-section-content">
              <TextField
                label={selectedProduct.purpose_of_loan}
                variant="outlined"
                name="purposeOfLoan"
                value={loanData.purposeOfLoan}
                onChange={handleDataChange}
                fullWidth
                margin="normal"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoanProductDetails;
