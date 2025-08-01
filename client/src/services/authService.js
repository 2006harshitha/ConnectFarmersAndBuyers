import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, userData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to verify identity",
      }
    );
  }
};

// ✅ Include token in reset password request
const resetPassword = async (username, token, passwords) => {
  try {
    const response = await axios.put(
      `${API_URL}/reset-password/${username}/${token}`,
      passwords
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to reset password",
      }
    );
  }
};

const authService = {
  register,
  login,
  forgotPassword,
  resetPassword,
};

export default authService;
