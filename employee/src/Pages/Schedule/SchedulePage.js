import Header from "../../Components/Header/Header";
import ScheduledLeads from "../../Components/ScheduledLeads/ScheduledLeads";
import "./SchedulePageStyles.css";

const SchedulePage = () => {
  return (
    <div className="schedule-page">
      <div className="schedule-page-header">
        <Header />
      </div>
      <div className="schedule-page-leads">
        <ScheduledLeads />
      </div>
    </div>
  );
};

export default SchedulePage;
