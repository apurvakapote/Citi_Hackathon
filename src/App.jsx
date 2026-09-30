import React, { useState } from 'react';
import AndroidStatusBar from './components/AndroidStatusBar';
import AndroidNavBar from './components/AndroidNavBar';
import AndroidSnackbar from './components/AndroidSnackbar';
import Header from './components/Header';
import TransactionSimulator from './components/TransactionSimulator';
import VaultView from './components/VaultView';
import SavingsPotsGrid from './components/SavingsPotsGrid';
import TransactionHistory from './components/TransactionHistory';
import BehavioralMetrics from './components/BehavioralMetrics';
import FeedbackBanner from './components/FeedbackBanner';
import confetti from 'canvas-confetti';
import { 
  INITIAL_POTS, 
  INITIAL_TRANSACTIONS 
} from './data/initialData';
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  Lock, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Vault 
} from 'lucide-react';

export default function App() {
  // 1. Core Financial State (Simulated Main Account & Vault)
  const [mainBalance, setMainBalance] = useState(10000); // Default ₹10,000
  const [safeFloor, setSafeFloor] = useState(1000); // Default ₹1,000
  const [dailyLimit, setDailyLimit] = useState(200); // Default ₹200
  const [todaySaved, setTodaySaved] = useState(42.0); // Pre-seeded today's savings

  // 2. Goal Pots & Transactions
  const [pots, setPots] = useState(INITIAL_POTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [latestFeedbackTx, setLatestFeedbackTx] = useState(null);
  const [streakDays, setStreakDays] = useState(12);
  const [isUpdatedFlash, setIsUpdatedFlash] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Derived Financial Properties
  const vaultBalance = pots.reduce((sum, pot) => sum + pot.currentAmount, 0);
  const activePot = pots.find((p) => p.isActive) || pots[0];
  
  // Smart Pause & Resume Condition:
  // Automatically paused if Main Balance is below or hits the Safe-to-Save floor
  const isSmartPaused = mainBalance < safeFloor;

  // Set active destination pot
  const handleSetActivePot = (potId) => {
    setPots((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.id === potId,
      }))
    );
  };

  // Execute Simulated UPI Payment with Percentage Slabs & Safe-to-Save Engine
  const handleSimulatePayment = (paymentData) => {
    const { 
      spent, 
      rawCalculatedSavings, 
      saved, 
      rateLabel, 
      slabLabel, 
      category, 
      categoryLabel, 
      merchantName, 
      goalId, 
      goalName, 
      isExcluded, 
      exclusionReason, 
      sweepStatusNotice,
      explanation 
    } = paymentData;

    const newTxId = `UPI-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const now = new Date();
    const timeString = `Just now, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

    let finalSaved = saved;
    let finalNotice = sweepStatusNotice;
    let txStatus = 'Confirmed';

    // Verify Safe-to-Save floor protection before execution
    if (!isExcluded && rawCalculatedSavings > 0) {
      if ((mainBalance - rawCalculatedSavings) < safeFloor) {
        finalSaved = 0;
        finalNotice = 'PAUSED_LOW_BALANCE';
        txStatus = 'Halted (Floor Protected)';
      }
    }

    if (isExcluded) {
      finalSaved = 0;
      finalNotice = 'EXCLUDED_LARGE_TX';
      txStatus = 'Excluded';
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      timestamp: timeString,
      spent,
      saved: finalSaved,
      rateLabel,
      slabLabel,
      category,
      categoryLabel,
      merchantName,
      goalId,
      goalName,
      status: txStatus,
      isExcluded,
      exclusionReason,
      sweepStatusNotice: finalNotice,
      explanation,
      refId: newTxId,
    };

    // Update Main Balance:
    // Deducts spent payment to merchant + swept savings into Vault
    setMainBalance((prev) => Math.max(0, +(prev - spent - finalSaved).toFixed(2)));

    // Update Destination Pot & Vault if funds were swept
    let reachedTarget = false;
    if (finalSaved > 0) {
      setPots((prevPots) =>
        prevPots.map((p) => {
          if (p.id === goalId) {
            const updatedAmount = +(p.currentAmount + finalSaved).toFixed(2);
            if (updatedAmount >= p.targetAmount && p.currentAmount < p.targetAmount) {
              reachedTarget = true;
            }
            return {
              ...p,
              currentAmount: updatedAmount,
            };
          }
          return p;
        })
      );
      setTodaySaved((prev) => +(prev + finalSaved).toFixed(2));
    }

    setTransactions((prev) => [newTx, ...prev]);
    setLatestFeedbackTx(newTx);
    setIsUpdatedFlash(true);
    setTimeout(() => setIsUpdatedFlash(false), 700);

    if (reachedTarget) {
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.5 },
      });
    }
  };

  // 1-Tap Emergency Withdrawal from Vault to Main Bank Account
  const handleEmergencyWithdrawal = () => {
    if (vaultBalance <= 0) return;
    const withdrawAmount = vaultBalance;

    // Credit funds back to Main Account
    setMainBalance((prev) => +(prev + withdrawAmount).toFixed(2));

    // Zero out the savings pots
    setPots((prevPots) =>
      prevPots.map((p) => ({
        ...p,
        currentAmount: 0,
      }))
    );

    // Record an audit transaction for withdrawal
    const withdrawalTx = {
      id: `tx-wd-${Date.now()}`,
      timestamp: 'Just now',
      spent: 0,
      saved: 0,
      rateLabel: 'IMPS',
      slabLabel: 'Emergency Withdrawal Sweep',
      category: 'travel',
      categoryLabel: 'Vault Withdrawal',
      merchantName: 'PennyWise Escrow',
      goalId: 'vault',
      goalName: 'Escrow Vault IMPS Transfer',
      status: 'Transferred',
      isExcluded: false,
      refId: `IMPS-${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    setTransactions((prev) => [withdrawalTx, ...prev]);
    setIsUpdatedFlash(true);
    setTimeout(() => setIsUpdatedFlash(false), 700);
  };

  // Quick Deposit tool to simulate adding funds and triggering Smart Resume
  const handleDepositMainBalance = (amount = 2000) => {
    setMainBalance((prev) => +(prev + amount).toFixed(2));
    setIsUpdatedFlash(true);
    setTimeout(() => setIsUpdatedFlash(false), 700);
  };

  // Set specific Main Balance (e.g. for testing low balance pause)
  const handleSetSimulatedMainBalance = (targetAmount) => {
    setMainBalance(targetAmount);
    setIsUpdatedFlash(true);
    setTimeout(() => setIsUpdatedFlash(false), 700);
  };

  const handleAddGoal = (newGoal) => {
    setPots((prev) => [...prev, newGoal]);
  };

  const handleBoostPot = (potId, amount = 50) => {
    if (mainBalance < amount) return;

    setMainBalance((prev) => Math.max(0, +(prev - amount).toFixed(2)));
    let completed = false;

    setPots((prev) =>
      prev.map((p) => {
        if (p.id === potId) {
          const nextVal = +(p.currentAmount + amount).toFixed(2);
          if (nextVal >= p.targetAmount && p.currentAmount < p.targetAmount) {
            completed = true;
          }
          return { ...p, currentAmount: nextVal };
        }
        return p;
      })
    );

    setIsUpdatedFlash(true);
    setTimeout(() => setIsUpdatedFlash(false), 700);

    if (completed) {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.5 },
      });
    }
  };

  const handleResetDemo = () => {
    setMainBalance(10000);
    setSafeFloor(1000);
    setDailyLimit(200);
    setTodaySaved(42.0);
    setPots(INITIAL_POTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setLatestFeedbackTx(null);
    setStreakDays(12);
  };

  return (
    <div className="android-device-outer">
      {/* Native Android Mobile Chassis */}
      <div className="android-phone-frame">
        {/* Android System Status Bar with Camera Hole & System Metrics */}
        <AndroidStatusBar />

        {/* Prototype / Simulation Mandatory Regulatory Disclosure */}
        <div className="prototype-simulation-disclosure" role="region" aria-label="Prototype Disclosure">
          <ShieldCheck size={11} className="disclosure-shield-icon" />
          <span>PROTOTYPE SIMULATION • ZERO REAL MONEY • NO UPI PIN COLLECTED</span>
        </div>

        {/* Scrollable Screen Content */}
        <div className="android-screen-scroll">
          {/* TAB 1: HOME OVERVIEW */}
          {activeTab === 'home' && (
            <div className="screen-section animate-slide-down">
              <Header
                mainBalance={mainBalance}
                vaultBalance={vaultBalance}
                safeFloor={safeFloor}
                isSmartPaused={isSmartPaused}
                streakDays={streakDays}
                isUpdatedFlash={isUpdatedFlash}
                activePot={activePot}
                onQuickSimulate={() => setActiveTab('simulator')}
                onOpenVault={() => setActiveTab('vault')}
              />

              <div className="screen-inner-content">
                {/* Real-time Feedback Banner if a payment was recently simulated */}
                {latestFeedbackTx && (
                  <FeedbackBanner
                    transaction={latestFeedbackTx}
                    onDismiss={() => setLatestFeedbackTx(null)}
                  />
                )}

                {/* Behavioral & Telemetry Metrics */}
                <BehavioralMetrics
                  transactions={transactions}
                  totalSaved={vaultBalance}
                />

                {/* Active Goal Pot Glance */}
                <div className="home-preview-section">
                  <div className="preview-heading-row">
                    <span className="preview-label">ACTIVE SAVINGS POT</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('pots')}
                      className="preview-all-link"
                    >
                      All Goals ({pots.length}) ›
                    </button>
                  </div>

                  {activePot && (
                    <div 
                      className="home-active-pot-card clickable-pot"
                      onClick={() => setActiveTab('pots')}
                    >
                      <div className="pot-glance-top">
                        <div className="glance-title-row">
                          <span className="glance-name">{activePot.name}</span>
                          <span className="glance-milestone-pill">{activePot.milestone || 'In Progress'}</span>
                        </div>
                        <span className="glance-fraction tabular">
                          ₹{activePot.currentAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} / ₹{activePot.targetAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="glance-progress-track">
                        <div
                          className="glance-progress-fill"
                          style={{
                            width: '100%',
                            transform: `scaleX(${Math.min(1, activePot.currentAmount / activePot.targetAmount)})`,
                          }}
                        />
                      </div>
                      <div className="glance-meta-row">
                        <span className="glance-note">{activePot.description}</span>
                        <span className="glance-percent tabular">
                          {Math.min(100, Math.round((activePot.currentAmount / activePot.targetAmount) * 100))}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Escrow Vault Teaser with 1-Tap Withdrawal Link */}
                <div className="home-vault-teaser-card">
                  <div className="teaser-left">
                    <div className="teaser-vault-icon">
                      <Lock size={15} />
                    </div>
                    <div className="teaser-text">
                      <span className="teaser-title">PennyWise Escrow Vault</span>
                      <span className="teaser-sub">RBI Partnered • 100% Liquid Custody</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('vault')}
                    className="teaser-cta-chip"
                  >
                    Manage Vault ›
                  </button>
                </div>

                {/* Recent Sweeps Activity */}
                <div className="home-recent-activity">
                  <div className="preview-heading-row">
                    <span className="preview-label">RECENT PERCENTAGE SWEEPS</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ledger')}
                      className="preview-all-link"
                    >
                      Full Ledger ›
                    </button>
                  </div>

                  <div className="mini-activity-list">
                    {transactions.slice(0, 3).map((tx) => (
                      <div key={tx.id} className="mini-activity-row">
                        <div className="mini-meta">
                          <div className="mini-top">
                            <span className="mini-merchant">{tx.merchantName || tx.categoryLabel}</span>
                            <span className="mini-slab-badge">{tx.rateLabel || '0%'}</span>
                          </div>
                          <span className="mini-time tabular">{tx.timestamp}</span>
                        </div>
                        <div className="mini-values text-right">
                          {tx.saved > 0 ? (
                            <span className="mini-saved-mint tabular">+₹{Number(tx.saved).toFixed(2)}</span>
                          ) : (
                            <span className="mini-saved-zero tabular">₹0.00 ({tx.status || 'Halted'})</span>
                          )}
                          <span className="mini-spent tabular">Paid ₹{Number(tx.spent).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIMULATOR TERMINAL */}
          {activeTab === 'simulator' && (
            <div className="screen-section animate-slide-down">
              <TransactionSimulator
                mainBalance={mainBalance}
                safeFloor={safeFloor}
                dailyLimit={dailyLimit}
                todaySaved={todaySaved}
                activePot={activePot}
                onSimulatePayment={handleSimulatePayment}
              />
            </div>
          )}

          {/* TAB 3: ESCROW VAULT & 1-TAP EMERGENCY WITHDRAWAL */}
          {activeTab === 'vault' && (
            <div className="screen-section animate-slide-down">
              <VaultView
                vaultBalance={vaultBalance}
                mainBalance={mainBalance}
                safeFloor={safeFloor}
                dailyLimit={dailyLimit}
                todaySaved={todaySaved}
                isSmartPaused={isSmartPaused}
                onEmergencyWithdrawal={handleEmergencyWithdrawal}
                onUpdateSafeFloor={setSafeFloor}
                onUpdateDailyLimit={setDailyLimit}
                onDepositMainBalance={handleDepositMainBalance}
                onSetSimulatedMainBalance={handleSetSimulatedMainBalance}
              />
            </div>
          )}

          {/* TAB 4: GOAL-BASED SAVINGS POTS */}
          {activeTab === 'pots' && (
            <div className="screen-section animate-slide-down">
              <SavingsPotsGrid
                pots={pots}
                onSetActivePot={handleSetActivePot}
                onAddGoal={handleAddGoal}
                onBoostPot={handleBoostPot}
              />
            </div>
          )}

          {/* TAB 5: TRANSACTION LEDGER */}
          {activeTab === 'ledger' && (
            <div className="screen-section animate-slide-down">
              <TransactionHistory transactions={transactions} />
            </div>
          )}

          {/* Quick Demo Reset Utility at bottom of screen scroll */}
          <div className="mobile-reset-bar">
            <button
              type="button"
              onClick={handleResetDemo}
              className="m-reset-btn"
              title="Reset all prototype balances and sample data"
            >
              <RotateCcw size={12} />
              <span>Reset Prototype Demo State</span>
            </button>
          </div>
        </div>

        {/* Floating Android Snackbar */}
        <AndroidSnackbar
          transaction={latestFeedbackTx}
          onDismiss={() => setLatestFeedbackTx(null)}
          onViewPot={() => {
            setLatestFeedbackTx(null);
            setActiveTab('pots');
          }}
        />

        {/* Material 3 Bottom Navigation Bar */}
        <AndroidNavBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </div>
    </div>
  );
}
