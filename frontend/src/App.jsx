import React from "react";
import LoanForm from "./components/LoanForm";
import LoanFormRabindraStyle from "./components/LoanFormRabindraStyle";
import LoanApplicationForm from "./components/LoanForm/LoanFormAshaya";
import LoanProductDetails from "./components/LoanProductDetails";

const App = () => {
  return (
    <>
      <div>
        {/* <LoanFormRabindraStyle></LoanFormRabindraStyle> */}
        <LoanProductDetails></LoanProductDetails>
      </div>
    </>
  );
};

export default App;
