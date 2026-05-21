#!/usr/bin/env python3
"""
SAMBAL NYET SIMULATION ENGINE - Python Traffic Generator
=========================================================
This script simulates concurrent buying traffic for the Sambal Nyet launch.

OVERVIEW:
- Generates realistic random purchase transactions
- Writes transactions to pending_transactions.json
- Simulates high-concurrency product launch scenario
- Real Malaysian locations for authenticity
- Respects inventory limits

USAGE:
    python simulate.py
    
The script will run indefinitely, generating transactions approximately every 
0.5 to 1.5 seconds. Stop with Ctrl+C.

The generated pending_transactions.json file is polled by shared-state.js,
which processes transactions in real-time.
"""

import json
import time
import random
import os
from pathlib import Path

# ============================================================================
# CONFIGURATION
# ============================================================================

# Malaysian locations for realistic geographic distribution
LOCATIONS = [
    'Kuala Lumpur',
    'Shah Alam',
    'Penang',
    'Johor Bahru',
    'Kota Bharu',
    'Selangor',
    'Malacca',
    'Ipoh',
    'Putrajaya',
    'Subang Jaya'
]

# Product configuration (must match shared-state.js)
TOTAL_STOCK = 1000
UNIT_PRICE = 15.00

# Transaction generation configuration
MIN_QUANTITY = 1
MAX_QUANTITY = 5
MIN_DELAY_SECONDS = 0.5
MAX_DELAY_SECONDS = 1.5

# Output file
TRANSACTIONS_FILE = 'pending_transactions.json'

# Global variable to persist absolute historical units sold across pruning cycles
lifetime_bottles_sold = 0

# ============================================================================
# TRANSACTION GENERATION
# ============================================================================

def generate_transaction(max_allowed):
    """
    Generate a single realistic transaction without exceeding remaining stock.
    
    Args:
        max_allowed (int): Maximum available units left to sell
        
    Returns:
        dict: Transaction object with location, quantity, and timestamp
    """
    requested_qty = random.randint(MIN_QUANTITY, MAX_QUANTITY)
    actual_qty = min(requested_qty, max_allowed)
    
    account_id = f"User_{random.randint(1000, 9999)}"
    
    transaction = {
        'account_id': account_id,
        'location': random.choice(LOCATIONS),
        'quantity': actual_qty,
        'timestamp': int(time.time() * 1000)  # Milliseconds for JS compatibility
    }
    return transaction


def get_current_transactions():
    """
    Read existing transactions from pending_transactions.json
    
    Returns:
        dict: Current transactions structure or empty template
    """
    if not os.path.exists(TRANSACTIONS_FILE):
        return {'transactions': [], 'lastRead': 0}
    
    try:
        with open(TRANSACTIONS_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        # File corrupted or inaccessible, reset
        return {'transactions': [], 'lastRead': 0}


def save_transactions(data):
    """
    Save transactions to pending_transactions.json with atomic write
    
    Args:
        data (dict): Transaction data to save
    """
    try:
        # Write to temporary file first, then rename (atomic operation)
        temp_file = TRANSACTIONS_FILE + '.tmp'
        
        with open(temp_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        # Atomic rename
        if os.path.exists(temp_file):
            os.replace(temp_file, TRANSACTIONS_FILE)
            
    except IOError as e:
        print(f'⚠️  Error writing transactions: {e}')


def prune_old_transactions(transactions_list, max_age_seconds=300):
    """
    Remove transactions older than max_age to prevent file bloat.
    
    Args:
        transactions_list (list): List of transactions
        max_age_seconds (int): Maximum age in seconds
        
    Returns:
        list: Pruned transactions list
    """
    current_time = int(time.time() * 1000)
    cutoff_time = current_time - (max_age_seconds * 1000)
    
    return [t for t in transactions_list if t['timestamp'] > cutoff_time]


def should_continue_generating():
    """
    Determine if we should continue generating transactions.
    
    Returns:
        bool: True if we should keep generating transactions
    """
    global lifetime_bottles_sold
    if lifetime_bottles_sold >= TOTAL_STOCK:
        return False
    
    return True


# ============================================================================
# MAIN SIMULATION LOOP
# ============================================================================

def run_simulation():
    """
    Main simulation engine - continuously generates and saves transactions.
    """
    global lifetime_bottles_sold
    
    print("=" * 70)
    print("🌶️  SAMBAL NYET SIMULATION ENGINE")
    print("=" * 70)
    print(f"📍 Starting transaction generation for Sambal Nyet launch")
    print(f"📦 Total stock: {TOTAL_STOCK} bottles")
    print(f"💰 Price per bottle: RM {UNIT_PRICE:.2f}")
    print(f"🌍 Available locations: {len(LOCATIONS)}")
    print(f"📄 Output file: {TRANSACTIONS_FILE}")
    print("⏹️  Press Ctrl+C to stop simulation\n")
    
    transaction_count = 0
    total_revenue = 0
    
    # Reset internal lifetime metrics at the start of a script execution session
    lifetime_bottles_sold = 0
    
    try:
        while True:
            # Check if we should continue
            if not should_continue_generating():
                print("\n✓ All stock sold out! Stopping simulation.")
                break
            
            # Calculate safety limit remaining
            remaining_stock = TOTAL_STOCK - lifetime_bottles_sold
            
            # Generate new transaction honoring constraints
            transaction = generate_transaction(remaining_stock)
            
            # Avoid logging or adding zero-unit purchases if edge boundary matches perfectly
            if transaction['quantity'] <= 0:
                print("\n✓ All stock sold out! Stopping simulation.")
                break
            
            # Read current transactions
            data = get_current_transactions()
            
            # Add new transaction
            data['transactions'].append(transaction)
            data['lastRead'] = int(time.time() * 1000)
            
            # Prune old transactions (keep last 5 minutes)
            data['transactions'] = prune_old_transactions(data['transactions'], max_age_seconds=300)
            
            # Save updated transactions
            save_transactions(data)
            
            # Update statistics using global tracker safely
            transaction_count += 1
            lifetime_bottles_sold += transaction['quantity']
            total_revenue += transaction['quantity'] * UNIT_PRICE
            
            # Display status
            print(f"[{transaction_count}] {transaction['account_id']:10} | "
                  f"{transaction['location']:15} | "
                  f"Qty: {transaction['quantity']:2} | "
                  f"Total: {lifetime_bottles_sold:4}/{TOTAL_STOCK} | "
                  f"Revenue: RM {total_revenue:8.2f}", end='\r')
            
            # Random delay between transactions (0.5 to 1.5 seconds)
            delay = random.uniform(MIN_DELAY_SECONDS, MAX_DELAY_SECONDS)
            time.sleep(delay)
            
    except KeyboardInterrupt:
        print("\n\n" + "=" * 70)
        print("🛑 SIMULATION STOPPED")
        print("=" * 70)
        print(f"Total transactions generated: {transaction_count}")
        print(f"Total bottles sold: {lifetime_bottles_sold}/{TOTAL_STOCK}")
        print(f"Total revenue simulated: RM {total_revenue:.2f}")
        print(f"Average bottles per transaction: {lifetime_bottles_sold/transaction_count:.1f}" if transaction_count > 0 else "")
        print("=" * 70 + "\n")


# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    run_simulation()