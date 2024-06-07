import { useContext } from "react";
import "./Header.scss";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../App";
import { ROL } from "../../models/User";
import { PiUserLight } from "react-icons/pi";

const Header = (): JSX.Element => {
  const authInfo = useContext(AuthContext);

  const getHeaderClassName = (): string => {
    if (!authInfo?.userInfo) {
      return "header";
    }
    switch (authInfo.userInfo.rol) {
      case ROL.ADMIN:
        return "header header--admin";
      case ROL.DELEGATE:
        return "header header--delegate";
      default:
        return "header header--user";
    }
  };

  return (
    <header className={getHeaderClassName()}>
      <div className="header__home">
        <NavLink to="/" className="header__link">
          Football manager
        </NavLink>
      </div>

      {authInfo?.userInfo ? (
        <div className="header__user-info-sign-in">
          {authInfo?.userInfo && authInfo.userInfo.rol !== ROL.ADMIN ? (
            <NavLink className="header__user-profile" to="/profile">
              {" "}
              Mi perfil
            </NavLink>
          ) : (
            <NavLink className="header__user-profile" to="/profile-admin">
              {" "}
              Mi perfil
            </NavLink>
          )}

          <span className="header__logout" onClick={authInfo.logout}>
            logout
          </span>
        </div>
      ) : (
        <div className="header__user-info">
          <NavLink to="/login" className="header__user-link">
            Login
          </NavLink>
          <span>/</span>
          <NavLink to="/register" className="header__user-link">
            Registro
          </NavLink>
          <span className="header__user-icon">
            <PiUserLight />
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
