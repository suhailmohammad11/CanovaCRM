const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
require("dotenv").config();
require("./Db/Connections");

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({extended:true}))

//importing routes
const adminRoutes = require("./Routers/AdminRoutes");
const employeeRoutes=require("./Routers/EmployeeRoutes")
const attendanceRoutes= require("./Routers/AttendanceRoutes");

//cron jobs
require("./Cron/AttendanceCron");

//Routing links
app.use("/api/admin", adminRoutes);
app.use("/api/employees", employeeRoutes);

//attendance routes
app.use("/api/employee/attendance", attendanceRoutes)

app.listen(port, () => {
  try {
    console.log(`Listening at: ${port}`);
  } catch (err) {
    console.log(err);
  }
});
