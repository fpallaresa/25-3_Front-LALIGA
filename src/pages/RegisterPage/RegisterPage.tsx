import { useRef } from "react";
import Header from "../../components/Header/Header";
import "./RegisterPage.scss";
import { ROL, UserCreate } from "../../models/User";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const RegisterPage = (): JSX.Element => {
  const API_URL_REGISTER = `${process.env.REACT_APP_API_URL as string}/user/`;
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const initialState = {
    rol: "PLAYER" as ROL,
  };

  const submitForm = (event: React.FormEvent): void => {
    event.preventDefault();

    const userToCreate: UserCreate = {
      email: emailRef.current?.value as string,
      password: passwordRef.current?.value as string,
      firstName: firstNameRef.current?.value as string,
      lastName: lastNameRef.current?.value as string,
      image: imageRef.current?.value as string,
      rol: initialState.rol,
    };

    if (!userToCreate.email || !userToCreate.firstName || !userToCreate.lastName) {
      alert("Debes introducir todos los campos");
      return;
    }

    fetch(API_URL_REGISTER, {
      method: "POST",
      body: JSON.stringify(userToCreate),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.status === 201) {
          alert("Usuario registrado exitosamente!");
          navigate("/login");
        }
        return await response.json();
      })
      .catch((error) => {
        console.error(error);
        alert("Ha ocurrido un error en la petición");
      });
  };

  return (
    <div className="register-page">
      <Header></Header>
      <div className="register-page__main-container">
        <h1 className="register-page__title">Bienvenido</h1>
        <h2 className="register-page__subtitle">Sign up</h2>
        <h3 className="register-page__description">Introduce tus datos para registrarte:</h3>

        <form onSubmit={submitForm} className="register-page__form">
          <label htmlFor="email">Email:</label>
          <input className="register-page__input-email" ref={emailRef} type="email" id="email" placeholder="Introduce tu email" />

          <label htmlFor="password">Password:</label>
          <input className="register-page__input-password" ref={passwordRef} type="password" id="password" placeholder="Introduce tu contraseña" />

          <label htmlFor="firstname">Nombre:</label>
          <input className="register-page__input-name" ref={firstNameRef} type="text" id="name" placeholder="Introduce tu nombre" />

          <label htmlFor="lastname">Apellidos:</label>
          <input className="register-page__input-name" ref={lastNameRef} type="text" id="lastname" placeholder="Introduce tus apellidos" />

          <button className="register-page__button-sing-up button" type="submit" title="Log in">
            REGISTRARSE
          </button>
        </form>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default RegisterPage;
