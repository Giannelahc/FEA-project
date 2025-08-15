// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import users from '../slices/usersSlice';
import auth from '../slices/authSlice';
import tweet from '../slices/tweetSlice';

const store = configureStore({
  reducer: { users, auth, tweet },
});

export default store;
