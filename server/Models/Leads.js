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
    set: (v) => v ? v.toLowerCase().trim() : v, 
  },
  leadLanguage: {
    type: String,
    required: true,
    set: (v) => v ? v.toLowerCase().trim() : v, 
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

leadSchema.pre("save", function(next) {
  if (this.leadLanguage) {
    this.leadLanguage = this.leadLanguage.toLowerCase().trim();
  }
  if (this.leadLocation) {
    this.leadLocation = this.leadLocation.toLowerCase().trim();
  }
  next();
});

leadSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();
  
  if (update.$set) {
    if (update.$set.leadLanguage) {
      update.$set.leadLanguage = update.$set.leadLanguage.toLowerCase().trim();
    }
    if (update.$set.leadLocation) {
      update.$set.leadLocation = update.$set.leadLocation.toLowerCase().trim();
    }
  }
  
  if (update.leadLanguage) {
    update.leadLanguage = update.leadLanguage.toLowerCase().trim();
  }
  if (update.leadLocation) {
    update.leadLocation = update.leadLocation.toLowerCase().trim();
  }
  
  this.setUpdate(update);
  next();
});

const Lead = new mongoose.model("Lead", leadSchema);

module.exports = Lead;