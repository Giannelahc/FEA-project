import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../services/api";

// --- Thunks ---
export const searchUsersThunk = createAsyncThunk("users/search", async (q) => {
  const { data } = await searchUsers(q);
  return { q, results: data.results || [] };
});

export const followThunk   = createAsyncThunk("users/follow",   async (id) => { await followUser(id);   return id; });
export const unfollowThunk = createAsyncThunk("users/unfollow", async (id) => { await unfollowUser(id); return id; });

export const fetchFollowersThunk = createAsyncThunk("users/followers", async (id) => {
  const { data } = await getFollowers(id);
  return data.results || [];
});

export const fetchFollowingThunk = createAsyncThunk("users/following", async (id) => {
  const { data } = await getFollowing(id);
  return data.results || [];
});

// --- Slice ---
const usersSlice = createSlice({
  name: "users",
  initialState: {
    search: { q: "", results: [], loading: false, error: null },
    followers: [],
    following: [],
    relations: {}, // userId -> boolean (am I following?)
  },
  reducers: {},
  extraReducers: (b) => {
    b
      // search
      .addCase(searchUsersThunk.pending,   (s)=>{ s.search.loading = true; s.search.error = null; })
      .addCase(searchUsersThunk.fulfilled, (s,{payload})=>{
        s.search.loading = false;
        s.search.q = payload.q;
        s.search.results = payload.results;
        payload.results.forEach(u => { s.relations[u.id] = !!u.following; });
      })
      .addCase(searchUsersThunk.rejected,  (s)=>{ s.search.loading = false; s.search.error = "Search failed"; })
      // follow/unfollow
      .addCase(followThunk.fulfilled,   (s,{payload})=>{ s.relations[payload] = true; })
      .addCase(unfollowThunk.fulfilled, (s,{payload})=>{ s.relations[payload] = false; })
      // lists
      .addCase(fetchFollowersThunk.fulfilled, (s,{payload})=>{ s.followers = payload; })
      .addCase(fetchFollowingThunk.fulfilled, (s,{payload})=>{ s.following = payload; });
  }
});

export default usersSlice.reducer;
