const Activity = require("../Models/Activity");

exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(7)
      .populate("employeeId", "firstName")
      .populate("leadId", "leadName");

    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to load activities" });
  }
};
