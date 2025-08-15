// src/pages/UserProfilePage.js
import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Avatar,
  Button,
  Spin,
  Form,
  Input,
  Image,
  List,
  Typography,
  Divider,
  Drawer,
} from 'antd';
import { useMessageApi } from '../context/MessageContext';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [relLoading, setRelLoading] = useState({ followers: false, following: false });

  const [form] = Form.useForm();
  const messageApi = useMessageApi();

  const API_BASE = 'http://localhost:3001';
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, tweetsRes] = await Promise.all([
        fetch(`${API_BASE}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${API_BASE}/tweets/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const userData = await userRes.json();
      const tweetsData = await tweetsRes.json();

      if (!userRes.ok) throw new Error(userData.message || 'Failed to load user');
      if (!tweetsRes.ok) throw new Error(tweetsData.message || 'Failed to load tweets');

      setUser(userData);
      setTweets(tweetsData);
    } catch (err) {
      messageApi.error(err.message || 'Error loading profile');
    } finally {
      setLoading(false);
    }
  }, [API_BASE, token, messageApi]);

  // Followers / Following fetchers
  const fetchFollowers = useCallback(async (uid) => {
    setRelLoading((s) => ({ ...s, followers: true }));
    try {
      const res = await fetch(`${API_BASE}/users/${uid}/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load followers');
      setFollowers(Array.isArray(data.results) ? data.results : data);
    } catch (e) {
      messageApi.error(e.message || 'Failed to load followers');
    } finally {
      setRelLoading((s) => ({ ...s, followers: false }));
    }
  }, [API_BASE, token, messageApi]);

  const fetchFollowing = useCallback(async (uid) => {
    setRelLoading((s) => ({ ...s, following: true }));
    try {
      const res = await fetch(`${API_BASE}/users/${uid}/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load following');
      setFollowing(Array.isArray(data.results) ? data.results : data);
    } catch (e) {
      messageApi.error(e.message || 'Failed to load following');
    } finally {
      setRelLoading((s) => ({ ...s, following: false }));
    }
  }, [API_BASE, token, messageApi]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const cleaned = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => typeof v === 'string' && v.trim() !== '')
      );

      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleaned),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');

      messageApi.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      messageApi.error(err.message || 'Save failed');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Failed to load user info. Please try again later.</p>
      </div>
    );
  }

  // helper for flexible IDs from API
  const getId = (u) => u?.id ?? u?._id;

  const openFollowersDrawer = () => {
    const uid = getId(user);
    if (!uid) return;
    fetchFollowers(uid);
    setFollowersOpen(true);
  };

  const openFollowingDrawer = () => {
    const uid = getId(user);
    if (!uid) return;
    fetchFollowing(uid);
    setFollowingOpen(true);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', marginTop: 40 }}>
      <Card
        actions={[
          !editing && (
            <Button
              key="edit"
              type="link"
              onClick={() => {
                form.setFieldsValue({
                  username: user.username,
                  contact: user.contact,
                  preference: user.preference,
                });
                setEditing(true);
              }}
            >
              Edit Profile
            </Button>
          ),
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Avatar
            size={64}
            src={`https://picsum.photos/seed/${user.username}/64`}
            alt="avatar"
            style={{ marginRight: 16 }}
          >
            {user.username?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <div>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>
              {editing ? 'Editing Profile' : user.username}
            </div>
            <div style={{ color: 'gray' }}>{user.email}</div>
          </div>
        </div>

        {editing ? (
          <Form form={form} layout="vertical">
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Username is required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Contact" name="contact">
              <Input />
            </Form.Item>

            <Form.Item label="Preference" name="preference">
              <Input.TextArea rows={3} />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
              <Button onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </Form>
        ) : (
          <div style={{ marginTop: '16px', color: 'gray' }}>
            Joined:{' '}
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            <br />
            Contact: {user.contact || 'Not provided'}
            <br />
            Preference: {user.preference || 'Not specified'}
            <br />
            {/* Followers / Following quick actions */}
            <Button type="link" onClick={openFollowersDrawer} style={{ paddingLeft: 0 }}>
              <b>{user.followers?.length || 0}</b> followers
            </Button>
            ·
            <Button type="link" onClick={openFollowingDrawer}>
              <b>{user.following?.length || 0}</b> following
            </Button>
          </div>
        )}
      </Card>

      <Divider orientation="left">Tweets</Divider>

      <List
        itemLayout="vertical"
        dataSource={tweets}
        locale={{ emptyText: 'No tweets yet.' }}
        renderItem={(tweet) => (
          <List.Item key={tweet._id}>
            <Card>
              <Typography.Paragraph>{tweet.content}</Typography.Paragraph>
              {tweet.mediaUrl && (
                <div style={{ marginTop: 12 }}>
                  <Image
                    width={300}
                    src={`${API_BASE}${tweet.mediaUrl}`}
                    alt="media"
                    style={{ borderRadius: 8 }}
                  />
                </div>
              )}
              <Typography.Text type="secondary">
                Posted on {new Date(tweet.createdAt).toLocaleString()}
              </Typography.Text>
            </Card>
          </List.Item>
        )}
      />

      {/* Followers Drawer */}
      <Drawer
        title="Followers"
        placement="right"
        width={380}
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
      >
        {relLoading.followers ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin />
          </div>
        ) : followers.length ? (
          <List
            dataSource={followers}
            renderItem={(u) => (
              <List.Item key={getId(u)}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={u.avatarUrl}>
                      {u.username?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  }
                  title={u.username}
                  description={`@${u.handle || u.username}`}
                />
              </List.Item>
            )}
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
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin />
          </div>
        ) : following.length ? (
          <List
            dataSource={following}
            renderItem={(u) => (
              <List.Item key={getId(u)}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={u.avatarUrl}>
                      {u.username?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  }
                  title={u.username}
                  description={`@${u.handle || u.username}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Typography.Text type="secondary">
            You are not following anyone yet.
          </Typography.Text>
        )}
      </Drawer>
    </div>
  );
}
