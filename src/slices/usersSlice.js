// src/slices/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
   Axios with Bearer token
========================= */
const api = axios.create({
  // e.g. REACT_APP_API_BASE_URL=http://localhost:3001 or http://localhost:3001/api
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
});
api.interceptors.request.use((config) => {
  let token;
  try {
    const raw = localStorage.getItem("auth"); // { token, ... }
    if (raw) token = JSON.parse(raw)?.token;
  } catch {}
  if (!token) token = localStorage.getItem("jwt_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* =========================
   Helpers
========================= */
const asArray = (data) => (Array.isArray(data) ? data : data?.results || []);
const userIdOf = (u) => u?.id ?? u?._id;
const setFollowFlagOnList = (arr, targetId, flag) => {
  for (const u of arr) {
    const id = userIdOf(u);
    if (!id) continue;
    if (String(id) === String(targetId)) {
      // Support either `following` or `isFollowing` property
      if ("following" in u) u.following = !!flag;
      if ("isFollowing" in u) u.isFollowing = !!flag;
      // If neither existed, add a consistent field:
      if (!("following" in u) && !("isFollowing" in u)) u.isFollowing = !!flag;
      break;
    }
  }
};

/* =========================
   API wrappers
========================= */
const searchUsersApi = (q, page = 1, limit = 20, signal) =>
  api.get("/users/search", { params: { q, page, limit }, signal });

const followUserApi = (userId, signal) =>
  api.post(`/follow/${userId}`, null, { signal });

const unfollowUserApi = (userId, signal) =>
  api.delete(`/follow/${userId}`, { signal });

const getFollowersApi = (userId, page = 1, limit = 20, signal) =>
  api.get(`/users/${userId}/followers`, { params: { page, limit }, signal });

const getFollowingApi = (userId, page = 1, limit = 20, signal) =>
  api.get(`/users/${userId}/following`, { params: { page, limit }, signal });

/* =========================
   Thunks (with abort signals)
========================= */
// args: { q, page=1, limit=20 }
export const searchUsersThunk = createAsyncThunk(
  "users/search",
  async ({ q, page = 1, limit = 20 }, { rejectWithValue, signal }) => {
    try {
      const { data } = await searchUsersApi(q, page, limit, signal);
      const results = asArray(data);
      return { q, page, limit, results, hasMore: results.length >= limit };
    } catch (e) {
      if (axios.isCancel?.(e)) return rejectWithValue("Search cancelled");
      return rejectWithValue(e?.response?.data?.message || "Search failed");
    }
  }
);

// args: userId
export const followThunk = createAsyncThunk(
  "users/follow",
  async (userId, { rejectWithValue, signal }) => {
    try {
      await followUserApi(userId, signal);
      return { userId };
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Follow failed");
    }
  }
);

// args: userId
export const unfollowThunk = createAsyncThunk(
  "users/unfollow",
  async (userId, { rejectWithValue, signal }) => {
    try {
      await unfollowUserApi(userId, signal);
      return { userId };
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Unfollow failed");
    }
  }
);

// args: { userId, page=1, limit=20 }
export const fetchFollowersThunk = createAsyncThunk(
  "users/fetchFollowers",
  async ({ userId, page = 1, limit = 20 }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getFollowersApi(userId, page, limit, signal);
      const items = asArray(data);
      return { items, page, limit, hasMore: items.length >= limit };
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Followers fetch failed");
    }
  }
);

// args: { userId, page=1, limit=20 }
export const fetchFollowingThunk = createAsyncThunk(
  "users/fetchFollowing",
  async ({ userId, page = 1, limit = 20 }, { rejectWithValue, signal }) => {
    try {
      const { data } = await getFollowingApi(userId, page, limit, signal);
      const items = asArray(data);
      return { items, page, limit, hasMore: items.length >= limit };
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || "Following fetch failed");
    }
  }
);

/* =========================
   Slice
========================= */
const initialState = {
  search: {
    q: "",
    results: [],
    loading: false,
    error: null,
    page: 1,
    limit: 20,
    hasMore: false,
  },
  followers: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    limit: 20,
    hasMore: false,
  },
  following: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    limit: 20,
    hasMore: false,
  },
  relations: {}, // userId -> boolean (are we following?)
  pending: {
    follow: {},   // userId -> true while request in-flight
    unfollow: {}, // userId -> true while request in-flight
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetSearch(state) {
      state.search = { ...initialState.search };
    },
    clearFollowers(state) {
      state.followers = { ...initialState.followers };
    },
    clearFollowing(state) {
      state.following = { ...initialState.following };
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---- Search ---- */
      .addCase(searchUsersThunk.pending, (state, action) => {
        state.search.loading = true;
        state.search.error = null;
        // keep q while typing so UI can show the term
        if (action.meta?.arg?.q !== undefined) state.search.q = action.meta.arg.q;
      })
      .addCase(searchUsersThunk.fulfilled, (state, action) => {
        state.search.loading = false;
        const { q, results, page, limit, hasMore } = action.payload;
        state.search.q = q;
        state.search.page = page;
        state.search.limit = limit;
        state.search.hasMore = hasMore;
        state.search.results = results;

        // Sync relations cache from results
        for (const u of results) {
          const id = userIdOf(u);
          if (!id) continue;
          const isFollowing =
            typeof u.following === "boolean" ? u.following : !!u.isFollowing;
          state.relations[id] = isFollowing;
        }
      })
      .addCase(searchUsersThunk.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.payload || "Search failed";
      })

      /* ---- Followers ---- */
      .addCase(fetchFollowersThunk.pending, (state) => {
        state.followers.loading = true;
        state.followers.error = null;
      })
      .addCase(fetchFollowersThunk.fulfilled, (state, action) => {
        state.followers.loading = false;
        const { items, page, limit, hasMore } = action.payload;
        state.followers.items = items;
        state.followers.page = page;
        state.followers.limit = limit;
        state.followers.hasMore = hasMore;
      })
      .addCase(fetchFollowersThunk.rejected, (state, action) => {
        state.followers.loading = false;
        state.followers.error = action.payload || "Followers fetch failed";
      })

      /* ---- Following ---- */
      .addCase(fetchFollowingThunk.pending, (state) => {
        state.following.loading = true;
        state.following.error = null;
      })
      .addCase(fetchFollowingThunk.fulfilled, (state, action) => {
        state.following.loading = false;
        const { items, page, limit, hasMore } = action.payload;
        state.following.items = items;
        state.following.page = page;
        state.following.limit = limit;
        state.following.hasMore = hasMore;
      })
      .addCase(fetchFollowingThunk.rejected, (state, action) => {
        state.following.loading = false;
        state.following.error = action.payload || "Following fetch failed";
      })

      /* ---- Follow / Unfollow ---- */
      .addCase(followThunk.pending, (state, action) => {
        const id = action.meta?.arg;
        if (id) state.pending.follow[id] = true;
      })
      .addCase(followThunk.fulfilled, (state, action) => {
        const { userId } = action.payload;
        delete state.pending.follow[userId];
        state.relations[userId] = true;
        // reflect in visible lists
        setFollowFlagOnList(state.search.results, userId, true);
        setFollowFlagOnList(state.followers.items, userId, true);
        setFollowFlagOnList(state.following.items, userId, true);
      })
      .addCase(followThunk.rejected, (state, action) => {
        const id = action.meta?.arg;
        if (id) delete state.pending.follow[id];
        // optional: capture error
      })
      .addCase(unfollowThunk.pending, (state, action) => {
        const id = action.meta?.arg;
        if (id) state.pending.unfollow[id] = true;
      })
      .addCase(unfollowThunk.fulfilled, (state, action) => {
        const { userId } = action.payload;
        delete state.pending.unfollow[userId];
        state.relations[userId] = false;
        setFollowFlagOnList(state.search.results, userId, false);
        setFollowFlagOnList(state.followers.items, userId, false);
        setFollowFlagOnList(state.following.items, userId, false);
      })
      .addCase(unfollowThunk.rejected, (state, action) => {
        const id = action.meta?.arg;
        if (id) delete state.pending.unfollow[id];
      });
  },
});

export const { resetSearch, clearFollowers, clearFollowing } = usersSlice.actions;

/* =========================
   Selectors
========================= */
export const selectUsersSearch = (s) => s.users.search;
export const selectFollowers = (s) => s.users.followers;
export const selectFollowing = (s) => s.users.following;
export const selectRelations = (s) => s.users.relations;
export const selectIsFollowing = (userId) => (s) => !!s.users.relations[userId];
export const selectFollowPending = (userId) => (s) => !!s.users.pending.follow[userId];
export const selectUnfollowPending = (userId) => (s) => !!s.users.pending.unfollow[userId];

export default usersSlice.reducer;
