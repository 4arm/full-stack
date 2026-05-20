# 🌶️ SAMBAL NYET - Real-Time Product Launch System

**A lightweight, real-time product launching system using Multi-Page Architecture (MPA) with HTML, CSS, and pure JavaScript.**

---

## 📋 Project Overview

This system simulates a high-concurrency product launch scenario: **Khairul Aming launching "Sambal Nyet"**, an authentic Malaysian sambal product.

### Key Features
- ✅ **Real-Time Synchronization** - BroadcastChannel API syncs state across all open pages instantly
- ✅ **Centralized State Management** - localStorage-based state engine with no backend required
- ✅ **Dual Role System** - Separate interfaces for Seller (Khairul Aming) and Buyers
- ✅ **Python Traffic Simulation** - Automated buying traffic generator for load testing
- ✅ **Multi-Page Architecture** - Pure HTML pages without frontend frameworks
- ✅ **Race Condition Safe** - Transactional buy logic prevents overselling

### System Architecture

```
SAMBAL NYET LAUNCH SYSTEM
│
├─ shared-state.js (Core Engine)
│  ├─ localStorage state persistence
│  ├─ BroadcastChannel messaging (cross-tab sync)
│  ├─ Transaction processing logic
│  └─ Python transaction polling
│
├─ seller.html (Khairul Aming's Dashboard)
│  ├─ Real-time revenue counter (RM format)
│  ├─ Stock monitoring (sold/remaining)
│  └─ Live sales feed with geolocations
│
├─ buyer.html (Customer Storefront)
│  ├─ Real-time stock ticker
│  ├─ Location selector (Malaysian cities)
│  ├─ Quantity input
│  └─ Buy Now button with validation
│
└─ simulate.py (Traffic Generator)
   ├─ Generates random transactions
   └─ Writes to pending_transactions.json
```

---

## 📁 File Structure

```
Real Time Ticketing System/
├── README.md                     # This file
├── shared-state.js              # Core state management engine
├── seller.html                  # Khairul Aming's dashboard
├── buyer.html                   # Customer storefront
├── simulate.py                  # Python simulation engine
└── pending_transactions.json    # Auto-generated (Python output)
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.6+ (for simulation)
- Any modern web browser
- Local HTTP server (or file:// for testing)

### Step 1: Start a Local Web Server

Navigate to the project directory and start a local server. Choose one:

**Using Python (recommended):**
```bash
python -m http.server 8000
```

**Using Node.js (if available):**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

### Step 2: Open the Interfaces

In your web browser, navigate to:

- **Seller Dashboard:** http://localhost:8000/seller.html
- **Buyer Storefront:** http://localhost:8000/buyer.html

Open multiple browser tabs/windows to see real-time cross-tab synchronization in action.

### Step 3: Run the Simulation

In a terminal, from the project directory:

```bash
python simulate.py
```

This will start generating simulated purchase transactions. Watch the:
- **Seller dashboard** update in real-time with revenue and sales feed
- **Buyer storefront** stock ticker decrease dynamically

---

## 🔧 System Architecture Details

### Shared State Engine (shared-state.js)

**Responsibilities:**
1. Initialize product launch state in localStorage
2. Manage BroadcastChannel for cross-tab real-time sync
3. Process buy transactions safely
4. Poll for Python-generated transactions

**Key Functions:**

```javascript
SharedState.getState()                           // Get current state
SharedState.onStateChange(callback)              // Subscribe to changes
SharedState.processBuyTransaction(location, qty) // Process a purchase
SharedState.getRemainingStock()                  // Get stock available
SharedState.getRevenueFormatted()               // Get formatted revenue
SharedState.resetState()                         // Reset to initial state
```

**State Structure:**
```javascript
{
  productName: "Sambal Nyet",
  totalStock: 1000,
  stockSold: 0,
  unitPrice: 15.00,
  revenue: 0.00,
  salesGeolocations: [
    {
      location: "Kuala Lumpur",
      quantity: 2,
      timestamp: 1234567890000,
      revenue: 30.00
    }
  ],
  lastUpdated: 1234567890000
}
```

### Seller Dashboard (seller.html)

**Real-Time Metrics Displayed:**
- Total Revenue (RM formatted)
- Bottles Sold
- Bottles Remaining
- Sell-Through Percentage (0-100%)

**Visual Features:**
- Dark mode professional dashboard
- Animated metric cards with pulse effect
- Stock depletion progress bar
- Live sales feed showing:
  - Buyer location
  - Quantity purchased
  - Revenue per sale
  - Time ago (relative timestamps)

**Auto-Update:**
- Dashboard refreshes instantly when state changes
- Cross-tab synchronization through BroadcastChannel
- Animations highlight new updates

### Buyer Storefront (buyer.html)

**Features:**
- Real-time stock ticker with instant updates
- Location dropdown: Kuala Lumpur, Shah Alam, Penang, Johor Bahru, Kota Bharu
- Quantity selector (+/- buttons)
- Dynamic price calculation
- Buy Now button with validation
- SOLD OUT badge when stock depleted

**Purchase Workflow:**
1. Select location from dropdown
2. Choose quantity (1-100 bottles)
3. Click "Buy Now"
4. System validates stock availability
5. Transaction processed atomically
6. Updates broadcast to all other pages
7. Confirmation message displayed

**Validation:**
- Minimum quantity: 1 bottle
- Maximum quantity: 100 bottles per transaction
- Stock availability checked at transaction time
- Button disabled if sold out

### Python Simulation Engine (simulate.py)

**Generation Pattern:**
- Generates 1 transaction every 0.5-1.5 seconds (random)
- Random quantity: 1-5 bottles per transaction
- Random location from Malaysian cities list
- Realistic geographic distribution

**Output:**
- Writes transactions to `pending_transactions.json`
- Each transaction has: location, quantity, timestamp (milliseconds)
- Automatic pruning of old transactions (keeps last 5 minutes)

**Statistics Displayed:**
- Transaction count
- Total bottles sold
- Total revenue simulated
- Average bottles per transaction

**Configuration (can be modified):**
```python
TOTAL_STOCK = 1000              # Total inventory
UNIT_PRICE = 15.00              # Price per bottle
MIN_QUANTITY = 1                # Min bottles per transaction
MAX_QUANTITY = 5                # Max bottles per transaction
MIN_DELAY_SECONDS = 0.5         # Min delay between transactions
MAX_DELAY_SECONDS = 1.5         # Max delay between transactions
```

---

## 🔄 Real-Time Synchronization Flow

```
TRANSACTION FLOW:
─────────────────

1. User clicks "Buy Now" in buyer.html
   ↓
2. shared-state.js: processBuyTransaction()
   ↓
3. Validate stock & lock transaction
   ↓
4. Update localStorage state
   ↓
5. Broadcast via BroadcastChannel to all tabs
   ↓
6. seller.html receives update → DOM refreshes
   buyer.html receives update → Stock ticker updates
   Any other open pages receive update instantly


PYTHON SIMULATION FLOW:
──────────────────────

1. simulate.py generates transaction
   ↓
2. Writes to pending_transactions.json
   ↓
3. shared-state.js polling (every 500ms)
   ↓
4. Detects new transaction
   ↓
5. Calls processBuyTransaction()
   ↓
6. Updates state & broadcasts
   ↓
7. All open pages update instantly
```

---

## 📊 Product Launch Configuration

**Product Details:**
- Name: Sambal Nyet
- Initial Stock: 1,000 bottles
- Unit Price: RM 15.00 per bottle
- Maximum Total Revenue: RM 15,000

**Buyer Locations:**
- Kuala Lumpur
- Shah Alam
- Penang
- Johor Bahru
- Kota Bharu
- (Plus 5 additional simulation locations: Selangor, Malacca, Ipoh, Putrajaya, Subang Jaya)

---

## 🛠️ Customization Guide

### Modify Product Details

**In shared-state.js**, modify the initialization:
```javascript
const initialState = {
  productName: 'Your Product',        // Change product name
  totalStock: 5000,                   // Change stock amount
  unitPrice: 25.00,                   // Change price
  // ... rest of state
};
```

### Add More Locations

**In buyer.html**, add options to the dropdown:
```html
<select id="locationSelect">
  <option value="">Select your location...</option>
  <option value="Your City">Your City</option>
  <!-- Add more options -->
</select>
```

**In simulate.py**, expand the locations list:
```python
LOCATIONS = [
    'Kuala Lumpur',
    'Shah Alam',
    'Your New Location',
    # ... more locations
]
```

### Adjust Simulation Speed

**In simulate.py**, modify delays:
```python
MIN_DELAY_SECONDS = 0.2          # Faster transactions
MAX_DELAY_SECONDS = 0.8
```

### Change Dashboard Colors

**In seller.html or buyer.html**, modify CSS variables:
```css
/* Primary color */
color: #00d4ff;  /* Change from cyan to your color */

/* Accent color */
color: #ff006e;  /* Change from pink to your color */

/* Success color */
color: #00ff88;  /* Change from green to your color */
```

---

## 🧪 Testing & Validation

### Test 1: Single Browser Tab
1. Open buyer.html
2. Make a purchase manually
3. Verify the transaction processes successfully
4. Check that seller.html updates (if open)

### Test 2: Multi-Tab Synchronization
1. Open seller.html in Tab 1
2. Open buyer.html in Tab 2
3. Make a purchase in Tab 2
4. Verify Tab 1 (seller dashboard) updates instantly
5. Repeat with multiple tabs

### Test 3: Python Simulation
1. Open seller.html and buyer.html
2. Run `python simulate.py`
3. Watch transactions flow through the system
4. Verify stock decreases and revenue increases
5. Stop simulation with Ctrl+C

### Test 4: Stock Depletion
1. Modify simulate.py to reduce MAX_QUANTITY or increase transaction rate
2. Run simulation
3. Monitor as stock approaches 0
4. Verify SOLD OUT badge appears and Buy button disables
5. Confirm no more transactions can be processed

### Test 5: Race Condition Prevention
1. Open buyer.html in 10+ browser tabs
2. Click "Buy Now" simultaneously in multiple tabs
3. Verify total stock sold equals sum of all purchases
4. Confirm no overselling occurs

---

## ⚙️ Technical Specifications

### Browser Compatibility
- ✅ Chrome/Edge 60+
- ✅ Firefox 55+
- ✅ Safari 13+
- ✅ Any modern browser supporting:
  - localStorage API
  - BroadcastChannel API
  - Fetch API
  - ES6 JavaScript

### Performance
- **State reads:** Synchronous (instantaneous)
- **State writes:** ~1ms per transaction
- **Cross-tab sync:** <50ms latency via BroadcastChannel
- **Python polling:** Every 500ms (2 checks/second)
- **Memory footprint:** <1MB (localStorage cap is 5-10MB typically)

### Network Requirements
- No internet connection required
- Works entirely locally
- Python simulation runs locally
- All state in browser localStorage

---

## 🐛 Troubleshooting

### Issue: "BroadcastChannel not supported"
**Solution:** The system falls back to single-tab mode. This is normal.

### Issue: Python script not writing transactions
**Verification:**
1. Check if pending_transactions.json exists in the project directory
2. Run: `python simulate.py` and verify output shows transaction count
3. Check file permissions

### Issue: Stock not updating in real-time
**Solution:**
1. Verify BroadcastChannel is working (check browser console)
2. Ensure you're accessing pages via http://localhost:8000 (not file://)
3. Refresh the page and try again

### Issue: "SOLD OUT" badge not appearing
**Troubleshooting:**
1. Check if actual stock has depleted (check seller dashboard)
2. Manually simulate stock depletion by modifying simulate.py settings
3. Refresh buyer.html to see updated inventory

---

## 📝 Development Notes

### Key Design Decisions

1. **localStorage for State:** Provides durability, survives page refresh, no backend needed
2. **BroadcastChannel for Sync:** Native browser API, zero-latency cross-tab communication
3. **Polling for Python Output:** Simple file-based integration without complex IPC
4. **Atomic Transactions:** Stock check + deduction happens in single operation to prevent race conditions
5. **Pure Vanilla JS:** No dependencies, zero build step, runs anywhere

### Future Enhancement Ideas

- Add WebSocket support for multi-device synchronization
- Implement IndexedDB for larger transaction histories
- Add real backend REST API integration
- Multi-currency support
- Payment gateway integration (Stripe, PayPal)
- Real-time notifications (Notifications API)
- Mobile app version using Electron/React Native

---

## 📄 License

This project is provided as-is for educational and commercial use.

---

## 👨‍💻 Author

Built as a demonstration of real-time systems architecture using browser APIs and vanilla JavaScript.

---

## 📞 Support

For issues or questions, check:
1. Browser console for error messages (F12 → Console)
2. This README for troubleshooting section
3. Ensure all files (shared-state.js, seller.html, buyer.html, simulate.py) are in the same directory
4. Check that you're running a local HTTP server (not file:// protocol)

---

## 🎯 Quick Reference Commands

```bash
# Start local web server
python -m http.server 8000

# Run simulation in another terminal
python simulate.py

# Stop simulation
Ctrl+C

# Reset all data (in browser console)
SharedState.resetState()

# Check current state (in browser console)
console.log(SharedState.getState())

# View remaining stock (in browser console)
console.log(SharedState.getRemainingStock())
```

---

**Happy selling! 🌶️🚀**
