<h3 className="form-section-title">Applicant Details</h3>;

// Select Section
<div className="form-section-content">
  <label className="form-label">Type</label>
  <select
    class="form-select"
    name=""
    value={formData.data}
    onChange={handleDataChange}
  >
    <option value="">Select</option>
    <option value="EXISTING">EXISTING</option>
    <option value="NON-EXISTING">NON-EXISTING</option>
  </select>
</div>;

// Input Section
<div className="form-section-content">
  <label htmlFor="" className="form-label">
    Type
  </label>
  <input
    type="text"
    className="form-input"
    name=""
    value={formData.data}
    onChange={handleDataChange}
  />
</div>;

<div className="form-section">
  <div className="form-section-title">Loan Details</div>

  <div className="form-section-content-container">
    <div className="form-section-content">
      <label htmlFor="loan-type" className="form-label">
        Loan Type
      </label>
      <select
        className="form-select"
        name="productType"
        value={loanData.productType}
        onChange={handleDataChange}
      >
        <option value="" disabled>
          Select a loan type
        </option>
        {productData.map((type, index) => (
          <option key={index} value={type.product_type}>
            {type.product_type}
          </option>
        ))}
      </select>
    </div>
  </div>

  {loading && <p>Loading...</p>}
  {error && <p className="error-message">{error}</p>}

  {selectedProduct && (
    <div className="form-section-content-container pt-0">
      {/* Loan Amount  */}
      <div className="form-section-content">
        <label htmlFor="" className="form-label">
          {selectedProduct.loan_amount}
        </label>
        <input
          type="text"
          className="form-input"
          name="loanAmount"
          value={loanData.loanAmount}
          onChange={handleDataChange}
        />
      </div>

      {/* Loan Tenure  */}
      <div className="form-section-content">
        <label htmlFor="" className="form-label">
          {selectedProduct.loan_tenure}
        </label>
        <input
          type="text"
          className="form-input"
          name="loanTenure"
          value={loanData.loanTenure}
          onChange={handleDataChange}
        />
      </div>

      {/* Interest Rate  */}
      <div className="form-section-content">
        <label htmlFor="" className="form-label">
          {selectedProduct.interest_rate}
        </label>
        <input
          type="text"
          className="form-input"
          name="interestRate"
          value={loanData.interestRate}
          onChange={handleDataChange}
        />
      </div>

      {/* Purpose of Loan  */}
      <div className="form-section-content">
        <label htmlFor="" className="form-label">
          {selectedProduct.purpose_of_loan}
        </label>
        <input
          type="text"
          className="form-input"
          name="purposeOfLoan"
          value={loanData.purposeOfLoan}
          onChange={handleDataChange}
        />
      </div>
    </div>
  )}
</div>;

{
  selectedProduct && (
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
  );
}
