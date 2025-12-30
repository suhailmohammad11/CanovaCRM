const cron = require("node-cron");
const Attendance = require("../Models/Attendance");

cron.schedule(
  "0 0 * * *",
  async () => {
    console.log(" Midnight cron triggered at", new Date());

    const openAttendances = await Attendance.find({
      status: "working",
    });

    console.log("Found open attendances:", openAttendances.length);

    for (let attendance of openAttendances) {
      attendance.checkOut = "AUTO";
      attendance.status = "checkedOut";
      await attendance.save();

      await pushActivity(attendance.employeeId, {
        type: "CHECK_OUT",
        message: "Auto check-out at midnight",
      });
    }

    console.log(" Midnight cron completed");
  },
  { timezone: "Asia/Kolkata" }
);
