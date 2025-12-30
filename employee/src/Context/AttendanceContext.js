import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useAuthContext } from "../Hooks/useAuthContext";

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const { emp, authReady } = useAuthContext();
  const [fourDays, setFourDays] = useState([]);

const authConfig = useMemo(() => {
  if (!emp?.token) return null;
  return {
    headers: {
      Authorization: `Bearer ${emp.token}`,
    },
  };
}, [emp]);


 const fetchTodayAttendance = useCallback(async () => {
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
}, [authConfig]);


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

const getLastFourDaysAttendance = useCallback(async () => {
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
}, [authConfig]);


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
