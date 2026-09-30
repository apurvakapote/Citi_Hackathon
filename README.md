# PennyWise

PennyWise is a mobile-first micro-savings prototype built for daily earners and gig workers in India. It transforms routine spending into automatic, low-friction savings by rounding up small payments and directing the spare change into goal-based savings pots.

This project is a front-end demo built with React + Vite, designed to simulate a micro-savings experience without involving real money, UPI credentials, or backend banking integrations.

## Why this project exists

Many people with irregular income patterns struggle to save through traditional systems like SIPs, recurring deposits, or monthly savings plans. PennyWise addresses this by helping users save in small, instinctive increments based on normal daily transactions.

Instead of asking users to “set aside money,” the app automatically rounds up purchases and moves the difference into clearly defined goals like:
- Emergency fund
- School fees
- Diwali savings
- Vehicle maintenance

## Key features

- Simulated UPI-style payment flow
- Round-up savings based on transaction amount
- Goal-based savings pots with progress tracking
- Safe-to-save balance protection
- Daily saving and streak metrics
- Transaction history / audit log
- Emergency vault withdrawal simulation
- Responsive Android-inspired interface
- Prototype safety disclosure banner

## Demo experience

The app simulates:
- user spending across everyday categories like tea, groceries, travel, medical, and recharge
- automatic round-up calculations
- safeguards that pause savings when the account balance is too low
- goal completion celebrations via confetti
- a vault-like escrow experience for stored funds

## Tech stack

- React
- Vite
- JavaScript
- Lucide React icons
- Canvas Confetti

## Project structure

```text
DRUNIX_hackathon/
├── index.html
├── package.json
├── package-lock.json
├── PRODUCT.md
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   │   ├── AndroidNavBar.jsx
│   │   ├── AndroidSnackbar.jsx
│   │   ├── AndroidStatusBar.jsx
│   │   ├── BehavioralMetrics.jsx
│   │   ├── FeedbackBanner.jsx
│   │   ├── Header.jsx
│   │   ├── SavingsPotsGrid.jsx
│   │   ├── TransactionHistory.jsx
│   │   ├── TransactionSimulator.jsx
│   │   └── VaultView.jsx
│   └── data/
│       └── initialData.js
└── README.md
