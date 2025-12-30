import { useState, useMemo } from "react";
import { useEmployee } from "../../../Hooks/useEmployee";
import "./LeadStatusFormStyles.css";

const LeadStatusForm = ({ leadId, currStatus, scheduledDate, close }) => {
  const { closeLead } = useEmployee();
  const [status, setStatus] = useState(currStatus);

  const canClose = useMemo(() => {
    if (!scheduledDate || scheduledDate === "-") return false;
    return new Date() >= new Date(scheduledDate);
  }, [scheduledDate]);

  const handleSave = () => {
    if (status === "Closed") {
      closeLead(leadId);
    }
    close();
  };

  return (
    <div className="lead-status-form">
      <div className="status-icon">
        <p>Lead Status</p>
        <img src="info-icon.png" alt="info" className="info-icon" />
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="status-select"
      >
        <option value="Ongoing">Ongoing</option>
        {canClose && <option value="Closed">Closed</option>}
      </select>

      <button className="sd-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default LeadStatusForm;
