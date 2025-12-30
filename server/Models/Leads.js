const mongoose = require("mongoose");

const leadSchema = mongoose.Schema({
  leadName: {
    type: String,
    required: true,
  },
  leadEmail: {
    type: String,
    unique: true,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  leadLocation: {
    type: String,
    required: true,
  },
  leadLanguage: {
    type: String,
    required: true,
  },
  AssignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
  },
  status: {
    type: String,
    enum: ["New", "Ongoing", "Closed"],
    default: "New",
  },
  type: {
    type: String,
    default: "Warm",
  },
  scheduledDate: {
    type: Date,
    default: null,
  },
});

const Lead = new mongoose.model("Lead", leadSchema);

module.exports = Lead;
