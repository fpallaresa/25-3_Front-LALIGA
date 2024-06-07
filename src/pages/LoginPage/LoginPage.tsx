import { useContext, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./LoginPage.scss";
import { AuthContext } from "../../App";
import Footer from "../../components/Footer/Footer";
import { ROL } from "../../models/User";

interface LoginInfo {
  email: string
  password: string
}

const LoginPage = (): JSX.Element => {
  const API_URL_LOGIN = `${process.env.REACT_APP_API_URL as string}/user/login`;
  const authInfo = useContext(AuthContext);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const submitForm = (event: React.FormEvent): void => {
    event.preventDefault();

    const loginInfo: LoginInfo = {
      email: emailRef?.current?.value as string,
      password: passwordRef?.current?.value as string,
    };

    if (!loginInfo.email || !loginInfo.password) {
      alert("Email y la contraseña son obligatorios!");
    } else {
      doLoginRequest(loginInfo);
    }
  };

  const doLoginRequest = (loginInfo: LoginInfo): void => {
    fetch(API_URL_LOGIN, {
      method: "POST",
      body: JSON.stringify(loginInfo),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then(async (response) => {
        if (response.status !== 200) {
          alert("Login incorrecto");
        }
        return await response.json();
      })
      .then((data) => {
        // Login OK -> Guardamos las credenciales
        if (data.token && data.user && authInfo.login) {
          authInfo.login(data.token, data.user);
          if (data.user.rol !== ROL.ADMIN) {
            navigate("/profile");
          } else {
            navigate("/profile-admin");
          }
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Ha ocurrido un error en la petición");
      });
  };

  return (
    <div className="login-page">
      <Header></Header>
      <div className="login-page__main-container">
        <h1 className="login-page__title">Bienvenido</h1>
        <h2 className="login-page__subtitle">Sign in</h2>
        <h3 className="login-page__description">Introduce tus credenciales para acceder:</h3>

        <form onSubmit={submitForm} className="login-page__form">
          <label htmlFor="email">Email:</label>
          <input className="login-page__input-email" ref={emailRef} type="email" id="email" placeholder="Introduce tu email" />

          <label htmlFor="password">Password:</label>
          <input className="login-page__input-password" ref={passwordRef} type="password" id="password" placeholder="Introduce tu contraseña" />

          <button className="login-page__button-sign-up button" type="submit" title="Log in">
            ACCEDER
          </button>
          <NavLink className="login-page__button-register button button--grey" to="/register">
            REGISTRARSE
          </NavLink>
        </form>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default LoginPage;
