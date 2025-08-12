import { createContext, useContext, useState, useEffect } from "react";

{/* added to make use of tokens throughout frontend components */}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("jwt-token"));

  {/* Messy, clean later. Maybe remove. // authLogin name changed */}
  function authLogin(newToken) {
    localStorage.setItem("jwt-token", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("jwt-token");
    setToken(null);
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
