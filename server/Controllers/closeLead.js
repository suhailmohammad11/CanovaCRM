const Lead = require("../Models/Leads");
const Employee = require("../Models/Employees");
const autoAssignLeads = require("../Services/AutoAssignLeads");
const logActivity = require("../Utils/LogActivity");

const closeLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (!lead.AssignedTo) {
      return res.status(400).json({ message: "Lead not assigned" });
    }

    // Update lead status
    lead.status = "Closed";
    await lead.save();

    // Update employee's assigned and closed leads
    await Employee.findByIdAndUpdate(lead.AssignedTo, {
      $pull: { assignedLeads: lead._id },
      $push: { closedLeads: lead._id },
    });

    await logActivity({
      type: "LEAD_CLOSED",
      message: `Lead "${lead.leadName}" closed`,
      leadId: lead._id,
      employeeId: lead.AssignedTo,
      createdBy: "admin",
    });

    // Re-trigger auto-assign asynchronously
    setImmediate(() => {
      autoAssignLeads().catch(console.error);
    });

    res.status(200).json({ message: "Lead closed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { closeLead };
