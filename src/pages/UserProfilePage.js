// ProfilePage.jsx
import { useEffect, useState } from 'react';
import { Card, Avatar, Button, Spin, message, Form, Input } from 'antd';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm(); 
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

    const handleSave = async () => {
    try {
      const values = await form.validateFields(); // form validation
      const cleaned = Object.fromEntries(// filter out empty strings
        Object.entries(values).filter(([_, v]) => typeof v === 'string' && v.trim() !== '')
      );
      const response = await fetch('http://localhost:3001/users/profile', {
        method: 'PATCH', 
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( cleaned ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      message.success('Profile updated successfully');
      setEditing(false);
      fetchProfile(); // refresh data
    } catch (err) {
      message.error(err.message || 'Save failed');
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

  return (
    <Card
      style={{ maxWidth: 500, margin: '0 auto', marginTop: 40 }}
      actions={[
        editing ? null : (
          <Button type="link" onClick={() => {
            form.setFieldsValue({
              username: user.username
            });
            setEditing(true);
          }}>
            Edit Profile
          </Button>
        )
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
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: user.username,
            contact: user.contact,
            preference: user.preference,
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Username is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contact"
            name="contact"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Preference"
            name="preference"
            rules={[{ required: false }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="primary" onClick={handleSave}>Save</Button>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </Form>
      ) : (
        <div style={{ marginTop: '16px', color: 'gray' }}>
          Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          <br />
          Contact: {user.contact || 'Not provided'}
          <br />
          Preference: {user.preference || 'Not specified'}
        </div>
      )}
    </Card>
  );
}