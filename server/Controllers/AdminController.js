const Lead = require("../Models/Leads");
const Admin = require("../Models/Admin");
const fs = require("fs");
const path = require("path");
const Employee = require("../Models/Employees");
const autoAssignLeads = require("../Services/AutoAssignLeads");
const logActivity = require("../Utils/LogActivity");

//Fetch All Employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .sort({ createdAt: -1 })
      .populate("assignedLeads");
    res.status(200).json(employees);
  } catch (err) {
    console.log("Error fetching Employees");
    res.status(500).json({ message: "Failed to fetch employees", error: err });
  }
};

//Fetch Employess by ID
const getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    console.log("Error fetching Employee by Id");
    res.status(404).json(err);
  }
};

//Adding new Employee
const addEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, location, language } = req.body;
    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      location,
      language,
    });
    const employee = await newEmployee.save();

    // log activity
    await logActivity({
      type: "EMPLOYEE_ADDED",
      message: `Employee ${firstName} ${lastName} added`,
      employeeId: employee._id,
      createdBy: "admin",
    });

    // Trigger auto-assign asynchronously
    setImmediate(async () => {
      try {
        await autoAssignLeads();
      } catch (err) {
        console.error("Auto-assign failed:", err.message);
      }
    });

    res.status(200).json(employee);
  } catch (err) {
    console.log("Error Adding Employee");
    res.status(500).json({ message: err.message });
  }
};

//Editing Employee
const editEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, location, language } = req.body;
    const editedEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      { firstName, lastName, email, location, language },
      { new: true }
    );

    if (!editedEmployee)
      return res.status(404).json({ message: "Employee not found" });

    // Log activity
    await logActivity({
      type: "EMPLOYEE_EDITED",
      message: `Employee ${firstName} ${lastName} updated`,
      employeeId: editedEmployee._id,
      createdBy: "admin",
    });

    res.status(200).json(editedEmployee);
  } catch (err) {
    console.log("Error Editing Employee");
    res.status(500).json(err);
  }
};

//Deleting Employee
const deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const removedEmployee = await Employee.findByIdAndDelete({ _id: id });
    if (!removedEmployee)
      return res.status(404).json({ message: "Employee not found" });

    // Log activity
    await logActivity({
      type: "EMPLOYEE_DELETED",
      message: `Employee ${removedEmployee.firstName} ${removedEmployee.lastName} deleted`,
      employeeId: removedEmployee._id,
      createdBy: "admin",
    });

    res.status(200).json(removedEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
};

//fetch all Leads
const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate({
      path: "AssignedTo",
      select: "_id firstName email",
    });
    if (!leads) {
      res.status(400).json({ message: "No Leads Yet" });
    }
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Add Lead
const addLead = async (req, res) => {
  try {
    const { leadName, leadEmail, date, source, leadLocation, leadLanguage } =
      req.body;

    const lead = new Lead({
      leadName,
      leadEmail,
      date,
      source,
      leadLocation,
      leadLanguage,
    });

    const newLead = await lead.save();

    // Log activity
    await logActivity({
      type: "LEAD_ADDED",
      message: `Lead "${leadName}" added`,
      leadId: newLead._id,
      createdBy: "admin",
    });

    // Trigger auto-assign asynchronously
    setImmediate(() => {
      autoAssignLeads().catch(console.error);
    });

    res.status(200).json(newLead);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get Admin Details
const getAdminDetails = async (req, res) => {
  try {
    const adminData = await Admin.find();
    if (!adminData) {
      res.status(404).json({ message: "Admin Data Not Found" });
    }
    res.status(200).json(adminData);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Update Admin
const updateAdminDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, password } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(
      { _id: id },
      { firstName, lastName, email, password },
      { new: true }
    );
    if (!updatedAdmin) {
      res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(updatedAdmin);
  } catch (err) {
    res.status(500).json(err);
  }
};

//importing leads
const importLeadsFromText = async (req, res) => {
  try {
    const { csvText } = req.body;

    if (!csvText) {
      return res.status(400).json({ message: "CSV text missing" });
    }
    const lines = csvText.replace(/\r/g, "").split("\n").filter(Boolean);

    const dataRows = lines.slice(1);
    const leads = [];

    for (const row of dataRows) {
      const [name, email, source, date, location, language] = row
        .split(",")
        .map((v) => v.trim());

      if (!email) continue;

      leads.push({
        leadName: name,
        leadEmail: email,
        source,
        leadLocation: location,
        leadLanguage: language,
        date: date ? new Date(date) : undefined,
      });
    }

    await Lead.insertMany(leads, { ordered: false });

    // Log activity for CSV import
    await logActivity({
      type: "LEADS_IMPORTED",
      message: `${leads.length} leads imported from CSV`,
      createdBy: "admin",
    });

    res.status(201).json({
      message: "Leads imported",
      count: leads.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  editEmployee,
  deleteEmployee,
  addLead,
  getAllLeads,
  getAdminDetails,
  updateAdminDetails,
  importLeadsFromText,
};
