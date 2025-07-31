import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") {
        setResults([]);
        setNoResults(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/users/search?q=${query}`);
        setResults(res.data);
        setNoResults(res.data.length === 0);
      } catch (err) {
        console.error("Search failed:", err);
      }
      setLoading(false);
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔍 Live User Search</h2>
      <input
        type="text"
        placeholder="Type a name or username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "10px" }}
      />

      {loading && <p>Loading...</p>}
      {noResults && <p>No users found.</p>}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {results.map((user) => (
          <li key={user._id} style={{ padding: "8px 0" }}>
            <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "blue" }}>
              <strong>{user.username}</strong> — {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserSearch;
