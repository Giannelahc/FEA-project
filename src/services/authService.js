// src/services/authService.js

// save token
export function saveToken(token) {
    localStorage.setItem("jwt_token", token);
}

export function saveUser(username) {
    localStorage.setItem("username", username);
}

// get token
export function getToken() {
    return localStorage.getItem("jwt_token");
}

// delete token
export function logout() {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("username");
}
// get token from localstorage
export function getUserFromStorage() {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
}