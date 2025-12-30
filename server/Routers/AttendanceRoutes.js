const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../Middleware/AuthMiddleware");

const {
  getTodayAttendance,
  getLastFourDaysAttendance,
  checkIn,
  handleBreak,
  checkOut,
} = require("../Controllers/AttendanceController");

const { getRecentActivity } = require("../Controllers/EmployeeController");

router.use(AuthMiddleware);

//Attendance
router.get("/today", getTodayAttendance);
router.get("/history", getLastFourDaysAttendance);
router.post("/check-in", checkIn);
router.post("/break", handleBreak);
router.post("/check-out", checkOut);

//Employee activity
router.get("/activity", getRecentActivity);

module.exports = router;
