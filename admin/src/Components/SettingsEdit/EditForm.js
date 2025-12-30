import { useEffect, useState } from "react";
import "./EditFormStyles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditForm = () => {
  const navigate = useNavigate();
  const [adminDetails, setAdminDetails] = useState({});
  const [updatedAdmin, setUpdatedAdmin] = useState({
    _id: adminDetails._id,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const handleEditForm = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUpdatedAdmin({ ...updatedAdmin, [name]: value });
  };

  //fetch admin details
  const adminData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Settings`
      );
      console.log(response.data[0]);
      setAdminDetails(response.data[0]);
      setUpdatedAdmin(response.data[0]);
    } catch (err) {
      console.log("Error Fetching Admin Details", err);
    }
  };

  //update admin details
  const updateAdminDetails = async (e) => {
    e.preventDefault();
    try {
      const { _id, firstName, lastName, email, password } = updatedAdmin;
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Settings/${_id}`,
        { firstName, lastName, email, password }
      );
      if (response.status === 200) {
        alert("Amdin Details Updated Successfully");
      }
      adminData();
    } catch (err) {
      console.log("Error updating Admin Details");
    }
  };
  useEffect(() => {
    adminData();
  }, []);
  return (
    <div className="path-wrapper">
      <div className="path-crumbs">
        <p onClick={() => navigate("/dashboard")}>Home</p>
        <img src="crumb-right.png" alt="right" className="crumb-right" />
        <p>Settings</p>
      </div>
      <div className="edit-form">
        <div className="edit-title">
          <p className="edit-p">Edit Profile</p>
          <div className="lines">
            <img src="underline.png" alt="underline" className="under-line" />
            <img src="long-line.png" alt="long-line" className="long-line" />
          </div>
        </div>
        <form onSubmit={updateAdminDetails}>
          <label>
            <p>First Name</p>
            <input
              type="text"
              name="firstName"
              value={updatedAdmin.firstName}
              placeholder="First Name"
              onChange={handleEditForm}
            />
          </label>
          <label>
            <p>Last Name</p>
            <input
              type="text"
              name="lastName"
              value={updatedAdmin.lastName}
              placeholder="Last Name"
              onChange={handleEditForm}
            />
          </label>
          <label>
            <p>Email</p>
            <input
              type="email"
              name="email"
              value={updatedAdmin.email}
              placeholder="Email"
              onChange={handleEditForm}
            />
          </label>
          <label>
            <p>Password</p>
            <input
              type="password"
              name="password"
              value={updatedAdmin.password}
              placeholder="Password"
              onChange={handleEditForm}
            />
          </label>
          <label>
            <p>Confirm Password</p>
            <input
              type="password"
              name="confirmPassword"
              value={updatedAdmin.password}
              placeholder="Confirm Password"
              onChange={handleEditForm}
            />
          </label>
          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
