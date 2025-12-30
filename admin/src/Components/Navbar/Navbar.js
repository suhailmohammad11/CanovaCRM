import { useNavigate } from "react-router-dom";
import "./NavbarStyles.css";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="logo">
        <p className="first-word">Canova</p>
        <p className="second-word">CRM</p>
      </div>
      <img src="long-line.png" alt="longline" className="nav-line" />
      <nav className="nav-items">
        <p className="nav-item" onClick={() => navigate("/dashboard")}>
          Dashboard
        </p>
        <p className="nav-item" onClick={() => navigate("/leads")}>
          Leads
        </p>
        <p className="nav-item" onClick={() => navigate("/employees")}>
          Employees
        </p>
        <p className="nav-item" onClick={() => navigate("/settings")}>
          Settings
        </p>
      </nav>
    </div>
  );
};

export default Navbar;
