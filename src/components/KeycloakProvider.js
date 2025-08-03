// src/components/KeycloakProvider.js
import React, { useEffect, useState, createContext, useRef } from "react";
import { getKeycloak } from "../keycloak";

export const AuthContext = createContext(null);
const KeycloakProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const keycloak = getKeycloak();  // get same instance everytime
    const hasInitialized = useRef(false); 
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            keycloak.init({
                onLoad: "login-required",
                pkceMethod: "S256",
                checkLoginIframe: false,

            }).then((auth) => {
                setAuthenticated(auth);
                setInitialized(true);
            }).catch((err) => {
                console.error("Keycloak init error:", err);
                setInitialized(true);
            });
        }
    }); 

    if (!initialized) return <div>Loading Keycloak...</div>;

    return (
        <AuthContext.Provider value={{ keycloak: keycloak.current, authenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export default KeycloakProvider;