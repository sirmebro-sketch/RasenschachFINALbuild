import React from "react";
import { createRoot } from "react-dom/client";
import Rasenschach from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Rasenschach />
  </React.StrictMode>
);
