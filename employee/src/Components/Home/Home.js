import "./HomeStyles.css";
import { useAttendance } from "../../Hooks/useAttendance";
import { useEmployee } from "../../Hooks/useEmployee";
import { useEffect } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";

const Home = () => {
  const {
    attendance,
    loading,
    checkIn,
    checkOut,
    handleBreak,
    fourDays,
    fetchTodayAttendance,
  } = useAttendance();

  const { getRecentActivity, recentActivity } = useEmployee();
  const { authReady, emp } = useAuthContext();

  useEffect(() => {
    if (authReady && emp) {
      fetchTodayAttendance();
      getRecentActivity();
    }
  }, [authReady, emp, fetchTodayAttendance, getRecentActivity]);

  if (loading) return <p>Loading...</p>;

  const checkInTime = attendance?.checkIn || "--:--__";
  const checkOutTime = attendance?.checkOut || "--:--__";
  const breakData = attendance?.breaks?.[0];

  const isCheckedIn = checkInTime !== "--:--__";
  const isCheckedOut = checkOutTime !== "--:--__";
  const breakStarted = breakData?.breakStart;
  const breakEnded = breakData?.breakEnd && breakData.breakEnd !== "--:--__";

  const breakSwitchSrc = !breakStarted
    ? "switch.png"
    : breakEnded
    ? "red.png"
    : "green.png";

  const checkSwitchSrc = !isCheckedIn
    ? "switch.png"
    : isCheckedIn && !isCheckedOut
    ? "green.png"
    : "red.png";

  const formatTime = (time) => {
    if (!time || time === "--:--__") return "--:--__";

    const parts = time.split(":");

    return `${parts[0]}:${parts[1]} ${parts[2].split(" ")[1]}`;
  };
  const formatDate = (date) => {
    if (!date) return "--/--/--";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  return (
    <div className="home">
      <div className="timings">
        <p className="timings-title">Timings</p>
        <div className="check-in-out-div">
          <div className="check-in-out">
            <div className="check-in-data">
              <p className="time-title">Check In</p>
              <p className="time-data">{formatTime(checkInTime)}</p>
            </div>
            <div className="check-out-data">
              <p className="time-title">Check Out</p>
              <p className="time-data">{formatTime(checkOutTime)}</p>
            </div>
          </div>
          <img
            src={checkSwitchSrc}
            alt="switch"
            className="switch-btn"
            onClick={() => {
              if (!isCheckedIn) checkIn();
              else if (!isCheckedOut) checkOut();
            }}
          />
        </div>

        <div className="break-ended-div">
          <div className="break-ended">
            <div className="break-data">
              <p className="time-title">Break</p>
              <p className="time-data">
                {formatTime(breakStarted) || "--:--__"}
              </p>
            </div>
            <div className="ended-data">
              <p className="time-title">Ended</p>
              <p className="time-data">
                {breakEnded ? formatTime(breakData.breakEnd) : "--:--__"}
              </p>
            </div>
          </div>
          <img
            src={breakSwitchSrc}
            alt="break-switch"
            className="switch-btn"
            onClick={handleBreak}
          />
        </div>

        {/* Last 4 days history*/}
        <div className="four-days-history">
          {fourDays.length === 0 && <p>No recent history</p>}

          {fourDays.slice(0, 4).map((day) => {
            const b = day.breaks?.[0];
            return (
              <div className="four-day-card" key={day._id}>
                <div className="break-history">
                  <div className="activity-break-start">
                    <p>Break</p>
                    <p>{formatTime(b?.breakStart) || "--:--__"}</p>
                  </div>
                  <div className="activity-break-end">
                    <p>Ended</p>
                    <p>{formatTime(b?.breakEnd) || "--:--__"}</p>
                  </div>
                </div>
                <div className="activity-date">
                  <p>Date </p>
                  <p> {formatDate(day.assignedDate)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="home-activity">
        <p className="timings-title">Recent Activity</p>
        <div className="timings-data">
          <ul>
            {recentActivity &&
              recentActivity.map((activity) => {
                return (
                  <div className="activities" key={activity._id}>
                    <ul>
                      <li>{activity.message}</li>
                    </ul>
                  </div>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
