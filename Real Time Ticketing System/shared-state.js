/**
 * SHARED STATE ENGINE - Real-Time Synchronization for Sambal Nyet Launch
 * ======================================================================
 * This module manages centralized state using localStorage and BroadcastChannel API
 * to enable real-time synchronization across multiple browser tabs/windows.
 * 
 * Key responsibilities:
 * 1. Initialize and persist product launch state
 * 2. Broadcast state changes across all open pages
 * 3. Process buy transactions safely
 * 4. Poll for Python-generated transactions from pending_transactions.json
 */

// ============================================================================
// STATE INITIALIZATION
// ============================================================================

const STATE_KEY = 'sambal_nyet_launch_state';
const CHANNEL_NAME = 'sambal_launch_channel';

/**
 * Initialize the initial product state in localStorage
 */
function initializeState() {
  const existing = localStorage.getItem(STATE_KEY);
  
  if (!existing) {
    const initialState = {
      productName: 'Sambal Nyet',
      totalStock: 1000,
      stockSold: 0,
      unitPrice: 15.00,
      revenue: 0.00,
      salesGeolocations: [],
      lastUpdated: Date.now()
    };
    localStorage.setItem(STATE_KEY, JSON.stringify(initialState));
    return initialState;
  }
  
  return JSON.parse(existing);
}

/**
 * Get current state object (synchronous read from localStorage)
 * @returns {Object} Current state object
 */
function getState() {
  const state = localStorage.getItem(STATE_KEY);
  return state ? JSON.parse(state) : initializeState();
}

/**
 * Update state object in localStorage (internal function)
 * @param {Object} newState - New state to persist
 */
function setState(newState) {
  localStorage.setItem(STATE_KEY, JSON.stringify(newState));
}

// ============================================================================
// BROADCAST CHANNEL SETUP
// ============================================================================

let broadcastChannel = null;
let stateChangeListeners = [];

/**
 * Initialize BroadcastChannel for cross-tab real-time communication
 * This allows changes in one tab to immediately reflect in all other tabs
 */
function initializeBroadcastChannel() {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    
    // Listen for incoming state change messages from other tabs/windows
    broadcastChannel.onmessage = (event) => {
      const { type, payload } = event.data;
      
      if (type === 'STATE_UPDATE') {
        // Update local state based on broadcast
        setState(payload);
        
        // Trigger all registered listeners
        notifyStateChange(payload);
      }
    };
    
    console.log('✓ BroadcastChannel initialized for real-time sync');
  } catch (error) {
    console.warn('BroadcastChannel not supported, running in single-tab mode:', error.message);
  }
}

/**
 * Broadcast state change to all other tabs/windows
 * @param {Object} state - Updated state to broadcast
 */
function broadcastStateChange(state) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'STATE_UPDATE',
        payload: state,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to broadcast state change:', error);
    }
  }
}

/**
 * Register a callback function to be invoked when state changes
 * @param {Function} callback - Function to call with new state
 */
function onStateChange(callback) {
  if (typeof callback === 'function') {
    stateChangeListeners.push(callback);
  }
}

/**
 * Trigger all registered state change listeners
 * @param {Object} newState - The updated state
 */
function notifyStateChange(newState) {
  stateChangeListeners.forEach(listener => {
    try {
      listener(newState);
    } catch (error) {
      console.error('Error in state change listener:', error);
    }
  });
}

// ============================================================================
// TRANSACTION PROCESSING
// ============================================================================

/**
 * Process a buy transaction - the core transaction engine
 * This function ensures race condition safety by checking stock availability
 * immediately before deduction.
 * 
 * @param {string} location - Buyer's location (geolocation)
 * @param {number} quantity - Number of bottles to purchase
 * @returns {Object} Transaction result { success: boolean, message: string, newState: Object|null }
 */
function processBuyTransaction(location, quantity) {
  const state = getState();
  
  // Validate inputs
  if (!location || !location.trim()) {
    return {
      success: false,
      message: 'Location is required',
      newState: null
    };
  }
  
  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      success: false,
      message: 'Quantity must be at least 1 bottle',
      newState: null
    };
  }
  
  if (quantity > 100) {
    return {
      success: false,
      message: 'Maximum 100 bottles per transaction',
      newState: null
    };
  }
  
  // Check stock availability (this is the critical race condition prevention point)
  const remainingStock = state.totalStock - state.stockSold;
  
  if (remainingStock <= 0) {
    return {
      success: false,
      message: 'SOLD OUT - No stock available',
      newState: state
    };
  }
  
  if (quantity > remainingStock) {
    return {
      success: false,
      message: `Only ${remainingStock} bottles left`,
      newState: state
    };
  }
  
  // TRANSACTION COMMITTED: Deduct stock and update revenue
  const transactionRevenue = quantity * state.unitPrice;
  
  const updatedState = {
    ...state,
    stockSold: state.stockSold + quantity,
    revenue: parseFloat((state.revenue + transactionRevenue).toFixed(2)),
    salesGeolocations: [
      ...state.salesGeolocations,
      {
        location: location.trim(),
        quantity: quantity,
        timestamp: Date.now(),
        revenue: transactionRevenue
      }
    ],
    lastUpdated: Date.now()
  };
  
  // Persist to localStorage
  setState(updatedState);
  
  // Broadcast to all other tabs
  broadcastStateChange(updatedState);
  
  // Notify local listeners
  notifyStateChange(updatedState);
  
  return {
    success: true,
    message: `✓ Purchased ${quantity} bottle(s) from ${location}`,
    newState: updatedState
  };
}

// ============================================================================
// PYTHON TRANSACTION POLLING
// ============================================================================

let transactionPollingInterval = null;
let lastProcessedTransactionTimestamp = 0;

/**
 * Start polling for Python-generated transactions from pending_transactions.json
 * This function sets up an interval to check for new transactions written by
 * the Python simulation engine, allowing automated traffic injection.
 */
function startTransactionPolling() {
  // Poll every 500ms (twice per second) for new transactions
  transactionPollingInterval = setInterval(() => {
    pollForPendingTransactions();
  }, 500);
  
  console.log('✓ Python transaction polling started');
}

/**
 * Stop the transaction polling interval
 */
function stopTransactionPolling() {
  if (transactionPollingInterval) {
    clearInterval(transactionPollingInterval);
    transactionPollingInterval = null;
    console.log('✓ Python transaction polling stopped');
  }
}

/**
 * Poll for pending transactions from the JSON file
 * Reads pending_transactions.json and processes any new transactions that haven't
 * been processed yet (tracked via timestamp)
 */
function pollForPendingTransactions() {
  // Use fetch to read the pending_transactions.json file
  fetch('pending_transactions.json?nocache=' + Date.now())
    .then(response => {
      if (!response.ok) {
        // File doesn't exist yet (normal on startup)
        return null;
      }
      return response.json();
    })
    .then(data => {
      if (!data || !Array.isArray(data.transactions)) {
        return;
      }
      
      // Process only new transactions (those with timestamp > lastProcessedTransactionTimestamp)
      data.transactions.forEach(transaction => {
        if (transaction.timestamp > lastProcessedTransactionTimestamp) {
          // Process this transaction
          const result = processBuyTransaction(
            transaction.location,
            transaction.quantity
          );
          
          if (result.success) {
            lastProcessedTransactionTimestamp = transaction.timestamp;
            console.log(`Python transaction processed: ${transaction.quantity} bottles from ${transaction.location}`);
          }
        }
      });
    })
    .catch(error => {
      // Silently ignore - file may not exist or fetch may fail
      // This is expected in normal operation
    });
}

// ============================================================================
// INITIALIZATION & EXPORT
// ============================================================================

// Initialize state and BroadcastChannel when module loads
initializeState();
initializeBroadcastChannel();
startTransactionPolling();

// Export public API
window.SharedState = {
  getState,
  onStateChange,
  processBuyTransaction,
  startTransactionPolling,
  stopTransactionPolling,
  
  // Utility functions
  getRemainingStock: function() {
    const state = getState();
    return state.totalStock - state.stockSold;
  },
  
  getRevenueFormatted: function() {
    const state = getState();
    return 'RM ' + state.revenue.toFixed(2);
  },
  
  getStockPercentage: function() {
    const state = getState();
    return Math.round((state.stockSold / state.totalStock) * 100);
  },
  
  // Debug/Admin utility to reset state (development only)
  resetState: function() {
    const initialState = {
      productName: 'Sambal Nyet',
      totalStock: 1000,
      stockSold: 0,
      unitPrice: 15.00,
      revenue: 0.00,
      salesGeolocations: [],
      lastUpdated: Date.now()
    };
    setState(initialState);
    broadcastStateChange(initialState);
    notifyStateChange(initialState);
    console.log('✓ State reset to initial values');
  }
};

console.log('✓ Shared State Engine loaded and ready');
