import { useContext, useState, useEffect } from "react";
import "./TeamTable.scss";
import { AuthContext } from "../../../App";
import { TeamResponse } from "../../../models/Team";
import profileimage from "../../../assets/profile-image.png";
import { ROL, UserResponse } from "../../../models/User";

interface TeamTableProps {
  team: TeamResponse | null
  updateTeam: () => void
}

const TeamTable = ({ team, updateTeam }: TeamTableProps): JSX.Element => {
  const API_URL_USER = `${process.env.REACT_APP_API_URL as string}/user/?page=1&limit=50`;
  const API_URL_ADD_USER_TO_TEAM = `${process.env.REACT_APP_API_URL as string}/user/`;
  const authInfo = useContext(AuthContext);
  const [usersWithoutTeam, setUsersWithoutTeam] = useState<UserResponse[]>([]);
  const [showAddPlayersTable, setShowAddPlayersTable] = useState(false);

  useEffect(() => {
    if (authInfo?.userInfo?.rol === ROL.DELEGATE) {
      fetchUser();
    }
  }, [authInfo]);

  const fetchUser = (): void => {
    if (authInfo?.userToken) {
      fetch(API_URL_USER, {
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
          const usersData = responseParsed.data;
          const usersWithoutTeamUpdated = usersData.filter((user: { team: any }) => !user.team);
          setUsersWithoutTeam(usersWithoutTeamUpdated);
        })
        .catch((error) => {
          console.error(error);
          alert("Ha ocurrido un error en la petición");
        });
    }
  };

  const handleShowAddPlayersTable = (): void => {
    setShowAddPlayersTable(true);
  };

  const handleCollapseAddPlayersTable = (): void => {
    setShowAddPlayersTable(false);
  };

  const handleAddPlayerToTeam = async (userId: string): Promise<void> => {
    if (!authInfo?.userToken) return;

    try {
      const response = await fetch(`${API_URL_ADD_USER_TO_TEAM}${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authInfo.userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team: authInfo.userInfo?.team,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar jugador al equipo");
      }

      fetchUser();
      updateTeam();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        alert(error.message);
      } else {
        console.error("Se ha producido un error desconocido");
      }
    }
  };

  const handleRemovePlayerFromTeam = async (userId: string): Promise<void> => {
    if (!authInfo?.userToken) return;

    try {
      const response = await fetch(`${API_URL_ADD_USER_TO_TEAM}${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authInfo.userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar jugador del equipo");
      }

      fetchUser();
      updateTeam();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        alert(error.message);
      } else {
        console.error("Se ha producido un error desconocido");
      }
    }
  };

  return (
    <>
      <div className="team-table">
        <h3 className="team-table__title">MI EQUIPO</h3>
        <div className="team-table__container">
          <table className="team-table__table">
            <thead className="team-table__thead">
              <tr>
                <th></th>
                <th>NOMBRE</th>
                <th>APELLIDOS</th>
                <th>EMAIL</th>
                <th>ROL</th>
                {authInfo?.userInfo && authInfo.userInfo.rol === ROL.DELEGATE ? <th className="team-table__column-non-display">Sacar del equipo</th> : <th></th>}
              </tr>
            </thead>
            <tbody className="team-table__tbody">
              {team?.players?.map((player) => (
                <tr key={player._id}>
                  <td>
                    <img src={profileimage} alt={`${player.firstName}`} />
                  </td>
                  <td>{player.firstName}</td>
                  <td>{player.lastName}</td>
                  <td>{player.email}</td>
                  <td>{player.rol}</td>
                  {authInfo?.userInfo && authInfo.userInfo.rol === ROL.DELEGATE ? (
                    <td
                      className="team-table__delete"
                      onClick={async () => {
                        await handleRemovePlayerFromTeam(player._id);
                      }}
                    >
                      Eliminar
                    </td>
                  ) : (
                    <td></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {authInfo?.userInfo && authInfo.userInfo.rol === ROL.DELEGATE && !showAddPlayersTable && (
        <span className="team-table__add-players" onClick={handleShowAddPlayersTable}>
          AÑADIR JUGADORES
        </span>
      )}
      {showAddPlayersTable && (
        <>
          <span className="team-table__add-players" onClick={handleCollapseAddPlayersTable}>
            FIN DE EDICIÓN
          </span>
          <div className="team-table">
            <div className="team-table__container">
              <table className="team-table__table">
                <thead className="team-table__thead">
                  <tr>
                    <th></th>
                    <th>NOMBRE</th>
                    <th>APELLIDOS</th>
                    <th>EMAIL</th>
                    <th>ROL</th>
                    <th className="team-table__column-add-non-display">Añadir equipo</th>
                  </tr>
                </thead>
                <tbody className="team-table__tbody">
                  {usersWithoutTeam?.map((player) => (
                    <tr key={player._id}>
                      <td>
                        <img src={profileimage} alt={`${player.firstName}`} />
                      </td>
                      <td>{player.firstName}</td>
                      <td>{player.lastName}</td>
                      <td>{player.email}</td>
                      <td>{player.rol}</td>
                      {authInfo?.userInfo && authInfo.userInfo.rol === ROL.DELEGATE ? (
                        <td
                          className="team-table__add"
                          onClick={async () => {
                            await handleAddPlayerToTeam(player._id);
                          }}
                        >
                          Añadir
                        </td>
                      ) : (
                        <td></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeamTable;
