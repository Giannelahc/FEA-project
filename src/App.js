// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Homepage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import ProfileManagementPage from './pages/ProfileManagementPage';
import SearchResultPage from './pages/SearchResultPage';
import Navbar from './components/Navbar';
import { MessageProvider } from './context/MessageContext';
const App = () => {
  return (
    <MessageProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
        <Route path="/profile/edit" element={<ProfileManagementPage />} />
        <Route path="/search" element={<SearchResultPage />} />
      </Routes>
    </MessageProvider>
  );
}

export default App;