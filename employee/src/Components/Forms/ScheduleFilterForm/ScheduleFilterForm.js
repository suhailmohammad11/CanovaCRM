import { useState } from "react";
import "./ScheduleFilterFormStyles.css";

const ScheduleFilterForm = ({ onSelect, value, close }) => {
  const [selected, setSelected] = useState(value || "today");

  const handleSave = () => {
    onSelect(selected);
    close();
  };

  return (
    <div className="schedule-filter-form">
      <p>Filter</p>
      <div className="filter-select">
        <select
          className="schedule-filter-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="all">All</option>
        </select>
      </div>
      <button className="sd-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default ScheduleFilterForm;
