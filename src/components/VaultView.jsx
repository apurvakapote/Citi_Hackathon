import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  IndianRupee, 
  Info, 
  Landmark, 
  Lock, 
  Plus, 
  RefreshCw, 
  RotateCcw, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  Vault, 
  Wallet, 
  Zap 
} from 'lucide-react';

export default function VaultView({
  vaultBalance,
  mainBalance,
  safeFloor,
  dailyLimit,
  todaySaved,
  isSmartPaused,
  onEmergencyWithdrawal,
  onUpdateSafeFloor,
  onUpdateDailyLimit,
  onDepositMainBalance,
  onSetSimulatedMainBalance,
}) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState(null);

  const handleTriggerWithdrawal = () => {
    if (vaultBalance <= 0) return;
    setConfirmModalOpen(true);
  };

  const handleConfirmWithdrawal = () => {
    const amount = vaultBalance;
    onEmergencyWithdrawal();
    setConfirmModalOpen(false);
    setWithdrawSuccessMsg(`₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} instantly transferred from Escrow Vault to your Main Bank Account.`);
    setTimeout(() => setWithdrawSuccessMsg(null), 6000);
  };

  const todayProgressPercent = Math.min(100, Math.round((todaySaved / dailyLimit) * 100));

  return (
    <div className="native-vault-container">
      {/* Top Section Header */}
      <div className="vault-screen-header">
        <div>
          <h2 className="vault-main-title">PennyWise Escrow Vault</h2>
          <span className="vault-sub-caption">RBI Partnered Custody & Safe-to-Save Controls</span>
        </div>

        <div className="rbi-official-badge">
          <ShieldCheck size={14} className="badge-shield-icon" />
          <span>RBI REGISTERED</span>
        </div>
      </div>

      {withdrawSuccessMsg && (
        <div className="vault-success-alert animate-slide-down" role="alert">
          <CheckCircle2 size={16} className="alert-mint-icon" />
          <div className="alert-copy">
            <strong>Emergency Withdrawal Successful!</strong>
            <p>{withdrawSuccessMsg}</p>
          </div>
        </div>
      )}

      {/* Hero Escrow Vault Showcase */}
      <div className="escrow-hero-card">
        <div className="escrow-header-strip">
          <div className="escrow-brand-lockup">
            <div className="vault-shield-bubble">
              <Vault size={18} strokeWidth={2.25} />
            </div>
            <div>
              <span className="escrow-custody-label">ESCROW CUSTODY ACCOUNT</span>
              <span className="escrow-account-num tabular">ACC: #PW-RBI-8921-ESCROW</span>
            </div>
          </div>

          <div className="escrow-liquid-pill">
            <span className="pulse-mint-dot" />
            <span>100% LIQUID</span>
          </div>
        </div>

        {/* Big Vault Metric */}
        <div className="escrow-balance-section">
          <span className="escrow-metric-sub">TOTAL ACCUMULATED ASSETS</span>
          <div className="escrow-giant-number-row">
            <span className="escrow-rupee">₹</span>
            <span className="escrow-giant-digits tabular">
              {vaultBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="escrow-guarantee-note">
            Held safely in escrow with scheduled partner bank. Protected by multi-sig autonomous sweep architecture.
          </p>
        </div>

        {/* PROMINENT 1-TAP EMERGENCY WITHDRAWAL BUTTON */}
        <div className="emergency-action-container">
          <button
            type="button"
            onClick={handleTriggerWithdrawal}
            disabled={vaultBalance <= 0}
            className={`emergency-withdrawal-btn ${vaultBalance <= 0 ? 'is-disabled' : ''}`}
          >
            <ArrowDownLeft size={18} strokeWidth={2.75} />
            <span>1-Tap Emergency Withdrawal to Main Account</span>
          </button>
          <span className="emergency-hint">
            Instant IMPS sweep to linked Main Bank Account • Zero exit load • 24x7 instant credit
          </span>
        </div>
      </div>

      {/* Confirmation Modal for Emergency Withdrawal */}
      {confirmModalOpen && (
        <div className="native-modal-backdrop animate-fade-in">
          <div className="native-confirm-sheet animate-slide-up">
            <div className="sheet-warning-icon-wrap">
              <AlertTriangle size={24} className="sheet-crimson-icon" />
            </div>
            <h3 className="sheet-title">Confirm Emergency Withdrawal</h3>
            <p className="sheet-desc">
              Are you sure you want to withdraw <strong>₹{vaultBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> from the Escrow Vault directly into your Main Bank Account?
            </p>

            <div className="sheet-transfer-breakdown">
              <div className="sheet-breakdown-row">
                <span>From:</span>
                <strong>PennyWise Escrow Vault</strong>
              </div>
              <div className="sheet-breakdown-row">
                <span>To:</span>
                <strong>Main Bank Account (Simulated)</strong>
              </div>
              <div className="sheet-breakdown-row">
                <span>Transfer Speed:</span>
                <strong className="mint-text">Instant (IMPS 0-sec)</strong>
              </div>
            </div>

            <div className="sheet-btn-actions">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="sheet-btn-secondary"
              >
                Keep in Vault
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdrawal}
                className="sheet-btn-primary"
              >
                Confirm & Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAFE-TO-SAVE PROTECTIVE RULES SECTION */}
      <div className="safe-engine-section">
        <div className="safe-section-title-row">
          <div className="title-with-icon">
            <ShieldCheck size={16} className="safe-mint-icon" />
            <h3 className="safe-section-title">Safe-to-Save Protective Engine</h3>
          </div>
          <span className="safe-auto-tag">AUTONOMOUS GUARD</span>
        </div>
        <p className="safe-section-desc">
          Automated safety thresholds prevent micro-savings from ever endangering your essential living expenses.
        </p>

        {/* Floor Rule Card */}
        <div className="rule-configuration-card">
          <div className="rule-header-row">
            <div className="rule-title-group">
              <span className="rule-name">Minimum Balance Floor</span>
              <span className="rule-explanation">Auto-sweeps pause if Main Balance drops below this</span>
            </div>
            <span className="rule-current-val tabular">₹{safeFloor.toLocaleString('en-IN')}</span>
          </div>

          <div className="rule-chips-row">
            {[500, 1000, 2000, 5000].map((floorVal) => (
              <button
                key={floorVal}
                type="button"
                className={`rule-choice-chip ${safeFloor === floorVal ? 'is-selected' : ''}`}
                onClick={() => onUpdateSafeFloor(floorVal)}
              >
                ₹{floorVal.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div className="rule-status-glance">
            <span>Current Main Balance: <strong>₹{mainBalance.toLocaleString('en-IN')}</strong></span>
            {mainBalance < safeFloor ? (
              <span className="status-danger tabular">⚠️ BREACHED (Paused)</span>
            ) : (
              <span className="status-ok tabular">✓ BUFFER: ₹{(mainBalance - safeFloor).toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>

        {/* Daily Savings Limit Card */}
        <div className="rule-configuration-card">
          <div className="rule-header-row">
            <div className="rule-title-group">
              <span className="rule-name">Daily Savings Limit</span>
              <span className="rule-explanation">Strict cap on total micro-savings per calendar day</span>
            </div>
            <span className="rule-current-val tabular">₹{dailyLimit.toLocaleString('en-IN')}</span>
          </div>

          <div className="rule-chips-row">
            {[100, 200, 500, 1000].map((limitVal) => (
              <button
                key={limitVal}
                type="button"
                className={`rule-choice-chip ${dailyLimit === limitVal ? 'is-selected' : ''}`}
                onClick={() => onUpdateDailyLimit(limitVal)}
              >
                ₹{limitVal.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Daily Progress Bar */}
          <div className="daily-progress-container">
            <div className="progress-labels-row">
              <span>Today's Accumulated Sweeps:</span>
              <strong className="tabular">₹{todaySaved.toFixed(2)} / ₹{dailyLimit}</strong>
            </div>
            <div className="daily-progress-track">
              <div 
                className="daily-progress-fill" 
                style={{ width: `${todayProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SIMULATED BANK TEST CONTROLS */}
      <div className="simulated-bank-tools">
        <div className="tools-title-row">
          <Landmark size={15} />
          <span>SIMULATED MAIN ACCOUNT CONTROLS</span>
        </div>
        <p className="tools-caption">
          Quickly test Smart Pause & Auto-Resume behaviors by adjusting simulated funds:
        </p>

        <div className="tools-actions-grid">
          <button
            type="button"
            onClick={() => onDepositMainBalance(2000)}
            className="tool-btn btn-deposit"
          >
            <Plus size={14} />
            <span>+₹2,000 Quick Deposit (Auto-Resumes if Paused)</span>
          </button>

          <button
            type="button"
            onClick={() => onSetSimulatedMainBalance(800)}
            className="tool-btn btn-low-bal"
          >
            <AlertTriangle size={14} />
            <span>Set Balance to ₹800 (Triggers Low-Balance Pause)</span>
          </button>

          <button
            type="button"
            onClick={() => onSetSimulatedMainBalance(10000)}
            className="tool-btn btn-reset"
          >
            <RotateCcw size={14} />
            <span>Reset Main Balance to ₹10,000</span>
          </button>
        </div>
      </div>
    </div>
  );
}
