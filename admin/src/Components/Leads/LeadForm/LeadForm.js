import "./LeadFormStyles.css";
import { useAdmin } from "../../../Hooks/useAdmin";

const LeadForm = ({ onClose }) => {
  const { newLead, setNewLead, addLead } = useAdmin();

  const handleLeadForm = (e) => {
    const { name, value } = e.target;
    setNewLead({ ...newLead, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addLead();
    setNewLead({
      leadName: "",
      leadEmail: "",
      source: "",
      date: "",
      leadLocation: "",
      leadLanguage: "",
    });
    onClose();
  };

  return (
    <div className="lead-form-wrapper">
      <div className="lead-form">
        <div className="title">
          <p className="title-p">Add New Lead</p>
          <img
            src="close-icon.png"
            alt="close"
            className="close"
            onClick={onClose}
          />
        </div>

        <form className="leads-form" onSubmit={handleSubmit}>
          <label>
            <p>Name</p>
            <input
              type="text"
              name="leadName"
              value={newLead.leadName}
              placeholder="Enter Lead Name"
              onChange={handleLeadForm}
            />
          </label>

          <label>
            <p>Email</p>
            <input
              type="email"
              name="leadEmail"
              value={newLead.leadEmail}
              placeholder="Enter Email"
              onChange={handleLeadForm}
            />
          </label>

          <label>
            <p>Source</p>
            <input
              type="text"
              name="source"
              value={newLead.source}
              placeholder="Enter the source"
              onChange={handleLeadForm}
            />
          </label>

          <label>
            <p>Date</p>
            <input
              type="date"
              name="date"
              value={newLead.date}
              onChange={handleLeadForm}
            />
          </label>

          <label>
            <p>Location</p>
            <input
              name="leadLocation"
              value={newLead.leadLocation}
              placeholder="Enter Lead Location"
              onChange={handleLeadForm}
            />
          </label>

          <label>
            <p>Preferred Language</p>
            <input
              name="leadLanguage"
              value={newLead.leadLanguage}
              placeholder="Enter Lead Language"
              onChange={handleLeadForm}
            />
          </label>

          <button className="save-btn">Save</button>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
