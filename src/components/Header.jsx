import React from 'react';
import { 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Flame, 
  IndianRupee, 
  Landmark, 
  Lock, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Vault 
} from 'lucide-react';

export default function Header({
  mainBalance,
  vaultBalance,
  safeFloor,
  isSmartPaused,
  streakDays,
  isUpdatedFlash,
  activePot,
  onQuickSimulate,
  onOpenVault,
}) {
  return (
    <header className="native-header-container">
      {/* Native Top App Bar */}
      <div className="native-top-app-bar">
        <div className="app-brand-lockup">
          <div className="brand-crimson-mark">
            <IndianRupee size={16} strokeWidth={2.75} />
          </div>
          <div className="brand-text-block">
            <span className="brand-text-logo">PennyWise</span>
            <span className="brand-protocol-tag">PERCENTAGE ENGINE</span>
          </div>
        </div>

        <div className="app-top-badges">
          {/* Live Status Indicator Pill */}
          {isSmartPaused ? (
            <div className="telemetry-pill-paused" title={`Savings halted: Main balance below ₹${safeFloor} floor`}>
              <span className="telemetry-crimson-pip" />
              <span>PAUSED - LOW BAL</span>
            </div>
          ) : (
            <div className="telemetry-pill-active" title="Safe-to-Save protective rules active">
              <span className="telemetry-mint-pip" />
              <span>ACTIVE • SAFE</span>
            </div>
          )}

          <div className="streak-pill-amber" title={`${streakDays}-Day Consistent Micro-Saving Streak`}>
            <Flame size={13} className="flame-amber" />
            <span className="tabular">{streakDays}d</span>
          </div>
        </div>
      </div>

      {/* Dual Balances Display (Main Account & Escrow Vault side-by-side) */}
      <div className={`hero-dual-accounts-canvas ${isUpdatedFlash ? 'flash-mint' : ''}`}>
        <div className="dual-accounts-grid">
          {/* Main Account Card */}
          <div className="account-tile main-bank-tile">
            <div className="tile-top-row">
              <div className="tile-icon-box bank-icon-box">
                <Landmark size={14} />
              </div>
              <span className="tile-type-label">MAIN ACCOUNT</span>
            </div>

            <div className="tile-amount-row">
              <span className="tile-currency-symbol">₹</span>
              <span className="tile-metric-amount tabular">
                {mainBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="tile-floor-info">
              <span>Safe Floor: </span>
              <strong className="tabular">₹{safeFloor.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Escrow Vault Card */}
          <div 
            className="account-tile escrow-vault-tile clickable-tile"
            onClick={onOpenVault}
            title="Open PennyWise Escrow Vault details"
          >
            <div className="tile-top-row">
              <div className="tile-icon-box vault-icon-box">
                <Lock size={14} />
              </div>
              <div className="vault-label-group">
                <span className="tile-type-label-mint">ESCROW VAULT</span>
                <span className="rbi-verified-tag">RBI PARTNERED</span>
              </div>
            </div>

            <div className="tile-amount-row">
              <span className="tile-currency-symbol-mint">₹</span>
              <span className="tile-metric-amount-mint tabular">
                {vaultBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="tile-floor-info tile-withdraw-link">
              <span>1-Tap Emergency Withdrawal ›</span>
            </div>
          </div>
        </div>

        {/* Protection / Status Notice Bar */}
        {isSmartPaused ? (
          <div className="smart-pause-warning-bar animate-pulse-gentle">
            <AlertTriangle size={14} className="warning-crimson-icon" />
            <div className="warning-text">
              <strong>Smart Pause Activated:</strong> Main balance is near/below the ₹{safeFloor.toLocaleString('en-IN')} floor. Auto-sweep halted to preserve daily essentials.
            </div>
          </div>
        ) : (
          <div className="safe-status-bar">
            <ShieldCheck size={14} className="safe-mint-icon" />
            <span>Safe-to-Save verified: Micro-sweeps dynamically route into <strong>{activePot ? activePot.name : 'Active Pot'}</strong>.</span>
          </div>
        )}

        {/* Action Row */}
        <div className="hero-action-buttons-row">
          <button
            type="button"
            onClick={onQuickSimulate}
            className="native-hero-cta-btn"
          >
            <QrCode size={16} strokeWidth={2.5} />
            <span>Simulate UPI Payment</span>
          </button>

          <button
            type="button"
            onClick={onOpenVault}
            className="native-vault-secondary-btn"
          >
            <Vault size={16} />
            <span>Vault View</span>
          </button>
        </div>
      </div>
    </header>
  );
}
