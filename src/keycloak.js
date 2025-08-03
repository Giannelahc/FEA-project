// src/keycloak.js
import Keycloak from 'keycloak-js';

let keycloakInstance = null;

export const getKeycloak = () => {
    if (!keycloakInstance) {
        keycloakInstance = new Keycloak({
            url: 'http://localhost:8080/auth',
            realm: 'apiman',
            clientId: 'main-client',
        });
    }
    return keycloakInstance;
};