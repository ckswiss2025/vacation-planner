let currentTrip = null;
let trips = {};
let currentPackingType = 'carrying';
let currentShoppingFilter = 'before';
let itemToMove = null;

const DEFAULT_PACKING_TEMPLATE = {
    'Documents': ['Passport', 'Travel insurance documents', 'Flight confirmations', 'Hotel confirmations', 'Driver\'s license', 'Credit cards & cash', 'Vaccination records'],
    'Clothing': ['Lightweight shirts/tank tops', 'Shorts', 'Sundresses', 'Lightweight pants', 'Underwear', 'Socks', 'Pajamas', 'Light sweater/cardigan', 'Casual shoes', 'Comfortable walking shoes', 'Flip flops/sandals', 'Lightweight jacket for flights'],
    'Beach/Water': ['Swimsuits (multiple)', 'Beach cover-up', 'Beach bag', 'Water shoes', 'Goggles/snorkel gear'],
    'Toiletries': ['Sunscreen (SPF 30+)', 'Toothbrush & toothpaste', 'Deodorant', 'Shampoo & conditioner', 'Body wash', 'Moisturizer', 'Lip balm with SPF', 'Feminine hygiene products', 'Hair brush', 'Hair ties', 'Nail clippers'],
    'Medications': ['Prescription medications', 'Ibuprofen/pain relief', 'Antihistamines', 'Antacids', 'Hydrocortisone cream', 'Band-aids', 'First aid kit'],
    'Electronics': ['Phone & charger', 'Laptop/tablet (if needed)', 'Camera', 'Portable charger', 'Headphones', 'Travel adapter', 'USB-C cables'],
    'Kids - General': ['Extra clothing', 'Comfortable shoes', 'Lightweight jacket', 'Hat/visor', 'Backpack for day trips', 'Sunglasses', 'Favorite stuffed animal', 'Books/coloring books', 'Colored pencils/crayons'],
    'Kids - Infant': ['Diapers (bring extra)', 'Wipes', 'Diaper cream', 'Formula & bottles', 'Sterilizer (if needed)', 'Baby food & spoon', 'Bibs', 'Multiple outfit changes', 'Lightweight sleep sack', 'White noise machine (portable)', 'Baby sunscreen', 'Infant pain reliever', 'Pacifiers'],
    'Entertainment': ['Books/e-reader', 'Downloaded shows/movies', 'Headphones', 'Travel pillow', 'Eye mask', 'Compression socks'],
    'Other': ['Travel-sized laundry detergent', 'Wet wipes/hand sanitizer', 'Underwear/socks', 'Reusable water bottle', 'Sunglasses']
};

const DEFAULT_SHOPPING_TEMPLATE = {
    before: {
        'Groceries': ['Snacks for flights', 'Medications', 'Sunscreen', 'Insect repellent'],
        'Kids Items': ['New toys/books for flight', 'Leis or Hawaiian treats to bring', 'Infant formula/food'],
        'Other': ['Film/camera battery', 'Travel adapters']
    },
    during: {
        'Groceries': ['Water bottles', 'Snacks', 'Fresh fruit', 'Local treats'],
        'Sunscreen/Topicals': ['After-sun lotion', 'Lip balm'],
        'Kids Items': ['Sand toys', 'Kids snacks']
    }
};

const DEFAULT_TASKS_TEMPLATE = {
    'Home Prep': ['Change bed sheets', 'Clean out refrigerator', 'Take out trash', 'Do laundry', 'Water plants', 'Lock all doors and windows'],
    'Before Leaving': ['Set thermostat/HVAC to away mode', 'Set security system', 'Cancel/pause deliveries', 'Set mail hold', 'Notify neighbors', 'Pack car/arrange transport', 'Review packing lists'],
    'Health/Safety': ['Refill prescriptions', 'Check vaccination records', 'Make vet appointments if needed', 'Arrange pet care', 'Inform emergency contact'],
    'Administrative': ['Confirm all reservations', 'Check flight status', 'Download boarding passes', 'Review hotel check-in info', 'Notify credit card companies of travel', 'Print important documents']
};

const DEFAULT_ITINERARY_TEMPLATE = {
    places: [
        { name: 'Diamond Head', notes: 'Hiking trail, 30 minutes, iconic view' },
        { name: 'Hanauma Bay', notes: 'Snorkeling, marine life, arrive early' },
        { name: 'Waikiki Beach', notes: 'Main beach, swimming, sunbathing' },
        { name: 'Pearl Harbor', notes: 'Historic site, book ahead' },
        { name: 'Volcanoes National Park', notes: 'Crater views, hiking trails' },
        { name: 'Mauna Kea', notes: 'Stargazing, sunset views' },
        { name: 'Local Markets', notes: 'KCC Farmers Market, Honolulu International Market' },
        { name: 'Lanikai Beach', notes: 'Less crowded, twin mountains view' }
    ],
    restaurants: [
        { name: 'Duke\'s Waikiki', notes: 'Casual seafood, oceanfront' },
        { name: 'Alan Wong\'s', notes: 'Fine dining, Hawaiian cuisine' },
        { name: 'Toiro Sushi', notes: 'Fresh sushi, local favorite' },
        { name: 'Marukame Udon', notes: 'Casual udon noodles' },
        { name: 'Ramen Yoshimura', notes: 'Local ramen spot' },
        { name: 'Boots & Kimo\'s', notes: 'Breakfast/brunch' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    loadTripsFromStorage();
    setupEventListeners();
    renderTripSelector();
});

function setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });

    document.querySelectorAll('.shopping-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentShoppingFilter = e.target.dataset.shopping;
            renderShoppingLists();
            e.target.parentElement.querySelectorAll('.shopping-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    document.getElementById('tripSelector').addEventListener('change', (e) => {
        if (e.target.value) loadTrip(e.target.value);
    });

    document.getElementById('newTripBtn').addEventListener('click', () => openModal('newTripModal'));
    document.getElementById('importBtn').addEventListener('click', () => openModal('importModal'));
    document.getElementById('newTripForm').addEventListener('submit', (e) => {
        e.preventDefault();
        createNewTrip();
    });

    document.getElementById('exportBtn').addEventListener('click', exportCurrentTrip);
    document.getElementById('importFileBtn').addEventListener('click', importTrip);
    document.getElementById('duplicateBtn').addEventListener('click', duplicateCurrentTrip);
    document.getElementById('saveBtn').addEventListener('click', saveAllData);

    document.getElementById('destination').addEventListener('change', () => {
        if (currentTrip) { currentTrip.details.destination = document.getElementById('destination').value; updateLastSaved(); }
    });

    document.getElementById('travelers').addEventListener('change', () => {
        if (currentTrip) { currentTrip.details.travelers = document.getElementById('travelers').value; updateLastSaved(); }
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    if (tabName === 'packing') renderPackingLists();
    if (tabName === 'shopping') renderShoppingLists();
    if (tabName === 'tasks') renderTasksList();
    if (tabName === 'itinerary') renderItinerary();
    if (tabName === 'notes') renderNotesHistory();
}

function createNewTrip() {
    const name = document.getElementById('tripName').value;
    const startDate = document.getElementById('tripStartDate').value;
    const endDate = document.getElementById('tripEndDate').value;
    const tripId = `trip_${Date.now()}`;
    
    const newTrip = {
        id: tripId,
        name: name,
        startDate: startDate,
        endDate: endDate,
        createdAt: new Date().toISOString(),
        details: {
            destination: '',
            travelers: '',
            outbound_flight: '',
            outbound_confirm: '',
            return_flight: '',
            return_confirm: '',
            accommodation: '',
            accommodation_address: '',
            accommodation_confirm: '',
            accommodation_dates: '',
            ground_transport: '',
            car_rental: '',
            other_reservations: []
        },
        packing: { carrying: {}, checked: {} },
        shopping: { before: {}, during: {} },
        tasks: {},
        itinerary: { places: [], restaurants: [], schedule: [] },
        notes: [],
        archived: false
    };

    Object.keys(DEFAULT_PACKING_TEMPLATE).forEach(category => {
        newTrip.packing.carrying[category] = DEFAULT_PACKING_TEMPLATE[category].map(item => ({ text: item, checked: false, notes: '' }));
        newTrip.packing.checked[category] = [];
    });

    Object.keys(DEFAULT_SHOPPING_TEMPLATE.before).forEach(category => {
        newTrip.shopping.before[category] = DEFAULT_SHOPPING_TEMPLATE.before[category].map(item => ({ text: item, checked: false, notes: '' }));
    });

    Object.keys(DEFAULT_SHOPPING_TEMPLATE.during).forEach(category => {
        newTrip.shopping.during[category] = DEFAULT_SHOPPING_TEMPLATE.during[category].map(item => ({ text: item, checked: false, notes: '' }));
    });

    Object.keys(DEFAULT_TASKS_TEMPLATE).forEach(category => {
        newTrip.tasks[category] = DEFAULT_TASKS_TEMPLATE[category].map(task => ({ text: task, checked: false, notes: '' }));
    });

    newTrip.itinerary.places = DEFAULT_ITINERARY_TEMPLATE.places.map(p => ({ ...p, checked: false }));
    newTrip.itinerary.restaurants = DEFAULT_ITINERARY_TEMPLATE.restaurants.map(r => ({ ...r, checked: false }));

    trips[tripId] = newTrip;
    saveTripsToStorage();
    closeModal('newTripModal');
    renderTripSelector();
    loadTrip(tripId);
    document.getElementById('newTripForm').reset();
}

function loadTrip(tripId) {
    currentTrip = trips[tripId];
    currentPackingType = 'carrying';
    currentShoppingFilter = 'before';

    document.getElementById('destination').value = currentTrip.details.destination || '';
    document.getElementById('travelers').value = currentTrip.details.travelers || '';
    document.getElementById('outboundFlight').value = currentTrip.details.outbound_flight || '';
    document.getElementById('outboundConfirm').value = currentTrip.details.outbound_confirm || '';
    document.getElementById('returnFlight').value = currentTrip.details.return_flight || '';
    document.getElementById('returnConfirm').value = currentTrip.details.return_confirm || '';
    document.getElementById('accommodation').value = currentTrip.details.accommodation || '';
    document.getElementById('accommodationAddress').value = currentTrip.details.accommodation_address || '';
    document.getElementById('accommodationConfirm').value = currentTrip.details.accommodation_confirm || '';
    document.getElementById('accommodationDates').value = currentTrip.details.accommodation_dates || '';
    document.getElementById('groundTransport').value = currentTrip.details.ground_transport || '';
    document.getElementById('carRental').value = currentTrip.details.car_rental || '';

    const start = new Date(currentTrip.startDate);
    const end = new Date(currentTrip.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    document.getElementById('duration').value = `${days} days`;

    document.getElementById('tripNotes').value = '';
    renderPackingLists();
    renderShoppingLists();
    renderTasksList();
    renderItinerary();
    renderOtherReservations();
    renderNotesHistory();
    switchTab('trip-details');
    updateLastSaved();
}

function renderTripSelector() {
    const selector = document.getElementById('tripSelector');
    selector.innerHTML = '<option value="">Select a Trip...</option>';
    const sortedTrips = Object.values(trips).filter(t => !t.archived).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    sortedTrips.forEach(trip => {
        const option = document.createElement('option');
        option.value = trip.id;
        const startDate = new Date(trip.startDate).toLocaleDateString();
        option.textContent = `${trip.name} (${startDate})`;
        selector.appendChild(option);
    });
}

function renderPackingLists() {
    if (!currentTrip) return;
    const container = document.getElementById('packingListsContainer');
    container.innerHTML = '';
    const packingData = currentTrip.packing[currentPackingType];
    const categories = Object.keys(packingData).sort();
    categories.forEach(category => {
        const section = document.createElement('div');
        section.className = 'category-section';
        const items = packingData[category];
        const checkedCount = items.filter(i => i.checked).length;
        const header = document.createElement('h3');
        header.innerHTML = `${category} <span style="font-weight: normal; color: var(--secondary);">(${checkedCount}/${items.length})</span>`;
        section.appendChild(header);
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'category-items';
        items.forEach((item, idx) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'list-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.checked;
            checkbox.addEventListener('change', () => { item.checked = checkbox.checked; updateLastSaved(); renderPackingLists(); });
            const text = document.createElement('span');
            text.className = 'item-text';
            text.textContent = item.text;
            const moveBtn = document.createElement('button');
            moveBtn.className = 'btn-action btn-small';
            moveBtn.textContent = '🛒 Move to Shopping';
            moveBtn.addEventListener('click', () => { itemToMove = { item, category, type: currentPackingType }; openModal('moveToShoppingModal'); });
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete btn-small';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => { items.splice(idx, 1); updateLastSaved(); renderPackingLists(); });
            itemEl.appendChild(checkbox);
            itemEl.appendChild(text);
            itemEl.appendChild(moveBtn);
            itemEl.appendChild(deleteBtn);
            itemsContainer.appendChild(itemEl);
        });
        section.appendChild(itemsContainer);
        container.appendChild(section);
    });
}

function togglePackingType() {
    currentPackingType = currentPackingType === 'carrying' ? 'checked' : 'carrying';
    renderPackingLists();
}

function addPackingItem() {
    if (!currentTrip) return;
    const itemText = document.getElementById('newPackingItem').value.trim();
    const category = document.getElementById('packingCategory').value;
    if (!itemText) return;
    if (!currentTrip.packing[currentPackingType][category]) {
        currentTrip.packing[currentPackingType][category] = [];
    }
    currentTrip.packing[currentPackingType][category].push({ text: itemText, checked: false, notes: '' });
    document.getElementById('newPackingItem').value = '';
    updateLastSaved();
    renderPackingLists();
}

function confirmMoveToShopping(timing) {
    if (!itemToMove) return;
    const { item, category } = itemToMove;
    const shoppingCategory = category.replace(' - Infant', '').replace(' - General', '');
    
    if (!currentTrip.shopping[timing][shoppingCategory]) {
        currentTrip.shopping[timing][shoppingCategory] = [];
    }
    
    currentTrip.shopping[timing][shoppingCategory].push({ ...item });
    
    const packingData = currentTrip.packing[itemToMove.type];
    const itemIndex = packingData[category].indexOf(item);
    if (itemIndex > -1) {
        packingData[category].splice(itemIndex, 1);
    }
    
    itemToMove = null;
    closeModal('moveToShoppingModal');
    updateLastSaved();
    renderPackingLists();
    renderShoppingLists();
    alert('Item moved to shopping list!');
}

function renderShoppingLists() {
    if (!currentTrip) return;
    const container = document.getElementById('shoppingListsContainer');
    container.innerHTML = '';
    const shoppingData = currentTrip.shopping[currentShoppingFilter];
    const categories = Object.keys(shoppingData).sort();
    categories.forEach(category => {
        const section = document.createElement('div');
        section.className = 'category-section';
        const items = shoppingData[category];
        const checkedCount = items.filter(i => i.checked).length;
        const header = document.createElement('h3');
        header.innerHTML = `${category} <span style="font-weight: normal; color: var(--secondary);">(${checkedCount}/${items.length})</span>`;
        section.appendChild(header);
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'category-items';
        items.forEach((item, idx) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'list-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.checked;
            checkbox.addEventListener('change', () => { item.checked = checkbox.checked; updateLastSaved(); renderShoppingLists(); });
            const text = document.createElement('span');
            text.className = 'item-text';
            text.textContent = item.text;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete btn-small';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => { items.splice(idx, 1); updateLastSaved(); renderShoppingLists(); });
            itemEl.appendChild(checkbox);
            itemEl.appendChild(text);
            itemEl.appendChild(deleteBtn);
            itemsContainer.appendChild(itemEl);
        });
        section.appendChild(itemsContainer);
        container.appendChild(section);
    });
}

function addShoppingItem() {
    if (!currentTrip) return;
    const itemText = document.getElementById('newShoppingItem').value.trim();
    const category = document.getElementById('shoppingCategory').value;
    const timing = document.getElementById('shoppingTiming').value;
    if (!itemText) return;
    if (!currentTrip.shopping[timing][category]) { currentTrip.shopping[timing][category] = []; }
    currentTrip.shopping[timing][category].push({ text: itemText, checked: false, notes: '' });
    document.getElementById('newShoppingItem').value = '';
    updateLastSaved();
    renderShoppingLists();
}

function renderTasksList() {
    if (!currentTrip) return;
    const container = document.getElementById('tasksContainer');
    container.innerHTML = '';
    const categories = Object.keys(currentTrip.tasks).sort();
    categories.forEach(category => {
        const section = document.createElement('div');
        section.className = 'category-section';
        const tasks = currentTrip.tasks[category];
        const checkedCount = tasks.filter(t => t.checked).length;
        const header = document.createElement('h3');
        header.innerHTML = `${category} <span style="font-weight: normal; color: var(--secondary);">(${checkedCount}/${tasks.length})</span>`;
        section.appendChild(header);
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'category-items';
        tasks.forEach((task, idx) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'list-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.checked;
            checkbox.addEventListener('change', () => { task.checked = checkbox.checked; updateLastSaved(); renderTasksList(); });
            const text = document.createElement('span');
            text.className = 'item-text';
            text.textContent = task.text;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete btn-small';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => { tasks.splice(idx, 1); updateLastSaved(); renderTasksList(); });
            itemEl.appendChild(checkbox);
            itemEl.appendChild(text);
            itemEl.appendChild(deleteBtn);
            itemsContainer.appendChild(itemEl);
        });
        section.appendChild(itemsContainer);
        container.appendChild(section);
    });
}

function addTask() {
    if (!currentTrip) return;
    const taskText = document.getElementById('newTask').value.trim();
    const category = document.getElementById('taskCategory').value;
    if (!taskText) return;
    if (!currentTrip.tasks[category]) { currentTrip.tasks[category] = []; }
    currentTrip.tasks[category].push({ text: taskText, checked: false, notes: '' });
    document.getElementById('newTask').value = '';
    updateLastSaved();
    renderTasksList();
}

function addTaskCategory() {
    const categoryName = prompt('Enter new task category name:');
    if (categoryName && currentTrip) {
        currentTrip.tasks[categoryName] = [];
        updateLastSaved();
        renderTasksList();
    }
}

function renderItinerary() {
    if (!currentTrip) return;
    const placesContainer = document.getElementById('placesToVisitList');
    placesContainer.innerHTML = '';
    currentTrip.itinerary.places.forEach((place, idx) => {
        const item = document.createElement('div');
        item.className = 'place-item';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = place.checked;
        checkbox.addEventListener('change', () => { place.checked = checkbox.checked; updateLastSaved(); });
        const info = document.createElement('div');
        info.className = 'place-info';
        info.innerHTML = `<div class="place-name">${place.name}</div><div class="place-notes">${place.notes}</div>`;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete btn-small';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => { currentTrip.itinerary.places.splice(idx, 1); updateLastSaved(); renderItinerary(); });
        item.appendChild(checkbox);
        item.appendChild(info);
        item.appendChild(deleteBtn);
        placesContainer.appendChild(item);
    });

    const restaurantsContainer = document.getElementById('restaurantsList');
    restaurantsContainer.innerHTML = '';
    currentTrip.itinerary.restaurants.forEach((restaurant, idx) => {
        const item = document.createElement('div');
        item.className = 'place-item';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = restaurant.checked;
        checkbox.addEventListener('change', () => { restaurant.checked = checkbox.checked; updateLastSaved(); });
        const info = document.createElement('div');
        info.className = 'place-info';
        info.innerHTML = `<div class="place-name">${restaurant.name}</div><div class="place-notes">${restaurant.notes}</div>`;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete btn-small';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => { currentTrip.itinerary.restaurants.splice(idx, 1); updateLastSaved(); renderItinerary(); });
        item.appendChild(checkbox);
        item.appendChild(info);
        item.appendChild(deleteBtn);
        restaurantsContainer.appendChild(item);
    });

    const scheduleContainer = document.getElementById('scheduleList');
    scheduleContainer.innerHTML = '';
    currentTrip.itinerary.schedule.forEach((event, idx) => {
        const item = document.createElement('div');
        item.className = 'schedule-item';
        const dateSpan = document.createElement('div');
        dateSpan.className = 'schedule-date';
        dateSpan.textContent = new Date(event.date).toLocaleDateString();
        const info = document.createElement('div');
        info.className = 'schedule-info';
        info.innerHTML = `<div class="schedule-event">${event.event}</div>`;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete btn-small';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => { currentTrip.itinerary.schedule.splice(idx, 1); updateLastSaved(); renderItinerary(); });
        item.appendChild(dateSpan);
        item.appendChild(info);
        item.appendChild(deleteBtn);
        scheduleContainer.appendChild(item);
    });
}

function addPlace() {
    if (!currentTrip) return;
    const placeName = document.getElementById('newPlace').value.trim();
    const placeNotes = document.getElementById('placeNotes').value.trim();
    if (!placeName) return;
    currentTrip.itinerary.places.push({ name: placeName, notes: placeNotes, checked: false });
    document.getElementById('newPlace').value = '';
    document.getElementById('placeNotes').value = '';
    updateLastSaved();
    renderItinerary();
}

function addRestaurant() {
    if (!currentTrip) return;
    const restaurantName = document.getElementById('newRestaurant').value.trim();
    const restaurantNotes = document.getElementById('restaurantNotes').value.trim();
    if (!restaurantName) return;
    currentTrip.itinerary.restaurants.push({ name: restaurantName, notes: restaurantNotes, checked: false });
    document.getElementById('newRestaurant').value = '';
    document.getElementById('restaurantNotes').value = '';
    updateLastSaved();
    renderItinerary();
}

function addScheduleEvent() {
    if (!currentTrip) return;
    const date = document.getElementById('scheduleDate').value;
    const event = document.getElementById('scheduleEvent').value.trim();
    if (!date || !event) return;
    currentTrip.itinerary.schedule.push({ date, event });
    document.getElementById('scheduleDate').value = '';
    document.getElementById('scheduleEvent').value = '';
    updateLastSaved();
    renderItinerary();
}

function renderOtherReservations() {
    if (!currentTrip) return;
    const container = document.getElementById('otherReservations');
    container.innerHTML = '';
    currentTrip.details.other_reservations.forEach((reservation, idx) => {
        const item = document.createElement('div');
        item.style.marginBottom = '1rem';
        item.innerHTML = `<div style="background: var(--light); padding: 1rem; border-radius: 4px; margin-bottom: 0.5rem;"><input type="text" value="${reservation.name}" placeholder="Reservation name" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid var(--border); border-radius: 4px;" onchange="currentTrip.details.other_reservations[${idx}].name = this.value; updateLastSaved();"><input type="text" value="${reservation.details}" placeholder="Details" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid var(--border); border-radius: 4px;" onchange="currentTrip.details.other_reservations[${idx}].details = this.value; updateLastSaved();"><input type="text" value="${reservation.confirmationCode || ''}" placeholder="Confirmation code" style="width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid var(--border); border-radius: 4px;" onchange="currentTrip.details.other_reservations[${idx}].confirmationCode = this.value; updateLastSaved();"><button class="btn btn-danger btn-small" onclick="currentTrip.details.other_reservations.splice(${idx}, 1); updateLastSaved(); renderOtherReservations();">Delete</button></div>`;
        container.appendChild(item);
    });
}

function addReservation() {
    if (!currentTrip) return;
    currentTrip.details.other_reservations.push({ name: '', details: '', confirmationCode: '' });
    updateLastSaved();
    renderOtherReservations();
}

function addNewNote() {
    if (!currentTrip) return;
    const noteText = document.getElementById('tripNotes').value.trim();
    if (!noteText) {
        alert('Please enter a note');
        return;
    }
    
    if (!currentTrip.notes) {
        currentTrip.notes = [];
    }
    
    const newNote = {
        id: `note_${Date.now()}`,
        text: noteText,
        timestamp: new Date().toISOString()
    };
    
    currentTrip.notes.unshift(newNote);
    document.getElementById('tripNotes').value = '';
    updateLastSaved();
    renderNotesHistory();
    alert('Note saved!');
}

function renderNotesHistory() {
    if (!currentTrip) return;
    const container = document.getElementById('notesHistoryContainer');
    container.innerHTML = '';
    
    if (!currentTrip.notes || currentTrip.notes.length === 0) {
        container.innerHTML = '<p class="empty-state">No notes yet. Add a note above!</p>';
        return;
    }
    
    currentTrip.notes.forEach((note, idx) => {
        const noteEl = document.createElement('div');
        noteEl.className = 'note-entry';
        
        const timestamp = new Date(note.timestamp);
        const dateStr = timestamp.toLocaleDateString();
        const timeStr = timestamp.toLocaleTimeString();
        
        noteEl.innerHTML = `
            <div class="note-header">
                <span class="note-timestamp">${dateStr} at ${timeStr}</span>
                <button class="btn-delete btn-small" onclick="deleteNote(${idx})">Delete</button>
            </div>
            <div class="note-content">${note.text}</div>
        `;
        
        container.appendChild(noteEl);
    });
}

function deleteNote(idx) {
    if (currentTrip && currentTrip.notes && confirm('Delete this note?')) {
        currentTrip.notes.splice(idx, 1);
        updateLastSaved();
        renderNotesHistory();
    }
}

function exportCurrentTrip() {
    if (!currentTrip) { alert('Please select a trip first'); return; }
    const dataStr = JSON.stringify(currentTrip, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentTrip.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    link.click();
}

function importTrip() {
    const file = document.getElementById('importFile').files[0];
    if (!file) { alert('Please select a file'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedTrip = JSON.parse(e.target.result);
            const newTripId = `trip_${Date.now()}`;
            importedTrip.id = newTripId;
            importedTrip.createdAt = new Date().toISOString();
            trips[newTripId] = importedTrip;
            saveTripsToStorage();
            renderTripSelector();
            loadTrip(newTripId);
            closeModal('importModal');
            alert('Trip imported successfully!');
        } catch (error) {
            alert('Error importing trip: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function duplicateCurrentTrip() {
    if (!currentTrip) { alert('Please select a trip first'); return; }
    const newTripId = `trip_${Date.now()}`;
    trips[newTripId] = JSON.parse(JSON.stringify({ ...currentTrip, id: newTripId, createdAt: new Date().toISOString() }));
    saveTripsToStorage();
    renderTripSelector();
    loadTrip(newTripId);
    closeModal('importModal');
    alert('Trip duplicated!');
}

function saveAllData() {
    saveTripsToStorage();
    updateLastSaved();
    alert('All data saved!');
}

function updateLastSaved() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('lastSaved').textContent = timeString;
    saveTripsToStorage();
}

function saveTripsToStorage() {
    localStorage.setItem('vacationPlannerTrips', JSON.stringify(trips));
}

function loadTripsFromStorage() {
    const stored = localStorage.getItem('vacationPlannerTrips');
    if (stored) {
        trips = JSON.parse(stored);
    }
}

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

document.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal:not(.hidden)');
    modals.forEach(modal => {
        if (e.target === modal) { modal.classList.add('hidden'); }
    });
});
