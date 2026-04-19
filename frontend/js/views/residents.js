import { fetchWithAuth } from '../api.js';

let residentsData = [];

export async function render(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Residents Management</h2>
            <button id="add-resident-btn">Add New Resident</button>
        </div>
        
        <div id="residents-message" style="margin-bottom: 10px;"></div>
        
        <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Department</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="residents-tbody">
                <tr><td colspan="5">Loading...</td></tr>
            </tbody>
        </table>

        <div id="resident-form-container" class="hidden" style="margin-top: 30px; border: 1px solid #ccc; padding: 20px; max-width: 400px; background-color: #fff;">
            <h3 id="form-title">Add New Resident</h3>
            <form id="resident-form">
                <input type="hidden" id="resident-id">
                
                <div style="margin-bottom: 15px;">
                    <label>First Name:</label><br>
                    <input type="text" id="resident-first-name" required style="width: 100%;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>Last Name:</label><br>
                    <input type="text" id="resident-last-name" required style="width: 100%;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>Department:</label><br>
                    <input type="text" id="resident-department" style="width: 100%;">
                </div>
                
                <button type="submit" id="save-resident-btn">Save</button>
                <button type="button" id="cancel-resident-btn">Cancel</button>
            </form>
        </div>
    `;

    attachEventListeners();
    await loadResidents();
}

function attachEventListeners() {
    document.getElementById('add-resident-btn').addEventListener('click', showAddForm);
    document.getElementById('cancel-resident-btn').addEventListener('click', hideForm);
    document.getElementById('resident-form').addEventListener('submit', handleFormSubmit);

    // Event delegation for dynamically created buttons in the table
    document.getElementById('residents-tbody').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            showEditForm(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            deleteResident(id);
        }
    });
}

async function loadResidents() {
    const tbody = document.getElementById('residents-tbody');
    const messageDiv = document.getElementById('residents-message');

    try {
        const response = await fetchWithAuth('/residents');
        if (!response.ok) throw new Error('Failed to fetch residents');

        residentsData = await response.json();
        renderTable();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error loading residents: ${error.message}</span>`;
        tbody.innerHTML = `<tr><td colspan="5">No data available.</td></tr>`;
    }
}

function renderTable() {
    const tbody = document.getElementById('residents-tbody');

    if (residentsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No residents found.</td></tr>`;
        return;
    }

    tbody.innerHTML = residentsData.map(resident => `
        <tr>
            <td>${resident.id}</td>
            <td>${resident.first_name}</td>
            <td>${resident.last_name}</td>
            <td>${resident.department || '-'}</td>
            <td>
                <button class="edit-btn" data-id="${resident.id}">Edit</button>
                <button class="delete-btn" data-id="${resident.id}">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showAddForm() {
    document.getElementById('form-title').innerText = 'Add New Resident';
    document.getElementById('resident-form').reset();
    document.getElementById('resident-id').value = '';

    document.getElementById('resident-form-container').classList.remove('hidden');
}

function showEditForm(id) {
    const resident = residentsData.find(r => r.id === id);
    if (!resident) return;

    document.getElementById('form-title').innerText = 'Edit Resident';
    document.getElementById('resident-id').value = resident.id;
    document.getElementById('resident-first-name').value = resident.first_name;
    document.getElementById('resident-last-name').value = resident.last_name;
    document.getElementById('resident-department').value = resident.department || '';

    document.getElementById('resident-form-container').classList.remove('hidden');
}

function hideForm() {
    document.getElementById('resident-form-container').classList.add('hidden');
    document.getElementById('resident-form').reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('residents-message');
    const submitBtn = document.getElementById('save-resident-btn');

    const id = document.getElementById('resident-id').value;
    const first_name = document.getElementById('resident-first-name').value;
    const last_name = document.getElementById('resident-last-name').value;
    const department = document.getElementById('resident-department').value;

    const isEditing = id !== '';
    submitBtn.disabled = true;

    const payload = { first_name, last_name };
    if (department.trim() !== '') {
        payload.department = department;
    }

    try {
        if (isEditing) {
            // Update resident (PATCH)
            const response = await fetchWithAuth(`/residents/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to update resident');
            messageDiv.innerHTML = `<span style="color: green;">Resident updated successfully.</span>`;
        } else {
            // Create resident (POST)
            const response = await fetchWithAuth('/residents', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to create resident');
            messageDiv.innerHTML = `<span style="color: green;">Resident created successfully.</span>`;
        }

        hideForm();
        await loadResidents(); // Refresh table
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    } finally {
        submitBtn.disabled = false;
    }
}

async function deleteResident(id) {
    if (!confirm('Are you sure you want to delete this resident?')) return;

    const messageDiv = document.getElementById('residents-message');

    try {
        const response = await fetchWithAuth(`/residents/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete resident');

        messageDiv.innerHTML = `<span style="color: green;">Resident deleted successfully.</span>`;
        await loadResidents(); // Refresh table
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error deleting resident: ${error.message}</span>`;
    }
}

// Cleanup function called by main.js when switching views
export function destroy() {
    residentsData = [];
}