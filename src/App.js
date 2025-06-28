// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import ProfileManagementPage from './pages/ProfileManagementPage';
import SearchResultPage from './pages/SearchResultPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/profile-management" element={<ProfileManagementPage />} />
        <Route path="/search" element={<SearchResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;