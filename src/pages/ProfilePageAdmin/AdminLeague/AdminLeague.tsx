import { useContext, useEffect, useState } from "react";
import "./AdminLeague.scss";
import { AuthContext } from "../../../App";
import shield from "../../../assets/shield.png";
import { MatchdayResponse } from "../../../models/Matchday";

const AdminLeague = (): JSX.Element => {
  const API_URL_MATCHDAY = `${process.env.REACT_APP_API_URL as string}/matchday/`;
  const API_URL_MATCH = `${process.env.REACT_APP_API_URL as string}/match/`;
  const API_URL_LEAGUE = `${process.env.REACT_APP_API_URL as string}/league/generate`;
  const authInfo = useContext(AuthContext);
  const [matchday, setMatchday] = useState<MatchdayResponse[]>([]);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [newScores, setNewScores] = useState<Record<string, { homeGoals: number, awayGoals: number }>>({});

  useEffect(() => {
    fetchMatchday();
  }, []);

  const fetchMatchday = (): void => {
    if (authInfo?.userToken) {
      fetch(API_URL_MATCHDAY, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authInfo.userToken}`,
        },
      })
        .then(async (response): Promise<any> => {
          if (response.status !== 200) {
            alert("Ha ocurrido un error en la petición");
          }
          return await response.json();
        })
        .then((responseParsed) => {
          setMatchday(responseParsed.data);
        })
        .catch((error) => {
          console.error(error);
          alert("Ha ocurrido un error en la petición");
        });
    }
  };

  const handleGenerateLeague = (): void => {
    if (authInfo?.userToken) {
      fetch(API_URL_LEAGUE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authInfo.userToken}`,
        },
      })
        .then(async (response): Promise<any> => {
          if (response.status !== 200) {
            alert("Ha ocurrido un error en la petición");
          }
          return await response.json();
        })
        .then(() => {
          fetchMatchday();
        })
        .catch((error) => {
          console.error(error);
          alert("Ha ocurrido un error en la petición");
        });
    }
  };

  const handleEditClick = (matchId: string): void => {
    setEditMode({ ...editMode, [matchId]: true });
  };

  const handleInputChange = (matchId: string, team: "homeGoals" | "awayGoals", value: number): void => {
    setNewScores({
      ...newScores,
      [matchId]: { ...newScores[matchId], [team]: value },
    });
  };

  const handleSaveClick = (matchId: string): void => {
    const { homeGoals, awayGoals } = newScores[matchId];
    if (authInfo?.userToken) {
      fetch(`${API_URL_MATCH}${matchId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authInfo.userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homeGoals,
          awayGoals,
          status: "FINALIZADO",
        }),
      })
        .then(async (response): Promise<any> => {
          if (response.status !== 200) {
            alert("Ha ocurrido un error en la petición");
          }
          return await response.json();
        })
        .then(() => {
          setEditMode({ ...editMode, [matchId]: false });
          fetchMatchday();
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
    <>
      <div className="league-table">
        <h3 className="league-table__title">LIGA</h3>
        <div className="league-table__container">
          {matchday.map((matchday) => (
            <div key={matchday._id} className="league-table__item">
              <h4 className="league-table__subtitle">
                JORNADA {matchday.matchdayNumber} | {matchday?.date ? formatDate(matchday.date.toString()) : ""}
              </h4>
              <table className="league-table__table">
                <tbody className="league-table__tbody">
                  {matchday.matches.map((match: any) => (
                    <tr key={match._id}>
                      <td className="league-table__home-team">
                        {match.homeTeam.alias}
                        <img className="league-table__home-team-image" src={shield} alt={`${match.homeTeam.name} shield`} />
                      </td>
                      <td className="league-table__status">
                        {editMode[match._id] ? (
                          <>
                            <input
                              type="number"
                              min="0"
                              value={newScores[match._id]?.homeGoals || ""}
                              onChange={(e) => { handleInputChange(match._id, "homeGoals", parseInt(e.target.value)) }}
                              onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (parseInt(target.value) < 0) target.value = "0";
                              }}
                            />
                            -
                            <input
                              type="number"
                              min="0"
                              value={newScores[match._id]?.awayGoals || ""}
                              onChange={(e) => { handleInputChange(match._id, "awayGoals", parseInt(e.target.value)) }}
                              onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                if (parseInt(target.value) < 0) target.value = "0";
                              }}
                            />
                          </>
                        ) : match.status === "NO DISPUTADO" ? (
                          "NO DISPUTADO"
                        ) : (
                          `${match.homeGoals} - ${match.awayGoals}`
                        )}
                      </td>
                      <td className="league-table__away-team">
                        <img className="league-table__away-team-image" src={shield} alt={`${match.awayTeam.name} shield`} />
                        {match.awayTeam.alias}
                      </td>
                      {editMode[match._id] ? (
                        <span
                          className="league-table__save"
                          onClick={() => {
                            handleSaveClick(match._id);
                          }}
                        >
                          Guardar
                        </span>
                      ) : (
                        <span
                          className="league-table__edit"
                          onClick={() => {
                            handleEditClick(match._id);
                          }}
                        >
                          Editar
                        </span>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <span className="league-table__generate-new-league" onClick={handleGenerateLeague}>
            REINICIAR LIGA
          </span>
        </div>
      </div>
    </>
  );
};

export default AdminLeague;
