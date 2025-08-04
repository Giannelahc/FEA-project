// ProfilePage.jsx
import { useEffect, useState } from 'react';
import { Card, Avatar, Button, Spin, message } from 'antd';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/users/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load profile');
      }

      setUser(data);
    } catch (err) {
      message.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  return (
    <Card
      style={{ maxWidth: 500, margin: '0 auto', marginTop: 40 }}
      actions={[<Button type="link">Edit Profile</Button>]}
    >
      <Card.Meta
        avatar={<Avatar 
        size={64} 
        src={`https://picsum.photos/seed/${user.username}/64`}
        alt="avatar"
      >
        {user.username?.[0]?.toUpperCase() || '?'}
      </Avatar>}
        title={user.username}
        description={user.email}
      />
      <div style={{ marginTop: '16px', color: 'gray' }}>
        Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
      </div>
    </Card>
  );
}