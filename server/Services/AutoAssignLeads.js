const Lead = require("../Models/Leads");
const Employee = require("../Models/Employees");
const logActivity = require("../Utils/LogActivity");

const MAX_ACTIVE_LEADS = 3;

const autoAssignLeads = async () => {
  try {
    
    // unassigned leads only
    const leads = await Lead.find({
      AssignedTo: null,
      status: "New",
    }).sort({ createdAt: 1 });

    if (!leads.length) return;

    for (const lead of leads) {
      const employees = await Employee.find({
        status: "active",
        location: lead.leadLocation,
        language: lead.leadLanguage,
        $expr: {
          $lt: [{ $size: "$assignedLeads" }, MAX_ACTIVE_LEADS],
        },
      }).sort({ assignedLeads: 1 });

      if (!employees.length) {
        console.log(` No active employees for lead ${lead.leadName}`);
        continue;
      }

      const employee = employees[0];

      //  Assign lead
      lead.AssignedTo = employee._id;
      lead.status = "Ongoing";

      employee.assignedLeads.push(lead._id);

      await Promise.all([lead.save(), employee.save()]);

      await logActivity({
        type: "LEAD_ASSIGNED",
        message: `Lead "${lead.leadName}" assigned to ${employee.firstName}`,
        leadId: lead._id,
        employeeId: employee._id,
        createdBy: "system",
      });
    }
  } catch (err) {
    console.error("Auto-assign error:", err.message);
    throw err;
  }
};

module.exports = autoAssignLeads;
