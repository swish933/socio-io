import axios from "axios";

const config = {
  headers: { "Content-Type": "application/json" },
};

const register = (data) => {
  return axios.post(`/api/auth/register`, data, config);
};

const login = (data) => {
  return axios.post(`/api/auth/login`, data, config);
};

const logout = () => {
  localStorage.removeItem("token");
};

export const AuthService = {
  register,
  login,
  logout,
};
