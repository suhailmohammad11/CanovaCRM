import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";

export const AdminData = createContext();

export const AdminContextProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [employeeForm, setEmployeeForm] = useState({});
  const [activities, setActivities] = useState([]);

  const [updatedEmployeeForm, setUpdatedEmployeeForm] = useState({
    _id: null,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    language: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  //---------------------------------------------Employees---------------------------------------------------------------------------->//

  const handleEditButton = (employee) => {
    setUpdatedEmployeeForm({
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      location: employee.location,
      language: employee.language,
    });
    alert("clicked edit");
    setShowUpdateForm(true);
    setShowAddForm(false);
  };
  const handleDeleteButton = async (id) => {
    await deleteEmployee(id);
    getEmployees();
  };

  //form change
  const handleAddEmployeeField = (e) => {
    const { name, value } = e.target;
    setEmployeeForm({ ...employeeForm, [name]: value });
  };

  //update form change
  const handleUpdateEmployeeField = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployeeForm({ ...updatedEmployeeForm, [name]: value });
  };

  //Retrieve Employees
  const getEmployees = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Employees`
      );
      setEmployees(response.data);
    } catch (err) {
      console.log("Error Retrieving Employees");
    }
  }, []);

  //Add New Employee
  const addEmployee = async () => {
    try {
      const { firstName, lastName, email, password, location, language } =
        employeeForm;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Employees`,
        { firstName, lastName, email, password, location, language }
      );
      if (response.status === 200) {
        alert("Added Employee Successfully");
      }
      getEmployees();
    } catch (err) {
      alert("Error Adding employee");
    }
  };

  //Edit Employee
  const editEmployee = async (id) => {
    try {
      const { firstName, lastName, email, password, location, language } =
        updatedEmployeeForm;
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Employees/${id}`,
        { firstName, lastName, email, password, location, language }
      );
      if (response.status === 200) {
        alert("Employee Edited Successfully");
        setShowUpdateForm(false);
        getEmployees();
      }
    } catch (err) {
      console.log(err);
      alert("Error updating employee");
    }
  };

  //Delte Employee
  const deleteEmployee = async (_id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Employees/${_id}`
      );
      alert("Employee Deleted Successfully");
    } catch (err) {
      alert("Error Deleting Employee");
    }
  };

  //---------------------------------------------Leads---------------------------------------------------------------------------->//

  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({
    leadName: "",
    leadEmail: "",
    source: "",
    date: "",
    leadLocation: "",
    leadLanguage: "",
  });

  //Fetch all leads
  const getLeads = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Leads`
      );
      setLeads(response.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  //add leads
  const addLead = async () => {
    try {
      const { leadName, leadEmail, source, date, leadLocation, leadLanguage } =
        newLead;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Leads`,
        { leadName, leadEmail, source, date, leadLocation, leadLanguage }
      );
      console.log(response.data);
      if (response.status === 200) {
        alert("Added Lead Successfully");
      }
      getLeads();
    } catch (err) {
      console.log(err);
      alert("Error adding Lead");
    }
  };

  //import leads
  const importLeads = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Leads/importLeads`
      );
      if (response.status === 201) {
        alert("Leads imported");
      }
      getLeads();
    } catch (err) {
      console.log(err);
      alert("Error assigning Lead");
    }
  };

  //assign Leads
  const assignLeads = async () => {
    try {
      await axios.post(
        `"${process.env.REACT_APP_API_URL}/api/admin/Home/Leads/assignLeads`,
        {}
      );
      alert("Leads Assigned");
      getLeads();
    } catch (err) {
      console.log(err);
      alert("Error assigning Lead");
    }
  };

  //conversion rate
  const getConversionRate = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/analytics/conversion?days=14`
      );
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const uploadCsvAndProcessLeads = async (csvText, setProgress) => {
    try {
      setProgress(20);

      // Import leads from CSV

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Leads/import-from-text`,
        { csvText },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setProgress(60);

      // Assign leads
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Leads/assignLeads`
      );

      setProgress(100);

      getLeads();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  //get recent admin activities
  const getRecentActivities = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/activities`
      );
      if (response.status === 200) {
        setActivities(response.data);
      }
    } catch (err) {
      console.error("Error fetching recent activities", err);
    }
  }, []);
  useEffect(() => {
    getRecentActivities();
  }, [getRecentActivities]);

  return (
    <AdminData.Provider
      value={{
        employees,
        setEmployees,
        getEmployees,
        addEmployee,
        editEmployee,
        deleteEmployee,
        handleAddEmployeeField,
        handleUpdateEmployeeField,
        showAddForm,
        setShowAddForm,
        showUpdateForm,
        setShowUpdateForm,
        handleEditButton,
        handleDeleteButton,
        updatedEmployeeForm,
        setNewLead,
        newLead,
        addLead,
        getLeads,
        leads,
        importLeads,
        assignLeads,
        getConversionRate,
        uploadCsvAndProcessLeads,
        activities,
        getRecentActivities,
      }}
    >
      {children}
    </AdminData.Provider>
  );
};
