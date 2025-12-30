const express = require("express");
const router = express.Router();

const {
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
} = require("../Controllers/AdminController");
const { leadAssignments } = require("../Controllers/leadAssignment");
const { closeLead } = require("../Controllers/closeLead");
const { getConversionRate } = require("../Controllers/AnalyticsController");
const { getRecentActivities } = require("../Controllers/ActivityController");

//admin details
router.get("/Home/Settings", getAdminDetails);
router.put("/Home/Settings/:id", updateAdminDetails);

//employees routes
router.get("/Home/Employees", getAllEmployees);
router.get("/Home/Employees/:id", getEmployeeById);
router.post("/Home/Employees", addEmployee);
router.put("/Home/Employees/:id", editEmployee);
router.delete("/Home/Employees/:id", deleteEmployee);

//lead routes
router.get("/Home/Leads", getAllLeads);
router.post("/Home/Leads", addLead);

//upload csv route
router.post("/Home/Leads/import-from-text", importLeadsFromText);
router.post("/Home/Leads/assignLeads", leadAssignments);

//data analysis
router.get("/analytics/conversion", getConversionRate);

//admin activity
router.get("/activities", getRecentActivities);

module.exports = router;
