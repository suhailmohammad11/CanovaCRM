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

    const employeeId = lead.AssignedTo;
    
    lead.status = "Closed";
    await lead.save();

    await Employee.findByIdAndUpdate(employeeId, {
      $pull: { assignedLeads: lead._id },
      $push: { closedLeads: lead._id },
    });

    const updatedEmployee = await Employee.findById(employeeId);
    console.log(`Employee ${employeeId} now has ${updatedEmployee.assignedLeads.length} assigned leads`);

    await logActivity({
      type: "LEAD_CLOSED",
      message: `Lead "${lead.leadName}" closed`,
      leadId: lead._id,
      employeeId: employeeId,
      createdBy: "admin",
    });

    setImmediate(async () => {
      try {
        await autoAssignLeads();
        console.log("Auto-assign completed after lead closure");
      } catch (err) {
        console.error("Auto-assign error after lead closure:", err);
      }
    });

    res.status(200).json({ 
      message: "Lead closed successfully",
      assignedLeadsCount: updatedEmployee.assignedLeads.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { closeLead };
