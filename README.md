# ✈️ Vacation Planner

A comprehensive, collaborative web-based vacation planning tool for families. Track packing lists, shopping lists, pre-travel tasks, itineraries, and all your trip details in one place.

## Features

### 📋 Trip Details
- **Flight Information**: Outbound and return flights with confirmation codes
- **Accommodations**: Hotel/property details, address, and check-in information
- **Transportation**: Pickup/dropoff and car rental information
- **Other Reservations**: Track dining reservations, tours, activities, and confirmation codes
- **Trip Duration**: Auto-calculated from start and end dates

### 🎒 Packing Lists
- **Pre-populated templates** based on Hawaii travel best practices
- **Categories**: Clothing, Toiletries, Electronics, Documents, Beach/Water, Kids items, Medications, Entertainment, and more
- **Carry-on vs Checked**: Toggle between what you're carrying on and what you're checking
- **Progress tracking**: See completed items at a glance with percentage counters
- **Item notes**: Add details like colors, sizes, or reminders
- **Easy customization**: Delete pre-populated items and add your own

### 🛒 Shopping Lists
- **Before Trip**: Buy items before you leave
- **During Trip**: Buy items once you arrive
- **Categories**: Groceries, Sunscreen/Topicals, Medications, Kids Items, Activities, and more
- **Checkboxes**: Track what you've already purchased
- **Flexible organization**: Add items to either list at any time

### ✅ Pre-Travel Tasks
- **Pre-populated categories**:
  - Home Prep: Change sheets, clean fridge, water plants, etc.
  - Before Leaving: Thermostat, security, mail hold, etc.
  - Health/Safety: Prescriptions, vet appointments, etc.
  - Administrative: Confirm reservations, download boarding passes, etc.
- **Progress tracking**: See what's done and what's left
- **Custom categories**: Add your own task categories as needed

### 🗺️ Itinerary & Activities
- **Places to Visit**: Pre-populated Hawaii attractions (Diamond Head, Hanauma Bay, Pearl Harbor, etc.)
- **Restaurants & Dining**: Restaurant recommendations with notes
- **Daily Schedule**: Plan out your days with specific times and events
- **Progress tracking**: Check off activities as you do them

### 📝 Notes & History
- **Trip Notes**: Keep notes about what worked, what didn't, and what to improve
- **Historical Trips**: View and review past vacations
- **Template Reuse**: Use past trips as templates for future vacations
- **Archive System**: Keep historical data without cluttering current trips

## Getting Started

### Access the Planner
The vacation planner is a web app stored entirely in your GitHub repository:

1. Go to your repository settings
2. Enable GitHub Pages (source: main branch)
3. Access your planner at: `https://ckswiss2025.github.io/vacation-planner`

### Creating Your First Trip

1. Click **"+ New Trip"** in the header
2. Enter:
   - Trip name (e.g., "Hawaii 2026")
   - Start date
   - End date
3. Click **"Create"**

The trip will be pre-populated with:
- Default packing list for a family trip
- Hawaii-specific attractions and restaurants
- Common pre-travel tasks
- Shopping list templates

### Using the Planner

#### Trip Details Tab
- Fill in your destination, travelers, and trip dates
- Add flight information and confirmation codes
- Store accommodation and transportation details
- Track all reservations and confirmations in one place

#### Packing Tab
- View pre-populated packing lists
- Toggle between **Carry-On** and **Checked Luggage**
- Check off items as you pack
- Add custom items using the form at the bottom
- Delete items you don't need
- Add notes to items for reference

#### Shopping Tab
- Shop before your trip (general supplies, medications, etc.)
- Shop during your trip (local items, forgotten supplies)
- Track purchases with checkboxes
- Organize by category

#### Tasks Tab
- Complete all pre-travel preparation tasks
- Categories help organize: Home, Before Leaving, Health, Admin
- Check off tasks as you complete them

#### Itinerary Tab
- Review attractions and activities for your destination
- Add restaurants you want to visit
- Create a day-by-day schedule
- Check off items as you experience them

#### Notes Tab
- Write detailed notes about your trip experience
- Document what worked well and what to improve
- View historical trips and their notes
- Duplicate past trips as templates for future vacations

## How Collaboration Works

### For Couples/Family Access

Since this is a web app with local storage, both you and your husband can access it in two ways:

**Method 1: Share via GitHub Pages (Recommended)**
- Both access the same GitHub Pages URL
- Note: Each person has their own browser storage, so you'll need to manually sync updates
- Workaround: Use Import/Export to share trip data

**Method 2: Direct Git Collaboration**
- One person makes changes and exports the trip as JSON
- The other person imports the JSON file
- Changes sync through GitHub (you can use the Import/Export feature)

**Method 3: Manual Sync via Export/Import**
1. Person A works on the trip and clicks "Export" in Import/Export modal
2. Person A shares the JSON file (email, Messages, etc.)
3. Person B imports the JSON file
4. When done, Person B exports and sends back to Person A

### Real-time Sync Tips
- Click **"💾 Save All"** frequently - data is stored in browser local storage
- Export your trip periodically as backup
- The "Last Saved" timestamp shows when data was last updated

## Data Storage & Backup

### Local Storage
- Your data is stored in your browser's local storage
- Data persists across sessions
- Data is private to your device

### Backup & Sharing
- **Export**: Download trip as JSON file (perfect for backup)
- **Import**: Upload previously exported trip files
- **Duplicate**: Create a copy of a trip (great for future vacations)
- **Archive**: Historical trips are kept separate for reference

### GitHub Backup (Optional)
To backup your data to GitHub:
1. Export your trip as JSON
2. Create a new file in your repo with the JSON content
3. Or commit the browser data manually

## Customization

### Adding Pre-populated Items
Edit `app.js` and modify:
- `DEFAULT_PACKING_TEMPLATE`: Add/remove packing items
- `DEFAULT_SHOPPING_TEMPLATE`: Modify shopping lists
- `DEFAULT_TASKS_TEMPLATE`: Adjust pre-travel tasks
- `DEFAULT_ITINERARY_TEMPLATE`: Change attractions/restaurants

### Changing Colors
Edit the CSS color variables in `styles.css`:
```css
:root {
    --primary: #0066cc;      /* Main brand color */
    --secondary: #6c757d;    /* Muted text */
    --success: #28a745;      /* Checkmarks */
    --danger: #dc3545;       /* Delete buttons */
    --warning: #ffc107;      /* Warnings */
}
```

### Modifying Categories
You can:
- Add new packing categories (edit dropdown in HTML)
- Create new task categories on-the-fly (click "Add Category")
- Customize shopping categories
- Edit the trip details sections

## Tips & Best Practices

### Before Your Trip
1. ✅ Complete all pre-travel tasks
2. ✅ Pack and check off items
3. ✅ Get shopping done (before trip items)
4. ✅ Confirm all reservations
5. ✅ Add important notes to reservation items

### During Your Trip
1. 📝 Check off activities as you do them
2. 🛒 Track what you buy with shopping list
3. 📍 Add spontaneous activities to itinerary
4. 💭 Make notes about experiences

### After Your Trip
1. 📝 Update notes with what worked/didn't
2. ✅ Mark items you need for next trip
3. 🔄 Archive the trip
4. 📋 Use it as a template for future trips

## Technical Details

### Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile friendly (responsive design)
- Offline capable (data syncs when back online)

### Data Format
Trips are stored as JSON in browser local storage:
```json
{
  "id": "trip_1234567890",
  "name": "Hawaii 2026",
  "startDate": "2026-06-01",
  "endDate": "2026-06-21",
  "createdAt": "2025-05-27T...",
  "details": {
    "destination": "Hawaii",
    "travelers": "2 adults, 1 child, 1 infant",
    ...
  },
  "packing": {
    "carrying": {...},
    "checked": {...}
  },
  "shopping": {
    "before": {...},
    "during": {...}
  },
  "tasks": {...},
  "itinerary": {...},
  "notes": "",
  "archived": false
}
```

## Troubleshooting

### Data Lost?
- Check if you're in a private/incognito browser window (data is separate)
- Try exporting/importing to see if data is still in files
- Check browser local storage in Developer Tools

### Can't Access GitHub Pages?
1. Go to repository Settings
2. Scroll to GitHub Pages section
3. Ensure Source is set to "main branch"
4. Wait a few minutes for it to deploy

### Export Not Working?
- Make sure you have a trip selected
- Check browser console for errors
- Try a different browser

## Feature Requests & Contributions

Feel free to:
- Open GitHub issues for feature requests
- Submit pull requests with improvements
- Share templates and suggestions
- Report bugs

## License

This project is open source and available in your personal GitHub repository.

---

**Happy vacation planning! 🌴✈️🏖️**
