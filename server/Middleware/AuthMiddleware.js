const jwt = require("jsonwebtoken");
const Employee = require("../Models/Employees");

const AuthMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Auth Token Required" });
  }
  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.employee = await Employee.findOne({ _id }).select("_id");
    next();
  } catch (err) {
    res.status(401).json({ message: "Request not Authorized" });
  }
};

module.exports = AuthMiddleware;
