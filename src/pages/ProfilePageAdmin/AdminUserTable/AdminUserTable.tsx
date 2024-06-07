import { useContext, useEffect, useRef, useState } from "react";
import "./AdminUserTable.scss";
import { AuthContext } from "../../../App";
import profileimage from "../../../assets/profile-image.png";
import { ROL, UserCreate, UserResponse } from "../../../models/User";

const AdminUserTable = (): JSX.Element => {
  const API_URL_USER = `${process.env.REACT_APP_API_URL as string}/user/`;
  const authInfo = useContext(AuthContext);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const rolRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = (): void => {
    if (authInfo?.userToken) {
      fetch(API_URL_USER + "?limit=200", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authInfo.userToken}`,
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
        "Authorization": `Bearer ${authInfo.userToken as string}`,
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

  const getTeamAlias = (team?: string | { alias: string }): string => {
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
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{getTeamAlias(user.team)}</td>
                  <td>{user.rol}</td>
                  <td className="user-table__edit">EDITAR</td>
                  <td className="user-table__delete"><button className="user-table__button"onClick={() => { deleteUser(user._id) }}>ELIMINAR</button></td>
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
                    <button type="submit" className="user-table__button">AÑADIR</button>
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
