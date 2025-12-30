const Employee = require("../Models/Employees");
const Lead = require("../Models/Leads");

const leadAssignments = async (req, res) => {
  try {
    const employees = await Employee.find({ status: "active" });
    const MAX_ONGOING = 3;
    
    const assignmentsInProgress = {};
    employees.forEach(emp => {
      assignmentsInProgress[emp._id] = 0;
    });
    
    const unassignedLeads = await Lead.find({ 
      AssignedTo: null, 
      status: "New" 
    }).sort({ createdAt: 1 });
    
    if (!unassignedLeads.length) {
      return res.status(200).json({ message: "No unassigned leads" });
    }

    const results = [];
    const failedLeads = [];
    
    for (const lead of unassignedLeads) {
      const suitableEmployees = employees.filter(emp => 
        emp.location === lead.leadLocation && 
        emp.language === lead.leadLanguage &&
        (emp.assignedLeads.length + assignmentsInProgress[emp._id]) < MAX_ONGOING
      );
      
      if (!suitableEmployees.length) {
        failedLeads.push({
          leadId: lead._id,
          reason: `No suitable employee with capacity for ${lead.leadLanguage}/${lead.leadLocation}`
        });
        continue;
      }
      
      suitableEmployees.sort((a, b) => {
        const aTotal = a.assignedLeads.length + assignmentsInProgress[a._id];
        const bTotal = b.assignedLeads.length + assignmentsInProgress[b._id];
        return aTotal - bTotal;
      });
      
      const assignedEmployee = suitableEmployees[0];
      
      assignmentsInProgress[assignedEmployee._id]++;
      
      lead.AssignedTo = assignedEmployee._id;
      lead.status = "Ongoing";
      
      await Promise.all([
        lead.save(),
        Employee.updateOne(
          { _id: assignedEmployee._id },
          { $push: { assignedLeads: lead._id } }
        )
      ]);
      
      results.push({
        leadId: lead._id,
        employeeId: assignedEmployee._id,
        employeeName: `${assignedEmployee.firstName} ${assignedEmployee.lastName}`
      });
    }
    
    res.status(200).json({
      message: "Lead assignment completed",
      assigned: results.length,
      failed: failedLeads.length,
      details: {
        assigned: results,
        failed: failedLeads
      }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = { leadAssignments };
