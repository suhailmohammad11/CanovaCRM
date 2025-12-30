import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuthContext } from "../Hooks/useAuthContext";

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const { emp, authReady } = useAuthContext();
  const [fourDays, setFourDays] = useState([]);

  const authConfig =
    emp && emp.token
      ? {
          headers: {
            Authorization: `Bearer ${emp.token}`,
          },
        }
      : null;

  const fetchTodayAttendance = async () => {
    if (!authConfig) return;

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/employee/attendance/today`,
        authConfig
      );
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
      setAttendance(null);
    } finally {
      setTodayLoading(false);
    }
  };

  const checkIn = async () => {
    if (!authConfig) return;
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/employee/attendance/check-in`,
      {},
      authConfig
    );
    setAttendance(res.data);
  };

  const handleBreak = async () => {
    if (!authConfig) return;
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/employee/attendance/break`,
      {},
      authConfig
    );
    setAttendance(res.data);
  };

  const checkOut = async () => {
    if (!authConfig) return;
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/employee/attendance/check-out`,
      {},
      authConfig
    );
    setAttendance(res.data);
  };

  const getLastFourDaysAttendance = async () => {
    if (!authConfig) return;

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/employee/attendance/history`,
        authConfig
      );
      setFourDays(res.data);
    } catch (err) {
      console.error(err);
      setFourDays([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (authReady && emp) {
      fetchTodayAttendance();
      getLastFourDaysAttendance();
    }
    if (authReady && !emp) {
      setTodayLoading(false);
      setHistoryLoading(false);
    }
  }, [authReady, emp, fetchTodayAttendance,getLastFourDaysAttendance]);

  const loading = todayLoading || historyLoading;

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        checkIn,
        loading,
        handleBreak,
        checkOut,
        fourDays,
        getLastFourDaysAttendance,
        fetchTodayAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
