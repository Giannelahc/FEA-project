// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import ProfileManagementPage from './pages/ProfileManagementPage';
import SearchResultPage from './pages/SearchResultPage';
import ProductPage from './pages/ProductPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/profile-management" element={<ProfileManagementPage />} />
        <Route path="/search" element={<SearchResultPage />} />
      </Routes>
    </>
  );
}

export default App;