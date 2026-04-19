import { login, logout, isAuthenticated, getUserRole } from './auth.js';

// DOM Elements
const loginView = document.getElementById('login-view');
const appView = document.getElementById('app-view');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const mainNav = document.getElementById('main-nav');
const contentArea = document.getElementById('content-area');

// Configuration of available views
const ROUTES = {
    residents: { title: 'Residents', module: './views/residents.js', roles: ['admin', 'manager'] },
    users: { title: 'Users', module: './views/users.js', roles: ['admin'] },
    rooms: { title: 'Rooms & Categories', module: './views/rooms.js', roles: ['admin', 'manager'] },
    roomReservations: { title: 'Room Reservations', module: './views/room-reservations.js', roles: ['admin', 'manager'] },
    roomPayments: { title: 'Room Payments', module: './views/room-payments.js', roles: ['admin', 'manager'] }, // Nowa zakladka
    parkingReservations: { title: 'Parking Reservations', module: './views/parking-reservations.js', roles: ['admin', 'manager'] },
    equipment: { title: 'Equipment', module: './views/equipment.js', roles: ['admin', 'manager'] }
};

let currentViewModule = null;

function initApp() {
    if (isAuthenticated()) {
        showApp();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginView.classList.remove('hidden');
    appView.classList.add('hidden');
    loginError.innerText = '';
    contentArea.innerHTML = '';
}

function showApp() {
    loginView.classList.add('hidden');
    appView.classList.remove('hidden');
    renderNavigation();

    // Load default view
    loadView('residents');
}

function renderNavigation() {
    mainNav.innerHTML = '';
    const userRole = getUserRole();

    for (const [routeKey, routeData] of Object.entries(ROUTES)) {
        if (routeData.roles.includes(userRole)) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.innerText = routeData.title;
            a.href = '#';
            a.addEventListener('click', (e) => {
                e.preventDefault();
                loadView(routeKey);
            });
            li.appendChild(a);
            mainNav.appendChild(li);
        }
    }
}

async function loadView(routeKey) {
    const route = ROUTES[routeKey];
    if (!route) return;

    contentArea.innerHTML = '<p>Loading...</p>';

    try {
        // Dynamically import the view module
        const module = await import(route.module);

        // Cleanup previous view if needed
        if (currentViewModule && typeof currentViewModule.destroy === 'function') {
            currentViewModule.destroy();
        }

        currentViewModule = module;

        // Render the new view
        if (typeof module.render === 'function') {
            module.render(contentArea);
        } else {
            throw new Error('View module missing render function');
        }
    } catch (error) {
        console.error(`Failed to load view: ${routeKey}`, error);
        contentArea.innerHTML = `<p class="error-text">Failed to load view. Check console for details.</p>`;
    }
}

// Event Listeners
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    loginError.innerText = '';

    try {
        await login(email, password);
        showApp();
    } catch (error) {
        loginError.innerText = error.message;
    }
});

logoutBtn.addEventListener('click', () => {
    logout();
});

window.addEventListener('auth:unauthorized', () => {
    logout();
});

window.addEventListener('auth:logout', () => {
    showLogin();
});

// Initialize the application
initApp();