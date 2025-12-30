import { useEffect, useMemo, useState } from "react";
import { useEmployee } from "../../Hooks/useEmployee";
import "./LeadStyles.css";
import { useAuthContext } from "../../Hooks/useAuthContext";
import ChangeTypeForm from "../Forms/ChangeTypeForm/ChangeTypeForm";
import ScheduleDateForm from "../Forms/ScheduleDateForm/ScheduleDateForm";
import LeadStatusForm from "../Forms/LeadStatusForm/LeadStatusForm";
import Search from "../Search/Search";

const Leads = () => {
  const { getEmployeeLeads, empLeads } = useEmployee();
  const { emp } = useAuthContext();
  const [active, setActive] = useState({ id: null, action: null });
  const [searchTerm, setSearchTerm] = useState("");

  const toggleAction = (leadId, action) => {
    setActive((prev) =>
      prev.id === leadId && prev.action === action
        ? { id: null, action: null }
        : { id: leadId, action }
    );
  };

  const mergedLeads = useMemo(() => {
    return [...(empLeads.assignedLeads || []), ...(empLeads.closedLeads || [])];
  }, [empLeads]);

  const filteredLeads = useMemo(() => {
    if (!searchTerm) return mergedLeads;

    const term = searchTerm.toLowerCase();

    return mergedLeads.filter((lead) => {
      const nameMatch = lead.leadName?.toLowerCase().includes(term);

      const emailMatch = lead.leadEmail?.toLowerCase().includes(term);

      const typeMatch = lead.type?.toLowerCase().includes(term);

      const statusMatch = lead.status?.toLowerCase().includes(term);

      const ongoingMatch = term === "ongoing" && lead.status !== "Closed";

      const closedMatch = term === "closed" && lead.status === "Closed";

      return (
        nameMatch ||
        emailMatch ||
        typeMatch ||
        statusMatch ||
        ongoingMatch ||
        closedMatch
      );
    });
  }, [mergedLeads, searchTerm]);

  useEffect(() => {
    if (emp?.token) {
      getEmployeeLeads();
    }
  }, [emp, getEmployeeLeads]);

  const closeForm = () => setActive({ id: null, action: null });

  return (
    <div className="leads">
      <Search onSearch={setSearchTerm} />
      {filteredLeads.map((l) => (
        <div
          key={l._id}
          className={l.status === "Closed" ? "closed-lead" : "assigned-lead"}
        >
          <div className="div-1">
            <div className="name-email-div">
              <p className="lead-name">{l.leadName}</p>
              <p className="lead-email">@{l.leadEmail}</p>
            </div>

            <div className="date-div">
              <img src="calendar-icon.png" alt="date" className="icon" />
              <p className="date">
                {new Date(l.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="div-2">
            <div className="status-type">
              <div
                className={
                  { Hot: "hot-type", Warm: "warm-type", Cold: "cold-type" }[
                    l.type
                  ] || "warm-type"
                }
              >
                <div className="status">
                  <p>{l.status}</p>
                </div>
              </div>
            </div>

            <div className="lead-btns">
              <img
                src="type-icon.png"
                alt="type"
                className="icon"
                onClick={() => toggleAction(l._id, "type")}
              />

              <img
                src="schedule-icon.png"
                alt="schedule"
                className="icon"
                onClick={() => toggleAction(l._id, "schedule")}
              />

              <img
                src="lead-status-icon.png"
                alt="status"
                className="icon"
                onClick={() => toggleAction(l._id, "status")}
              />

              {active.id === l._id && active.action === "type" && (
                <ChangeTypeForm leadId={l._id} close={closeForm} />
              )}

              {active.id === l._id && active.action === "schedule" && (
                <ScheduleDateForm leadId={l._id} close={closeForm} />
              )}

              {active.id === l._id && active.action === "status" && (
                <LeadStatusForm
                  leadId={l._id}
                  currStatus={l.status}
                  scheduledDate={l.scheduledDate}
                  close={closeForm}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leads;
