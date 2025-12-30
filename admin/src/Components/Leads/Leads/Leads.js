import { useEffect, useState } from "react";
import { useAdmin } from "../../../Hooks/useAdmin";
import "./LeadStyles.css";
import LeadForm from "../LeadForm/LeadForm";
import CsvUpload from "../../UploadCSV/CsvUpload";
import { useNavigate } from "react-router-dom";
import Search from "../../Search/Search";

const Leads = () => {
  const { leads, getLeads } = useAdmin();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  const getLeadScore = (lead, query) => {
    if (!query) return 1;

    const q = query.toLowerCase();
    let score = 0;

    const name = lead.leadName?.toLowerCase() || "";
    const email = lead.leadEmail?.toLowerCase() || "";
    const location = lead.leadLocation?.toLowerCase() || "";
    const language = lead.leadLanguage?.toLowerCase() || "";
    const source = lead.source?.toLowerCase() || "";
    const status = lead.status?.toLowerCase() || "";
    const assignedTo = lead.AssignedTo?._id?.toLowerCase() || "";

    if (name.startsWith(q)) score += 50;
    else if (name.includes(q)) score += 30;

    if (email.startsWith(q)) score += 40;
    else if (email.includes(q)) score += 25;

    if (location === q) score += 20;
    if (language === q) score += 20;
    if (source === q) score += 15;
    if (status === q) score += 15;

    if (assignedTo.includes(q)) score += 10;

    return score;
  };

  const rankedLeads = leads
    ?.map((lead) => ({
      ...lead,
      score: getLeadScore(lead, searchTerm),
    }))
    .filter((lead) => lead.score > 0)
    .sort((a, b) => b.score - a.score);

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentLeads = rankedLeads?.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil((rankedLeads?.length || 0) / recordsPerPage);
  useEffect(() => {
    getLeads();
  }, [getLeads]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 1) return pages;

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 3, currentPage + 2);

    pages.push(1);

    // Left ellipsis
    if (start > 2) {
      pages.push("...");
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (end < totalPages - 3) {
      pages.push("...");
    }

    // Last 3 pages
    for (let i = Math.max(totalPages - 2, 2); i <= totalPages; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="leads">
      <Search value={searchTerm} onChange={setSearchTerm} />
      <div className="line">
        <img src="long-line.png" alt="long-line" className="long-line" />
      </div>
      <div className="leads-crumb-buttons">
        <div className="path-crumbs">
          <p onClick={() => navigate("/dashboard")}>Home</p>
          <img src="crumb-right.png" alt="right" className="crumb-right" />
          <p>Leads</p>
        </div>
        <div className="leads-buttons">
          <button
            className="buttons"
            onClick={() => {
              setShowForm(true);
              setShowCSV(false);
            }}
          >
            Add Manually
          </button>
          <button
            className="buttons"
            onClick={() => {
              setShowForm(false);
              setShowCSV(true);
            }}
          >
            Add CSV
          </button>
        </div>
      </div>
      <div className="table-section">
        <div className="table-container">
          {showForm && !showCSV && (
            <LeadForm onClose={() => setShowForm(false)} />
          )}
          {!showForm && showCSV && (
            <CsvUpload close={() => setShowCSV(false)} />
          )}
          <table className="leads-table">
            <thead>
              <tr>
                <th className="no">No</th>
                <th className="name">Name</th>
                <th className="email">Email</th>
                <th className="source">Source</th>
                <th className="date">Date</th>
                <th className="location">Location</th>
                <th className="language">Language</th>
                <th className="assigned-to">Assigned To</th>
                <th className="status">Status</th>
                <th className="type">Type</th>
                <th className="scheduled-date">Scheduled Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="thead-divider">
                <td colSpan="11">
                  <img src="long-line.png" alt="divider" />
                </td>
              </tr>
              {currentLeads &&
                currentLeads.map((lead, index) => (
                  <tr key={lead._id}>
                    <td className="no">{firstIndex + index + 1}</td>
                    <td className="name">{lead.leadName}</td>
                    <td className="email">{lead.leadEmail}</td>
                    <td className="source">{lead.source}</td>
                    <td className="date">
                      {lead.date
                        ? new Date(lead.date).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                    <td className="location">{lead.leadLocation}</td>
                    <td className="language">{lead.leadLanguage}</td>
                    <td className="assigned-to">
                      {lead.AssignedTo?._id ?? "-"}
                    </td>
                    <td className="status">{lead.status}</td>
                    <td className="type">{lead.type}</td>
                    <td className="scheduled-date">
                      {lead.scheduledDate
                        ? new Date(lead.scheduledDate).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination">
        <div className="prev-div">
          <img src="prev-icon.png" alt="prev" className="page-icon" />
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="prev-button"
          >
            Previous
          </button>
        </div>

        <div className="page-numbers">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`dots-${index}`} className="dots">
                ...
              </span>
            ) : (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            )
          )}
        </div>
        <div className="next-div">
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="next-button"
          >
            Next
          </button>
          <img src="next-icon.png" alt="next" className="page-icon" />
        </div>
      </div>
    </div>
  );
};

export default Leads;
