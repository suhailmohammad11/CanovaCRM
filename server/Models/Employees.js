  const mongoose = require("mongoose");
  const bcrypt=require("bcrypt")


  const employeeSchema = mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    assignedLeads:[
      {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Lead",
    }],
    closedLeads: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Lead",
    }],
    status: {
      type: String,
      default: "inactive",
    },
    activityLog: [
  {
    type: {
      type: String,
      enum: ["LEAD_ASSIGNED", "LEAD_CLOSED", "CHECK_IN", "CHECK_OUT"],
      required: true,
    },
    message: { type: String, required: true },
    relatedId: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
  },
],

  },
    { timestamps: true }
  );

  employeeSchema.pre("validate", function () {
    if (!this.password) {
      this.password = this.email;
    }
  });

  employeeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.email, salt);
  })


  employeeSchema.statics.login=async function(email, password){
    const emp=await this.findOne({email})

    if(!emp){
      throw new Error ("Email Id Doesnot exist. Try with valid one")
    }
    const match=await bcrypt.compare(password, emp.password)
    if(!match){
      throw new Error ("Invalid Password, Try Again!!")
    }
    return emp
  }

  const Employee = new mongoose.model("Employee", employeeSchema);

  module.exports = Employee;
