import { fetchWithAuth } from '../api.js';

let reservationsData = [];
let residentsData = [];
let parkingLotsData = [];

export async function render(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Parking Reservations</h2>
            <button id="add-pres-btn">Add New Reservation</button>
        </div>
        
        <div id="pres-message" style="margin-bottom: 10px;"></div>
        
        <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th>ID</th>
                    <th>Resident</th>
                    <th>Parking Lot</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="pres-tbody">
                <tr><td colspan="6">Loading...</td></tr>
            </tbody>
        </table>

        <div id="pres-form-container" class="hidden" style="margin-top: 30px; border: 1px solid #ccc; padding: 20px; max-width: 500px; background-color: #fff;">
            <h3 id="form-title">Add New Parking Reservation</h3>
            <form id="pres-form">
                <input type="hidden" id="pres-id">
                
                <div style="margin-bottom: 15px;">
                    <label>Resident:</label><br>
                    <select id="pres-resident" required style="width: 100%; padding: 5px;">
                        <option value="">Loading residents...</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        <label>Start Date:</label><br>
                        <input type="date" id="pres-start" required style="width: 100%;">
                    </div>
                    <div style="flex: 1;">
                        <label>End Date:</label><br>
                        <input type="date" id="pres-end" required style="width: 100%;">
                    </div>
                </div>

                <div style="margin-bottom: 15px;" id="availability-section">
                    <button type="button" id="check-parking-btn" style="width: 100%; padding: 8px; margin-bottom: 5px;">Check Available Parking Lots</button>
                    <small style="color: #666;">Select dates and check availability before choosing a parking lot.</small>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>Parking Lot:</label><br>
                    <select id="pres-parking" required style="width: 100%; padding: 5px;">
                        <option value="">Check availability first...</option>
                    </select>
                </div>
                
                <button type="submit" id="save-pres-btn">Save</button>
                <button type="button" id="cancel-pres-btn">Cancel</button>
            </form>
        </div>
    `;

    attachEventListeners();
    await loadDependencies();
    await loadReservations();
}

function attachEventListeners() {
    document.getElementById('add-pres-btn').addEventListener('click', showAddForm);
    document.getElementById('cancel-pres-btn').addEventListener('click', hideForm);
    document.getElementById('pres-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('check-parking-btn').addEventListener('click', checkAvailableParkingLots);

    document.getElementById('pres-tbody').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            showEditForm(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            deleteReservation(id);
        }
    });
}

async function loadDependencies() {
    try {
        const [resResidents, resParkingLots] = await Promise.all([
            fetchWithAuth('/residents'),
            fetchWithAuth('/parking-lots')
        ]);

        if (resResidents.ok) residentsData = await resResidents.json();
        if (resParkingLots.ok) parkingLotsData = await resParkingLots.json();

        const residentSelect = document.getElementById('pres-resident');
        if (residentsData.length > 0) {
            residentSelect.innerHTML = '<option value="">Select resident...</option>' +
                residentsData.map(r => `<option value="${r.id}">${r.first_name} ${r.last_name}</option>`).join('');
        } else {
            residentSelect.innerHTML = '<option value="">No residents found.</option>';
        }
    } catch (error) {
        console.error('Failed to load dependencies:', error);
    }
}

async function loadReservations() {
    const tbody = document.getElementById('pres-tbody');
    const messageDiv = document.getElementById('pres-message');

    try {
        const response = await fetchWithAuth('/parking-reservations');
        if (!response.ok) throw new Error('Failed to fetch parking reservations');

        reservationsData = await response.json();
        renderTable();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error loading reservations: ${error.message}</span>`;
        tbody.innerHTML = `<tr><td colspan="6">No data available.</td></tr>`;
    }
}

function renderTable() {
    const tbody = document.getElementById('pres-tbody');

    if (reservationsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No parking reservations found.</td></tr>`;
        return;
    }

    tbody.innerHTML = reservationsData.map(res => {
        const resident = residentsData.find(r => r.id === res.id_resident);
        const residentName = resident ? `${resident.first_name} ${resident.last_name}` : `ID: ${res.id_resident}`;

        const lot = parkingLotsData.find(p => p.id === res.id_parking_lot);
        const lotDisplay = lot ? `${lot.placement} (${lot.parking_lot_type})` : `ID: ${res.id_parking_lot}`;

        const startDate = res.start_date_reserv ? res.start_date_reserv.split('T')[0] : '-';
        const endDate = res.end_date_reserv ? res.end_date_reserv.split('T')[0] : '-';

        return `
            <tr>
                <td>${res.id}</td>
                <td>${residentName}</td>
                <td>${lotDisplay}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>
                    <button class="edit-btn" data-id="${res.id}">Edit</button>
                    <button class="delete-btn" data-id="${res.id}">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

async function checkAvailableParkingLots() {
    const start = document.getElementById('pres-start').value;
    const end = document.getElementById('pres-end').value;
    const parkingSelect = document.getElementById('pres-parking');

    parkingSelect.innerHTML = '<option value="">Loading available parking lots...</option>';

    if (!start || !end) {
        alert('Please select both start and end dates first.');
        parkingSelect.innerHTML = '<option value="">Check availability first...</option>';
        return;
    }

    try {
        const response = await fetchWithAuth(`/parking-reservations/available?start_date=${start}&end_date=${end}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            let errorMsg = 'Failed to fetch available parking lots.';

            if (errorData && errorData.message) {
                errorMsg = Array.isArray(errorData.message) ? errorData.message.join(' | ') : errorData.message;
            }

            throw new Error(errorMsg);
        }

        const availableLots = await response.json();

        if (availableLots.length === 0) {
            parkingSelect.innerHTML = '<option value="">No parking lots available for these dates.</option>';
            return;
        }

        parkingSelect.innerHTML = '<option value="">Select an available parking lot...</option>' +
            availableLots.map(lot => `<option value="${lot.id}">${lot.placement} (${lot.parking_lot_type})</option>`).join('');
    } catch (error) {
        parkingSelect.innerHTML = `<option value="">Error: ${error.message}</option>`;
        alert(`Error checking availability: ${error.message}`);
        console.error('Availability check failed:', error);
    }
}

function showAddForm() {
    document.getElementById('form-title').innerText = 'Add New Parking Reservation';
    document.getElementById('pres-form').reset();
    document.getElementById('pres-id').value = '';

    document.getElementById('pres-parking').innerHTML = '<option value="">Check availability first...</option>';
    document.getElementById('availability-section').classList.remove('hidden');

    document.getElementById('pres-form-container').classList.remove('hidden');
}

function showEditForm(id) {
    const res = reservationsData.find(r => r.id === id);
    if (!res) return;

    document.getElementById('form-title').innerText = 'Edit Parking Reservation';
    document.getElementById('pres-id').value = res.id;
    document.getElementById('pres-resident').value = res.id_resident;

    if (res.start_date_reserv) {
        document.getElementById('pres-start').value = res.start_date_reserv.split('T')[0];
    }
    if (res.end_date_reserv) {
        document.getElementById('pres-end').value = res.end_date_reserv.split('T')[0];
    }

    const lot = parkingLotsData.find(p => p.id === res.id_parking_lot);
    const parkingSelect = document.getElementById('pres-parking');
    parkingSelect.innerHTML = `<option value="${res.id_parking_lot}">Current: ${lot ? lot.placement : res.id_parking_lot}</option>`;

    document.getElementById('availability-section').classList.remove('hidden');
    document.getElementById('pres-form-container').classList.remove('hidden');
}

function hideForm() {
    document.getElementById('pres-form-container').classList.add('hidden');
    document.getElementById('pres-form').reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('pres-message');
    const submitBtn = document.getElementById('save-pres-btn');

    const id = document.getElementById('pres-id').value;
    const isEditing = id !== '';

    const payload = {};
    const startDate = document.getElementById('pres-start').value;
    const endDate = document.getElementById('pres-end').value;
    const parkingId = document.getElementById('pres-parking').value;
    const residentId = document.getElementById('pres-resident').value;

    if (startDate) payload.start_date_reserv = startDate;
    if (endDate) payload.end_date_reserv = endDate;
    if (parkingId) payload.id_parking_lot = parseInt(parkingId, 10);
    if (residentId) payload.id_resident = parseInt(residentId, 10);

    submitBtn.disabled = true;

    try {
        let response;
        if (isEditing) {
            response = await fetchWithAuth(`/parking-reservations/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetchWithAuth('/parking-reservations', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            let errorMsg = 'Failed to save parking reservation.';

            if (errorData && errorData.message) {
                errorMsg = Array.isArray(errorData.message)
                    ? errorData.message.join('<br>')
                    : errorData.message;
            }
            throw new Error(errorMsg);
        }

        messageDiv.innerHTML = `<span style="color: green;">Parking reservation ${isEditing ? 'updated' : 'created'} successfully.</span>`;
        hideForm();
        await loadReservations();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    } finally {
        submitBtn.disabled = false;
    }
}

async function deleteReservation(id) {
    if (!confirm('Are you sure you want to delete this parking reservation?')) return;

    const messageDiv = document.getElementById('pres-message');

    try {
        const response = await fetchWithAuth(`/parking-reservations/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete parking reservation');

        messageDiv.innerHTML = `<span style="color: green;">Parking reservation deleted successfully.</span>`;
        await loadReservations();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error deleting parking reservation: ${error.message}</span>`;
    }
}

export function destroy() {
    reservationsData = [];
    residentsData = [];
    parkingLotsData = [];
}