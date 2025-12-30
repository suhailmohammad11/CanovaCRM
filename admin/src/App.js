import "./App.css";
import LeadsPage from "./Pages/Leads/LeadsPage";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import EmployeesPage from "./Pages/Employees/EmployeesPage";
import Settings from "./Pages/Settings/Settings";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />}></Route>
          <Route path="/leads" element={<LeadsPage />}></Route>
          <Route path="/employees" element={<EmployeesPage />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
