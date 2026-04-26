import { fetchWithAuth } from '../api.js';

let equipmentData = [];
let roomsData = [];
let currentRoomEquipmentData = [];
let selectedRoomId = null;

export async function render(container) {
    container.innerHTML = `
        <div style="margin-bottom: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>General Equipment Inventory</h2>
                <button id="add-eq-btn">Add New Equipment</button>
            </div>
            <div id="eq-message" style="margin-bottom: 10px;"></div>
            <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Total Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="eq-tbody">
                    <tr><td colspan="5">Loading...</td></tr>
                </tbody>
            </table>

            <div id="eq-form-container" class="hidden" style="margin-top: 20px; border: 1px solid #ccc; padding: 20px; max-width: 400px; background-color: #fff;">
                <h3 id="eq-form-title">Add Equipment</h3>
                <form id="eq-form">
                    <input type="hidden" id="eq-id">
                    <div style="margin-bottom: 15px;">
                        <label>Equipment Name:</label><br>
                        <input type="text" id="eq-name" required style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>Description:</label><br>
                        <input type="text" id="eq-desc" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>Total Count:</label><br>
                        <input type="number" id="eq-count" required style="width: 100%;" min="0">
                    </div>
                    <button type="submit" id="save-eq-btn">Save</button>
                    <button type="button" id="cancel-eq-btn">Cancel</button>
                </form>
            </div>
        </div>

        <hr style="margin-bottom: 40px;">

        <div>
            <h2>Room Equipment Assignment</h2>
            
            <div style="margin-bottom: 20px;">
                <label><strong>Select Room: </strong></label>
                <select id="room-select" style="padding: 5px; min-width: 200px;">
                    <option value="">-- Choose a room --</option>
                </select>
            </div>

            <div id="room-eq-section" class="hidden">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0;">Equipment in Room</h3>
                    <button id="assign-eq-btn">Assign Equipment to Room</button>
                </div>
                
                <div id="room-eq-message" style="margin-bottom: 10px;"></div>
                
                <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th>Equipment Name</th>
                            <th>Count in Room</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="room-eq-tbody">
                        <tr><td colspan="3">Select a room to view equipment.</td></tr>
                    </tbody>
                </table>

                <div id="assign-form-container" class="hidden" style="margin-top: 20px; border: 1px solid #ccc; padding: 20px; max-width: 400px; background-color: #fff;">
                    <h3>Assign Equipment</h3>
                    <form id="assign-form">
                        <div style="margin-bottom: 15px;">
                            <label>Equipment:</label><br>
                            <select id="assign-eq-id" required style="width: 100%; padding: 5px;">
                                <option value="">Select equipment...</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label>Count:</label><br>
                            <input type="number" id="assign-count" required style="width: 100%;" min="1">
                        </div>
                        <button type="submit" id="save-assign-btn">Assign</button>
                        <button type="button" id="cancel-assign-btn">Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    attachEventListeners();
    await loadEquipment();
    await loadRooms();
}

function attachEventListeners() {
    // Inventory Listeners
    document.getElementById('add-eq-btn').addEventListener('click', showEqForm);
    document.getElementById('cancel-eq-btn').addEventListener('click', hideEqForm);
    document.getElementById('eq-form').addEventListener('submit', handleEqSubmit);

    document.getElementById('eq-tbody').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-eq-btn')) {
            showEditEqForm(parseInt(e.target.dataset.id, 10));
        } else if (e.target.classList.contains('delete-eq-btn')) {
            deleteEq(parseInt(e.target.dataset.id, 10));
        }
    });

    // Room Equipment Listeners
    document.getElementById('room-select').addEventListener('change', handleRoomSelection);
    document.getElementById('assign-eq-btn').addEventListener('click', showAssignForm);
    document.getElementById('cancel-assign-btn').addEventListener('click', hideAssignForm);
    document.getElementById('assign-form').addEventListener('submit', handleAssignSubmit);

    document.getElementById('room-eq-tbody').addEventListener('click', (e) => {
        if (e.target.classList.contains('update-assign-btn')) {
            updateAssignCount(parseInt(e.target.dataset.id, 10));
        } else if (e.target.classList.contains('delete-assign-btn')) {
            removeAssignment(parseInt(e.target.dataset.id, 10));
        }
    });
}

// ==========================================
// EQUIPMENT INVENTORY LOGIC
// ==========================================

async function loadEquipment() {
    const tbody = document.getElementById('eq-tbody');
    try {
        const response = await fetchWithAuth('/equipment');
        if (!response.ok) throw new Error('Failed to fetch equipment');
        equipmentData = await response.json();

        if (equipmentData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">No equipment found.</td></tr>`;
            return;
        }

        tbody.innerHTML = equipmentData.map(eq => `
            <tr>
                <td>${eq.id}</td>
                <td>${eq.equipment_name}</td>
                <td>${eq.description || '-'}</td>
                <td>${eq.count}</td>
                <td>
                    <button class="edit-eq-btn" data-id="${eq.id}">Edit</button>
                    <button class="delete-eq-btn" data-id="${eq.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="color:red;">Error: ${error.message}</td></tr>`;
    }
}

function showEqForm() {
    document.getElementById('eq-form-title').innerText = 'Add Equipment';
    document.getElementById('eq-form').reset();
    document.getElementById('eq-id').value = '';
    document.getElementById('eq-form-container').classList.remove('hidden');
}

function showEditEqForm(id) {
    const eq = equipmentData.find(e => e.id === id);
    if (!eq) return;

    document.getElementById('eq-form-title').innerText = 'Edit Equipment';
    document.getElementById('eq-id').value = eq.id;
    document.getElementById('eq-name').value = eq.equipment_name;
    document.getElementById('eq-desc').value = eq.description || '';
    document.getElementById('eq-count').value = eq.count;
    document.getElementById('eq-form-container').classList.remove('hidden');
}

function hideEqForm() {
    document.getElementById('eq-form-container').classList.add('hidden');
}

async function handleEqSubmit(e) {
    e.preventDefault();
    const msg = document.getElementById('eq-message');
    const id = document.getElementById('eq-id').value;

    const payload = {
        equipment_name: document.getElementById('eq-name').value.trim(),
        count: parseInt(document.getElementById('eq-count').value, 10)
    };

    const desc = document.getElementById('eq-desc').value.trim();
    if (desc) payload.description = desc;

    try {
        let response;
        if (id) {
            response = await fetchWithAuth(`/equipment/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        } else {
            response = await fetchWithAuth('/equipment', { method: 'POST', body: JSON.stringify(payload) });
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            let errorMsg = 'Failed to save equipment.';
            if (errorData && errorData.message) {
                errorMsg = Array.isArray(errorData.message) ? errorData.message.join('<br>') : errorData.message;
            }
            throw new Error(errorMsg);
        }

        hideEqForm();
        await loadEquipment();
        if (selectedRoomId) await loadRoomEquipment(selectedRoomId); // Refresh room equipment names if needed
        msg.innerHTML = `<span style="color: green;">Equipment saved.</span>`;
    } catch (error) {
        msg.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}

// ==========================================
// ROOM EQUIPMENT ASSIGNMENT LOGIC
// ==========================================

async function loadRooms() {
    const select = document.getElementById('room-select');
    try {
        const response = await fetchWithAuth('/rooms');
        if (!response.ok) throw new Error('Failed to fetch rooms');
        roomsData = await response.json();

        select.innerHTML = '<option value="">-- Choose a room --</option>' +
            roomsData.map(r => `<option value="${r.id}">Room ${r.room_number} (ID: ${r.id})</option>`).join('');
    } catch (error) {
        console.error('Error loading rooms for select:', error);
    }
}

async function handleRoomSelection(e) {
    selectedRoomId = e.target.value;
    const section = document.getElementById('room-eq-section');
    const tbody = document.getElementById('room-eq-tbody');
    const msg = document.getElementById('room-eq-message');

    hideAssignForm();
    msg.innerHTML = '';

    if (!selectedRoomId) {
        section.classList.add('hidden');
        return;
    }

    section.classList.remove('hidden');
    await loadRoomEquipment(selectedRoomId);
}

async function loadRoomEquipment(roomId) {
    const tbody = document.getElementById('room-eq-tbody');
    try {
        const response = await fetchWithAuth(`/room-equipment/room/${roomId}`);
        if (!response.ok) throw new Error('Failed to fetch assigned equipment');
        currentRoomEquipmentData = await response.json();

        if (currentRoomEquipmentData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3">No equipment assigned to this room yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = currentRoomEquipmentData.map(assignment => {
            // Find equipment name from the general inventory
            const eq = equipmentData.find(e => e.id === assignment.id_equipment);
            const eqName = eq ? eq.equipment_name : `Unknown (ID: ${assignment.id_equipment})`;

            return `
            <tr>
                <td>${eqName}</td>
                <td>${assignment.count}</td>
                <td>
                    <button class="update-assign-btn" data-id="${assignment.id_equipment}">Change Count</button>
                    <button class="delete-assign-btn" data-id="${assignment.id_equipment}">Remove</button>
                </td>
            </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="3" style="color:red;">Error: ${error.message}</td></tr>`;
    }
}

async function showAssignForm() {
    document.getElementById('assign-form').reset();
    await updateAssignSelect(); // Update select options right before showing form
    document.getElementById('assign-form-container').classList.remove('hidden');
}

function hideAssignForm() {
    document.getElementById('assign-form-container').classList.add('hidden');
}

async function handleAssignSubmit(e) {
    e.preventDefault();
    const msg = document.getElementById('room-eq-message');

    if (!selectedRoomId) return;

    const payload = {
        id_room: parseInt(selectedRoomId, 10),
        id_equipment: parseInt(document.getElementById('assign-eq-id').value, 10),
        count: parseInt(document.getElementById('assign-count').value, 10)
    };

    try {
        const response = await fetchWithAuth('/room-equipment', { method: 'POST', body: JSON.stringify(payload) });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            let errorMsg = 'Assignment rejected by server.';
            if (errorData && errorData.message) {
                errorMsg = Array.isArray(errorData.message) ? errorData.message.join('<br>') : errorData.message;
            }
            throw new Error(errorMsg);
        }

        hideAssignForm();
        await loadRoomEquipment(selectedRoomId);
        msg.innerHTML = `<span style="color: green;">Equipment assigned successfully.</span>`;
    } catch (error) {
        msg.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}

async function updateAssignSelect() {
    const select = document.getElementById('assign-eq-id');
    if (!select) return;

    select.innerHTML = '<option value="">Loading availability...</option>';

    try {
        // Fetch all assignments to calculate current availability
        const response = await fetchWithAuth('/room-equipment');
        let allAssignments = [];
        if (response.ok) {
            allAssignments = await response.json();
        }

        select.innerHTML = '<option value="">Select equipment...</option>' +
            equipmentData.map(eq => {
                // Sum assigned count for this specific equipment across all rooms
                const assignedCount = allAssignments
                    .filter(a => a.id_equipment === eq.id)
                    .reduce((sum, a) => sum + a.count, 0);

                const available = eq.count - assignedCount;

                // Disable option if there are no items left to assign
                const disabled = available <= 0 ? 'disabled' : '';

                return `<option value="${eq.id}" ${disabled}>${eq.equipment_name} (Avail: ${available} / Total: ${eq.count})</option>`;
            }).join('');
    } catch (error) {
        console.error('Failed to load assignments for select', error);
        select.innerHTML = '<option value="">Error loading data</option>';
    }
}

async function updateAssignCount(eqId) {
    const msg = document.getElementById('room-eq-message');
    const assignment = currentRoomEquipmentData.find(a => a.id_equipment === eqId);
    if (!assignment || !selectedRoomId) return;

    const newCountStr = prompt(`Enter new count for this equipment (Current: ${assignment.count}):`, assignment.count);
    if (newCountStr === null) return;

    const newCount = parseInt(newCountStr, 10);
    if (isNaN(newCount) || newCount <= 0) {
        alert("Invalid count. Must be a positive number.");
        return;
    }

    try {
        const response = await fetchWithAuth(`/room-equipment/room/${selectedRoomId}/equipment/${eqId}`, {
            method: 'PATCH',
            body: JSON.stringify({ count: newCount })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            let errorMsg = 'Failed to update count.';
            if (errorData && errorData.message) {
                errorMsg = Array.isArray(errorData.message) ? errorData.message.join('<br>') : errorData.message;
            }
            throw new Error(errorMsg);
        }

        await loadRoomEquipment(selectedRoomId);
        msg.innerHTML = `<span style="color: green;">Count updated.</span>`;
    } catch (error) {
        msg.innerHTML = `<span style="color: red;">Error updating count: ${error.message}</span>`;
    }
}

async function removeAssignment(eqId) {
    if (!selectedRoomId) return;
    if (!confirm('Are you sure you want to remove this equipment from the room?')) return;

    const msg = document.getElementById('room-eq-message');

    try {
        await fetchWithAuth(`/room-equipment/room/${selectedRoomId}/equipment/${eqId}`, { method: 'DELETE' });
        await loadRoomEquipment(selectedRoomId);
        msg.innerHTML = `<span style="color: green;">Equipment removed from room.</span>`;
    } catch (error) {
        msg.innerHTML = `<span style="color: red;">Error removing assignment: ${error.message}</span>`;
    }
}

export function destroy() {
    equipmentData = [];
    roomsData = [];
    currentRoomEquipmentData = [];
    selectedRoomId = null;
}