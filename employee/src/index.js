import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./Context/AuthContext";
import { EmployeeContextProvider } from "./Context/EmployeeContext";
import { AttendanceProvider } from "./Context/AttendanceContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <EmployeeContextProvider>
        <AttendanceProvider>
          <App />
        </AttendanceProvider>
      </EmployeeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
