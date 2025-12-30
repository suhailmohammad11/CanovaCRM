const Employee = require("../Models/Employees");
const Lead = require("../Models/Leads");
const createToken = require("../Utils/token");
const bcrypt = require("bcrypt");
const pushActivity = require("../Utils/PushActivity");

//Employee Login
const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.login(email, password);
    const token = await createToken(employee._id);

    res.status(200).json({
      email: employee.email,
      token,
      id: employee._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Employee Specific Leads
const getEmployeeLeads = async (req, res) => {
  try {
    const empId = req.employee._id;

    const emp = await Employee.findById(empId)
      .populate("assignedLeads")
      .populate("closedLeads");

    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      assignedLeads: emp.assignedLeads,
      closedLeads: emp.closedLeads,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//change type of lead
const changeType = async (req, res) => {
  try {
    const id = req.params.id;
    const { type } = req.body;

    const lead = await Lead.findByIdAndUpdate(id, { type }, { new: true });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await pushActivity(req.employee._id, {
      type: "LEAD_UPDATED",
      message: `Lead marked as ${type}`,
    });

    res.status(200).json(lead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Schedule Lead
const scheduleLead = async (req, res) => {
  try {
    const id = req.params.id;
    const { scheduledDate } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      id,
      { scheduledDate },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await pushActivity(req.employee._id, {
      type: "LEAD_SCHEDULED",
      message: `Lead scheduled on ${scheduledDate}`,
    });

    res.status(200).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//get Employee details
const getEmployeeDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//edit profile
const editProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await Employee.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await pushActivity(id, {
      type: "PROFILE_UPDATED",
      message: "You updated your profile",
    });

    res.status(200).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Recent activity upto 7
const getRecentActivity = async (req, res) => {
  try {
    const employeeId = req.employee._id;

    const employee = await Employee.findById(employeeId).select("activityLog");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee.activityLog || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  employeeLogin,
  getEmployeeLeads,
  changeType,
  scheduleLead,
  editProfile,
  getEmployeeDetails,
  getRecentActivity,
};
