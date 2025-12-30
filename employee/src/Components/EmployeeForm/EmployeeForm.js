import { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import { useEmployee } from "../../Hooks/useEmployee";
import { useLogout } from "../../Hooks/useLogout";
import { useNavigate } from "react-router-dom";
import "./EmployeeFormStyles.css";

export const EmployeeForm = () => {
  const {
    editProfileForm,
    setEditProfileForm,
    editProfile,
    getEmployeeDetails,
  } = useEmployee();
  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const { emp } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleEditField = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setEditProfileForm({ ...editProfileForm, [name]: value });
  };

  // Basic validations
  const validations = () => {
    let tempErrors = {};
    let isValid = true;

    //email validation
    if (!editProfileForm.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editProfileForm.email)) {
      tempErrors.email = "Invalid format";
      isValid = false;
    }

    //password
    if (!editProfileForm.password) {
      tempErrors.password = "Password is required!!";
      isValid = false;
    }

    //confirm password
    if (editProfileForm.password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    if (!validations()) {
      return;
    }
    if (!emp?.id) return;
    await editProfile(emp.id);
    setConfirmPassword("");
  };

  useEffect(() => {
    if (emp?.id) {
      getEmployeeDetails();
    }
  }, [emp, getEmployeeDetails]);

  return (
    <div className="employee-form">
      <form className="employee-edit-form" onSubmit={submitEditForm}>
        <label className="edit-form-label">
          <p className="edit-form-p">First Name</p>
          <input
            className="edit-form-input"
            type="text"
            name="firstName"
            value={editProfileForm.firstName}
            onChange={handleEditField}
            placeholder="First Name"
          />
        </label>
        <label className="edit-form-label">
          <p className="edit-form-p">Last Name</p>
          <input
            className="edit-form-input"
            type="text"
            name="lastName"
            value={editProfileForm.lastName}
            onChange={handleEditField}
            placeholder="Last Name"
          />
        </label>
        <label className="edit-form-label">
          <p className="edit-form-p">Email</p>
          <input
            className="edit-form-input"
            type="email"
            name="email"
            value={editProfileForm.email}
            onChange={handleEditField}
            placeholder="Email"
          />
        </label>
        <label className="edit-form-label">
          <p className="edit-form-p">Password</p>
          <input
            className="edit-form-input"
            type="password"
            name="password"
            value={editProfileForm.password}
            onChange={handleEditField}
            placeholder="New Password"
          />
        </label>
        <label className="edit-form-label">
          <p className="edit-form-p">Confirm Password</p>
          <input
            className="edit-form-input"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
        </label>
        <div className="edit-form-btns">
          <button className="edit-form-save" type="submit">
            save
          </button>
          <button
            className="edit-form-logout"
            onClick={() => {
              logout();
              alert("You have been logged out");
              navigate("/auth", { replace: true });
            }}
          >
            logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
