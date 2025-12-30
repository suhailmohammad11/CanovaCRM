const { Readable } = require("stream");
const Lead = require("../Models/Leads");
const { leadAssignments } = require("./leadAssignments");

const importLeadsStream = async (req, res) => {
  try {
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({ message: "CSV data missing" });
    }

    const readable = Readable.from(csvData.split("\n"));

    let isHeader = true;
    const leadsBuffer = [];

    for await (const line of readable) {
      const row = line.replace(/\r/g, "").trim();
      if (!row) continue;

      if (isHeader) {
        isHeader = false;
        continue;
      }

      const cols = row.split(",").map((c) => c.trim());
      if (cols.length !== 6) continue;

      const [name, email, source, dateStr, location, language] = cols;

      leadsBuffer.push({
        leadName: name,
        leadEmail: email,
        source,
        leadLocation: location,
        leadLanguage: language,
        date: dateStr ? new Date(dateStr) : undefined,
      });
    }

    if (!leadsBuffer.length) {
      return res.status(400).json({ message: "No valid leads found" });
    }

    // Insert leads
    await Lead.insertMany(leadsBuffer, { ordered: false });

    // Auto-assign after import
    await leadAssignments({}, { status: () => ({ json: () => {} }) });

    res.status(201).json({
      message: "Leads imported & assigned",
      count: leadsBuffer.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = importLeadsStream;
