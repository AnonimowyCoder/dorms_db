import { fetchWithAuth } from '../api.js';

let parkingLotsData = [];

export async function render(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Parking Lots Management</h2>
            <button id="add-parking-btn">Add New Parking Lot</button>
        </div>
        
        <div id="parking-message" style="margin-bottom: 10px;"></div>
        
        <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th>ID</th>
                    <th>Type</th>
                    <th>Placement</th>
                    <th>Daily Rate</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="parking-tbody">
                <tr><td colspan="5">Loading...</td></tr>
            </tbody>
        </table>

        <div id="parking-form-container" class="hidden" style="margin-top: 30px; border: 1px solid #ccc; padding: 20px; max-width: 400px; background-color: #fff;">
            <h3 id="form-title">Add New Parking Lot</h3>
            <form id="parking-form">
                <input type="hidden" id="parking-id">
                
                <div style="margin-bottom: 15px;">
                    <label>Parking Lot Type:</label><br>
                    <input type="text" id="parking-type" required style="width: 100%;" placeholder="e.g., covered">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>Placement:</label><br>
                    <input type="text" id="parking-placement" required style="width: 100%;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>Daily Rate:</label><br>
                    <input type="number" step="0.01" id="parking-daily-rate" style="width: 100%;">
                </div>
                
                <button type="submit" id="save-parking-btn">Save</button>
                <button type="button" id="cancel-parking-btn">Cancel</button>
            </form>
        </div>
    `;

    attachEventListeners();
    await loadParkingLots();
}

function attachEventListeners() {
    document.getElementById('add-parking-btn').addEventListener('click', showAddForm);
    document.getElementById('cancel-parking-btn').addEventListener('click', hideForm);
    document.getElementById('parking-form').addEventListener('submit', handleFormSubmit);

    document.getElementById('parking-tbody').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            showEditForm(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            deleteParkingLot(id);
        }
    });
}

async function loadParkingLots() {
    const tbody = document.getElementById('parking-tbody');
    const messageDiv = document.getElementById('parking-message');

    try {
        const response = await fetchWithAuth('/parking-lots');
        if (!response.ok) throw new Error('Failed to fetch parking lots');

        parkingLotsData = await response.json();
        renderTable();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error loading parking lots: ${error.message}</span>`;
        tbody.innerHTML = `<tr><td colspan="5">No data available.</td></tr>`;
    }
}

function renderTable() {
    const tbody = document.getElementById('parking-tbody');

    if (parkingLotsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No parking lots found.</td></tr>`;
        return;
    }

    tbody.innerHTML = parkingLotsData.map(lot => `
        <tr>
            <td>${lot.id}</td>
            <td>${lot.parking_lot_type || '-'}</td>
            <td>${lot.placement || '-'}</td>
            <td>${lot.daily_rate !== undefined && lot.daily_rate !== null ? lot.daily_rate : '-'}</td>
            <td>
                <button class="edit-btn" data-id="${lot.id}">Edit</button>
                <button class="delete-btn" data-id="${lot.id}">Delete</button>
            </td>
        </tr>
    `).join('');
}

function showAddForm() {
    document.getElementById('form-title').innerText = 'Add New Parking Lot';
    document.getElementById('parking-form').reset();
    document.getElementById('parking-id').value = '';
    document.getElementById('parking-form-container').classList.remove('hidden');
}

function showEditForm(id) {
    const lot = parkingLotsData.find(p => p.id === id);
    if (!lot) return;

    document.getElementById('form-title').innerText = 'Edit Parking Lot';
    document.getElementById('parking-id').value = lot.id;
    document.getElementById('parking-type').value = lot.parking_lot_type || '';
    document.getElementById('parking-placement').value = lot.placement || '';

    if (lot.daily_rate !== undefined && lot.daily_rate !== null) {
        document.getElementById('parking-daily-rate').value = lot.daily_rate;
    } else {
        document.getElementById('parking-daily-rate').value = '';
    }

    document.getElementById('parking-form-container').classList.remove('hidden');
}

function hideForm() {
    document.getElementById('parking-form-container').classList.add('hidden');
    document.getElementById('parking-form').reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('parking-message');
    const submitBtn = document.getElementById('save-parking-btn');

    const id = document.getElementById('parking-id').value;
    const isEditing = id !== '';

    const payload = {};
    const type = document.getElementById('parking-type').value.trim();
    const placement = document.getElementById('parking-placement').value.trim();
    const rateStr = document.getElementById('parking-daily-rate').value;

    if (type) payload.parking_lot_type = type;
    if (placement) payload.placement = placement;
    if (rateStr) payload.daily_rate = parseFloat(rateStr);

    submitBtn.disabled = true;

    try {
        let response;
        if (isEditing) {
            response = await fetchWithAuth(`/parking-lots/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetchWithAuth('/parking-lots', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            let errorMsg = 'Failed to save parking lot.';
            if (errorData && errorData.message) {
                errorMsg = Array.isArray(errorData.message) ? errorData.message.join('<br>') : errorData.message;
            }
            throw new Error(errorMsg);
        }

        messageDiv.innerHTML = `<span style="color: green;">Parking lot ${isEditing ? 'updated' : 'created'} successfully.</span>`;
        hideForm();
        await loadParkingLots();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    } finally {
        submitBtn.disabled = false;
    }
}

async function deleteParkingLot(id) {
    if (!confirm('Are you sure you want to delete this parking lot?')) return;

    const messageDiv = document.getElementById('parking-message');

    try {
        const response = await fetchWithAuth(`/parking-lots/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete parking lot');

        messageDiv.innerHTML = `<span style="color: green;">Parking lot deleted successfully.</span>`;
        await loadParkingLots();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error deleting parking lot: ${error.message}</span>`;
    }
}

export function destroy() {
    parkingLotsData = [];
}