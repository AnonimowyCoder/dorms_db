import { fetchWithAuth } from '../api.js';

let usersData = [];

export async function render(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Users Management</h2>
            <button id="add-user-btn">Add New User</button>
        </div>
        
        <div id="users-message" style="margin-bottom: 10px;"></div>
        
        <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th>ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="users-tbody">
                <tr><td colspan="4">Loading...</td></tr>
            </tbody>
        </table>

        <div id="user-form-container" class="hidden" style="margin-top: 30px; border: 1px solid #ccc; padding: 20px; max-width: 400px; background-color: #fff;">
            <h3 id="form-title">Add New User</h3>
            <form id="user-form">
                <input type="hidden" id="user-id">
                
                <div style="margin-bottom: 15px;">
                    <label>Email:</label><br>
                    <input type="email" id="user-email" required style="width: 100%;">
                </div>
                
                <div style="margin-bottom: 15px;" id="password-group">
                    <label>Password:</label><br>
                    <input type="password" id="user-password" style="width: 100%;">
                    <small style="color: #666;" id="password-hint">Required for new users.</small>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>Role:</label><br>
                    <select id="user-role" required style="width: 100%; padding: 5px;">
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                
                <button type="submit" id="save-user-btn">Save</button>
                <button type="button" id="cancel-user-btn">Cancel</button>
            </form>
        </div>
    `;

    attachEventListeners();
    await loadUsers();
}

function attachEventListeners() {
    document.getElementById('add-user-btn').addEventListener('click', showAddForm);
    document.getElementById('cancel-user-btn').addEventListener('click', hideForm);
    document.getElementById('user-form').addEventListener('submit', handleFormSubmit);

    // Event delegation for dynamically created buttons in the table
    document.getElementById('users-tbody').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            showEditForm(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            deleteUser(id);
        }
    });
}

async function loadUsers() {
    const tbody = document.getElementById('users-tbody');
    const messageDiv = document.getElementById('users-message');

    try {
        const response = await fetchWithAuth('/users');
        if (!response.ok) throw new Error('Failed to fetch users');

        usersData = await response.json();
        renderTable();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error loading users: ${error.message}</span>`;
        tbody.innerHTML = `<tr><td colspan="4">No data available.</td></tr>`;
    }
}

function renderTable() {
    const tbody = document.getElementById('users-tbody');

    if (usersData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">No users found.</td></tr>`;
        return;
    }

    tbody.innerHTML = usersData.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="edit-btn" data-id="${user.id}">Edit</button>
                <button class="delete-btn" data-id="${user.id}">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showAddForm() {
    document.getElementById('form-title').innerText = 'Add New User';
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = '';

    // Password is required when creating a new user
    document.getElementById('user-password').required = true;
    document.getElementById('password-group').classList.remove('hidden');
    document.getElementById('password-hint').innerText = 'Required for new users.';

    document.getElementById('user-form-container').classList.remove('hidden');
}

function showEditForm(id) {
    const user = usersData.find(u => u.id === id);
    if (!user) return;

    document.getElementById('form-title').innerText = 'Edit User';
    document.getElementById('user-id').value = user.id;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-role').value = user.role;

    // Password is optional during edit
    document.getElementById('user-password').required = false;
    document.getElementById('user-password').value = '';
    document.getElementById('password-group').classList.remove('hidden');
    document.getElementById('password-hint').innerText = 'Leave blank to keep current password.';

    document.getElementById('user-form-container').classList.remove('hidden');
}

function hideForm() {
    document.getElementById('user-form-container').classList.add('hidden');
    document.getElementById('user-form').reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('users-message');
    const submitBtn = document.getElementById('save-user-btn');

    const id = document.getElementById('user-id').value;
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;
    const password = document.getElementById('user-password').value;

    const isEditing = id !== '';
    submitBtn.disabled = true;

    try {
        if (isEditing) {
            // Update user (PATCH)
            const payload = { email, role };

            // Append password to payload only if user typed something
            if (password.trim() !== '') {
                payload.password = password;
            }

            const response = await fetchWithAuth(`/users/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to update user');
            messageDiv.innerHTML = `<span style="color: green;">User updated successfully.</span>`;
        } else {
            // Create user (POST)
            const payload = { email, password, role };

            const response = await fetchWithAuth('/users', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to create user');
            messageDiv.innerHTML = `<span style="color: green;">User created successfully.</span>`;
        }

        hideForm();
        await loadUsers(); // Refresh table
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    } finally {
        submitBtn.disabled = false;
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const messageDiv = document.getElementById('users-message');

    try {
        const response = await fetchWithAuth(`/users/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete user');

        messageDiv.innerHTML = `<span style="color: green;">User deleted successfully.</span>`;
        await loadUsers(); // Refresh table
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error deleting user: ${error.message}</span>`;
    }
}

// Cleanup function called by main.js when switching views
export function destroy() {
    usersData = [];
}