import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "../../Hooks/useAdmin";
import Employees from "../Employees/EmployeeCard/Employees";
import ConversionRateBarChart from "../Chart/ConversionRateBarChart";
import { useNavigate } from "react-router-dom";
import Search from "../Search/Search";
import "./DashboardStyles.css";

const Dashboard = () => {
  const { leads, getLeads } = useAdmin();
  const navigate = useNavigate();
  const [dashboardSearch, setDashboardSearch] = useState("");

  const { unAssigned, assigned, closedLeads, conversionRate } = useMemo(() => {
    let unAssigned = 0;
    let assigned = 0;
    let closedLeads = 0;

    for (let lead of leads) {
      if (!lead.AssignedTo) {
        unAssigned++;
      } else {
        assigned++;
        if (lead.status === "Closed") closedLeads++;
      }
    }

    const conversionRate =
      assigned === 0 ? 0 : ((closedLeads / assigned) * 100).toFixed(2);

    return { unAssigned, assigned, closedLeads, conversionRate };
  }, [leads]);

  const { activities } = useAdmin();

  return (
    <div className="dashboard">
      <div className="dashboard-search">
        <Search value={dashboardSearch} onChange={setDashboardSearch} />
        <div className="line">
          <img src="long-line.png" alt="long-line" className="long-line" />
        </div>
      </div>

      <div className="path-crumbs">
        <p onClick={() => navigate("/dashboard")}>Home</p>
        <img src="crumb-right.png" alt="right" className="crumb-right" />
        <p>Dashboard</p>
      </div>

      <div className="leads-data">
        <div className="data">
          <div className="data-img">
            <img src="unassigned.png" alt="ua" className="data-image" />
          </div>
          <div className="datas-title-value">
            <p className="data-title">Unassigned Leads</p>
            <p className="data-value">{unAssigned}</p>
          </div>
        </div>
        <div className="data">
          <div className="data-img">
            <img src="asssigned.png" alt="ua" className="data-image" />
          </div>
          <div className="datas-title-value">
            <p className="data-title">Assigned This Week</p>
            <p className="data-value">{assigned}</p>
          </div>
        </div>
        <div className="data">
          <div className="data-img">
            <img src="active-salespeople.png" alt="ua" className="data-image" />
          </div>
          <div className="datas-title-value">
            <p className="data-title">Active Salespeople</p>
            <p className="data-value">0</p>
          </div>
        </div>
        <div className="data">
          <div className="data-img">
            <img src="conversion-rate.png" alt="ua" className="data-image" />
          </div>
          <div className="datas-title-value">
            <p className="data-title">Conversion Rate</p>
            <p className="data-value">{conversionRate}%</p>
          </div>
        </div>
      </div>

      <div className="graph-activity">
        <div className="graph">
          <ConversionRateBarChart />
        </div>
        <div className="activity">
          <p className="activity-title">Recent Activity Feed</p>
          <div className="activity-feed">
            {activities.length === 0 && <p>No recent activities</p>}
            {activities.map((act, idx) => (
              <p className="act" key={idx}>
                [{new Date(act.createdAt).toLocaleTimeString()}] {act.message}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-leads">
        <div className="employees-table-scroll">
          <Employees
            showSearch={false}
            showHeader={false}
            statusFilter="active"
            enablePagination={false}
            externalSearchTerm={dashboardSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
