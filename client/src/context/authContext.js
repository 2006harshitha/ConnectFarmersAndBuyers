import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = "http://localhost:5000";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, role }
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
      localStorage.removeItem("token");
    }
  };

  const loadUser = () => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.user.username,
          role: decoded.user.role,
        });
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      const { token } = response.data;
      setAuthToken(token);
      setToken(token);
      const decoded = jwtDecode(token);
      setUser({
        username: decoded.user.username,
        role: decoded.user.role,
      });
      setIsAuthenticated(true);
      return token;
    } catch (err) {
      setError("Login failed");
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post("/api/auth/register", formData);
      const { token } = response.data;
      setAuthToken(token);
      setToken(token);
      const decoded = jwtDecode(token);
      setUser({
        username: decoded.user.username,
        role: decoded.user.role,
      });
      setIsAuthenticated(true);
      return token;
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const forgotPassword = async (credentials) => {
    try {
      const response = await axios.post(
        "/api/auth/forgot-password",
        credentials
      );
      return response.data;
    } catch (err) {
      throw (
        err.response?.data || {
          success: false,
          message: "Verification failed",
        }
      );
    }
  };

  const resetPassword = async (username, token, passwords) => {
    try {
      const response = await axios.put(
        `/api/auth/reset-password/${username}/${token}`,
        passwords
      );
      const loginResponse = await axios.post("/api/auth/login", {
        username,
        password: passwords.newPassword,
      });
      const { token: newToken } = loginResponse.data;
      setAuthToken(newToken);
      setToken(newToken);
      const decoded = jwtDecode(newToken);
      setUser({
        username: decoded.user.username,
        role: decoded.user.role,
      });
      setIsAuthenticated(true);
      return response.data;
    } catch (err) {
      throw (
        err.response?.data || {
          success: false,
          message: "Password reset failed",
        }
      );
    }
  };

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        setError,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
