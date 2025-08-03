// src/api/productApi.js
import keycloak from '../keycloak';

export async function getProducts() {
    const token = keycloak.token;  // ensure the user is logined
    const response = await fetch('http://localhost:8080/auth/realms/apiman/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': '73363200-f84e-4100-848c-6e3127b9f58c',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    return await response.json();
}
