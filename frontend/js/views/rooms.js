import { fetchWithAuth } from '../api.js';
import { getUserRole } from '../auth.js';

let categoriesData = [];
let roomsData = [];

export async function render(container) {
    const userRole = getUserRole();
    const isAdmin = userRole === 'admin';

    container.innerHTML = `
        <div style="margin-bottom: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Room Categories</h2>
                ${isAdmin ? `<button id="add-category-btn">Add New Category</button>` : ''}
            </div>
            <div id="categories-message" style="margin-bottom: 10px;"></div>
            <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Monthly Rent</th>
                        <th>Kitchen</th>
                        ${isAdmin ? `<th>Actions</th>` : ''}
                    </tr>
                </thead>
                <tbody id="categories-tbody">
                    <tr><td colspan="${isAdmin ? 5 : 4}">Loading...</td></tr>
                </tbody>
            </table>

            <div id="category-form-container" class="hidden" style="margin-top: 20px; border: 1px solid #ccc; padding: 20px; max-width: 400px; background-color: #fff;">
                <h3 id="category-form-title">Add Category</h3>
                <form id="category-form">
                    <input type="hidden" id="category-id">
                    <div style="margin-bottom: 15px;">
                        <label>Category Name:</label><br>
                        <input type="text" id="category-name" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>Monthly Rent:</label><br>
                        <input type="number" step="0.01" id="category-rent" required style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>
                            <input type="checkbox" id="category-kitchen"> Has Kitchen
                        </label>
                    </div>
                    <button type="submit" id="save-category-btn">Save</button>
                    <button type="button" id="cancel-category-btn">Cancel</button>
                </form>
            </div>
        </div>

        <hr style="margin-bottom: 40px;">

        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2>Rooms</h2>
                <button id="add-room-btn">Add New Room</button>
            </div>
            <div id="rooms-message" style="margin-bottom: 10px;"></div>
            <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%; text-align: left;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th>ID</th>
                        <th>Room No.</th>
                        <th>Floor</th>
                        <th>Beds</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="rooms-tbody">
                    <tr><td colspan="6">Loading...</td></tr>
                </tbody>
            </table>

            <div id="room-form-container" class="hidden" style="margin-top: 20px; border: 1px solid #ccc; padding: 20px; max-width: 400px; background-color: #fff;">
                <h3 id="room-form-title">Add Room</h3>
                <form id="room-form">
                    <input type="hidden" id="room-id">
                    <div style="margin-bottom: 15px;">
                        <label>Room Number:</label><br>
                        <input type="number" id="room-number" required style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>Floor Number:</label><br>
                        <input type="number" id="room-floor" required style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>Number of Beds:</label><br>
                        <input type="number" id="room-beds" required style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label>Category:</label><br>
                        <select id="room-category-id" required style="width: 100%; padding: 5px;">
                            <option value="">Select category...</option>
                        </select>
                    </div>
                    <button type="submit" id="save-room-btn">Save</button>
                    <button type="button" id="cancel-room-btn">Cancel</button>
                </form>
            </div>
        </div>
    `;

    attachEventListeners(isAdmin);

    // Konieczne jest załadowanie kategorii przed pokojami, 
    // aby poprawnie wygenerować listę rozwijaną w formularzu pokojów i nazwy w tabeli.
    await loadCategories(isAdmin);
    await loadRooms();
}

function attachEventListeners(isAdmin) {
    if (isAdmin) {
        document.getElementById('add-category-btn').addEventListener('click', showCategoryForm);
        document.getElementById('cancel-category-btn').addEventListener('click', hideCategoryForm);
        document.getElementById('category-form').addEventListener('submit', handleCategorySubmit);

        document.getElementById('categories-tbody').addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-cat-btn')) {
                showEditCategoryForm(parseInt(e.target.dataset.id, 10));
            } else if (e.target.classList.contains('delete-cat-btn')) {
                deleteCategory(parseInt(e.target.dataset.id, 10));
            }
        });
    }

    document.getElementById('add-room-btn').addEventListener('click', showRoomForm);
    document.getElementById('cancel-room-btn').addEventListener('click', hideRoomForm);
    document.getElementById('room-form').addEventListener('submit', handleRoomSubmit);

    document.getElementById('rooms-tbody').addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-room-btn')) {
            showEditRoomForm(parseInt(e.target.dataset.id, 10));
        } else if (e.target.classList.contains('delete-room-btn')) {
            deleteRoom(parseInt(e.target.dataset.id, 10));
        }
    });
}

// ==========================================
// CATEGORIES LOGIC
// ==========================================

async function loadCategories(isAdmin) {
    const tbody = document.getElementById('categories-tbody');
    try {
        const response = await fetchWithAuth('/room-categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        categoriesData = await response.json();

        updateCategorySelect(); // Refresh select list in rooms form

        if (categoriesData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${isAdmin ? 5 : 4}">No categories found.</td></tr>`;
            return;
        }

        tbody.innerHTML = categoriesData.map(cat => `
            <tr>
                <td>${cat.id}</td>
                <td>${cat.category_name || '-'}</td>
                <td>${cat.monthly_rent}</td>
                <td>${cat.if_kitchen ? 'Yes' : 'No'}</td>
                ${isAdmin ? `
                <td>
                    <button class="edit-cat-btn" data-id="${cat.id}">Edit</button>
                    <button class="delete-cat-btn" data-id="${cat.id}">Delete</button>
                </td>` : ''}
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="${isAdmin ? 5 : 4}" style="color:red;">Error: ${error.message}</td></tr>`;
    }
}

function updateCategorySelect() {
    const select = document.getElementById('room-category-id');
    if (!select) return;

    select.innerHTML = '<option value="">Select category...</option>' +
        categoriesData.map(cat => `<option value="${cat.id}">${cat.category_name || `ID: ${cat.id}`} (${cat.monthly_rent})</option>`).join('');
}

function showCategoryForm() {
    document.getElementById('category-form-title').innerText = 'Add Category';
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
    document.getElementById('category-form-container').classList.remove('hidden');
}

function showEditCategoryForm(id) {
    const cat = categoriesData.find(c => c.id === id);
    if (!cat) return;

    document.getElementById('category-form-title').innerText = 'Edit Category';
    document.getElementById('category-id').value = cat.id;
    document.getElementById('category-name').value = cat.category_name || '';
    document.getElementById('category-rent').value = cat.monthly_rent;
    document.getElementById('category-kitchen').checked = cat.if_kitchen || false;
    document.getElementById('category-form-container').classList.remove('hidden');
}

function hideCategoryForm() {
    document.getElementById('category-form-container').classList.add('hidden');
}

async function handleCategorySubmit(e) {
    e.preventDefault();
    const msg = document.getElementById('categories-message');
    const id = document.getElementById('category-id').value;

    const payload = {
        monthly_rent: parseFloat(document.getElementById('category-rent').value),
        if_kitchen: document.getElementById('category-kitchen').checked
    };

    const nameVal = document.getElementById('category-name').value.trim();
    if (nameVal) payload.category_name = nameVal;

    try {
        if (id) {
            await fetchWithAuth(`/room-categories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        } else {
            await fetchWithAuth('/room-categories', { method: 'POST', body: JSON.stringify(payload) });
        }
        hideCategoryForm();
        await loadCategories(getUserRole() === 'admin');
        await loadRooms(); // Refresh rooms to update displayed category names
        msg.innerHTML = `<span style="color: green;">Category saved.</span>`;
    } catch (error) {
        msg.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}

async function deleteCategory(id) {
    if (!confirm('Are you sure? This might fail if rooms are using this category.')) return;
    try {
        await fetchWithAuth(`/room-categories/${id}`, { method: 'DELETE' });
        await loadCategories(getUserRole() === 'admin');
    } catch (error) {
        document.getElementById('categories-message').innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}

// ==========================================
// ROOMS LOGIC
// ==========================================

async function loadRooms() {
    const tbody = document.getElementById('rooms-tbody');
    try {
        const response = await fetchWithAuth('/rooms');
        if (!response.ok) throw new Error('Failed to fetch rooms');
        roomsData = await response.json();

        if (roomsData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">No rooms found.</td></tr>`;
            return;
        }

        tbody.innerHTML = roomsData.map(room => {
            const cat = categoriesData.find(c => c.id === room.id_category);
            const catDisplay = cat ? (cat.category_name || `ID: ${cat.id}`) : room.id_category;

            return `
            <tr>
                <td>${room.id}</td>
                <td>${room.room_number}</td>
                <td>${room.floor_number}</td>
                <td>${room.num_of_beds}</td>
                <td>${catDisplay}</td>
                <td>
                    <button class="edit-room-btn" data-id="${room.id}">Edit</button>
                    <button class="delete-room-btn" data-id="${room.id}">Delete</button>
                </td>
            </tr>
        `}).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" style="color:red;">Error: ${error.message}</td></tr>`;
    }
}

function showRoomForm() {
    document.getElementById('room-form-title').innerText = 'Add Room';
    document.getElementById('room-form').reset();
    document.getElementById('room-id').value = '';
    document.getElementById('room-form-container').classList.remove('hidden');
}

function showEditRoomForm(id) {
    const room = roomsData.find(r => r.id === id);
    if (!room) return;

    document.getElementById('room-form-title').innerText = 'Edit Room';
    document.getElementById('room-id').value = room.id;
    document.getElementById('room-number').value = room.room_number;
    document.getElementById('room-floor').value = room.floor_number;
    document.getElementById('room-beds').value = room.num_of_beds;
    document.getElementById('room-category-id').value = room.id_category;
    document.getElementById('room-form-container').classList.remove('hidden');
}

function hideRoomForm() {
    document.getElementById('room-form-container').classList.add('hidden');
}

async function handleRoomSubmit(e) {
    e.preventDefault();
    const msg = document.getElementById('rooms-message');
    const id = document.getElementById('room-id').value;

    const payload = {
        room_number: parseInt(document.getElementById('room-number').value, 10),
        floor_number: parseInt(document.getElementById('room-floor').value, 10),
        num_of_beds: parseInt(document.getElementById('room-beds').value, 10),
        id_category: parseInt(document.getElementById('room-category-id').value, 10)
    };

    try {
        if (id) {
            await fetchWithAuth(`/rooms/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        } else {
            await fetchWithAuth('/rooms', { method: 'POST', body: JSON.stringify(payload) });
        }
        hideRoomForm();
        await loadRooms();
        msg.innerHTML = `<span style="color: green;">Room saved.</span>`;
    } catch (error) {
        msg.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}

async function deleteRoom(id) {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
        await fetchWithAuth(`/rooms/${id}`, { method: 'DELETE' });
        await loadRooms();
    } catch (error) {
        document.getElementById('rooms-message').innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
}

export function destroy() {
    categoriesData = [];
    roomsData = [];
}