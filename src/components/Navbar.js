import React from 'react';
import { AppstoreOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../slices/authSlice';

type MenuItem = Required<MenuProps>['items'][number];

function Navbar() {
    const location = useLocation(); //get current path
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.token!=null );

    // map pathname -> menu key
    const pathToKey: Record<string, string> = {
        '/': 'home',
        '/search': 'search',
        '/profile': 'profile',
        '/login': 'login',
    };

    const selectedKey = pathToKey[location.pathname] || '';

    const onClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            dispatch(logoutSuccess());
            navigate('/login'); 
        }
    };
    const items: MenuItem[] = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: <Link to="/">Home</Link>,
        },
        {
            key: 'search',
            icon: <SearchOutlined />,
            label: <Link to="/search">Search</Link>,
        },
        {
            key: 'profile',
            icon: <AppstoreOutlined />,
            label: <Link to="/profile">Profile</Link>,
        },
        isAuthenticated
            ? {
                key: 'logout',
                label: 'Logout',
            }
            : {
                key: 'login',
                label: <Link to="/login">Login</Link>,
            },
    ];
    return (
        <Menu
            onClick={onClick}
            selectedKeys={[selectedKey]} // update selected key
            mode="horizontal"
            items={items}
        />
    );
}

export default Navbar;