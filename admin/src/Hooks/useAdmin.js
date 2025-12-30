import { useContext } from "react";
import { AdminData } from "../Context/AdminContext";

export const useAdmin = () => {
  const context = useContext(AdminData);
  if (!context) {
    throw new Error("useAdmin must be used inside AdminContextProvider");
  }
  return context;
};
