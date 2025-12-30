import { useEffect, useState } from "react";
import "./EmployeeStyles.css";
import { useAdmin } from "../../../Hooks/useAdmin";
import { useNavigate } from "react-router-dom";
import Search from "../../Search/Search";

const Employees = ({
  showSearch = true,
  showHeader = true,
  statusFilter = null,
  externalSearchTerm = null,
  onSearchChange = null,
  enablePagination = true,
}) => {
  const {
    employees,
    getEmployees,
    handleDeleteButton,
    handleEditButton,
    setShowAddForm,
  } = useAdmin();

  const navigate = useNavigate();

  const [showEditDelete, setShowEditDelete] = useState(null);
  const [internalSearch, setInternalSearch] = useState("");
  const searchTerm = externalSearchTerm ?? internalSearch;

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  const toggleEditDelete = (id) => {
    setShowEditDelete((prev) => (prev === id ? null : id));
  };

  const effectiveSearchTerm = externalSearchTerm ?? searchTerm;

  useEffect(() => {
    if (!externalSearchTerm) return;
    setCurrentPage(1);
  }, [externalSearchTerm]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const getEmployeeScore = (emp, query) => {
    if (!query) return 1;
    const q = query.toLowerCase();
    let score = 0;
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const email = emp.email.toLowerCase();
    const empId = emp._id.toLowerCase();
    const status = emp.status.toLowerCase();

    if (fullName.startsWith(q)) score += 50;
    else if (fullName.includes(q)) score += 30;

    if (email.startsWith(q)) score += 40;
    else if (email.includes(q)) score += 25;

    if (empId.includes(q)) score += 35;

    if (status === q) score += 20;

    return score;
  };

  const filteredEmployees = employees
    ?.filter((emp) => !statusFilter || emp.status === statusFilter)
    .map((emp) => ({
      ...emp,
      score: getEmployeeScore(emp, effectiveSearchTerm),
    }))
    .filter((emp) => emp.score > 0)
    .sort((a, b) => b.score - a.score);

  // Pagination
  const totalPages = Math.ceil(
    (filteredEmployees?.length || 0) / recordsPerPage
  );
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const visibleEmployees = enablePagination
    ? filteredEmployees?.slice(firstIndex, lastIndex)
    : filteredEmployees;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 1) return pages;
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 3, currentPage + 2);
    pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 3) pages.push("...");
    for (let i = Math.max(totalPages - 2, 2); i <= totalPages; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="employees">
      {showSearch && (
        <div className="search-line">
          <Search value={searchTerm} onChange={setInternalSearch} />
          <div className="line">
            <img src="long-line.png" alt="long-line" className="long-line" />
          </div>
        </div>
      )}

      {showHeader && (
        <div className="employee-buttons">
          <div className="path-crumbs">
            <p onClick={() => navigate("/dashboard")}>Home</p>
            <img src="crumb-right.png" alt="right" className="crumb-right" />
            <p>Employees</p>
          </div>
          <button className="buttons" onClick={() => setShowAddForm(true)}>
            Add Employees
          </button>
        </div>
      )}

      <table className="employee-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Assigned Leads</th>
            <th>Closed Leads</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visibleEmployees.map((emp) => (
            <tr key={emp._id}>
              <td>
                <input type="checkbox" className="box" />
              </td>
              <td>
                <div className="name-card">
                  <div className="profile">
                    {emp.firstName.charAt(0)}
                    {emp.lastName.charAt(0)}
                  </div>
                  <div className="name-email">
                    <p className="emp-name">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="emp-email">{emp.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="emp-id">#{emp._id}</div>
              </td>
              <td>
                <div className="emp-leads">{emp.assignedLeads.length}</div>
              </td>
              <td>
                <div className="emp-leads">{emp.closedLeads.length}</div>
              </td>
              <td>
                <div
                  className={
                    emp.status === "active" ? "active-class" : "inactive-class"
                  }
                >
                  <img
                    src={
                      emp.status === "active" ? "greet-dot.png" : "red-dot.png"
                    }
                    alt="dot"
                    className="dot"
                  />
                  {emp.status}
                </div>
              </td>
              <td>
                <div className="actions">
                  <img
                    src="dots.png"
                    alt="dots"
                    className="dots"
                    onClick={() => toggleEditDelete(emp._id)}
                  />
                  {showEditDelete === emp._id && (
                    <div className="buttons-div">
                      <div
                        className="edit"
                        onClick={() => {
                          handleEditButton(emp);
                          setShowEditDelete(null);
                        }}
                      >
                        <img src="edit.png" alt="edit" />
                        <span>Edit</span>
                      </div>
                      <div
                        className="delete"
                        onClick={() => {
                          handleDeleteButton(emp._id);
                          setShowEditDelete(null);
                        }}
                      >
                        <img src="delete.png" alt="delete" />
                        <span>Delete</span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {enablePagination && (
        <div className="pagination">
          <div className="prev-div">
            <img src="prev-icon.png" alt="prev" className="page-icon" />
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="prev-button"
            >
              Previous
            </button>
          </div>
          <div className="page-numbers">
            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span key={`dots-${i}`} className="dots">
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
              onClick={() => setCurrentPage((p) => p + 1)}
              className="next-button"
            >
              Next
            </button>
            <img src="next-icon.png" alt="next" className="page-icon" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
