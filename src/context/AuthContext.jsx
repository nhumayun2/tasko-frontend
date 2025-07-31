import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getToken,
  getUserInfo,
  setAuthData,
  removeAuthData,
} from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUserInfo();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Login function now accepts rememberMe
  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthData(
          data.token,
          { _id: data._id, username: data.username, email: data.email },
          rememberMe
        ); // Pass rememberMe
        setToken(data.token);
        setUser({ _id: data._id, username: data.username, email: data.email });
        setLoading(false);
        return { success: true, user: data };
      } else {
        setLoading(false);
        return { success: false, error: data.message || "Login failed" };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: "Network error or server unreachable" };
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // For registration, we can default rememberMe to true or false as per UX
        setAuthData(
          data.token,
          { _id: data._id, username: data.username, email: data.email },
          true
        ); // Default to rememberMe on registration
        setToken(data.token);
        setUser({ _id: data._id, username: data.username, email: data.email });
        setLoading(false);
        return { success: true, user: data };
      } else {
        setLoading(false);
        return { success: false, error: data.message || "Registration failed" };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: "Network error or server unreachable" };
    }
  };

  const logout = () => {
    removeAuthData();
    setToken(null);
    setUser(null);
  };

  const authContextValue = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    API_BASE_URL,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
