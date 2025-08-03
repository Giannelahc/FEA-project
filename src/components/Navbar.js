import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'mail',
        icon: <MailOutlined />,
        label: (
            <a href="/"  rel="noopener noreferrer">
                Home
            </a>
        ),
    },
    {
        key: 'app',
        icon: <AppstoreOutlined />,
        label: (
            <a href="/profile" rel="noopener noreferrer">
                Profile
            </a>
        ),
    },
    {
        key: 'SubMenu',
        icon: <SettingOutlined />,
        label: (
            <a href="/search" rel="noopener noreferrer">
                Search
            </a>
        ),
    },
    {
        key: 'alipay',
        label: (
            <a href="/login" rel="noopener noreferrer">
                Login
            </a>
        ),
    },
];

function Navbar() {
    const [current, setCurrent] = useState('mail');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
}

export default Navbar;
