import React, { useState } from 'react';
import { Input, Button, Flex } from 'antd';
import { useDispatch } from 'react-redux';
import { saveToken } from '../services/authService';
import { loginSuccess } from '../slices/authSlice';
function LoginForm({ navigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const { setAuthenticated } = useContext(AuthContext);
    const dispatch = useDispatch();
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
            dispatch(loginSuccess(result.token))
            saveToken(result.token); //save token to local storage

            navigate('/');

        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: '0 auto' }}>
            <h3>Login</h3>
            <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: '16px' }} />

            <Input.Password placeholder="password" onChange={(e) => setPassword(e.target.value)} required />

            <Flex justify="center" style={{ marginTop: '20px' }}>
                <Button type="primary" onClick={handleLogin}>Login</Button>
            </Flex>
        </form>
    );
}

export default LoginForm;