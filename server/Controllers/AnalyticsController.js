const Lead = require("../Models/Leads");

const getConversionRate = async (req, res) => {
  try {
    const days = Number(req.query.days) || 14;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const result = await Lead.aggregate([
      {
        $match: {
          AssignedTo: { $ne: null },
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
          assigned: { $sum: 1 },
          closed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Closed"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          assigned: 1,
          closed: 1,
          conversionRate: {
            $cond: [
              { $eq: ["$assigned", 0] },
              0,
              {
                $multiply: [{ $divide: ["$closed", "$assigned"] }, 100],
              },
            ],
          },
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to calculate conversion rate" });
  }
};

module.exports = { getConversionRate };
