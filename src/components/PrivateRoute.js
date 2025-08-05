// components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setTimeout(() => {
          setShouldRedirect(true);
        }, 2000);
      }
    };
    checkToken();
  }, []);

  if (isAuthenticated === null) return <div>Checking authentication...</div>;

  if (!isAuthenticated && shouldRedirect) {
    navigate('/login', {
      replace: true,
      state: { from: location, message: 'Please login first' },
    });
    return null; // prevent multiple render
  }
  if (!isAuthenticated) {
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height: '100vh'}}>
        You are not yet login, Please login first.<br/>
        Redirecting to login page in 2 seconds...</div>;
  }

  return children;
};

export default PrivateRoute;