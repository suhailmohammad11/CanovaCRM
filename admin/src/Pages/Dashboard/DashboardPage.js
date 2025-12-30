import Dashboard from "../../Components/Dashboard/Dashboard";
import Navbar from "../../Components/Navbar/Navbar";
import "./DashboardPageStyles.css";

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-navbar">
        <Navbar />
      </div>
      <div className="dashboard-dashboard">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
