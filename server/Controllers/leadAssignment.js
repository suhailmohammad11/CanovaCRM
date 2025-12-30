const Employee = require("../Models/Employees");
const Lead = require("../Models/Leads");

const leadAssignments = async (req, res) => {
  try {
    const unassignedLeads = await Lead.find({ AssignedTo: null });
    if (!unassignedLeads.length) {
      return res.status(200).json({ message: "No unassigned leads" });
    }

    const employees = await Employee.find();
    const MAX_ONGOING = 3;

    // Group employees by language
    const empByLang = {};
    employees.forEach((emp) => {
      if (!empByLang[emp.language]) empByLang[emp.language] = [];
      empByLang[emp.language].push(emp);
    });

    // Round-robin index per language
    const rrIndex = {};
    Object.keys(empByLang).forEach((lang) => (rrIndex[lang] = 0));

    const tasks = unassignedLeads.map(async (lead) => {
      const lang = lead.leadLanguage;
      const empList = empByLang[lang];
      if (!empList || !empList.length) {
        throw new Error(`No employee for language ${lang}`);
      }

      let attempts = empList.length;

      while (attempts--) {
        const emp = empList[rrIndex[lang]];
        rrIndex[lang] = (rrIndex[lang] + 1) % empList.length;

        const ongoingCount = await Lead.countDocuments({
          AssignedTo: emp._id,
          status: "Ongoing",
        });

        if (ongoingCount < MAX_ONGOING) {
          lead.AssignedTo = emp._id;

          await Promise.all([
            lead.save(),
            Employee.updateOne(
              { _id: emp._id },
              { $push: { assignedLeads: lead._id } }
            ),
          ]);

          return { leadId: lead._id, employeeId: emp._id };
        }
      }

      throw new Error("All employees are at capacity");
    });

    const results = await Promise.allSettled(tasks);

    const assigned = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    res.status(200).json({
      message: "Lead assignment completed",
      assigned,
      failed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { leadAssignments };
