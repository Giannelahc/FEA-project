import React, { useState, useContext } from 'react';
import { getKeycloak } from '../keycloak';
import { Input, Button, Flex } from 'antd';
function LoginForm({ navigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const { setAuthenticated } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const result = await response.json();
            console.log('Access token:', result.token);

            navigate('/');

        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h3>Login</h3>
            <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />

            <Input.Password placeholder="password" onChange={(e) => setPassword(e.target.value)} required />

            <Flex justify="center" style={{ marginTop: '20px' }}>
                <Button type="primary" onClick={handleLogin}>Login</Button>
            </Flex>
        </form>
    );
}

export default LoginForm;