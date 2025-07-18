import React from 'react';
import keycloak from '../keycloak';

function LoginForm({ navigate }) {
    const handleLogin = async (e) => {
        e.preventDefault();
        await keycloak.login();  // switch to the Keycloak loginpage
    };

    return (
        <form onSubmit={handleLogin}>
            <h3>Login with Keycloak</h3>
            <button type="submit">Login</button>
        </form>
    );
}

// function LoginForm() {
//     return (
//         <form>
//             <h3>Login</h3>
//             <input type="email" placeholder="Email" required />
//             <input type="password" placeholder="Password" required />
//             <button type="submit">Login</button>
//         </form>
//     );
// }
export default LoginForm;