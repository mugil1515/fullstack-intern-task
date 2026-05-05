import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authService.getProfile()
        .then(({ data }) => { setUser(data.data.user); localStorage.setItem("user", JSON.stringify(data.data.user)); })
        .catch(() => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const register = useCallback(async (userData) => {
    const { data } = await authService.register(userData);
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const logout = useCallback(() => {
    authService.logout().catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
