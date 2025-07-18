import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { KeycloakContext } from '../components/KeycloakProvider';
function LoginPage() {
    const [activeTab, setActiveTab] = useState('login');
    const { authenticated } = useContext(KeycloakContext);
    const navigate = useNavigate(); 

    useEffect(() => {
        if (authenticated) {
            navigate('/');  // jump to home page
        }
    }, [authenticated, navigate]);

    return (
        <div>
            {/* tab button */}
            <div>
                <button onClick={() => setActiveTab('login')}>Login</button>
                <button onClick={() => setActiveTab('register')}>Register</button>
            </div>

            {/* form space */}
            {activeTab === 'login'
                ? <LoginForm navigate={navigate} />
                : <RegisterForm navigate={navigate} />
            }
        </div>
    );
}  

export default LoginPage;
