// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import {
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons';
import {
  Menu,
  Avatar,
  Badge,
  Dropdown,
  List,
  Spin,
  Input,
} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../slices/authSlice';
import axios from 'axios';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.token !== null);
  const token = useSelector((state) => state.auth.token);
  const usernameFromStore = useSelector((state) => state.auth.username);
  const username = usernameFromStore || 'User';

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // --- Search input state (embedded SearchBar) ---
  const [q, setQ] = useState('');
  const onSearch = (value) => {
    const query = (value ?? q).trim();
    if (!query) return;
    navigate({ pathname: '/search', search: `?q=${encodeURIComponent(query)}` });
  };

  // highlight current tab
  const pathToKey = {
    '/': 'home',
    '/search': 'search',
    '/profile': 'profile',
    '/login': 'login',
  };
  const selectedKey = pathToKey[location.pathname] || '';

  const onMenuClick = (e) => {
    if (e.key === 'logout') {
      // Clear redux + any persisted tokens
      dispatch(logoutSuccess());
      try { localStorage.removeItem('jwt_token'); } catch {}
      try { localStorage.removeItem('auth'); } catch {}
      navigate('/login');
    }
  };

  // --- Notifications ---
  const fetchNotifications = async () => {
    if (!token) return;
    setLoadingNotifications(true);
    try {
      const res = await axios.get('http://localhost:3001/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markReadAndGo = async (item) => {
    try {
      await axios.patch(
        `http://localhost:3001/notifications/${item._id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      // noop
    }

    // Navigate by type
    if (item.type === 'follow') {
      // Prefer an id field if backend provides it
      const target = item.senderId || item.sender || '';
      if (target) navigate(`/users/${encodeURIComponent(target)}`);
      return;
    }
    if (item.tweetId) {
      navigate(`/tweets/${encodeURIComponent(item.tweetId)}`);
      return;
    }
  };

  // Custom dropdown content for notifications
  const notificationMenu = (
    <div style={{ maxHeight: 300, overflowY: 'auto', width: 320 }}>
      {loadingNotifications ? (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <p style={{ padding: 10, margin: 0 }}>No notifications</p>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              style={{
                backgroundColor: item.isRead ? 'white' : '#e6f7ff',
                cursor: 'pointer',
              }}
              onClick={() => markReadAndGo(item)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar>
                    {(item.senderName || item.sender || '?')
                      .toString()
                      .charAt(0)
                      .toUpperCase()}
                  </Avatar>
                }
                title={`${item.senderName || item.sender || 'Someone'} ${item.type}`}
                description={
                  item.tweetId
                    ? 'On a tweet'
                    : item.message || item.createdAt
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Menu
      onClick={onMenuClick}
      selectedKeys={[selectedKey]}
      mode="horizontal"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
      }}
    >
      {/* Left: main nav */}
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

      {/* Middle: embedded global search */}
      

      {/* Right: notifications + user menu */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated && (
          <>
            <Dropdown
              overlay={notificationMenu}
              trigger={['click']}
              placement="bottomRight"
            >
              <Badge count={unreadCount} overflowCount={99} offset={[0, 5]}>
                <BellOutlined
                  style={{ fontSize: 20, cursor: 'pointer', marginRight: 20 }}
                />
              </Badge>
            </Dropdown>

            <Menu.SubMenu
              key="user"
              title={
                <span
                  onClick={() => navigate('/profile')}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    style={{ marginRight: 8 }}
                    icon={<UserOutlined />}
                    // If you later store avatar url in state.auth.avatar, use src={state.auth.avatar}
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
