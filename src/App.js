// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import ProfileManagementPage from './pages/ProfileManagementPage';
import SearchResultPage from './pages/SearchResultPage';
import KeycloakProvider from "./components/KeycloakProvider";
import keycloak from "./keycloak";

const PrivateRoute = ({ children }) => {
  return keycloak.authenticated ? children : <Navigate to="/login" />;
}; 
const App = () => {
  return (
    <KeycloakProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-profile" element={
          <PrivateRoute> 
            <UserProfilePage />
          </PrivateRoute>
        } />
        <Route path="/profile-management" element={
          <PrivateRoute> 
            <ProfileManagementPage />
          </PrivateRoute>
        } />
        <Route path="/search" element={<SearchResultPage />} />
      </Routes>
    </KeycloakProvider>
  );
}

export default App;