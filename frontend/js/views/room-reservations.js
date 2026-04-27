import { fetchWithAuth } from '../api.js';

let reservationsData = [];
let residentsData = [];
let roomsData = [];

export async function render(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Room Reservations</h2>
            <button id="add-res-btn">Add New Reservation</button>
        </div>
        
        <div id="res-message" style="margin-bottom: 10px;"></div>
        
        <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th>ID</th>
                    <th>Resident</th>
                    <th>Room No.</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="res-tbody">
                <tr><td colspan="6">Loading...</td></tr>
            </tbody>
        </table>

        <div id="res-form-container" class="hidden" style="margin-top: 30px; border: 1px solid #ccc; padding: 20px; max-width: 500px; background-color: #fff;">
            <h3 id="form-title">Add New Reservation</h3>
            <form id="res-form">
                <input type="hidden" id="res-id">
                
                <div style="margin-bottom: 15px;">
                    <label>Resident:</label><br>
                    <select id="res-resident" required style="width: 100%; padding: 5px;">
                        <option value="">Loading residents...</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        <label>Start Date:</label><br>
                        <input type="date" id="res-start" required style="width: 100%;">
                    </div>
                    <div style="flex: 1;">
                        <label>End Date:</label><br>
                        <input type="date" id="res-end" required style="width: 100%;">
                    </div>
                </div>

                <div style="margin-bottom: 15px;" id="availability-section">
                    <button type="button" id="check-rooms-btn" style="width: 100%; padding: 8px; margin-bottom: 5px;">Check Available Rooms</button>
                    <small style="color: #666;">Select dates and check availability before choosing a room.</small>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>Room:</label><br>
                    <select id="res-room" required style="width: 100%; padding: 5px;">
                        <option value="">Check availability first...</option>
                    </select>
                </div>
                
                <button type="submit" id="save-res-btn">Save</button>
                <button type="button" id="cancel-res-btn">Cancel</button>
            </form>
        </div>
    `;

    attachEventListeners();
    await loadDependencies();
    await loadReservations();
}

function attachEventListeners() {
    document.getElementById('add-res-btn').addEventListener('click', showAddForm);
    document.getElementById('cancel-res-btn').addEventListener('click', hideForm);
    document.getElementById('res-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('check-rooms-btn').addEventListener('click', checkAvailableRooms);

    document.getElementById('res-tbody').addEventListener('click', (e) => {
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
        const [resResidents, resRooms] = await Promise.all([
            fetchWithAuth('/residents'),
            fetchWithAuth('/rooms')
        ]);

        if (resResidents.ok) residentsData = await resResidents.json();
        if (resRooms.ok) roomsData = await resRooms.json();

        // Populate resident dropdown
        const residentSelect = document.getElementById('res-resident');
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
    const tbody = document.getElementById('res-tbody');
    const messageDiv = document.getElementById('res-message');

    try {
        const response = await fetchWithAuth('/room-reservations');
        if (!response.ok) throw new Error('Failed to fetch reservations');

        reservationsData = await response.json();
        renderTable();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error loading reservations: ${error.message}</span>`;
        tbody.innerHTML = `<tr><td colspan="6">No data available.</td></tr>`;
    }
}

function renderTable() {
    const tbody = document.getElementById('res-tbody');

    if (reservationsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No reservations found.</td></tr>`;
        return;
    }

    tbody.innerHTML = reservationsData.map(res => {
        const resident = residentsData.find(r => r.id === res.id_resident);
        const residentName = resident ? `${resident.first_name} ${resident.last_name}` : `ID: ${res.id_resident}`;

        const room = roomsData.find(r => r.id === res.id_room);
        const roomNumber = room ? room.room_number : `ID: ${res.id_room}`;

        // Format dates safely
        const startDate = res.start_date_reserv ? res.start_date_reserv.split('T')[0] : '-';
        const endDate = res.end_date_reserv ? res.end_date_reserv.split('T')[0] : '-';

        return `
            <tr>
                <td>${res.id}</td>
                <td>${residentName}</td>
                <td>${roomNumber}</td>
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

async function checkAvailableRooms() {
    const start = document.getElementById('res-start').value;
    const end = document.getElementById('res-end').value;
    const roomSelect = document.getElementById('res-room');

    // Clear previous options
    roomSelect.innerHTML = '<option value="">Loading available rooms...</option>';

    if (!start || !end) {
        alert('Please select both start and end dates first.');
        roomSelect.innerHTML = '<option value="">Check availability first...</option>';
        return;
    }

    try {
        const response = await fetchWithAuth(`/room-reservations/available?start_date=${start}&end_date=${end}`);

        if (!response.ok) {
            // Attempt to parse the error message from the backend
            const errorData = await response.json().catch(() => null);
            let errorMsg = 'Failed to fetch available rooms.';

            if (errorData && errorData.message) {
                // NestJS might return a string or an array of strings
                errorMsg = Array.isArray(errorData.message) ? errorData.message.join(' | ') : errorData.message;
            }

            throw new Error(errorMsg);
        }

        const availableRooms = await response.json();

        if (availableRooms.length === 0) {
            roomSelect.innerHTML = '<option value="">No rooms available for these dates.</option>';
            return;
        }

        roomSelect.innerHTML = '<option value="">Select an available room...</option>' +
            availableRooms.map(r => `<option value="${r.id}">Room ${r.room_number} (Floor ${r.floor_number}, Beds: ${r.num_of_beds})</option>`).join('');

    } catch (error) {
        // Display the specific backend error in the select box or via alert
        roomSelect.innerHTML = `<option value="">Error: ${error.message}</option>`;
        alert(`Error checking availability: ${error.message}`);
        console.error('Availability check failed:', error);
    }
}

function showAddForm() {
    document.getElementById('form-title').innerText = 'Add New Reservation';
    document.getElementById('res-form').reset();
    document.getElementById('res-id').value = '';

    // Reset room select
    document.getElementById('res-room').innerHTML = '<option value="">Check availability first...</option>';
    document.getElementById('availability-section').classList.remove('hidden');

    document.getElementById('res-form-container').classList.remove('hidden');
}

function showEditForm(id) {
    const res = reservationsData.find(r => r.id === id);
    if (!res) return;

    document.getElementById('form-title').innerText = 'Edit Reservation';
    document.getElementById('res-id').value = res.id;
    document.getElementById('res-resident').value = res.id_resident;

    if (res.start_date_reserv) {
        document.getElementById('res-start').value = res.start_date_reserv.split('T')[0];
    }
    if (res.end_date_reserv) {
        document.getElementById('res-end').value = res.end_date_reserv.split('T')[0];
    }

    // Populate room select with current room to allow saving without checking availability again
    const room = roomsData.find(r => r.id === res.id_room);
    const roomSelect = document.getElementById('res-room');
    roomSelect.innerHTML = `<option value="${res.id_room}">Current: Room ${room ? room.room_number : res.id_room}</option>`;

    document.getElementById('availability-section').classList.remove('hidden');
    document.getElementById('res-form-container').classList.remove('hidden');
}

function hideForm() {
    document.getElementById('res-form-container').classList.add('hidden');
    document.getElementById('res-form').reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('res-message');
    const submitBtn = document.getElementById('save-res-btn');

    const id = document.getElementById('res-id').value;
    const isEditing = id !== '';

    const payload = {};
    const startDate = document.getElementById('res-start').value;
    const endDate = document.getElementById('res-end').value;
    const roomId = document.getElementById('res-room').value;
    const residentId = document.getElementById('res-resident').value;

    if (startDate) payload.start_date_reserv = startDate;
    if (endDate) payload.end_date_reserv = endDate;
    if (roomId) payload.id_room = parseInt(roomId, 10);
    if (residentId) payload.id_resident = parseInt(residentId, 10);

    submitBtn.disabled = true;

    try {
        let response;
        if (isEditing) {
            response = await fetchWithAuth(`/room-reservations/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetchWithAuth('/room-reservations', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) {
            // Parse error response from the backend
            const errorData = await response.json().catch(() => null);
            let errorMsg = 'Failed to save reservation.';

            if (errorData && errorData.message) {
                // NestJS can return a single string or an array of strings for validation errors
                errorMsg = Array.isArray(errorData.message)
                    ? errorData.message.join('<br>')
                    : errorData.message;
            }
            throw new Error(errorMsg);
        }

        messageDiv.innerHTML = `<span style="color: green;">Reservation ${isEditing ? 'updated' : 'created'} successfully.</span>`;
        hideForm();
        await loadReservations();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    } finally {
        submitBtn.disabled = false;
    }
}

async function deleteReservation(id) {
    if (!confirm('Are you sure you want to delete this reservation? This might affect related payments.')) return;

    const messageDiv = document.getElementById('res-message');

    try {
        const response = await fetchWithAuth(`/room-reservations/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete reservation');

        messageDiv.innerHTML = `<span style="color: green;">Reservation deleted successfully.</span>`;
        await loadReservations();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error deleting reservation: ${error.message}</span>`;
    }
}

export function destroy() {
    reservationsData = [];
    residentsData = [];
    roomsData = [];
}