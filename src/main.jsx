import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { CognitionPage } from "./CognitionPage.jsx";
import "./styles.css";

function isCognitionRoute() {
  const normalizedPath = window.location.pathname.replace(/\/+$/, "");
  return normalizedPath.endsWith("/cognition") || window.location.hash === "#/cognition";
}

function OrbSystemRouter() {
  const [isCognitionPage, setIsCognitionPage] = useState(isCognitionRoute);

  useEffect(() => {
    const syncRoute = () => setIsCognitionPage(isCognitionRoute());
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  return isCognitionPage ? <CognitionPage /> : <App />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OrbSystemRouter />
  </React.StrictMode>,
);
