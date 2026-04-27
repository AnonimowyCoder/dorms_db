import { loginRequest } from './api.js';

const TOKEN_KEY = 'jwt_token';

export async function login(email, password) {
    const data = await loginRequest(email, password);
    localStorage.setItem(TOKEN_KEY, data.access_token);
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event('auth:logout'));
}

export function isAuthenticated() {
    return localStorage.getItem(TOKEN_KEY) !== null;
}

export function getTokenPayload() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
        // Extract the payload part of the JWT and decode base64url
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing token payload', error);
        return null;
    }
}

export function getUserRole() {
    const payload = getTokenPayload();
    return payload ? payload.role : null;
}