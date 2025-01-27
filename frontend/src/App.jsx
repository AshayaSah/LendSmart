import React from "react";
import RetailLoanForm from "./components/RetailLoan/RetailLoanFormCopyCopy";
import { Container, Switch, Typography, Button } from "@mui/material";
import ThemeProviderComponent, {
  useThemeContext,
} from "./components/ThemeProviderComponent";
import FetchXMLDetails from "./components/experiments/FetchXMLDetails";

const App = () => {
  return (
    <ThemeProviderComponent>
      <MainContent />
    </ThemeProviderComponent>
  );
};

// MainContent is the part of your app where you want to manage theme toggle and show content
const MainContent = () => {
  const { toggleTheme, isDarkMode } = useThemeContext();

  return (
    <Container style={{ padding: "20px" }}>
      {/* <Typography variant="h5">Switch Theme Example</Typography>
      <Switch
        checked={isDarkMode}
        onChange={toggleTheme}
        name="themeSwitch"
        inputProps={{ "aria-label": "secondary checkbox" }}
      />
      <Typography variant="body1">
        The current theme is {isDarkMode ? "Dark Mode" : "Light Mode"}.
      </Typography> */}
      {/* <RetailLoanForm /> */}
      {/* <FetchXMLDetails></FetchXMLDetails> */}
      <RetailLoanFormCopyCopy></RetailLoanFormCopyCopy>
    </Container>
  );
};

export default App;
