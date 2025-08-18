import { createContext, useContext, useState, useEffect } from "react";

{/* added to make use of tokens throughout frontend components */}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("jwt-token"));
  const [uid, setUid] = useState(localStorage.getItem("user-id"));

  {/* authLogin name changed */}
  function authLogin(newToken, newUid) {
    localStorage.setItem("jwt-token", newToken);
    localStorage.setItem("user-id", newUid);
    setToken(newToken);
    setUid(newUid);
  }

  function logout() {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("user-id");
    setToken(null);
    setUid(null);
  }

  const loggedIn = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, loggedIn, authLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
