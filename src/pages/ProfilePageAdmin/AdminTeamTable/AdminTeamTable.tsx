import { useContext, useEffect, useRef, useState } from "react";
import "./AdminTeamTable.scss";
import { AuthContext } from "../../../App";
import shield from "../../../assets/shield.png";
import { TeamResponse } from "../../../models/Team";

interface TeamCreate {
  name: string
  alias: string
}

const AdminTeamTable = (): JSX.Element => {
  const API_URL_TEAM = `${process.env.REACT_APP_API_URL as string}/team/`;
  const authInfo = useContext(AuthContext);
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [newTeamData, setNewTeamData] = useState<Record<string, Partial<TeamCreate>>>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const aliasRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = (): void => {
    if (authInfo?.userToken) {
      fetch(API_URL_TEAM, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authInfo.userToken}`,
        },
      })
        .then(async (response) => {
          if (response.status !== 200) {
            alert("Ha ocurrido un error en la petición de equipos");
          }
          return await response.json();
        })
        .then((responseParsed) => {
          setTeams(responseParsed.data);
        })
        .catch((error) => {
          console.error(error);
          alert("Ha ocurrido un error en la petición");
        });
    }
  };

  const submitForm = (event: React.FormEvent): void => {
    event.preventDefault();

    const teamToCreate: TeamCreate = {
      name: nameRef.current?.value as string,
      alias: aliasRef.current?.value as string,
    };

    if (!teamToCreate.name || !teamToCreate.alias) {
      alert("Debes introducir todos los campos");
      return;
    }

    fetch(API_URL_TEAM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authInfo.userToken as string}`,
      },
      body: JSON.stringify(teamToCreate),
    })
      .then(async (response) => {
        if (response.status === 201) {
          (nameRef as any).current.value = "";
          (aliasRef as any).current.value = "";
        } else {
          alert("Ha ocurrido un error");
        }
        return await response.json();
      })
      .then(() => {
        fetchTeams();
      })
      .catch((error) => {
        alert("Ha ocurrido un error en la petición");
        console.error(error);
      });
  };

  const deleteTeam = (userId: string): void => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este equipo?")) {
      return;
    }

    fetch(`${API_URL_TEAM}${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authInfo.userToken as string}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          fetchTeams();
        } else {
          alert("Ha ocurrido un error al eliminar el equipo");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Ha ocurrido un error en la petición");
      });
  };

  const handleEditClick = (teamId: string): void => {
    setEditMode({ ...editMode, [teamId]: true });
    setNewTeamData({ ...newTeamData, [teamId]: { ...teams.find((team) => team._id === teamId) } });
  };

  const handleInputChange = (teamId: string, field: string, value: any): void => {
    setNewTeamData({
      ...newTeamData,
      [teamId]: {
        ...newTeamData[teamId],
        [field]: value,
      },
    });
  };

  const handleSaveClick = (teamId: string): void => {
    const updatedTeam = newTeamData[teamId];
    if (authInfo?.userToken) {
      fetch(`${API_URL_TEAM}${teamId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authInfo.userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTeam),
      })
        .then(async (response) => {
          if (response.status !== 200) {
            alert("Ha ocurrido un error en la petición");
          }
          return await response.json();
        })
        .then(() => {
          setEditMode({ ...editMode, [teamId]: false });
          fetchTeams();
        })
        .catch((error) => {
          console.error(error);
          alert("Ha ocurrido un error en la petición");
        });
    }
  };

  return (
    <>
      <div className="team-table-admin">
        <h3 className="team-table-admin__title">EQUIPOS</h3>
        <div className="team-table-admin__container">
          <table className="team-table-admin__table">
            <thead className="team-table-admin__thead">
              <tr>
                <th></th>
                <th>NOMBRE</th>
                <th>ALIAS</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody className="team-table-admin__tbody">
              {teams?.map((team) => (
                <tr key={team._id}>
                  <td className="team-table-admin__image-td">
                    <div className="team-table-admin__image-container"></div>
                    <img className="team-table-admin__image" src={shield} alt="" />
                  </td>
                  <td>
                    {editMode[team._id] ? (
                      <input
                        className="team-table-admin__input-name"
                        type="text"
                        placeholder="Introduce nombre"
                        value={newTeamData[team._id]?.name ?? ""}
                        onChange={(e) => {
                          handleInputChange(team._id, "name", e.target.value);
                        }}
                      />
                    ) : (
                      team.name
                    )}
                  </td>
                  <td>
                    {editMode[team._id] ? (
                      <input
                        className="team-table-admin__input-lastname"
                        type="text"
                        placeholder="Introduce alias"
                        value={newTeamData[team._id]?.alias ?? ""}
                        onChange={(e) => {
                          handleInputChange(team._id, "alias", e.target.value);
                        }}
                      />
                    ) : (
                      team.alias
                    )}
                  </td>
                  <td>
                    {editMode[team._id] ? (
                      <button
                        className="team-table-admin__save"
                        onClick={() => {
                          handleSaveClick(team._id);
                        }}
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        className="team-table-admin__edit"
                        onClick={() => {
                          handleEditClick(team._id);
                        }}
                      >
                        Editar
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="team-table-admin__delete"
                      onClick={() => {
                        deleteTeam(team._id);
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <span className="team-table-admin__add-players">NUEVO EQUIPO</span>
      <div className="team-table-admin">
        <div className="team-table-admin__container">
          <form className="team-table-admin__form" onSubmit={submitForm}>
            <table className="team-table-admin__table">
              <tbody className="team-table-admin__tbody">
                <tr>
                  <td className="team-table-admin__image-td">
                    <div className="team-table-admin__image-container"></div>
                    <img className="team-table-admin__image" src={shield} alt="" />
                  </td>
                  <td className="team-table-admin__info">
                    <input className="team-table-admin__input-name" ref={nameRef} type="text" id="name" placeholder="Introduce nombre" />
                  </td>
                  <td className="team-table-admin__info">
                    <input className="team-table-admin__input-lastname" ref={aliasRef} type="text" id="alias" placeholder="Introduce alias" />
                  </td>
                  <td className="team-table-admin__add">
                    <button type="submit" className="team-table-admin__button">
                      AÑADIR
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminTeamTable;
