// authFetch.js
export async function authFetch(url, options = {}) {
    let accessToken = localStorage.getItem("token");
    let refreshToken = localStorage.getItem("refresh_token");

    if (!options.headers) options.headers = {};
    if (accessToken) {
        options.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, options);

    if (response.status === 401 && refreshToken) {
        const refreshData = new URLSearchParams();
        refreshData.append('grant_type', 'refresh_token');
        refreshData.append('client_id', 'main-client');
        refreshData.append('client_secret', '73363200-f84e-4100-848c-6e3127b9f58c');
        refreshData.append('refresh_token', refreshToken);

        const refreshResponse = await fetch('http://localhost:8080/auth/realms/apiman/protocol/openid-connect/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: refreshData.toString(),
        });

        if (refreshResponse.ok) {
            const newTokens = await refreshResponse.json();
            localStorage.setItem("token", newTokens.access_token);
            localStorage.setItem("refresh_token", newTokens.refresh_token);

            options.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
            response = await fetch(url, options);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            window.location.href = '/login';
        }
    }

    return response;
}
