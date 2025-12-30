import { useContext } from "react";
import { AttendanceContext } from "../Context/AttendanceContext";

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw Error("useAttendance not used");
  }

  return context;
};
