import axios from "axios";

const authApiClient = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

const loginCredentials = (username, password) => ({ username, password });

export const registerApi = (user) => authApiClient.post("/register", user);

export const loginApi = (username, password) =>
  authApiClient.post("/login", loginCredentials(username, password));

// ✅ Store everything in localStorage for persistence and reactivity
export const saveLoggedUser = (userId, username, role) => {
  localStorage.setItem("USER_ID", userId);
  localStorage.setItem("USERNAME", username);
  localStorage.setItem("ROLE", role);
};

export const storeBasicAuth = (basicAuth) => localStorage.setItem("auth", basicAuth);
export const getBasicAuth = () => localStorage.getItem("auth");

export const isUserLoggedIn = () => !!localStorage.getItem("USERNAME");
export const getLoggedInUserId = () => localStorage.getItem("USER_ID");
export const getLoggedInUser = () => localStorage.getItem("USERNAME");
export const isAdminUser = () => localStorage.getItem("ROLE") === "ROLE_ADMIN";

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
};
