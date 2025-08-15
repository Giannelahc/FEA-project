// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================================================
   Storage helpers (inlined so you don't need authService)
========================================================= */
const STORAGE_AUTH = "auth";        // { token, user }
const STORAGE_TOKEN = "jwt_token";  // raw token for interceptors

const safeGet = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeSet = (key, val) => {
  try { localStorage.setItem(key, val); } catch {}
};
const safeRemove = (key) => {
  try { localStorage.removeItem(key); } catch {}
};

export const getToken = () => {
  // Prefer full auth object, fallback to raw token
  try {
    const raw = safeGet(STORAGE_AUTH);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) return parsed.token;
    }
  } catch {}
  return safeGet(STORAGE_TOKEN) || null;
};

export const saveToken = ({ token, user }) => {
  if (token) safeSet(STORAGE_TOKEN, token);
  safeSet(STORAGE_AUTH, JSON.stringify({ token, user: user || null }));
};

export const logoutService = () => {
  safeRemove(STORAGE_AUTH);
  safeRemove(STORAGE_TOKEN);
};

/* =========================================================
   Optional login thunk (use it from your LoginPage)
   Expects backend to return: { token, user }
========================================================= */
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
      // data: { token, user }
      return data;
    } catch (e) {
      const msg = e.response?.data?.message || "Login failed";
      return rejectWithValue(msg);
    }
  }
);

/* =========================================================
   Slice
========================================================= */
const bootAuth = () => {
  const token = getToken();
  let user = null;
  let username = null;
  try {
    const raw = safeGet(STORAGE_AUTH);
    if (raw) {
      const parsed = JSON.parse(raw);
      user = parsed?.user || null;
      username = user?.username || user?.email || null;
    }
  } catch {}
  return { token, user, username };
};

const initialState = {
  ...bootAuth(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Use when you already have { token, user } (e.g., from a custom login request)
    loginSuccess(state, action) {
      const { token, user } = action.payload || {};
      state.token = token || null;
      state.user = user || null;
      state.username = user?.username || user?.email || null;
      saveToken({ token: state.token, user: state.user });
    },

    logoutSuccess(state) {
      state.token = null;
      state.user = null;
      state.username = null;
      state.error = null;
      logoutService();
    },

    // Optional helper to update user fields after profile edit
    setUser(state, action) {
      state.user = { ...(state.user || {}), ...(action.payload || {}) };
      state.username = state.user?.username || state.user?.email || null;
      // persist updated user with same token
      saveToken({ token: state.token, user: state.user });
    },
  },
  extraReducers: (b) => {
    b
      .addCase(loginThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginThunk.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.token = payload?.token || null;
        s.user = payload?.user || null;
        s.username = s.user?.username || s.user?.email || null;
        saveToken({ token: s.token, user: s.user });
      })
      .addCase(loginThunk.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload || "Login failed";
      });
  },
});

export const { loginSuccess, logoutSuccess, setUser } = authSlice.actions;
export default authSlice.reducer;
