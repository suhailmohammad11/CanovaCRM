const express = require("express");
const AuthMiddleware = require("../Middleware/AuthMiddleware");
const {
  employeeLogin,
  getEmployeeLeads,
  changeType,
  scheduleLead,
  editProfile,
  getEmployeeDetails,
  getRecentActivity,
} = require("../Controllers/EmployeeController");

const { closeLead } = require("../Controllers/closeLead");
const router = express.Router();

router.post("/login", employeeLogin);
router.get("/Home/Leads", AuthMiddleware, getEmployeeLeads);
router.patch("/Home/Leads/closeLead/:id", AuthMiddleware, closeLead);
router.patch("/Home/Lead/changeType/:id", AuthMiddleware, changeType);
router.patch("/Home/Lead/scheduleDate/:id", AuthMiddleware, scheduleLead);

//profile routes
router.put("/Home/Profile/:id", AuthMiddleware, editProfile);
router.get("/Home/Profile/:id", AuthMiddleware, getEmployeeDetails);

module.exports = router;
