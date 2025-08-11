import React from 'react';
import { AppstoreOutlined, HomeOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Avatar } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../slices/authSlice';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.token !== null);
    const user = useSelector((state) => state.auth.username);
    const username = user || 'User';

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

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[selectedKey]}
            mode="horizontal"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
            {/* Left menu items */}
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

            {/* Right user avatar */}
            {isAuthenticated && (
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
                                src={user?.avatar} // si tienes imagen, se muestra
                            />
                            {username}
                        </span>
                    }
                >
                    <Menu.Item key="logout">Logout</Menu.Item>
                </Menu.SubMenu>
            )}
        </Menu>
    );
}

export default Navbar;
