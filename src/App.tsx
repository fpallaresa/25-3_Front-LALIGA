import { HashRouter, Route, Routes } from "react-router-dom";
import { createContext, useState } from "react";
import { UserResponse } from "./models/User";
import "./App.scss";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProfilePageAdmin from "./pages/ProfilePageAdmin/ProfilePageAdmin";

interface AuthContextInfo {
  userInfo?: UserResponse
  userToken?: string
  login?: (userToken: string, userInfo: UserResponse) => void
  logout?: () => void
}

export const AuthContext = createContext<AuthContextInfo>({});

const App = (): JSX.Element => {
  const [userToken, setUserToken] = useState<string | undefined>();
  const [userInfo, setUserInfo] = useState<UserResponse | undefined>();

  const login = (userTokenFromApi: string, userInfoFromApi: UserResponse): void => {
    setUserToken(userTokenFromApi);
    setUserInfo(userInfoFromApi);
  };

  const logout = (): void => {
    setUserToken(undefined);
    setUserInfo(undefined);
  };

  return (
    <AuthContext.Provider value={{ userInfo, userToken, login, logout }}>
      <div className="app">
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage></HomePage>}></Route>
            <Route path="/login" element={<LoginPage></LoginPage>}></Route>
            <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
            <Route path="/profile" element={<ProfilePage></ProfilePage>}></Route>
            <Route path="/profile-admin" element={<ProfilePageAdmin></ProfilePageAdmin>}></Route>
          </Routes>
        </HashRouter>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
