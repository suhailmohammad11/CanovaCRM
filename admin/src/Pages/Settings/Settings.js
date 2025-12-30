import Navbar from "../../Components/Navbar/Navbar";
import EditForm from "../../Components/SettingsEdit/EditForm";
import "./SettingStyles.css";

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="settings-navbar">
        <Navbar />
      </div>
      <div className="right">
        <img
          src="long-line.png"
          alt="long-line"
          className="settings-long-line"
        />
        <div className="settings-edit-form">
          <EditForm />
        </div>
      </div>
    </div>
  );
};

export default Settings;
