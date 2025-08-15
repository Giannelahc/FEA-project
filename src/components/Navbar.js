import React, { useEffect, useState } from 'react';
import { HomeOutlined, SearchOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import { Menu, Avatar, Badge, Dropdown, List, Spin } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../slices/authSlice';
import axios from 'axios';
import io from 'socket.io-client';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  const user = useSelector((state) => state.auth.username);
  const token = useSelector((state) => state.auth.token);
  const username = user || 'User';

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const pathToKey = {
    '/': 'home',
    '/search': 'search',
    '/profile': 'profile',
    '/login': 'login',
  };

  const selectedKey = pathToKey[location.pathname] || '';

  const onClick = (e) => {
    if (e.key === 'logout') {
      dispatch(logoutSuccess());
      navigate('/login');
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    setLoadingNotifications(true);
    try {
      const res = await axios.get('http://localhost:3001/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
  if (!token) return;
  fetchNotifications();

  const socket = io('http://localhost:3001', {
    transports: ['websocket'],
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Connected to notifications socket');
    socket.emit('register', username);
  });

  socket.on('notification', (notif) => {
    setNotifications((prev) => [notif, ...prev]);
  });

  return () => {
    socket.disconnect();
  };
}, [token, username]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const notificationMenu = (
    <div style={{ maxHeight: 300, overflowY: 'auto', width: 300 }}>
      {loadingNotifications ? (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <p style={{ padding: 10 }}>No notifications</p>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={item => (
            <List.Item
              key={item._id}
              style={{ backgroundColor: item.isRead ? 'white' : '#e6f7ff', cursor: 'pointer' }}
              onClick={() => {
                axios.patch(`http://localhost:3001/notifications/${item._id}/read`, {}, {
                  headers: { Authorization: `Bearer ${token}` }
                }).catch(console.error);

                setNotifications(prev =>
                  prev.map(n =>
                    n._id === item._id ? { ...n, isRead: true } : n
                  )
                );

                if (item.type === 'follow') {
                  navigate(`/profile/${item.sender}`);
                } else if (item.tweetId) {
                  navigate(`/tweets/${item.tweetId}`);
                }
              }}
            >
              <List.Item.Meta
                avatar={<Avatar>{item.sender?.charAt(0).toUpperCase() || '?'}</Avatar>}
                title={`${item.sender} ${item.type}`}
                description={item.tweetId ? 'On a tweet' : ''}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[selectedKey]}
      mode="horizontal"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div style={{ display: 'flex' }}>
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="search" icon={<SearchOutlined />}>
          <Link to="/search">Search</Link>
        </Menu.Item>
        {!isAuthenticated && (
          <Menu.Item key="login">
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated && (
          <>
            <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
              <Badge count={unreadCount} overflowCount={99} offset={[0, 5]}>
                <BellOutlined style={{ fontSize: 20, cursor: 'pointer', marginRight: 20 }} />
              </Badge>
            </Dropdown>

            <Menu.SubMenu
              key="user"
              title={
                <span
                  onClick={() => navigate('/profile')}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <Avatar
                    style={{ marginRight: 8 }}
                    icon={<UserOutlined />}
                    src={user?.avatar}
                  />
                  {username}
                </span>
              }
            >
              <Menu.Item key="logout">Logout</Menu.Item>
            </Menu.SubMenu>
          </>
        )}
      </div>
    </Menu>
  );
}

export default Navbar;
