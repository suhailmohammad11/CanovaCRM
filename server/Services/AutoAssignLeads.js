// Services/AutoAssignLeads.js
const Lead = require("../Models/Leads");
const Employee = require("../Models/Employees");

const autoAssignLeads = async () => {
  try {
    const leads = await Lead.find({
      AssignedTo: null,
      status: "New",
    }).sort({ createdAt: 1 });

    if (!leads.length) return;

    for (const lead of leads) {
      const leadLanguageLower = lead.leadLanguage ? 
        lead.leadLanguage.toLowerCase() : "english";
      const leadLocationLower = lead.leadLocation ?
        lead.leadLocation.toLowerCase() : "unknown";

      const employees = await Employee.find({
        status: "active",
        $expr: {
          $eq: [
            { $toLower: "$language" },
            leadLanguageLower
          ]
        },
        $expr: {
          $eq: [
            { $toLower: "$location" },
            leadLocationLower
          ]
        },
        $expr: {
          $lt: [{ $size: "$assignedLeads" }, 3], // Max 3 leads
        },
      }).sort({ assignedLeads: 1 });

      if (!employees.length) {
        console.log(`No active employees for ${lead.leadLanguage}/${lead.leadLocation}`);
        continue;
      }

      const employee = employees[0];

      // Assign lead
      lead.AssignedTo = employee._id;
      lead.status = "Ongoing";
      await lead.save();

      // Add to employee's assignedLeads
      employee.assignedLeads.push(lead._id);
      await employee.save();

      console.log(`Assigned lead ${lead._id} to employee ${employee._id}`);
    }
  } catch (err) {
    console.error("Auto-assign error:", err.message);
    throw err;
  }
};

module.exports = autoAssignLeads;