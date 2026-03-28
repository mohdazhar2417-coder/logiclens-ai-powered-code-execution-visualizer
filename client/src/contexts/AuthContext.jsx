import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { clearStoredSession, getStoredToken, getStoredUser, setStoredSession } from "../services/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.me();
        setUser(response.user);
      } catch {
        clearStoredSession();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      async login(form) {
        const response = await api.login(form);
        setStoredSession(response.token, response.user);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      },
      async signup(form) {
        const response = await api.signup(form);
        setStoredSession(response.token, response.user);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      },
      async refreshUser() {
        const response = await api.me();
        setUser(response.user);
        return response.user;
      },
      logout() {
        clearStoredSession();
        setToken(null);
        setUser(null);
      },
      async updateProfile(form) {
        const response = await api.updateProfile(form);
        setStoredSession(token, response.user);
        setUser(response.user);
        return response.user;
      },
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
