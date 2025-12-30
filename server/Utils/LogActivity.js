const Activity = require("../Models/Activity");

const logActivity = async ({
  type,
  message,
  leadId = null,
  employeeId = null,
  createdBy = "system",
}) => {
  try {
    await Activity.create({ type, message, leadId, employeeId, createdBy });
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};

module.exports = logActivity;
