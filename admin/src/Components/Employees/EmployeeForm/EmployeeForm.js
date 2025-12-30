import { useEffect } from "react";
import "./EmployeeFormStyles.css";
import { useAdmin } from "../../../Hooks/useAdmin";

const EmployeeForm = () => {
  const {
    getEmployees,
    addEmployee,
    editEmployee,
    showAddForm,
    showUpdateForm,
    handleAddEmployeeField,
    handleUpdateEmployeeField,
    setShowAddForm,
    updatedEmployeeForm,
    setShowUpdateForm,
  } = useAdmin();

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  if (!showAddForm && !showUpdateForm) return null;

  return (
    <div
      className="Employee-form"
      onClick={() => {
        setShowAddForm(false);
        setShowUpdateForm(false);
      }}
    >
      {/* Add Employee Form */}
      {showAddForm && (
        <form
          className="employee-form"
          onClick={(e) => e.stopPropagation()}
          onSubmit={(e) => {
            e.preventDefault();
            addEmployee();
            setShowAddForm(false);
          }}
        >
          <div className="title">
            <p className="title-p">Add New Employee</p>
            <img
              src="close-icon.png"
              alt="close"
              className="close"
              onClick={() => setShowAddForm(false)}
            />
          </div>

          <label>
            <p className="employee-form-p">First Name</p>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleAddEmployeeField}
            />
          </label>

          <label>
            <p className="employee-form-p">Last Name</p>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleAddEmployeeField}
            />
          </label>

          <label>
            <p className="employee-form-p">Email</p>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleAddEmployeeField}
            />
          </label>

          <label>
            <p className="employee-form-p">Location</p>
            <input
              type="text"
              name="location"
              placeholder="Location"
              onChange={handleAddEmployeeField}
            />
          </label>

          <label>
            <p className="employee-form-p">Preferred Language</p>
            <input
              type="text"
              name="language"
              placeholder="Preferred Language"
              onChange={handleAddEmployeeField}
            />
          </label>

          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      )}

      {/* Update Employee Form */}
      {showUpdateForm && (
        <form
          className="employee-update-form"
          onClick={(e) => e.stopPropagation()}
          onSubmit={(e) => {
            e.preventDefault();
            editEmployee(updatedEmployeeForm._id);
            setShowUpdateForm(false);
          }}
        >
          <div className="title">
            <p className="title-p">Update Employee</p>
            <img
              src="close-icon.png"
              alt="close"
              className="close"
              onClick={() => setShowUpdateForm(false)}
            />
          </div>

          <label>
            <p className="employee-form-p">First Name</p>
            <input
              type="text"
              name="firstName"
              value={updatedEmployeeForm.firstName}
              onChange={handleUpdateEmployeeField}
            />
          </label>

          <label>
            <p className="employee-form-p">Last Name</p>
            <input
              type="text"
              name="lastName"
              value={updatedEmployeeForm.lastName}
              onChange={handleUpdateEmployeeField}
            />
          </label>

          <label>
            <p className="employee-form-p">Email</p>
            <input
              type="email"
              name="email"
              value={updatedEmployeeForm.email}
              onChange={handleUpdateEmployeeField}
            />
          </label>

          <label>
            <p className="employee-form-p">Location</p>
            <input
              type="text"
              name="location"
              value={updatedEmployeeForm.location}
              onChange={handleUpdateEmployeeField}
            />
          </label>

          <label>
            <p className="employee-form-p">Preferred Language</p>
            <input
              type="text"
              name="language"
              value={updatedEmployeeForm.language}
              onChange={handleUpdateEmployeeField}
            />
          </label>

          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default EmployeeForm;
