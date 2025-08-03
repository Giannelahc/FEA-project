import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { Flex, Tabs } from 'antd';
const { TabPane } = Tabs;

function LoginPage() {
    const navigate = useNavigate();

    return (
        <Flex gap="middle" align="center" vertical justify="center" style={{ marginTop: '100px' }}>


            <Tabs defaultActiveKey="1">
                <TabPane tab="Login" key="1">
                    <LoginForm navigate={navigate} />
                </TabPane>
                <TabPane tab="Register" key="2">
                    <RegisterForm navigate={navigate} />
                </TabPane>
            </Tabs>
        </Flex>
    );
}

export default LoginPage;
