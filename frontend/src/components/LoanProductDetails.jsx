import React, { useEffect, useState } from "react";

const LoanForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);
  const [loanData, setLoanData] = useState({
    productType: "",
  });

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
  };

  return (
    <>
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
              {productData.map((type) => (
                <option key={type.name || type.idx} value={type.product_type}>
                  {type.product_type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </>
  );
};

export default LoanForm;
