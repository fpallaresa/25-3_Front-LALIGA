import { useContext, useState } from "react";
import Header from "../../components/Header/Header";
import "./ProfilePageAdmin.scss";
import { AuthContext } from "../../App";
import { Navigate } from "react-router-dom";
import { TeamResponse } from "../../models/Team";
import Footer from "../../components/Footer/Footer";
import UserSidebar from "../../components/UserSidebar/UserSidebar";
import AdminUserTable from "./AdminUserTable/AdminUserTable";
import AdminTeamTable from "./AdminTeamTable/AdminTeamTable";
import AdminLeague from "./AdminLeague/AdminLeague";

const ProfilePageAdmin = (): JSX.Element => {
  const authInfo = useContext(AuthContext);
  const [team] = useState<TeamResponse | null>(null);
  const [activeComponent, setActiveComponent] = useState("USERS");

  const renderComponent = (): JSX.Element | null => {
    switch (activeComponent) {
      case "USERS":
        return <AdminUserTable />;
      case "TEAMS":
        return <AdminTeamTable />;
      case "LEAGUE":
        return <AdminLeague />;
      default:
        return null;
    }
  };

  return (
    <div className="profile-admin-page">
      {authInfo?.userInfo ? (
        <>
          <Header />
          <div className="profile-admin-page__container">
            <div className="profile-admin-page__sidebar-content">
              <UserSidebar team={team} />
            </div>
            <div className="profile-admin-page__main-content">
              <div className="profile-admin-page__options">
                <button
                  className={`profile-admin-page__button button ${activeComponent === "USERS" ? "" : "button--grey"}`}
                  type="button"
                  onClick={() => { setActiveComponent("USERS") }}
                  title="Usuarios"
                >
                  USUARIOS
                </button>
                <button
                  className={`profile-admin-page__button button ${activeComponent === "TEAMS" ? "" : "button--grey"}`}
                  type="button"
                  onClick={() => { setActiveComponent("TEAMS") }}
                  title="Equipos"
                >
                  EQUIPOS
                </button>
                <button
                  className={`profile-admin-page__button button ${activeComponent === "LEAGUE" ? "" : "button--grey"}`}
                  type="button"
                  onClick={() => { setActiveComponent("LEAGUE") }}
                  title="Liga"
                >
                  LIGA
                </button>
              </div>
              {renderComponent()}
            </div>
          </div>
          <Footer />
        </>
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </div>
  );
};

export default ProfilePageAdmin;
