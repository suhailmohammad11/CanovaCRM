const Employee = require("../Models/Employees");

const pushActivity = async (employeeId, activity) => {
  try {
    await Employee.findByIdAndUpdate(employeeId, {
      $push: {
        activityLog: {
          $each: [
            {
              ...activity,
              createdAt: new Date(),
            },
          ],
          $position: 0,
          $slice: 7,
        },
      },
    });
  } catch (err) {
    console.error("pushActivity error:", err.message);
  }
};

module.exports = pushActivity;
