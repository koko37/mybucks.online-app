import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import StoreProvider from "@mybucks/contexts/Store";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "@mybucks/styles/global.js";
import themes from "@mybucks/styles/themes.js";

// [TODO] Remove index.css
import "@mybucks/index.css";
import "@mybucks/styles/font.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={themes.light}>
      <GlobalStyle />
      <StoreProvider>
        <App />
      </StoreProvider>
    </ThemeProvider>
  </React.StrictMode>
);
