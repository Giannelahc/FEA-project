import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function LoginPage() {
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate(); // ✅ 这里是安全调用

    return (
        <div>
            {/* 切换按钮 */}
            <div>
                <button onClick={() => setActiveTab('login')}>登录</button>
                <button onClick={() => setActiveTab('register')}>注册</button>
            </div>

            {/* 表单区域 */}
            {activeTab === 'login'
                ? <LoginForm navigate={navigate} />
                : <RegisterForm navigate={navigate} />
            }
        </div>
    );
}  

export default LoginPage;
