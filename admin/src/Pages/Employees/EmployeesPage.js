import Employees from "../../Components/Employees/EmployeeCard/Employees";
import EmployeeForm from "../../Components/Employees/EmployeeForm/EmployeeForm";
import Navbar from "../../Components/Navbar/Navbar";

import "./EmployeesPageStyles.css";

const EmployeePage = () => {
  return (
    <div className="employee-page">
      <div className="employee-nav">
        <Navbar />
      </div>
      <div className="right">
        <div className="emp-page-employee">
          <EmployeeForm />
          <Employees />
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
