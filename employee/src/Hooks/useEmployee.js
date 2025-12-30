import { useContext } from "react";
import { EmpLeadData } from "../Context/EmployeeContext";

export const useEmployee = () => {
  const context = useContext(EmpLeadData);
  if (!context) {
    throw Error("useEmployee not used");
  }

  return context;
};
