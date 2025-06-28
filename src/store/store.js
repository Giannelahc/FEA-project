// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import tweetsReducer from '../slices/tweetSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetsReducer,
  },
});

export default store;
