import React, { useState } from 'react';

function LoginForm({ navigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = new URLSearchParams();
        data.append('grant_type', 'password');
        data.append('client_id', 'main-client');
        data.append('client_secret', '73363200-f84e-4100-848c-6e3127b9f58c');
        data.append('username', email);
        data.append('password', password);

        try {
            const response = await fetch('https://localhost:8443/apiman-gateway/default/list-products/1.0', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data.toString(),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const result = await response.json();
            console.log('Access token:', result.access_token);

            // opential：save token to localstorage or context
            localStorage.setItem('token', result.access_token);

            navigate('/home');

        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h3>Login</h3>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;