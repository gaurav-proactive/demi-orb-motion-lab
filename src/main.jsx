import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { CognitionPage } from "./CognitionPage.jsx";
import "./styles.css";

const isCognitionPage = window.location.pathname === "/cognition" || window.location.pathname === "/cognition/";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isCognitionPage ? <CognitionPage /> : <App />}
  </React.StrictMode>,
);
