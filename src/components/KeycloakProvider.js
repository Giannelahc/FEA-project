// src/components/KeycloakProvider.js
import React, { useEffect, useState } from 'react';
import keycloak from '../keycloak';

export const KeycloakContext = React.createContext();

const KeycloakProvider = ({ children }) => {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        keycloak
            .init({ onLoad: 'check-sso', pkceMethod: 'S256', checkLoginIframe: false })
            .then((auth) => {
                setAuthenticated(auth);
                setInitialized(true);

                if (auth) {
                    console.log('Keycloak Token:', keycloak.token);

                    // 定时刷新token
                    setInterval(() => {
                        keycloak.updateToken(30).catch(() => {
                            keycloak.logout();
                        });
                    }, 10000);
                }
            });
    }, []);

    if (!initialized) {
        return <div>Loading...</div>;
    }

    return (
        <KeycloakContext.Provider value={{ keycloak, authenticated }}>
            {children}
        </KeycloakContext.Provider>
    );
};

export default KeycloakProvider;