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
        `${process.env.REACT_APP_API_URL}/api/employees/Home/Leads`,
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
      if (!emp?.token) return;
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/employees/Home/Lead/changeType/${id}`,
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
      if (!emp?.token) return;

      let formattedDate;

      if (scheduledDate instanceof Date) {
        formattedDate = scheduledDate.toISOString();
      } else if (typeof scheduledDate === "string") {
        const dateObj = new Date(scheduledDate);
        if (isNaN(dateObj.getTime())) {
          throw new Error("Invalid date format");
        }
        formattedDate = dateObj.toISOString();
      } else {
        throw new Error("Invalid date provided");
      }

      console.log("Sending date to backend:", formattedDate);

      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/employees/Home/Lead/scheduleDate/${id}`,
        { scheduledDate: formattedDate },
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );

      console.log("Schedule response:", response.data);
      alert("Scheduled successfully!");
      getEmployeeLeads();
    } catch (err) {
      console.error("Schedule error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        config: err.config,
      });

      alert(`Error scheduling: ${err.response?.data?.message || err.message}`);
    }
  };

  //close lead
  const closeLead = async (id) => {
    try {
      if (!emp?.token) return;
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/employees/Home/Leads/closeLead/${id}`,
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
        `${process.env.REACT_APP_API_URL}/api/employees/Home/Profile/${emp.id}`,
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );

      const employee = response.data;

      setEditProfileForm((prev) => ({
        ...prev,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        password: "",
      }));
    } catch (err) {
      console.log(err);
    }
  }, [emp]);

  //Edit Profile
  const editProfile = async (id) => {
    try {
      if (!emp?.id || !emp?.token) return;
      const { firstName, lastName, email, password } = editProfileForm;
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/employees/Home/Profile/${id}`,
        { firstName, lastName, email, password },
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );
      alert("Edited Successfully");
    } catch (err) {
      console.error(
        "Recent activity error:",
        err.response?.data || err.message
      );
    }
  };

  //get recent activity
  const getRecentActivity = useCallback(async () => {
    try {
      if (!emp?.token) return;

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/employees/Home/recentActivity`,
        {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      );

      setRecentActivity(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [emp]);

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
