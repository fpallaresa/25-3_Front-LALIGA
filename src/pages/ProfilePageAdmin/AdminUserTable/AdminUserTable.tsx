import { useContext, useEffect, useRef, useState } from "react";
import "./AdminUserTable.scss";
import { AuthContext } from "../../../App";
import profileimage from "../../../assets/profile-image.png";
import { ROL, UserCreate, UserResponse } from "../../../models/User";

interface TeamResponse {
  alias: string
}

const AdminUserTable = (): JSX.Element => {
  const API_URL_USER = `${process.env.REACT_APP_API_URL as string}/user/`;
  const API_URL_TEAM = `${process.env.REACT_APP_API_URL as string}/team/`;
  const authInfo = useContext(AuthContext);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [newUserData, setNewUserData] = useState<Record<string, Partial<UserResponse>>>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const rolRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const fetchUsers = (): void => {
    if (authInfo?.userToken) {
      fetch(API_URL_USER + "?limit=200", {
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
          setUsers(responseParsed.data);
        })
        .catch((error) => {
          console.error(error);
          alert("Ha ocurrido un error en la petición");
        });
    }
  };

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

    const userToCreate: UserCreate = {
      email: emailRef.current?.value as string,
      password: passwordRef.current?.value as string,
      firstName: firstNameRef.current?.value as string,
      lastName: lastNameRef.current?.value as string,
      rol: rolRef.current?.value as ROL,
      image: "" as string,
    };

    if (!userToCreate.email || !userToCreate.firstName || !userToCreate.lastName || !userToCreate.rol) {
      alert("Debes introducir todos los campos");
      return;
    }

    fetch(API_URL_USER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authInfo.userToken as string}`,
      },
      body: JSON.stringify(userToCreate),
    })
      .then(async (response) => {
        if (response.status === 201) {
          (emailRef as any).current.value = "";
          (firstNameRef as any).current.value = "";
          (lastNameRef as any).current.value = "";
          (rolRef as any).current.value = "";
          (passwordRef as any).current.value = "";
        } else {
          alert("Ha ocurrido un error");
        }
        return await response.json();
      })
      .then(() => {
        fetchUsers();
      })
      .catch((error) => {
        alert("Ha ocurrido un error en la petición");
        console.error(error);
      });
  };

  const deleteUser = (userId: string): void => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      return;
    }

    fetch(`${API_URL_USER}${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authInfo.userToken as string}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          fetchUsers();
        } else {
          alert("Ha ocurrido un error al eliminar el usuario");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Ha ocurrido un error en la petición");
      });
  };

  const handleEditClick = (userId: string): void => {
    setEditMode({ ...editMode, [userId]: true });
    setNewUserData({ ...newUserData, [userId]: { ...users.find((user) => user._id === userId) } });
  };

  const handleInputChange = (userId: string, field: string, value: any): void => {
    setNewUserData({
      ...newUserData,
      [userId]: {
        ...newUserData[userId],
        [field]: field === "team" ? teams.find((team) => team.alias === value) : value,
      },
    });
  };

  const handleSaveClick = (userId: string): void => {
    const updatedUser = newUserData[userId];
    if (authInfo?.userToken) {
      fetch(`${API_URL_USER}${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authInfo.userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })
        .then(async (response) => {
          if (response.status !== 200) {
            alert("Ha ocurrido un error en la petición");
          }
          return await response.json();
        })
        .then(() => {
          setEditMode({ ...editMode, [userId]: false });
          fetchUsers();
        })
        .catch((error) => {
          console.error(error);
          alert("Ha ocurrido un error en la petición");
        });
    }
  };

  const getTeamAlias = (team?: string | TeamResponse): string => {
    if (!team) {
      return "";
    }
    if (typeof team === "string") {
      return team;
    }
    return team.alias;
  };

  return (
    <>
      <div className="user-table">
        <h3 className="user-table__title">USUARIOS</h3>
        <div className="user-table__container">
          <table className="user-table__table">
            <thead className="user-table__thead">
              <tr>
                <th></th>
                <th>NOMBRE</th>
                <th>APELLIDOS</th>
                <th>EMAIL</th>
                <th>EQUIPO</th>
                <th>ROL</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody className="user-table__tbody">
              {users?.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img src={profileimage} alt={`${user.firstName}`} />
                  </td>
                  <td>
                    {editMode[user._id] ? (
                      <input
                        className="user-table__input-name"
                        type="text"
                        placeholder="Introduce nombre"
                        value={newUserData[user._id]?.firstName ?? ""}
                        onChange={(e) => {
                          handleInputChange(user._id, "firstName", e.target.value);
                        }}
                      />
                    ) : (
                      user.firstName
                    )}
                  </td>
                  <td>
                    {editMode[user._id] ? (
                      <input
                        className="user-table__input-lastname"
                        type="text"
                        placeholder="Introduce apellidos"
                        value={newUserData[user._id]?.lastName ?? ""}
                        onChange={(e) => {
                          handleInputChange(user._id, "lastName", e.target.value);
                        }}
                      />
                    ) : (
                      user.lastName
                    )}
                  </td>
                  <td>
                    {editMode[user._id] ? (
                      <input
                        className="user-table__input-email"
                        type="email"
                        placeholder="Introduce email"
                        value={newUserData[user._id]?.email ?? ""}
                        onChange={(e) => {
                          handleInputChange(user._id, "email", e.target.value);
                        }}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="user-table__select">
                    {editMode[user._id] ? (
                      <select
                        value={getTeamAlias(user.team)}
                        onChange={(e) => {
                          handleInputChange(user._id, "team", e.target.value);
                        }}
                      >
                        <option value="">Selecciona equipo</option>
                        {teams.map((team) => (
                          <option key={team.alias} value={team.alias}>
                            {team.alias}
                          </option>
                        ))}
                      </select>
                    ) : (
                      getTeamAlias(user.team)
                    )}
                  </td>
                  <td className="user-table__select">
                    {editMode[user._id] ? (
                      <select
                        value={newUserData[user._id]?.rol ?? ""}
                        onChange={(e) => {
                          handleInputChange(user._id, "rol", e.target.value as ROL);
                        }}
                      >
                        <option value="">Selecciona rol</option>
                        <option value={ROL.PLAYER}>{ROL.PLAYER}</option>
                        <option value={ROL.DELEGATE}>{ROL.DELEGATE}</option>
                        <option value={ROL.ADMIN}>{ROL.ADMIN}</option>
                      </select>
                    ) : (
                      user.rol
                    )}
                  </td>
                  <td>
                    {editMode[user._id] ? (
                      <button
                        className="user-table__save"
                        onClick={() => {
                          handleSaveClick(user._id);
                        }}
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        className="user-table__edit"
                        onClick={() => {
                          handleEditClick(user._id);
                        }}
                      >
                        Editar
                      </button>
                    )}
                  </td>
                  <td>
                    {editMode[user._id] ? (
                      <button
                        className="user-table__delete"
                        onClick={() => {
                          deleteUser(user._id);
                        }}
                      >
                        Eliminar
                      </button>
                    ) : (
                      <td></td>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <span className="user-table__add-players">NUEVO USUARIO</span>
      <div className="user-table">
        <div className="user-table__container">
          <form className="user-table__form" onSubmit={submitForm}>
            <table className="user-table__table">
              <tbody className="user-table__tbody">
                <tr>
                  <td className="user-table__image">
                    <img src={profileimage} alt="imagen de perfil" />
                  </td>
                  <td className="user-table__info">
                    <input className="user-table__input-name" ref={firstNameRef} type="text" id="firstName" placeholder="Introduce nombre" />
                  </td>
                  <td className="user-table__info">
                    <input className="user-table__input-lastname" ref={lastNameRef} type="text" id="lastname" placeholder="Introduce apellidos" />
                  </td>
                  <td className="user-table__info">
                    <input className="user-table__input-email" ref={emailRef} type="email" id="email" placeholder="Introduce email" />
                  </td>
                  <td className="user-table__info">
                    <input className="user-table__input-password" ref={passwordRef} type="text" id="pasword" placeholder="Introduce password" />
                  </td>
                  <td className="user-table__select">
                    <select id="user-rol" ref={rolRef} required>
                      <option value=""> Selecciona rol </option>
                      <option value="PLAYER">Jugador</option>
                      <option value="DELEGATE">Delegado</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </td>
                  <td className="user-table__add">
                    <button type="submit" className="user-table__button">
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

export default AdminUserTable;
