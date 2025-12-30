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

  const handleEditButton = (employee) => {
    setUpdatedEmployeeForm({
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      location: employee.location,
      language: employee.language,
    });
    setShowUpdateForm(true);
    setShowAddForm(false);
  };

  const handleDeleteButton = async (id) => {
    await deleteEmployee(id);
    getEmployees();
  };

  const handleAddEmployeeField = (e) => {
    const { name, value } = e.target;
    setEmployeeForm({ ...employeeForm, [name]: value });
  };

  const handleUpdateEmployeeField = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployeeForm({ ...updatedEmployeeForm, [name]: value });
  };

  const getEmployees = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Employees`
      );
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees");
    }
  }, []);

  const addEmployee = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Employees`,
        employeeForm
      );
      alert("Employee added");
      getEmployees();
    } catch (err) {
      alert("Error adding employee");
    }
  };

  const editEmployee = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Employees/${id}`,
        updatedEmployeeForm
      );
      alert("Employee updated");
      setShowUpdateForm(false);
      getEmployees();
    } catch (err) {
      alert("Error updating employee");
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Employees/${id}`
      );
      alert("Employee deleted");
    } catch (err) {
      alert("Error deleting employee");
    }
  };

  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({
    leadName: "",
    leadEmail: "",
    source: "",
    date: "",
    leadLocation: "",
    leadLanguage: "",
  });

  const getLeads = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Leads`
      );
      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads");
    }
  }, []);

  const addLead = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/Home/Leads`,
        newLead
      );
      alert("Lead added");
      getLeads();
    } catch (err) {
      alert("Error adding lead");
    }
  };


const importCsvLeads = async (csvText, setProgress) => {
  try {
    setProgress(30);

    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/admin/Home/Leads/import-from-text`,
      { csvText },
      { headers: { "Content-Type": "application/json" } }
    );

    setProgress(100);
  } catch (err) {
    console.error("CSV import failed", err);
    throw err;
  }
};

const assignImportedLeads = async (setProgress) => {
  try {
    setProgress?.(0);

    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/admin/Home/Leads/assignLeads`,
      {},
      {
        onUploadProgress: (e) => {
          if (setProgress && e.total) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress(percent);
          }
        },
      }
    );

    setProgress?.(100);
    getLeads(); 
  } catch (err) {
    console.error("Lead assignment failed", err);
    throw err;
  }
};

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

  const getRecentActivities = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/activities`
      );
      setActivities(res.data);
    } catch (err) {
      console.error("Error fetching activities");
    }
  }, []);

  useEffect(() => {
    getRecentActivities();
  }, [getRecentActivities]);

  return (
    <AdminData.Provider
      value={{
        employees,
        getEmployees,
        addEmployee,
        editEmployee,
        deleteEmployee,
        handleAddEmployeeField,
        handleUpdateEmployeeField,
        handleEditButton,
        handleDeleteButton,
        showAddForm,
        setShowAddForm,
        showUpdateForm,
        setShowUpdateForm,
        updatedEmployeeForm,
        leads,
        getLeads,
        newLead,
        setNewLead,
        addLead,
        importCsvLeads,
        assignImportedLeads,
        getConversionRate,
        activities,
        getRecentActivities,
      }}
    >
      {children}
    </AdminData.Provider>
  );
};
