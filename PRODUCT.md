# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Low-income earners, daily-wage workers, and gig-economy operators in India with irregular, unpredictable cash flows who cannot commit to rigid monthly systematic investment plans (SIPs) or fixed recurring deposits.

## Product Purpose

PennyWise is a behavioral micro-savings application that turns routine daily micro-spending into effortless wealth accumulation. By automatically rounding up small, simulated UPI-style daily transactions (e.g., chai, auto fare, groceries) to the nearest ₹10, ₹50, or ₹100 (or 2× multiplier), the spare change difference is swept into goal-based savings pots—eliminating cognitive friction and manual discipline.

## Positioning

Unlike rigid monthly SIPs, mutual funds, or bank recurring deposits that penalize or exclude volatile incomes, PennyWise links micro-savings directly to real-time daily cash outflows, transforming everyday expenses into an automatic wealth-building micro-habit without requiring minimum commitments.

## Operating Context

Accessed across web browsers (desktop and mobile) and native Android mobile environments in fast, recurring daily moments (after buying tea, paying auto rickshaws, purchasing groceries). Designed for high-frequency use where visual clarity, immediacy, and trust are paramount.

## Capabilities and Constraints

- **Simulation-Only Architecture:** The application operates strictly using a Mock Payment Engine and Mock Bank Account. No real UPI, Account Aggregator, or live SMS parsing backend integrations.
- **Privacy & Security Constraints:** Strictly no UPI PIN collection, no banking password collection, and no real-money transactions or wallet transfers.
- **Prototype Disclosure Requirement:** Prominent and clear Prototype / Simulation disclosure banner communicating that all transactions and balances are simulated.
- **Header & Global Status Bar:** Displays total accumulated savings across all pots (₹), Streak Tracker badge (e.g., "🔥 12-Day Savings Streak"), and quick selector for active Round-Up Rule (Nearest ₹10, ₹50, ₹100, or 2x Multiplier).
- **Transaction Simulator (Primary Utility):** Interactive mock UPI payment form with spent amount input (₹), expense category selector (Chai, Auto, Kirana/Groceries, Snacks, Medical, Recharge), preset quick-picks, and instant "Pay & Save" trigger.
- **Real-Time Round-Up Feedback Banner:** Instant transaction breakdown triggered on payment ("Paid ₹47 → Rounded to ₹50 → ₹3 saved toward [Active Goal Name]").
- **Goal-Based Savings Pots Grid:** Interactive cards for named goals (e.g., "Emergency Fund", "Child School Fees", "Diwali Gold", "Two-Wheeler Service") with visual progress meters, target amounts, quick manual boosts (+₹50), celebration triggers upon completion, and active pot selection.
- **Transaction History & Audit Log:** Scrollable list/table of past simulated payments with timestamps, spent amounts, rounded amounts, saved spare change, destination goals, and mock UPI transaction reference IDs.
- **Native Android + Web Adaptive Interface:** Built with an Android-inspired mobile shell (system status bar, app bar, navigation bar, tonal elevation, snackbars) while adapting smoothly to responsive web layouts.

## Brand Commitments

- **Product Name:** PennyWise
- **Currency:** Indian Rupee (₹)
- **Aesthetic:** Native Android Red & Black fintech aesthetic (dark surface, energetic red accent, Material Design 3 tokens, high contrast).
- **Tone & Voice:** Empowering, sleek, institutional yet warm, clear, and grounded in everyday Indian financial habits (UPI, Chai, Auto fare, Kirana).
- **Design Mode:** 'Operate' (clean metric hierarchy, high contrast, crisp data visualization, and instant feedback loops).

## Evidence on Hand

- Complete self-contained client prototype in React + Vite with mock datasets (`initialData.js`).
- Pre-configured UI components including AndroidStatusBar, AndroidNavBar, AndroidSnackbar, Header, SavingsPotsGrid, TransactionSimulator, and TransactionHistory.
- No live external backend, database, or payment gateway dependencies. Future work must not fabricate real bank connections or prompt for real UPI credentials.

## Product Principles

1. **Frictionless Accumulation:** Saving happens as an automatic byproduct of spending—no separate transfers or manual discipline required.
2. **Radical Transparency & Immediacy:** Every transaction explicitly breaks down the exact math: Spent → Rounded → Saved → Destination Pot.
3. **Goal Anchor:** Spare change is never dumped into an abstract bucket; it visibly moves the needle on tangible life goals (Emergency Fund, School Fees).
4. **Absolute Trust & Safety:** Safe simulation environment that never asks for sensitive banking credentials or real money while teaching micro-saving habits.
5. **Celebratory Momentum:** Savings streaks, positive micro-animations, and milestone confetti reinforce pride and sustained financial resilience.

## Accessibility & Inclusion

- High-contrast visual hierarchy, large legible metrics, clear Rupee (₹) currency formatting, intuitive mobile-first responsive layout with minimum 48×48 dp touch targets.
