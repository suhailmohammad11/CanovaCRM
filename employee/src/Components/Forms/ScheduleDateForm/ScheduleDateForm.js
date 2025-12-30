import { useState } from "react";
import { useEmployee } from "../../../Hooks/useEmployee";
import "./ScheduleDateFormStyles.css";

const ScheduleDateForm = ({ leadId, close }) => {
  const { scheduleLead } = useEmployee();
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    if (!dateStr || !timeStr) {
      alert("Please select date and time");
      return;
    }

    const isoDate = new Date(`${dateStr}T${timeStr}`).toISOString();
    scheduleLead(leadId, isoDate);
    close();
  };

  return (
    <form className="schedule-date-form" onSubmit={handleSave}>
      <label className="schedule-label">
        <p className="schedule-title">Date</p>
        <input
          className="schedule-input"
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
        />
      </label>

      <label className="schedule-label">
        <p className="schedule-title">Time</p>
        <input
          className="schedule-input"
          type="time"
          value={timeStr}
          onChange={(e) => setTimeStr(e.target.value)}
        />
      </label>

      <button className="sd-btn" type="submit">
        Save
      </button>
    </form>
  );
};

export default ScheduleDateForm;
