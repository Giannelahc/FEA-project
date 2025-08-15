// src/pages/PublicUserPage.js
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Avatar, Button, Spin, List, Typography, Drawer, Divider } from "antd";
import FollowButton from "../components/FollowButton";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

export default function PublicUserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relLoading, setRelLoading] = useState({ followers: false, following: false });
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const token =
    JSON.parse(localStorage.getItem("auth") || "{}")?.token ||
    localStorage.getItem("jwt_token") ||
    "";

  const getId = (u) => u?.id ?? u?._id;

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load user");
      setUser(data);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  const fetchFollowers = useCallback(async () => {
    setRelLoading((s) => ({ ...s, followers: true }));
    try {
      const res = await fetch(`${API_BASE}/users/${id}/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load followers");
      setFollowers(Array.isArray(data) ? data : data?.results || []);
      setFollowersOpen(true);
    } finally {
      setRelLoading((s) => ({ ...s, followers: false }));
    }
  }, [id, token]);

  const fetchFollowing = useCallback(async () => {
    setRelLoading((s) => ({ ...s, following: true }));
    try {
      const res = await fetch(`${API_BASE}/users/${id}/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load following");
      setFollowing(Array.isArray(data) ? data : data?.results || []);
      setFollowingOpen(true);
    } finally {
      setRelLoading((s) => ({ ...s, following: false }));
    }
  }, [id, token]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>;
  }
  if (!user) {
    return <div style={{ textAlign: "center", padding: 50 }}><Typography.Text>User not found.</Typography.Text></div>;
  }

  const displayName = user.displayName || user.username || "User";
  const handle = user.handle || user.username || "user";

  return (
    <div style={{ maxWidth: 760, margin: "24px auto", padding: "0 12px" }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar size={72} src={user.avatarUrl}>
            {displayName?.[0]?.toUpperCase()}
          </Avatar>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{displayName}</div>
            <div style={{ color: "#666" }}>@{handle}</div>
          </div>
          <FollowButton
            userId={getId(user)}
            initialFollowing={!!(user.following || user.isFollowing)}
          />
        </div>

        <div style={{ marginTop: 12, color: "#555" }}>
          {user.bio || "No bio provided."}
        </div>

        <div style={{ marginTop: 12 }}>
          <Button type="link" onClick={fetchFollowers} style={{ paddingLeft: 0 }}>
            <b>{user.followersCount ?? user.followers?.length ?? 0}</b> followers
          </Button>
          ·
          <Button type="link" onClick={fetchFollowing}>
            <b>{user.followingCount ?? user.following?.length ?? 0}</b> following
          </Button>
        </div>
      </Card>

      <Divider orientation="left">Recent Activity</Divider>
      <Typography.Paragraph type="secondary">
        (Optional) If your backend exposes another user’s tweets, render them here.
      </Typography.Paragraph>

      {/* Followers Drawer */}
      <Drawer
        title="Followers"
        placement="right"
        width={380}
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
      >
        {relLoading.followers ? (
          <div style={{ textAlign: "center", padding: 24 }}><Spin /></div>
        ) : followers.length ? (
          <List
            dataSource={followers}
            renderItem={(u) => {
              const uid = getId(u);
              return (
                <List.Item key={uid}>
                  <List.Item.Meta
                    avatar={<Avatar src={u.avatarUrl}>{u.username?.[0]?.toUpperCase()}</Avatar>}
                    title={<Link to={`/users/${uid}`}>{u.username}</Link>}
                    description={`@${u.handle || u.username}`}
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <Typography.Text type="secondary">No followers yet.</Typography.Text>
        )}
      </Drawer>

      {/* Following Drawer */}
      <Drawer
        title="Following"
        placement="right"
        width={380}
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
      >
        {relLoading.following ? (
          <div style={{ textAlign: "center", padding: 24 }}><Spin /></div>
        ) : following.length ? (
          <List
            dataSource={following}
            renderItem={(u) => {
              const uid = getId(u);
              return (
                <List.Item key={uid}>
                  <List.Item.Meta
                    avatar={<Avatar src={u.avatarUrl}>{u.username?.[0]?.toUpperCase()}</Avatar>}
                    title={<Link to={`/users/${uid}`}>{u.username}</Link>}
                    description={`@${u.handle || u.username}`}
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <Typography.Text type="secondary">Not following anyone yet.</Typography.Text>
        )}
      </Drawer>
    </div>
  );
}
