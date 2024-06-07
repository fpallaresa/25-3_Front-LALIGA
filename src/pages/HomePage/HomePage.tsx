import Header from "../../components/Header/Header";
import "./HomePage.scss";
import image from "../../assets/image.png";
import StandingTable from "./StandingTable/StandingTable";
import MatchdayTable from "./MatchdayTable/MatchdayTable";
import Footer from "../../components/Footer/Footer";

const HomePage = (): JSX.Element => {
  return (
    <div className="home-page">
      <Header></Header>
      <div className="home-page__container">
        <img className="home-page__image" src={image} alt="Home Image Football Manager" />
        <div className="home-page__data">
          <div className="home-page__standing">
            <StandingTable />
          </div>
          <div className="home-page__matchdays">
            <MatchdayTable />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default HomePage;
