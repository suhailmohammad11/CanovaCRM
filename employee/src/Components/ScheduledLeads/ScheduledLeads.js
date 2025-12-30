import "./ScheduledLeadStyles.css";
import { useEmployee } from "../../Hooks/useEmployee";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import Search from "../Search/Search";
import ScheduleFilterForm from "../Forms/ScheduleFilterForm/ScheduleFilterForm";

const ScheduledLeads = () => {
  const { getEmployeeLeads, empLeads } = useEmployee();
  const { emp } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState("all");
  const today = new Date().toLocaleDateString("en-GB");
  const titleCard = (name) => {
    const names = name
      .trim()
      .split(" ")
      .map((n) => n[0].toUpperCase());
    return names.join("");
  };
  const scheduledLeads = useMemo(() => {
    return (
      empLeads.assignedLeads?.filter((lead) => lead.scheduledDate !== "-") || []
    );
  }, [empLeads]);
  const filteredLeads = scheduledLeads.filter((lead) => {
    const leadDate = new Date(lead.scheduledDate).toLocaleDateString("en-GB");

    const matchesSearch =
      lead.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || leadDate === today;

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (emp?.token) getEmployeeLeads();
  }, [emp, getEmployeeLeads]);

  return (
    <div className="scheduled-leads">
      <Search
        onSearch={setSearchTerm}
        onFilter={() => setShowFilter((prev) => !prev)}
      />
      {showFilter && (
        <ScheduleFilterForm
          value={filter}
          onSelect={setFilter}
          close={() => setShowFilter(false)}
        />
      )}
      {filteredLeads.length > 0 ? (
        filteredLeads.map((lead) => {
          return (
            <div className="lead" key={lead._id}>
              <div className="referral-date">
                <div className="lead-id">
                  <p className="l-source">{lead.source}</p>
                  <p className="l-id">{lead._id}</p>
                </div>
                <div className="scheduled-date">
                  <p>Date</p>
                  <p>
                    {new Date(lead.scheduledDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="call-name">
                <div className="call">
                  <img
                    src="location-icon.png"
                    className="loc-icon"
                    alt="location"
                  />
                  <p>Call</p>
                </div>
                <div className="lead-name">
                  <div className="name-card">
                    <p className="c-name">{titleCard(lead.leadName)}</p>
                  </div>
                  <p className="l-name">{lead.leadName}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No Scheduled Leads</p>
      )}
    </div>
  );
};

export default ScheduledLeads;
