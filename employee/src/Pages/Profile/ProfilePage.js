import EmployeeForm from "../../Components/EmployeeForm/EmployeeForm";
import Header from "../../Components/Header/Header";
import "./ProfilePageStyles.css";

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <Header />
      </div>
      <div className="profile-page-form">
        <EmployeeForm />
      </div>
    </div>
  );
};

export default ProfilePage;
