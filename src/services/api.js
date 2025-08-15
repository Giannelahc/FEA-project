import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
});

// Automatically attach token from localStorage
api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    try {
      const { token } = JSON.parse(auth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      console.warn("Invalid auth object in localStorage");
    }
  }
  return config;
});

/* ------------------- User-related API calls ------------------- */

// Search users
export const searchUsers = (q, page = 1, limit = 20) =>
  api.get("/users/search", { params: { q, page, limit } });

// Follow a user
export const followUser = (userId) => api.post(`/follow/${userId}`);

// Unfollow a user
export const unfollowUser = (userId) => api.delete(`/follow/${userId}`);

// Get followers list
export const getFollowers = (userId, page = 1, limit = 20) =>
  api.get(`/users/${userId}/followers`, { params: { page, limit } });

// Get following list
export const getFollowing = (userId, page = 1, limit = 20) =>
  api.get(`/users/${userId}/following`, { params: { page, limit } });

export default api;
