import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import "./ProfilePage.scss";
import { AuthContext } from "../../App";
import { Navigate } from "react-router-dom";
import { TeamResponse } from "../../models/Team";
import { ROL } from "../../models/User";
import Footer from "../../components/Footer/Footer";
import UserSidebar from "../../components/UserSidebar/UserSidebar";
import TeamTable from "./TeamTable/TeamTable";
import MatchdayTable from "./MatchdayTable/MatchdayTable";
import { MatchdayResponse } from "../../models/Matchday";

const ProfilePage = (): JSX.Element => {
  const API_URL_TEAM = `${process.env.REACT_APP_API_URL as string}/team/`;
  const API_URL_MATCHDAY = `${process.env.REACT_APP_API_URL as string}/matchday/`;
  const authInfo = useContext(AuthContext);
  const [team, setTeam] = useState<TeamResponse | null>(null);
  const [matchday, setMatchday] = useState<MatchdayResponse | null>(null);

  const updateTeam = (): void => {
    if (authInfo?.userInfo?.team && typeof authInfo.userInfo.team === "string") {
      fetchTeam(authInfo.userInfo.team);
    }
  };

  useEffect(() => {
    if (authInfo?.userInfo?.team && typeof authInfo.userInfo.team === "string") {
      fetchTeam(authInfo.userInfo.team);
    }
  }, [authInfo]);

  useEffect(() => {
    if (authInfo?.userInfo) {
      fetchMatchday();
    }
  }, [authInfo]);

  const fetchTeam = (teamId: string): void => {
    if (authInfo?.userToken && authInfo?.userInfo?.rol !== ROL.ADMIN) {
      fetch(API_URL_TEAM + teamId, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authInfo.userToken}`,
        },
      })
        .then(async (response) => {
          if (response.status !== 200) {
            alert("Ha ocurrido un error en la petición");
          }
          return await response.json();
        })
        .then((responseParsed) => {
          setTeam(responseParsed);
        })
        .catch((error) => {
          console.error(error);
          alert("Ha ocurrido un error en la petición");
        });
    }
  };

  const fetchMatchday = (): void => {
    fetch(API_URL_MATCHDAY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.status !== 200) {
          alert("Ha ocurrido un error en la petición");
        }
        return await response.json();
      })
      .then((responseParsed) => {
        setMatchday(responseParsed);
      })
      .catch((error) => {
        console.error(error);
        alert("Ha ocurrido un error en la petición");
      });
  };

  return (
    <div className="profile-page">
      {authInfo?.userInfo ? (
        <>
          <Header />
          <div className="profile-page__container">
            <div className="profile-page__sidebar-content">
              <UserSidebar team={team} />
            </div>
            <div className="profile-page__main-content">
              <TeamTable team={team} updateTeam={updateTeam} />
              <MatchdayTable matchday={matchday} />
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

export default ProfilePage;
