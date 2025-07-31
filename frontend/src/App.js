import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserSearch from "./components/UserSearch";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserSearch />} />
        <Route path="/profile/:id" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
