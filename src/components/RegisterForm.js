import React, { useState } from 'react';
import { Input, Button, Flex } from 'antd';
import { useMessageApi } from '../context/MessageContext';
function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const messageApi = useMessageApi();
    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });
            if (!response.ok) { 
                const errData = await response.json();
                const errorMessage = Array.isArray(errData.message)
                    ? errData.message.join(', ')
                    : errData.message || 'Registration failed';
                throw new Error(errorMessage);
            }
            messageApi.success('Registration successful!');
            // clean form if needed
            // setUsername('');
            // setEmail('');
            // setPassword('');
        } catch (error) {
            messageApi.error(error.message);
        }
    };
    return (
        <form onSubmit={handleRegister} style={{ maxWidth: 400, margin: '0 auto' }}>
            <Input placeholder="Username" value={username}
                onChange={(e) => setUsername(e.target.value)} 
                required style={{ marginBottom: '4px' }} />
            <p>*Username must be 3-20 characters and unique</p>

            <Input placeholder="Email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required 
                style={{ marginBottom: '16px' }} />

            <Input.Password placeholder="password" value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            
            <p>*Password must be no less than 6 characters, contain uppercase, lowercase letters and numbers, and no special characters</p>

            <Flex justify="center" style={{ marginTop: '20px' }}>
                <Button type="primary" htmlType="submit">Register</Button>
            </Flex>
        </form>
    );
}
export default RegisterForm;
