# Vacation Planner - Data Structure Reference

This document explains the data structure used by the Vacation Planner for developers and advanced users.

## Main Trip Object

```json
{
  "id": "trip_1234567890",
  "name": "Hawaii 2026",
  "startDate": "2026-06-01",
  "endDate": "2026-06-21",
  "createdAt": "2025-05-27T12:00:00Z",
  "archived": false,
  "details": {},
  "packing": {},
  "shopping": {},
  "tasks": {},
  "itinerary": {},
  "notes": ""
}
```

## Details Section

Stores all trip metadata and reservation information.

```json
"details": {
  "destination": "Hawaii",
  "travelers": "2 adults, 1 child (age 4), 1 infant (age 8 months)",
  "outbound_flight": "United Airlines UA 123, June 1, 8:00 AM",
  "outbound_confirm": "ABC123DEF",
  "return_flight": "United Airlines UA 456, June 21, 2:00 PM",
  "return_confirm": "GHI456JKL",
  "accommodation": "Hilton Hawaiian Village",
  "accommodation_address": "2005 Kalia Road, Honolulu, HI 96815",
  "accommodation_confirm": "MNO789PQR",
  "accommodation_dates": "June 1-21 (20 nights)",
  "ground_transport": "Avis Car Rental, Confirmation: STU012VWX",
  "car_rental": "Avis, June 1-21, Confirmation: YZA345BCD",
  "other_reservations": [
    {
      "name": "Duke's Waikiki Dinner",
      "details": "June 5 at 6:30 PM, 4 people",
      "confirmationCode": "EFG678HIJ"
    }
  ]
}
```

## Packing Section

Organized by carry-on vs checked luggage, then by category.

```json
"packing": {
  "carrying": {
    "Documents": [
      {
        "text": "Passport",
        "checked": false,
        "notes": "Blue passport for Chelsea"
      },
      {
        "text": "Travel insurance documents",
        "checked": true,
        "notes": ""
      }
    ],
    "Clothing": [
      {
        "text": "Lightweight shirts/tank tops",
        "checked": false,
        "notes": "Pack 5-6, bright colors"
      }
    ]
  },
  "checked": {
    "Kids - Infant": [
      {
        "text": "Diapers (bring extra)",
        "checked": false,
        "notes": "Size 2, 150 count"
      }
    ]
  }
}
```

## Shopping Section

Organized by timing (before/during) and category.

```json
"shopping": {
  "before": {
    "Groceries": [
      {
        "text": "Snacks for flights",
        "checked": false,
        "notes": ""
      }
    ]
  },
  "during": {
    "Sunscreen/Topicals": [
      {
        "text": "After-sun lotion",
        "checked": false,
        "notes": ""
      }
    ]
  }
}
```

## Tasks Section

Pre-travel tasks organized by category.

```json
"tasks": {
  "Home Prep": [
    {
      "text": "Change bed sheets",
      "checked": false,
      "notes": ""
    },
    {
      "text": "Clean out refrigerator",
      "checked": true,
      "notes": "Done May 25"
    }
  ],
  "Before Leaving": [
    {
      "text": "Set thermostat/HVAC to away mode",
      "checked": false,
      "notes": "Set to 78 degrees"
    }
  ]
}
```

## Itinerary Section

Attractions, restaurants, and daily schedule.

```json
"itinerary": {
  "places": [
    {
      "name": "Diamond Head",
      "notes": "Hiking trail, 30 minutes, iconic view",
      "checked": false
    },
    {
      "name": "Hanauma Bay",
      "notes": "Snorkeling, marine life, arrive early",
      "checked": true
    }
  ],
  "restaurants": [
    {
      "name": "Duke's Waikiki",
      "notes": "Casual seafood, oceanfront, reservation recommended",
      "checked": false
    }
  ],
  "schedule": [
    {
      "date": "2026-06-01",
      "event": "Arrive in Honolulu, check-in at 3 PM"
    },
    {
      "date": "2026-06-02",
      "event": "Visit Diamond Head hiking trail (9 AM)"
    }
  ]
}
```

## Notes Section

Free-form text for recording trip information and experiences.

```json
"notes": "Hawaii vacation 2026! This trip was amazing. Diamond Head hike was breathtaking despite being strenuous with young kids. Book Duke's earlier next time - they were fully booked! Infant handled the flight well with formula and pacifier. Must try shave ice at Matsumoto's on North Shore. Consider visiting Volcanoes National Park next time - ran out of time. Kids loved the beach but got too much sun on day 2."
```

## Storage

- **Location**: Browser Local Storage
- **Key**: `vacationPlannerTrips`
- **Format**: JSON object with trip IDs as keys
- **Size**: Typically 500KB - 2MB per trip depending on customization

## Accessing Data Programmatically

### JavaScript Console

```javascript
// Get all trips
const trips = JSON.parse(localStorage.getItem('vacationPlannerTrips'));
console.log(trips);

// Get specific trip
const currentTrip = Object.values(trips)[0];
console.log(currentTrip);

// Export trip
const json = JSON.stringify(currentTrip, null, 2);
console.log(json);
```

### Manual Backup

1. Open browser Developer Tools (F12)
2. Go to Application tab
3. Find Local Storage
4. Find `vacationPlannerTrips`
5. Copy the value
6. Save to a text file with .json extension

## Modifying Templates

The default templates are defined in `app.js`:

- `DEFAULT_PACKING_TEMPLATE`: Base packing list by category
- `DEFAULT_SHOPPING_TEMPLATE`: Shopping lists (before/during)
- `DEFAULT_TASKS_TEMPLATE`: Pre-travel tasks by category
- `DEFAULT_ITINERARY_TEMPLATE`: Initial attractions and restaurants

To customize these for different types of trips or destinations:

1. Edit the corresponding DEFAULT_* object in app.js
2. The changes apply to all new trips created after that point
3. Existing trips are not affected

## Export/Import Format

Exported trips are single JSON files containing the complete trip object. They can be:

- Backed up and stored separately
- Shared between devices
- Committed to version control
- Edited manually (with caution)

Example filename: `Hawaii_2026_1234567890.json`

## Best Practices

1. **Regular backups**: Export trip JSON monthly or after major updates
2. **Version control**: Keep multiple versions of important trips
3. **Documentation**: Add extensive notes in the Notes section
4. **Organization**: Use consistent naming for trips and categories
5. **Sharing**: Use export/import to sync between devices safely
