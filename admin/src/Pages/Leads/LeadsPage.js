import Leads from "../../Components/Leads/Leads/Leads";
import "./LeadsPageStyles.css";
import Navbar from "../../Components/Navbar/Navbar";

const LeadsPage = () => {
  return (
    <div className="leads-page">
      <div className="leads-navbar">
        <Navbar />
      </div>
      <div className="leads-leads">
        <Leads />
      </div>
    </div>
  );
};

export default LeadsPage;
