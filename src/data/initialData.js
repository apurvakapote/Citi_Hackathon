/**
 * PennyWise - Percentage Slab Math & Core Fintech Data
 * Obsidian & Crimson Dark Theme Configuration
 */

export const PERCENTAGE_SLABS = [
  { id: 'slab-5', min: 0, max: 100, percent: 5, label: '5% (≤ ₹100)', description: '5% micro-sweep on everyday snacks & transit' },
  { id: 'slab-3', min: 101, max: 500, percent: 3, label: '3% (₹101 - ₹500)', description: '3% sweep on dining & quick groceries' },
  { id: 'slab-2', min: 501, max: 2000, percent: 2, label: '2% (₹501 - ₹2,000)', description: '2% sweep on weekly shopping & fuel' },
  { id: 'slab-1', min: 2001, max: 5000, percent: 1, label: '1% (₹2,001 - ₹5,000)', description: '1% sweep on utilities, travel & retail' },
  { id: 'slab-05', min: 5001, max: 10000, percent: 0.5, cap: 50, label: '0.5% (₹5,001 - ₹10k)', description: '0.5% sweep with strict ₹50 safety cap' },
  { id: 'slab-excluded', min: 10001, max: Infinity, percent: 0, label: 'Excluded (> ₹10,000)', description: 'Excluded: Large Transaction (> ₹10,000)' },
];

/**
 * Pure Mathematical Engine for PennyWise Percentage Slabs
 * @param {number|string} amount - Spent amount in INR
 * @returns {object} calculation results & decision explanation
 */
export function calculatePercentageSavings(amount) {
  const val = parseFloat(amount) || 0;

  if (val <= 0) {
    return {
      spent: 0,
      saved: 0,
      rate: 0,
      rateLabel: '0%',
      slabId: null,
      slabLabel: 'No Amount Entered',
      isExcluded: false,
      isCapped: false,
      exclusionReason: null,
      explanation: 'Enter a valid payment amount to see percentage savings breakdown.'
    };
  }

  // Large transaction exclusion (> ₹10,000)
  if (val > 10000) {
    return {
      spent: val,
      saved: 0,
      rate: 0,
      rateLabel: '0%',
      slabId: 'slab-excluded',
      slabLabel: 'Excluded: Large Transaction (> ₹10,000)',
      isExcluded: true,
      isCapped: false,
      exclusionReason: 'Excluded: Large Transaction (> ₹10,000)',
      explanation: `Transactions above ₹10,000 are excluded from automatic micro-sweeps to prevent unexpected liquidity lockups.`
    };
  }

  // Slab 1: Up to ₹100 -> 5%
  if (val <= 100) {
    const saved = +(val * 0.05).toFixed(2);
    return {
      spent: val,
      saved,
      rate: 5,
      rateLabel: '5%',
      slabId: 'slab-5',
      slabLabel: '5% Slab (Up to ₹100)',
      isExcluded: false,
      isCapped: false,
      exclusionReason: null,
      explanation: `5% applied on ₹${val.toLocaleString('en-IN')} → ₹${saved.toFixed(2)} swept to savings.`
    };
  }

  // Slab 2: ₹101 to ₹500 -> 3%
  if (val <= 500) {
    const saved = +(val * 0.03).toFixed(2);
    return {
      spent: val,
      saved,
      rate: 3,
      rateLabel: '3%',
      slabId: 'slab-3',
      slabLabel: '3% Slab (₹101 - ₹500)',
      isExcluded: false,
      isCapped: false,
      exclusionReason: null,
      explanation: `3% applied on ₹${val.toLocaleString('en-IN')} → ₹${saved.toFixed(2)} swept to savings.`
    };
  }

  // Slab 3: ₹501 to ₹2,000 -> 2%
  if (val <= 2000) {
    const saved = +(val * 0.02).toFixed(2);
    return {
      spent: val,
      saved,
      rate: 2,
      rateLabel: '2%',
      slabId: 'slab-2',
      slabLabel: '2% Slab (₹501 - ₹2,000)',
      isExcluded: false,
      isCapped: false,
      exclusionReason: null,
      explanation: `2% applied on ₹${val.toLocaleString('en-IN')} → ₹${saved.toFixed(2)} swept to savings.`
    };
  }

  // Slab 4: ₹2,001 to ₹5,000 -> 1%
  if (val <= 5000) {
    const saved = +(val * 0.01).toFixed(2);
    return {
      spent: val,
      saved,
      rate: 1,
      rateLabel: '1%',
      slabId: 'slab-1',
      slabLabel: '1% Slab (₹2,001 - ₹5,000)',
      isExcluded: false,
      isCapped: false,
      exclusionReason: null,
      explanation: `1% applied on ₹${val.toLocaleString('en-IN')} → ₹${saved.toFixed(2)} swept to savings.`
    };
  }

  // Slab 5: ₹5,001 to ₹10,000 -> 0.5% with strict hard cap at ₹50
  const rawCalc = +(val * 0.005).toFixed(2);
  const isCapped = rawCalc > 50;
  const saved = Math.min(50, rawCalc);
  return {
    spent: val,
    saved,
    rate: 0.5,
    rateLabel: '0.5%',
    slabId: 'slab-05',
    slabLabel: '0.5% Slab (₹5,001 - ₹10,000, Max ₹50)',
    isExcluded: false,
    isCapped,
    exclusionReason: null,
    explanation: isCapped
      ? `0.5% of ₹${val.toLocaleString('en-IN')} is ₹${rawCalc.toFixed(2)}, capped at strict maximum limit of ₹50.00.`
      : `0.5% applied on ₹${val.toLocaleString('en-IN')} → ₹${saved.toFixed(2)} swept to savings.`
  };
}

export const EXPENSE_CATEGORIES = [
  { id: 'chai', label: 'Chai / Street Food', icon: 'Coffee', defaultAmount: 40 },
  { id: 'auto', label: 'Auto / Metro Fare', icon: 'Car', defaultAmount: 85 },
  { id: 'grocery', label: 'Kirana / Supermarket', icon: 'ShoppingCart', defaultAmount: 1200 },
  { id: 'dining', label: 'Swiggy / Dinner', icon: 'Utensils', defaultAmount: 300 },
  { id: 'travel', label: 'Flights / Railway', icon: 'Plane', defaultAmount: 3000 },
  { id: 'gadget', label: 'Electronics / EMI', icon: 'Smartphone', defaultAmount: 8000 },
];

export const QUICK_PRESETS = [
  { label: 'Kadak Chai', amount: 40, category: 'chai', slabNote: '5% slab → ₹2.00' },
  { label: 'Swiggy Dinner', amount: 300, category: 'dining', slabNote: '3% slab → ₹9.00' },
  { label: 'Kirana Mart', amount: 1200, category: 'grocery', slabNote: '2% slab → ₹24.00' },
  { label: 'Flight Ticket', amount: 3000, category: 'travel', slabNote: '1% slab → ₹30.00' },
  { label: 'Smartphone EMI', amount: 8000, category: 'gadget', slabNote: '0.5% capped → ₹40.00' },
  { label: 'Two-Wheeler', amount: 15000, category: 'auto', slabNote: 'Excluded > ₹10k' },
];

export const INITIAL_POTS = [
  {
    id: 'emergency',
    name: 'Emergency Fund',
    icon: 'ShieldAlert',
    targetAmount: 15000,
    currentAmount: 11500,
    color: '#10b981',
    description: '3-month buffer for medical & rainy-day safety',
    milestone: 'Almost There',
    milestoneTag: '76% Complete',
    isActive: true,
  },
  {
    id: 'laptop',
    name: 'Laptop',
    icon: 'Laptop',
    targetAmount: 60000,
    currentAmount: 18400,
    color: '#e11d48',
    description: 'M3 MacBook Air for freelance programming',
    milestone: 'Building Momentum',
    milestoneTag: '31% Complete',
    isActive: false,
  },
  {
    id: 'trip',
    name: 'Trip',
    icon: 'Palmtree',
    targetAmount: 25000,
    currentAmount: 9200,
    color: '#f59e0b',
    description: 'Annual family getaway to Himachal Pradesh',
    milestone: 'Halfway Mark',
    milestoneTag: '37% Complete',
    isActive: false,
  },
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-201',
    timestamp: 'Today, 04:15 PM',
    spent: 40,
    saved: 2.0,
    rateLabel: '5%',
    slabLabel: '5% Slab (≤ ₹100)',
    category: 'chai',
    categoryLabel: 'Chai / Street Food',
    merchantName: 'Sharma Tea Stall',
    goalId: 'emergency',
    goalName: 'Emergency Fund',
    status: 'Confirmed',
    refId: 'UPI-9842104',
  },
  {
    id: 'tx-202',
    timestamp: 'Today, 01:30 PM',
    spent: 300,
    saved: 9.0,
    rateLabel: '3%',
    slabLabel: '3% Slab (₹101 - ₹500)',
    category: 'dining',
    categoryLabel: 'Swiggy / Dinner',
    merchantName: 'Biryani Express',
    goalId: 'emergency',
    goalName: 'Emergency Fund',
    status: 'Confirmed',
    refId: 'UPI-8492015',
  },
  {
    id: 'tx-203',
    timestamp: 'Yesterday, 08:20 PM',
    spent: 1200,
    saved: 24.0,
    rateLabel: '2%',
    slabLabel: '2% Slab (₹501 - ₹2,000)',
    category: 'grocery',
    categoryLabel: 'Kirana / Supermarket',
    merchantName: 'More Retail Supermarket',
    goalId: 'laptop',
    goalName: 'Laptop',
    status: 'Confirmed',
    refId: 'UPI-7731940',
  },
  {
    id: 'tx-204',
    timestamp: 'Yesterday, 11:15 AM',
    spent: 3000,
    saved: 30.0,
    rateLabel: '1%',
    slabLabel: '1% Slab (₹2,001 - ₹5,000)',
    category: 'travel',
    categoryLabel: 'Flights / Railway',
    merchantName: 'MakeMyTrip Bookings',
    goalId: 'trip',
    goalName: 'Trip',
    status: 'Confirmed',
    refId: 'UPI-6391048',
  },
  {
    id: 'tx-205',
    timestamp: '2 days ago',
    spent: 8000,
    saved: 40.0,
    rateLabel: '0.5%',
    slabLabel: '0.5% Slab (Capped ₹50)',
    category: 'gadget',
    categoryLabel: 'Electronics / EMI',
    merchantName: 'Croma Retail Mumbai',
    goalId: 'emergency',
    goalName: 'Emergency Fund',
    status: 'Confirmed',
    refId: 'UPI-5102941',
  },
  {
    id: 'tx-206',
    timestamp: '3 days ago',
    spent: 15000,
    saved: 0.0,
    rateLabel: '0%',
    slabLabel: 'Excluded: Large Transaction (> ₹10,000)',
    category: 'auto',
    categoryLabel: 'Two-Wheeler Service',
    merchantName: 'Hero MotoCorp Center',
    goalId: 'emergency',
    goalName: 'Emergency Fund',
    status: 'Excluded',
    refId: 'UPI-4091823',
  },
];
