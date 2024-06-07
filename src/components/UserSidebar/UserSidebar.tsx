import { useContext, useState, useEffect } from "react";
import "./UserSidebar.scss";
import { AuthContext } from "../../App";
import { ROL, TeamResponse } from "../../models/User";
import profileimage from "../../assets/profile-image.png";
import shieldBig from "../../assets/shield-big.png";

const UserSidebar = ({ team }: { team: TeamResponse | null }): JSX.Element => {
  const authInfo = useContext(AuthContext);
  const API_URL_USER = `${process.env.REACT_APP_API_URL as string}/user/`;
  const API_URL_TEAM = `${process.env.REACT_APP_API_URL as string}/team/`;

  const [isEditingUser, setIsEditingUser] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(authInfo.userInfo?.firstName ?? "");
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [updatedTeamName, setUpdatedTeamName] = useState(team?.name ?? "");
  const [updatedTeamAlias, setUpdatedTeamAlias] = useState(team?.alias ?? "");

  useEffect(() => {
    setUpdatedUser(authInfo.userInfo?.firstName ?? "");
  }, [authInfo.userInfo?.firstName]);

  useEffect(() => {
    setUpdatedTeamName(team?.name ?? "");
    setUpdatedTeamAlias(team?.alias ?? "");
  }, [team?.name, team?.alias]);

  const handleEditUserClick = (): void => {
    setIsEditingUser(true);
  };

  const handleEditTeamClick = (): void => {
    setIsEditingTeam(true);
  };

  const handleUserSaveClick = async (): Promise<void> => {
    if (authInfo?.userToken && authInfo?.userInfo?._id) {
      try {
        const response = await fetch(API_URL_USER + authInfo.userInfo._id, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${authInfo.userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName: updatedUser }),
        });

        if (response.ok) {
          setUpdatedUser(updatedUser);
          alert("Campo actualizado correctamente");
        } else {
          alert("Error al actualizar. Inténtalo de nuevo.");
        }
      } catch (error) {
        console.error(error);
        alert("Error al actualizar. Inténtalo de nuevo.");
      } finally {
        setIsEditingUser(false);
      }
    }
  };

  const handleTeamSaveClick = async (): Promise<void> => {
    if (authInfo?.userToken && team) {
      try {
        const response = await fetch(API_URL_TEAM + team._id, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${authInfo.userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: updatedTeamName, alias: updatedTeamAlias }),
        });

        if (response.ok) {
          setUpdatedTeamName(updatedTeamName);
          setUpdatedTeamAlias(updatedTeamAlias);
          alert("Campos actualizados correctamente");
        } else {
          alert("Error al actualizar. Inténtalo de nuevo.");
        }
      } catch (error) {
        console.error(error);
        alert("Error al actualizar. Inténtalo de nuevo.");
      } finally {
        setIsEditingTeam(false);
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__user-info">
        <img className="sidebar__image" src={profileimage} alt={authInfo.userInfo?.firstName} />
        {isEditingUser ? (
          <>
            <label htmlFor="firstName">Nombre:</label>
            <input
              type="text"
              value={updatedUser}
              onChange={(e) => {
                setUpdatedUser(e.target.value);
              }}
            />
          </>
        ) : (
          <span className="sidebar__name">{authInfo.userInfo?.firstName}</span>
        )}

        <span className="sidebar__rol">{authInfo.userInfo?.rol}</span>
        {isEditingUser ? (
          <>
            <span className="sidebar__save" onClick={handleUserSaveClick}>
              Guardar
            </span>
          </>
        ) : (
          <>
            <span
              className="sidebar__edit"
              onClick={() => {
                handleEditUserClick();
              }}
            >
              Editar
            </span>
          </>
        )}
      </div>
      {authInfo?.userInfo && authInfo.userInfo.rol === ROL.DELEGATE && (
        <div className="sidebar__team-info">
          <span className="sidebar__team-delegate">Delegado del:</span>
          <div className="sidebar__team-image-container"></div>
          <img className="sidebar__team-image" src={shieldBig} alt={team?.name} />
          {isEditingTeam ? (
            <>
              <label htmlFor="teamName">Nombre del equipo:</label>
              <input
                type="text"
                value={updatedTeamName}
                onChange={(e) => {
                  setUpdatedTeamName(e.target.value);
                }}
              />
              <label htmlFor="teamName">Alias del equipo:</label>
              <input
                type="text"
                value={updatedTeamAlias}
                onChange={(e) => {
                  setUpdatedTeamAlias(e.target.value);
                }}
              />
              <span className="sidebar__save" onClick={handleTeamSaveClick}>
                Guardar equipo
              </span>
            </>
          ) : (
            <>
              <span className="sidebar__team-name">{team?.name}</span>
              <span className="sidebar__team-alias">{team?.alias}</span>
              <span
                className="sidebar__edit"
                onClick={() => {
                  handleEditTeamClick();
                }}
              >
                Editar equipo
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSidebar;
