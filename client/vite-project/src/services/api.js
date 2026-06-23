import axios from "axios";

// Use your backend URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ==================== AUTH ENDPOINTS ====================
export const registerUser = (userData) => api.post("/users/register", userData);
export const loginUser = (credentials) => api.post("/users/login", credentials);
export const checkUser = () => api.get("/users/checkUser");

export const getUserProfile = () => api.get("/users/profile");
export const updateUserProfile = (data) => api.put("/users/profile", data);
export const deleteUserAccount = () => api.delete("/users/account");
export const getUserQuestions = () => api.get("/users/questions");
export const getUserAnswers = () => api.get("/users/answers");

// ==================== QUESTION ENDPOINTS ====================
export const getAllQuestions = () => api.get("/questions");
export const getSingleQuestion = (id) => api.get(`/questions/${id}`);
export const postQuestion = (data) => api.post("/questions", data);
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);

// ==================== ANSWER ENDPOINTS ====================
export const getAnswersForQuestion = (questionId) =>
  api.get(`/answers/${questionId}`);
export const postAnswer = (data) => api.post("/answers", data);
export const updateAnswer = (id, data) => api.put(`/answers/${id}`, data);
export const deleteAnswer = (id) => api.delete(`/answers/${id}`);

export default api;
