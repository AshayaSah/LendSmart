// src/components/ThemeProviderComponent.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const ThemeContext = createContext();

const ThemeProviderComponent = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get initial theme from localStorage or default to light mode
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : false;
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#ff4081",
      },
      background: {
        default: "#ffffff",
        paper: "#f7f7f7",
      },
      text: {
        primary: "#000000",
        secondary: "#333333",
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#ff4081",
      },
      background: {
        default: "#121212",
        paper: "#1d1d1d",
      },
      text: {
        primary: "#ffffff",
        secondary: "#cccccc",
      },
    },
  });

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Save the theme to localStorage
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  // Apply the CSS custom properties dynamically
  useEffect(() => {
    const theme = isDarkMode ? darkTheme : lightTheme;
    const root = document.documentElement;

    root.style.setProperty("--primary-bg", theme.palette.background.default);
    root.style.setProperty("--secondary-bg", theme.palette.background.paper);
    root.style.setProperty("--primary-text", theme.palette.text.primary);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

export default ThemeProviderComponent;
