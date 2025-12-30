import { useLocation, useNavigate } from "react-router-dom";
import "./HeaderStyles.css";
import { useEmployee } from "../../Hooks/useEmployee";
import { useEffect } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { editProfileForm, getEmployeeDetails } = useEmployee();
  const { emp } = useAuthContext();

  const breadcrumbMap = {
    "/home": null,
    "/leads": "/home",
    "/schedule": "/leads",
    "/profile": "/schedule",
  };

  let pageName = "Profile";
  const userName = editProfileForm
    ? `${editProfileForm.firstName} ${editProfileForm.lastName}`
    : "";

  if (location.pathname === "/home") pageName = userName;
  else if (location.pathname === "/leads") pageName = "Leads";
  else if (location.pathname === "/schedule") pageName = "Schedule";
  else pageName = "Profile";

  useEffect(() => {
    if (emp?.id) {
      getEmployeeDetails();
    }
  }, [emp, getEmployeeDetails]);

  const handleBack = () => {
    const prevPath = breadcrumbMap[location.pathname];
    if (prevPath) navigate(prevPath);
  };

  return (
    <div className="header">
      <img src="mask.png" alt="rings" className="hero" />

      <div className="logo">
        <p className="logo-first-word">Canova</p>
        <p className="logo-second-word">CRM</p>
      </div>

      <div
        className={location.pathname === "/home" ? "home-title" : "back-page"}
      >
        {location.pathname !== "/home" && (
          <img
            className="back-arrow"
            src="back-arrow.png"
            alt="back"
            onClick={handleBack}
          />
        )}

        {location.pathname === "/home" && (
          <p className="gd-mrng">Good Morning</p>
        )}

        <p className="page-name">{pageName}</p>
      </div>
    </div>
  );
};

export default Header;
