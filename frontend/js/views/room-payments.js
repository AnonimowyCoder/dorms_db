import { fetchWithAuth } from '../api.js';

let paymentsData = [];
let reservationsData = [];
let roomsData = [];
let residentsData = [];

export async function render(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Room Payments</h2>
            <button id="add-payment-btn">Add New Payment</button>
        </div>
        
        <div id="payment-message" style="margin-bottom: 10px;"></div>
        
        <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th>ID</th>
                    <th>Reservation</th>
                    <th>Amount Due</th>
                    <th>Due Date</th>
                    <th>Amount Payed</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="payment-tbody">
                <tr><td colspan="7">Loading...</td></tr>
            </tbody>
        </table>

        <div id="res-details-container" class="hidden" style="margin-top: 20px; border: 1px solid #17a2b8; padding: 20px; max-width: 500px; background-color: #f8f9fa;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #17a2b8;">Reservation Details</h3>
                <button type="button" id="close-details-btn">Close</button>
            </div>
            <div id="res-details-content">
                </div>
        </div>

        <div id="payment-form-container" class="hidden" style="margin-top: 30px; border: 1px solid #ccc; padding: 20px; max-width: 400px; background-color: #fff;">
            <h3 id="form-title">Add New Payment</h3>
            <form id="payment-form">
                <input type="hidden" id="payment-id">
                
                <div style="margin-bottom: 15px;">
                    <label>Reservation:</label><br>
                    <div style="display: flex; gap: 10px;">
                        <select id="payment-reservation-id" required style="flex: 1; padding: 5px;">
                            <option value="">Loading reservations...</option>
                        </select>
                        <button type="button" id="form-res-details-btn">Details</button>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>Total Amount:</label><br>
                    <input type="number" step="0.01" id="payment-amount" required style="width: 100%;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>Due Date:</label><br>
                    <input type="date" id="payment-due-date" required style="width: 100%;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>Amount Payed:</label><br>
                    <input type="number" step="0.01" id="payment-amount-payed" required style="width: 100%;">
                </div>
                
                <button type="submit" id="save-payment-btn">Save</button>
                <button type="button" id="cancel-payment-btn">Cancel</button>
            </form>
        </div>
    `;

    attachEventListeners();
    await loadDependencies();
    await loadPayments();
}

function attachEventListeners() {
    document.getElementById('add-payment-btn').addEventListener('click', showAddForm);
    document.getElementById('cancel-payment-btn').addEventListener('click', hideForm);
    document.getElementById('payment-form').addEventListener('submit', handleFormSubmit);

    document.getElementById('close-details-btn').addEventListener('click', () => {
        document.getElementById('res-details-container').classList.add('hidden');
    });

    document.getElementById('payment-tbody').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            showEditForm(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.dataset.id, 10);
            deletePayment(id);
        } else if (e.target.classList.contains('info-btn')) {
            const resId = parseInt(e.target.dataset.resid, 10);
            showReservationDetails(resId);
        }
    });
    document.getElementById('form-res-details-btn').addEventListener('click', () => {
        const resId = document.getElementById('payment-reservation-id').value;
        if (resId) {
            showReservationDetails(parseInt(resId, 10));
        } else {
            alert('Please select a reservation from the list first.');
        }
    });
}

async function loadDependencies() {
    try {
        // Fetch reservations, rooms, and residents concurrently for detail mapping
        const [resReservations, resRooms, resResidents] = await Promise.all([
            fetchWithAuth('/room-reservations'),
            fetchWithAuth('/rooms'),
            fetchWithAuth('/residents')
        ]);

        if (resReservations.ok) reservationsData = await resReservations.json();
        if (resRooms.ok) roomsData = await resRooms.json();
        if (resResidents.ok) residentsData = await resResidents.json();

        const resSelect = document.getElementById('payment-reservation-id');
        if (reservationsData.length > 0) {
            resSelect.innerHTML = '<option value="">Select reservation...</option>' +
                reservationsData.map(r => `<option value="${r.id}">Res ID: ${r.id} (Room ID: ${r.id_room})</option>`).join('');
        } else {
            resSelect.innerHTML = '<option value="">No reservations found.</option>';
        }
    } catch (error) {
        console.error('Failed to load dependencies:', error);
    }
}

async function loadPayments() {
    const tbody = document.getElementById('payment-tbody');
    const messageDiv = document.getElementById('payment-message');

    try {
        const response = await fetchWithAuth('/room-payments');
        if (!response.ok) throw new Error('Failed to fetch payments');

        paymentsData = await response.json();
        renderTable();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error loading payments: ${error.message}</span>`;
        tbody.innerHTML = `<tr><td colspan="7">No data available.</td></tr>`;
    }
}

function renderTable() {
    const tbody = document.getElementById('payment-tbody');

    if (paymentsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No payments found.</td></tr>`;
        return;
    }

    tbody.innerHTML = paymentsData.map(payment => {
        const dueDate = payment.payment_due_date ? payment.payment_due_date.split('T')[0] : '-';
        const isFullyPaid = parseFloat(payment.amount_payed) >= parseFloat(payment.amount);
        const statusColor = isFullyPaid ? 'green' : 'red';
        const statusText = isFullyPaid ? 'Paid' : 'Pending';

        return `
            <tr>
                <td>${payment.id}</td>
                <td>
                    ID: ${payment.id_reservation}
                    <button class="info-btn" data-resid="${payment.id_reservation}" style="margin-left: 8px; cursor: pointer;">Details</button>
                </td>
                <td>${payment.amount}</td>
                <td>${dueDate}</td>
                <td>${payment.amount_payed}</td>
                <td style="color: ${statusColor}; font-weight: bold;">${statusText}</td>
                <td>
                    <button class="edit-btn" data-id="${payment.id}">Edit</button>
                    <button class="delete-btn" data-id="${payment.id}">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function showReservationDetails(resId) {
    const res = reservationsData.find(r => r.id === resId);
    const contentDiv = document.getElementById('res-details-content');

    if (!res) {
        contentDiv.innerHTML = '<p style="color: red;">Reservation data not found.</p>';
    } else {
        const room = roomsData.find(r => r.id === res.id_room);
        const roomDisplay = room ? `No. ${room.room_number} (Floor ${room.floor_number})` : `ID: ${res.id_room}`;

        const resident = residentsData.find(r => r.id === res.id_resident);
        const residentDisplay = resident ? `${resident.first_name} ${resident.last_name}` : `ID: ${res.id_resident}`;

        const start = res.start_date_reserv ? res.start_date_reserv.split('T')[0] : '-';
        const end = res.end_date_reserv ? res.end_date_reserv.split('T')[0] : '-';

        contentDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><strong>Resident:</strong><br>${residentDisplay}</div>
                <div><strong>Room:</strong><br>${roomDisplay}</div>
                <div><strong>Start Date:</strong><br>${start}</div>
                <div><strong>End Date:</strong><br>${end}</div>
            </div>
        `;
    }

    document.getElementById('res-details-container').classList.remove('hidden');
}

function showAddForm() {
    document.getElementById('form-title').innerText = 'Add New Payment';
    document.getElementById('payment-form').reset();
    document.getElementById('payment-id').value = '';
    document.getElementById('payment-reservation-id').disabled = false;
    document.getElementById('payment-amount-payed').value = '0.00';

    document.getElementById('payment-form-container').classList.remove('hidden');
    document.getElementById('res-details-container').classList.add('hidden');
}

function showEditForm(id) {
    const payment = paymentsData.find(p => p.id === id);
    if (!payment) return;

    document.getElementById('form-title').innerText = 'Edit Payment';
    document.getElementById('payment-id').value = payment.id;

    const resSelect = document.getElementById('payment-reservation-id');
    resSelect.value = payment.id_reservation;
    resSelect.disabled = true; // Preventing change of reservation ID on update

    document.getElementById('payment-amount').value = payment.amount;

    if (payment.payment_due_date) {
        document.getElementById('payment-due-date').value = payment.payment_due_date.split('T')[0];
    }

    document.getElementById('payment-amount-payed').value = payment.amount_payed;

    document.getElementById('payment-form-container').classList.remove('hidden');
    document.getElementById('res-details-container').classList.add('hidden');
}

function hideForm() {
    document.getElementById('payment-form-container').classList.add('hidden');
    document.getElementById('payment-form').reset();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('payment-message');
    const submitBtn = document.getElementById('save-payment-btn');

    const id = document.getElementById('payment-id').value;
    const isEditing = id !== '';

    const payload = {
        amount: parseFloat(document.getElementById('payment-amount').value),
        payment_due_date: document.getElementById('payment-due-date').value,
        amount_payed: parseFloat(document.getElementById('payment-amount-payed').value)
    };

    if (!isEditing) {
        payload.id_reservation = parseInt(document.getElementById('payment-reservation-id').value, 10);
    }

    submitBtn.disabled = true;

    try {
        if (isEditing) {
            const response = await fetchWithAuth(`/room-payments/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to update payment');
            messageDiv.innerHTML = `<span style="color: green;">Payment updated successfully.</span>`;
        } else {
            const response = await fetchWithAuth('/room-payments', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to create payment. Check if reservation already has a payment.');
            messageDiv.innerHTML = `<span style="color: green;">Payment created successfully.</span>`;
        }

        hideForm();
        await loadPayments();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    } finally {
        submitBtn.disabled = false;
    }
}

async function deletePayment(id) {
    if (!confirm('Are you sure you want to delete this payment record?')) return;

    const messageDiv = document.getElementById('payment-message');

    try {
        const response = await fetchWithAuth(`/room-payments/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete payment');

        messageDiv.innerHTML = `<span style="color: green;">Payment deleted successfully.</span>`;
        await loadPayments();
    } catch (error) {
        messageDiv.innerHTML = `<span style="color: red;">Error deleting payment: ${error.message}</span>`;
    }
}

export function destroy() {
    paymentsData = [];
    reservationsData = [];
    roomsData = [];
    residentsData = [];
}