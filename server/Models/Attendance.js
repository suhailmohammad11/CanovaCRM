const mongoose = require("mongoose");

const breakSchema = new mongoose.Schema(
  {
    breakStart: { type: String, required: true },
    breakEnd: { type: String, default: null },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    assignedDate: {
      type: String,
      required: true,
    },

    checkIn: { type: String, default: null },
    checkOut: { type: String, default: null },

    breaks: [breakSchema],

    status: {
      type: String,
      enum: ["working", "checkedOut"],
      default: "working",
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ employeeId: 1, assignedDate: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
