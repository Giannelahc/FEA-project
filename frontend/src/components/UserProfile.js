import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const { id } = useParams(); // user ID from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>👤 User Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Name:</strong> {user.name}</p>

      <br />
      <a href="/" style={{ textDecoration: "none", color: "blue" }}>← Back to Search</a>
    </div>
  );
}

export default UserProfile;
