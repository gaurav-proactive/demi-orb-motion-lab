import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { CognitionPage } from "./CognitionPage.jsx";
import "./styles.css";

const normalizedPath = window.location.pathname.replace(/\/+$/, "");
const isCognitionPage = normalizedPath.endsWith("/cognition") || window.location.hash === "#/cognition";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isCognitionPage ? <CognitionPage /> : <App />}
  </React.StrictMode>,
);
