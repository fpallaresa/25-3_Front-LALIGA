import { useContext, useEffect, useState } from "react";
import "./MatchdayTable.scss";
import { MatchdayResponse } from "../../../models/Matchday";
import { AuthContext } from "../../../App";
import shield from "../../../assets/shield.png";

const MatchdayTable = (): JSX.Element => {
  const API_URL_MATCHDAY = `${process.env.REACT_APP_API_URL as string}/matchday/`;
  const authInfo = useContext(AuthContext);
  const [matchdays, setMatchdays] = useState<MatchdayResponse[]>([]);

  useEffect(() => {
    if (authInfo?.userInfo?.team && typeof authInfo.userInfo.team === "string") {
      fetchMatchday(authInfo.userInfo.team);
    }
  }, [authInfo]);

  const fetchMatchday = (teamId: string): void => {
    if (authInfo?.userToken) {
      fetch(API_URL_MATCHDAY + "team?team=" + teamId, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authInfo.userToken}`,
        },
      })
        .then(async (response) => {
          if (response.status !== 200) {
            alert("Ha ocurrido un error en la petición de partidos");
            return null;
          }
          return await response.json();
        })
        .then((responseParsed) => {
          if (responseParsed && Array.isArray(responseParsed.data)) {
            setMatchdays(responseParsed.data);
          } else {
            console.error("Respuesta de API inesperada:", responseParsed);
            alert("Ha ocurrido un error en la estructura de la respuesta");
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Ha ocurrido un error en la petición");
        });
    }
  };

  const formatDate = (dateString: string): string => {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" } as const;
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="matchday-table-user">
      <h3 className="matchday-table-user__title">PARTIDOS</h3>
      <div className="matchday-table-user__container">
        {matchdays.map((matchday) => {
          const match = matchday.matches[0];
          return (
            <div key={matchday._id}>
              <table className="matchday-table-user__table">
                <tbody className="matchday-table-user__tbody">
                  <tr key={match._id}>
                    <td className="matchday-table-user__matchday">
                      JORNADA {matchday.matchdayNumber} | {matchday?.date ? formatDate(matchday.date.toString()) : ""}
                    </td>
                    <td className="matchday-table-user__home-team">
                      {match.homeTeam.alias}
                      <img className="matchday-table-user__home-team-image" src={shield} alt={`${match.homeTeam.name}`} />
                    </td>
                    <td className="matchday-table-user__status">{match.status === "NO DISPUTADO" ? "NO DISPUTADO" : `${match.homeGoals} - ${match.awayGoals}`}</td>
                    <td className="matchday-table-user__away-team">
                      <img className="matchday-table-user__away-team-image" src={shield} alt={`${match.homeTeam.name}`} />
                      {match.awayTeam.alias}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchdayTable;
