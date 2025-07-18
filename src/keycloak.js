// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080/auth', // Keycloak server address
    realm: 'apiman',                  // Realm name
    clientId: 'main-client',              // Keycloak - Client ID
});

export default keycloak;
