// src/features/tweets/tweetsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { tweets } from '../constants/mockData';

const initialState = {
  feed: tweets,
};

const tweetsSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    addTweet(state, action) {
      state.feed.unshift(action.payload);
    },
  },
});

export const { addTweet } = tweetsSlice.actions;
export default tweetsSlice.reducer;
