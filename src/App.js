// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Homepage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import ProfileManagementPage from './pages/ProfileManagementPage';
import SearchResultPage from './pages/SearchResultPage';
import TweetDetailPage from './pages/TweetDetailPage';
import PublicUserPage from './pages/PublicUserPage';

// Layout / Context
import Navbar from './components/Navbar';
import { MessageProvider } from './context/MessageContext';

// Search (added)
import SearchBar from './components/SearchBar';

const App = () => {
  return (
    <MessageProvider>
      <Navbar />

      {/* Remove this block if your Navbar already has a search input */}
      <div style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <SearchBar />
        </div>
      </div>
      {/* ---- end optional search block ---- */}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="/profile/edit" element={<ProfileManagementPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/tweets/:id" element={<TweetDetailPage />} />
        <Route path="/users/:id" element={<PublicUserPage />} />
      </Routes>
    </MessageProvider>
  );
};

export default App;
