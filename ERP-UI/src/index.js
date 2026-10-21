import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import App from "./App";
import LogIn from "./pages/user/Login";
import "react-toastify/dist/ReactToastify.css";
import "handsontable/dist/handsontable.full.min.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LogIn />} />
      <Route path="/*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
