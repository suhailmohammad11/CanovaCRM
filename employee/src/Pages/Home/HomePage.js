import "./HomePageStyles.css";
import Header from "../../Components/Header/Header";
import Home from "../../Components/Home/Home";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="home-page-header">
        <Header />
      </div>
      <div className="home-page-comp">
        <Home />
      </div>
    </div>
  );
};

export default HomePage;
