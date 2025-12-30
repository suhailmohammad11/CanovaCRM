import axios from "axios";
import { createContext, useCallback, useState } from "react";
import { useAuthContext } from "../Hooks/useAuthContext";

export const EmpLeadData = createContext();

export const EmployeeContextProvider = ({ children }) => {
  const { emp } = useAuthContext();
  const [empLeads, setEmpLeads] = useState({
    assignedLeads: [],
    closedLeads: [],
  });
  const [selectedType, setSelectedType] = useState("");

  const [editProfileForm, setEditProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [recentActivity, setRecentActivity] = useState([]);

  //fetch all leads of the employee
  const getEmployeeLeads = useCallback(async () => {
    try {
      if (!emp?.token) return;
      const response = await axios.get(
        "http://localhost:4000/api/employees/Home/Leads",
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );
      setEmpLeads(response.data);
    } catch (err) {
      console.log(err);
    }
  }, [emp]);

  //change type of the lead
  const changeType = async (id, type) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/employees/Home/Lead/changeType/${id}`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );
      getEmployeeLeads();
    } catch (err) {
      alert("Error changing type");
      console.log(err);
    }
  };

  //schedule time and date
  const scheduleLead = async (id, scheduledDate) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/employees/Home/Lead/scheduleDate/${id}`,
        { scheduledDate },
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );
      alert("scheduled ..!!!");
      getEmployeeLeads();
    } catch (err) {
      alert("Error scheduling date and time");
      console.log(err);
    }
  };

  //close lead
  const closeLead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/employees/Home/Leads/closeLead/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );
      getEmployeeLeads();
    } catch (err) {
      alert("Error closing lead");
      console.log(err);
    }
  };

  //Get Current employee details
  const getEmployeeDetails = useCallback(async () => {
    try {
      if (!emp?.id || !emp?.token) return;
      const response = await axios.get(
        `http://localhost:4000/api/employees/Home/Profile/${emp.id}`,
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );
      const employee = response.data;
      setEditProfileForm({
        ...editProfileForm,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        password: "",
      });
    } catch (err) {
      alert("Error fetching Details");
      console.log(err);
    }
  }, [emp]);

  //Edit Profile
  const editProfile = async (id) => {
    try {
      if (!emp?.id || !emp?.token) return;
      const { firstName, lastName, email, password } = editProfileForm;
      await axios.put(
        `http://localhost:4000/api/employees/Home/Profile/${id}`,
        { firstName, lastName, email, password },
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );
      alert("Edited Successfully");
    } catch (err) {
      alert("Error Editing Profile");
      console.log(err);
    }
  };

  //get recent activity
  const getRecentActivity = async () => {
    try {
      if (!emp?.id || !emp?.token) return;
      const res = await axios.get(
        "http://localhost:4000/api/employees/Home/recentActivity",
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );
      setRecentActivity(res.data);
    } catch (err) {
      alert("Error Fetching Activity");
      console.log(err);
    }
  };
  return (
    <EmpLeadData.Provider
      value={{
        getEmployeeLeads,
        empLeads,
        setEmpLeads,
        selectedType,
        setSelectedType,
        changeType,
        scheduleLead,
        closeLead,
        editProfile,
        editProfileForm,
        setEditProfileForm,
        getEmployeeDetails,
        getRecentActivity,
        recentActivity,
      }}
    >
      {children}
    </EmpLeadData.Provider>
  );
};
