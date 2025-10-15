import axios from "axios";
import { API_URL } from "./config";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !config.url.includes("login") && !config.url.includes("register")) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default API;
