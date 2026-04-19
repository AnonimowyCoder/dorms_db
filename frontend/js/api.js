const API_BASE_URL = 'http://localhost:3001';

export async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        window.dispatchEvent(new Event('auth:unauthorized'));
        throw new Error('Session expired or unauthorized');
    }

    return response;
}

export async function loginRequest(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        throw new Error('Invalid credentials');
    }

    return response.json();
}