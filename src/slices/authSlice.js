// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getToken, saveToken, logout as logoutService } from '../services/authService';

const initialState = {
  token: getToken(), 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.username = action.payload.user.username;
      saveToken(action.payload); 
    },
    logoutSuccess(state) {
      state.token = null;
      logoutService();
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
