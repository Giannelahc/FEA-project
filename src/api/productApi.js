// src/api/productApi.js
import keycloak from '../keycloak';

export async function getProducts() {
    const token = keycloak.token;  // ensure the user is logined
    const response = await fetch('https://localhost:8443/apiman-gateway/default/list-products/1.0', {
        method: 'GET',
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
