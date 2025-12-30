const Attendance = require("../Models/Attendance");
const Employee = require("../Models/Employees");
const autoAssignLeads = require("../Services/AutoAssignLeads");

// helpers
const getTodayDate = () => new Date().toISOString().split("T")[0];
const getCurrentTime = () => new Date().toLocaleTimeString("en-IN");

const EMPTY_TIME = "--:--__";

const pushActivity = async (employeeId, activity) => {
  await Employee.findByIdAndUpdate(employeeId, {
    $push: {
      activityLog: {
        $each: [activity],
        $position: 0,
        $slice: 7,
      },
    },
  });
};

//get Today Attendance
const getTodayAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      employeeId: req.employee._id,
      assignedDate: getTodayDate(),
    });

    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//last four days attendance
const getLastFourDaysAttendance = async (req, res) => {
  try {
    const attendanceHistory = await Attendance.find({
      employeeId: req.employee._id,
    })
      .sort({ assignedDate: -1 })
      .limit(4);

    res.status(200).json(attendanceHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//check in by employee
const checkIn = async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const assignedDate = getTodayDate();

    let attendance = await Attendance.findOne({ employeeId, assignedDate });

    if (attendance && attendance.checkIn !== EMPTY_TIME) {
      return res.status(400).json({ message: "Already checked in" });
    }
    if (!attendance) {
      attendance = await Attendance.create({
        employeeId,
        assignedDate,
        checkIn: getCurrentTime(),
      });
    } else {
      attendance.checkIn = getCurrentTime();
      await attendance.save();
    }

    await Employee.findByIdAndUpdate(employeeId, { status: "active" });

    await pushActivity(employeeId, {
      type: "CHECK_IN",
      message: "You checked in",
    });

    // Trigger auto-assign
    setImmediate(() => autoAssignLeads().catch(console.error));
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Break start and end
const handleBreak = async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const assignedDate = getTodayDate();

    const attendance = await Attendance.findOne({ employeeId, assignedDate });

    if (!attendance || attendance.checkIn === EMPTY_TIME) {
      return res.status(400).json({ message: "Check-in required" });
    }

    // Start break
    if (attendance.breaks.length === 0) {
      attendance.breaks.push({
        breakStart: getCurrentTime(),
        breakEnd: EMPTY_TIME,
      });

      await pushActivity(employeeId, {
        type: "BREAK_START",
        message: "Break started",
      });
    }
    // End break
    else {
      const breakObj = attendance.breaks[0];

      if (breakObj.breakEnd !== EMPTY_TIME) {
        return res
          .status(400)
          .json({ message: "Break already taken for today" });
      }

      breakObj.breakEnd = getCurrentTime();

      await pushActivity(employeeId, {
        type: "BREAK_END",
        message: "Break ended",
      });
    }

    await attendance.save();
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Check out by employee
const checkOut = async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const assignedDate = getTodayDate();

    const attendance = await Attendance.findOne({ employeeId, assignedDate });

    if (!attendance || attendance.checkIn === EMPTY_TIME) {
      return res.status(400).json({ message: "Check-in required" });
    }

    if (attendance.checkOut !== EMPTY_TIME) {
      return res.status(400).json({ message: "Already checked out" });
    }

    // Prevent checkout during active break
    if (
      attendance.breaks.length === 1 &&
      attendance.breaks[0].breakEnd === EMPTY_TIME
    ) {
      return res.status(400).json({ message: "End break before checkout" });
    }

    attendance.checkOut = getCurrentTime();
    attendance.status = "checkedOut";
    await attendance.save();

    await Employee.findByIdAndUpdate(employeeId, { status: "inactive" });

    await pushActivity(employeeId, {
      type: "CHECK_OUT",
      message: "You checked out",
    });

    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTodayAttendance,
  getLastFourDaysAttendance,
  checkIn,
  handleBreak,
  checkOut,
};
