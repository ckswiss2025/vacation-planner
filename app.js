let currentTrip = null;
let trips = {};
let currentPackingType = 'carrying';
let currentShoppingFilter = 'before';

const DEFAULT_PACKING_TEMPLATE = {
    'Documents': ['Passport', 'Travel insurance documents', 'Flight confirmations', 'Hotel confirmations', 'Driver\'s license', 'Credit cards & cash', 'Vaccination records', 'Car rental agreement', 'Copies of IDs'],
    'Clothing': ['Lightweight shirts/tank tops (5-6)', 'Shorts (3-4)', 'Sundresses (2-3)', 'Lightweight pants (1-2)', 'Underwear (7-10)', 'Socks (3-4 pairs)', 'Pajamas', 'Light sweater/cardigan', 'Casual shoes', 'Comfortable walking shoes', 'Flip flops/sandals', 'Lightweight jacket for flights', 'Beach cover-up', 'Maxi skirt or casual pants for dinners'],
    'Beach/Water': ['Swimsuits (2-3)', 'Beach bag', 'Water shoes', 'Goggles/snorkel gear', 'Rash guard or swim shirt', 'Beach towel (microfiber)', 'Waterproof phone case'],
    'Toiletries': ['Sunscreen (SPF 30+) - bring extra!', 'Toothbrush & toothpaste', 'Deodorant', 'Shampoo & conditioner', 'Body wash', 'Moisturizer', 'Lip balm with SPF', 'Feminine hygiene products', 'Hair brush/comb', 'Hair ties/headband', 'Nail clippers', 'Razor & shaving cream', 'Makeup & makeup remover', 'Face wash', 'Sunscreen lip balm', 'After-sun lotion/aloe', 'Insect repellent/bug spray'],
    'Medications': ['Prescription medications (in original containers)', 'Ibuprofen/pain relief', 'Antihistamines/allergy medication', 'Antacids', 'Hydrocortisone cream', 'Band-aids & gauze', 'First aid kit', 'Anti-diarrheal medication', 'Motion sickness medication', 'Thermometer'],
    'Electronics': ['Phone & charger', 'Portable charger/power bank', 'Camera', 'Headphones', 'Travel adapter (universal or type I for Hawaii)', 'USB-C cables', 'Charging cables for all devices', 'Laptop/tablet (if needed)'],
    'Kids - General': ['Extra clothing (2-3 outfits)', 'Comfortable shoes', 'Lightweight jacket/sweater', 'Hat/visor for sun protection', 'Sunglasses', 'Backpack for day trips', 'Favorite stuffed animal', 'Books/activity books (3-4)', 'Colored pencils/crayons & paper', 'Quiet toys for flights', 'Change of clothes in carry-on', 'Light rain jacket', 'Underwear & socks (7-10 pairs)'],
    'Kids - Infant': ['Diapers (bring extra! 100+ count)', 'Wipes (2-3 packs)', 'Diaper cream', 'Formula & bottles (enough for trip + extra)', 'Bottle sterilizer (if needed)', 'Baby food & feeding spoon', 'Bibs (5-6)', 'Multiple outfit changes (8-10)', 'Lightweight sleep sack', 'White noise machine (portable)', 'Baby sunscreen SPF 50+', 'Infant pain reliever/fever reducer', 'Pacifiers (5-6 + extras)', 'Burp cloth', 'Onesies & bodysuits (8-10)', 'Socks (10+ pairs)', 'Lightweight blanket/swaddle', 'Nose frida/saline drops', 'Thermometer'],
    'Entertainment': ['Books/e-reader', 'Downloaded shows/movies on tablet', 'Headphones', 'Travel pillow', 'Eye mask', 'Compression socks', 'Bluetooth speaker (optional)', 'Crosswords/puzzle book'],
    'Other': ['Travel-sized laundry detergent', 'Wet wipes/hand sanitizer', 'Reusable water bottle', 'Ziplock bags (various sizes)', 'Phone charger cables', 'Travel insurance cards', 'Hotel address written down', 'Emergency contacts list', 'Prescription copies']
};

const DEFAULT_SHOPPING_TEMPLATE = {
    before: {
        'Groceries': ['Snacks for flights (nuts, granola bars)', 'Travel-size medications', 'Sunscreen (SPF 30+)', 'Insect repellent', 'Gum/mints for flights'],
        'Toiletries': ['Travel-size toiletries if needed', 'Extra toothpaste', 'Lip balm with SPF'],
        'Kids Items': ['New small toys/books for flight entertainment', 'Leis or Hawaiian treats to bring', 'Infant formula (if needed)', 'Specific baby snacks'],
        'Other': ['Film/camera battery', 'Travel adapters', 'Ziplock bags', 'Plastic bags for wet items']
    },
    during: {
        'Groceries': ['Water bottles (refill bottles you bring)', 'Snacks for beach days', 'Fresh fruit', 'Local treats & souvenirs', 'Coconut water'],
        'Sunscreen/Topicals': ['After-sun lotion/aloe gel', 'Lip balm', 'Face moisturizer', 'Bug spray if needed'],
        'Kids Items': ['Sand toys', 'Kids snacks (local)', 'Ice cream/treats', 'Fun beach activities']
    }
};

const DEFAULT_TASKS_TEMPLATE = {
    'Home Prep': [
        'Change bed sheets',
        'Clean out refrigerator - throw away perishables',
        'Take out trash & recycling',
        'Do laundry (wash all clothes)',
        'Water plants or arrange for someone to',
        'Lock all doors and windows',
        'Close garage door',
        'Empty dishwasher',
        'Clean kitchen counters',
        'Feed pet/arrange pet sitter'
    ],
    'Before Leaving': [
        'Set thermostat/HVAC to away mode (save energy)',
        'Set security system',
        'Cancel/pause mail delivery or arrange with neighbor',
        'Set mail hold with post office',
        'Notify trusted neighbor you\'re leaving',
        'Pack car/arrange transport to airport',
        'Review all packing lists (use this app!)',
        'Unplug electronics/appliances',
        'Close curtains/blinds',
        'Leave spare house key with trusted person',
        'Charge all devices before leaving'
    ],
    'Health/Safety': [
        'Refill all prescriptions (with extras)',
        'Check vaccination records for family members',
        'Make vet appointments if leaving pets',
        'Arrange pet care/dog walker if needed',
        'Inform emergency contact of trip dates',
        'Check weather forecast for destination',
        'Get travel insurance (optional but recommended)',
        'Make dentist appointment if needed (go before trip)'
    ],
    'Administrative': [
        'Confirm all reservations (flights, hotel, car)',
        'Check flight status 24 hours before',
        'Download boarding passes',
        'Review hotel check-in info & policies',
        'Notify credit card companies of travel dates',
        'Print or screenshot important confirmations',
        'Make restaurant reservations where needed',
        'Register with airline (TSA PreCheck if available)',
        'Check passport expiration dates',
        'Make copies of ID & keep separate',
        'Set up travel alerts on credit cards',
        'Plan ground transportation to/from airport'
    ],
    'Financial': [
        'Notify bank of travel dates',
        'Check credit card limits',
        'Have some local currency exchanged',
        'Check for bank ATMs at destination',
        'Review trip insurance options',
        'Set aside cash in safe location'
    ],
    'Clothing & Gear': [
        'Try on everything that will be packed',
        'Check weather forecast & pack accordingly',
        'Get haircut if desired',
        'Do laundry - ensure all clothes are clean',
        'Check shoes are broken in (especially for hiking)',
        'Get pedicure if desired (sandal weather!)'
    ]
};

const DEFAULT_ITINERARY_TEMPLATE = {
    places: [
        { name: 'Diamond Head', notes: 'Hiking trail, 30 minutes to summit, iconic view. Open 6am-6pm. $5 entrance. Stroller-friendly trail available.' },
        { name: 'Hanauma Bay', notes: 'Snorkeling, marine life, arrive early (parking fills up). Rental gear available. $25/person, free for HI residents.' },
        { name: 'Waikiki Beach', notes: 'Main beach, swimming, sunbathing. Lifeguards on duty. Surfing lessons available. Busy on weekends.' },
        { name: 'Pearl Harbor', notes: 'Historic WWII site. Book tickets online in advance (free). Allow 3-4 hours. Not stroller-friendly for USS Arizona.' },
        { name: 'Volcanoes National Park', notes: 'Crater views, hiking trails. 2-hour drive from Honolulu. Entrance $30/car. Bring water & snacks.' },
        { name: 'Mauna Kea', notes: 'Stargazing, sunset views. High altitude (13,796 ft). Rental car/tour recommended. Tour companies offer trips.' },
        { name: 'Honolulu International Market', notes: 'Local market with fresh produce, souvenirs, local foods. Open daily. Great for snacks & gifts.' },
        { name: 'Lanikai Beach', notes: 'Less crowded than Waikiki, twin mountains view. Best for families. 30 min drive from Waikiki.' },
        { name: 'Manoa Falls Trail', notes: 'Easy hiking trail, 1.6 miles round trip. Rainforest hike with waterfall. Muddy - wear proper shoes.' },
        { name: 'KCC Farmers Market', notes: 'Saturday farmers market with local food vendors. 7:30am-11am. Great for breakfast & local goods.' },
        { name: 'Dole Plantation', notes: 'Pineapple plantation tour. Fun for kids. Gift shop & restaurant. 45 min from Honolulu.' },
        { name: 'Sea Life Park', notes: 'Aquarium & marine life park. Great for kids. Dolphin encounters available. Pre-book online for discounts.' }
    ],
    restaurants: [
        { name: 'Duke\'s Waikiki', notes: 'Casual seafood, oceanfront, sunset views. Reservation recommended for dinner. Known for kalua pork & fish.' },
        { name: 'Alan Wong\'s', notes: 'Fine dining, Hawaiian cuisine. Reservations required. Upscale casual. Great for special occasions.' },
        { name: 'Toiro Sushi', notes: 'Fresh sushi, local favorite. Good for lunch. Not always reservations needed but can get busy.' },
        { name: 'Marukame Udon', notes: 'Casual udon noodles, affordable. Lines can get long (worth the wait!). Great for families.' },
        { name: 'Ramen Yoshimura', notes: 'Local ramen spot, popular with locals. Small place, can have lines. Excellent tonkotsu ramen.' },
        { name: 'Boots & Kimo\'s', notes: 'Breakfast/brunch, casual, locally-owned. Famous for pancakes & fresh acai bowls. Great for families.' },
        { name: 'Kailani Kailani Grill', notes: 'Local Hawaiian cuisine, family-friendly. Great views. Good for casual lunch or dinner.' },
        { name: 'The Cheesecake Factory', notes: 'Large portions, great desserts. Good for families. Casual atmosphere. Popular with tourists.' },
        { name: 'Hank\'s Cafe', notes: 'Local-style plate lunch. Affordable, authentic Hawaiian food. Good for lunch.' },
        { name: 'Shave Ice at Matsumoto\'s', notes: 'Famous shave ice on North Shore. Small shop, always a line. Worth the drive (1 hour).' }
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
        notes: '',
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

    document.getElementById('tripNotes').value = currentTrip.notes || '';
    renderPackingLists();
    renderShoppingLists();
    renderTasksList();
    renderItinerary();
    renderOtherReservations();
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
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete btn-small';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => { items.splice(idx, 1); updateLastSaved(); renderPackingLists(); });
            itemEl.appendChild(checkbox);
            itemEl.appendChild(text);
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

function saveNotes() {
    if (currentTrip) {
        currentTrip.notes = document.getElementById('tripNotes').value;
        updateLastSaved();
        alert('Notes saved!');
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
