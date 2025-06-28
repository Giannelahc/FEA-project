// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/HomePage';
import PlaylistPage from './pages/PlaylistPage';
import ProfilePage from './pages/ProfilePage';
import SearchResultPage from './pages/SearchResultPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;