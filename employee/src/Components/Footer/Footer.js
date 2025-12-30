import "./FooterStyles.css";
import { useNavigate, useLocation } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const icons = {
    home: {
      default: "home-icon.png",
      active: "home-active.png",
    },
    leads: {
      default: "leads-page.png",
      active: "leads-active.png",
    },
    schedule: {
      default: "schedule-page.png",
      active: "schedule-active.png",
    },
    profile: {
      default: "profile.png",
      active: "profile-active.png",
    },
  };

  return (
    <div className="footer">
      <div
        className={`footer-icons ${isActive("/home") ? "active" : ""}`}
        onClick={() => navigate("/home")}
      >
        <img
          className="icon"
          src={isActive("/home") ? icons.home.active : icons.home.default}
          alt="home"
        />
        <p className={isActive("/home") ? "active-footer" : "footer-title"}>
          Home
        </p>
      </div>

      <div
        className={`footer-icons ${isActive("/leads") ? "active" : ""}`}
        onClick={() => navigate("/leads")}
      >
        <img
          className="icon"
          src={isActive("/leads") ? icons.leads.active : icons.leads.default}
          alt="leads"
        />
        <p className={isActive("/leads") ? "active-footer" : "footer-title"}>
          Leads
        </p>
      </div>

      <div
        className={`footer-icons ${isActive("/schedule") ? "active" : ""}`}
        onClick={() => navigate("/schedule")}
      >
        <img
          className="icon"
          src={
            isActive("/schedule")
              ? icons.schedule.active
              : icons.schedule.default
          }
          alt="schedule"
        />
        <p className={isActive("/schedule") ? "active-footer" : "footer-title"}>
          Schedule
        </p>
      </div>

      <div
        className={`footer-icons ${isActive("/profile") ? "active" : ""}`}
        onClick={() => navigate("/profile")}
      >
        <img
          className="icon"
          src={
            isActive("/profile") ? icons.profile.active : icons.profile.default
          }
          alt="profile"
        />
        <p className={isActive("/profile") ? "active-footer" : "footer-title"}>
          Profile
        </p>
      </div>
    </div>
  );
};

export default Footer;
