const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "LEAD_ADDED",
        "LEAD_ASSIGNED",
        "LEAD_CLOSED",
        "EMPLOYEE_ADDED",
        "EMPLOYEE_EDITED",
        "EMPLOYEE_DELETED",
        "LEADS_IMPORTED",
      ],
      required: true,
    },
    message: { type: String, required: true },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    createdBy: { type: String, default: "system" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
