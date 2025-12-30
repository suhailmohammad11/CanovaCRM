import Header from "../../Components/Header/Header";
import Leads from "../../Components/Leads/Leads";
import "./LeadPageStyles.css";

const LeadsPage = () => {
  return (
    <div className="leads-page">
      <div className="leads-page-header">
        <Header />
      </div>
      <div className="leads-page-leads">
        <Leads />
      </div>
    </div>
  );
};

export default LeadsPage;
