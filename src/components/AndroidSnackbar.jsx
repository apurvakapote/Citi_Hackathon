import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert, X } from 'lucide-react';

export default function AndroidSnackbar({ transaction, onDismiss, onViewPot }) {
  if (!transaction) return null;

  const isPaused = transaction.sweepStatusNotice === 'PAUSED_LOW_BALANCE';
  const isExcluded = transaction.isExcluded;

  return (
    <div 
      className={`native-android-snackbar animate-slide-up ${isPaused ? 'snackbar-paused' : ''}`} 
      role="status" 
      aria-live="polite"
    >
      <div className="snackbar-left-block">
        {isPaused ? (
          <AlertTriangle size={16} className="snackbar-crimson-icon" strokeWidth={2.5} />
        ) : isExcluded ? (
          <ShieldAlert size={16} className="snackbar-dim-icon" strokeWidth={2.5} />
        ) : (
          <CheckCircle2 size={16} className="snackbar-mint-check" strokeWidth={2.5} />
        )}
        <div className="snackbar-text-group">
          <div className="snackbar-main-line">
            <span className="tabular">₹{transaction.spent}</span>
            <ArrowRight size={11} className="snackbar-arrow-sep" />
            <span className="snackbar-slab-chip tabular">{transaction.rateLabel || '0%'}</span>
            {transaction.saved > 0 ? (
              <span className="snackbar-mint-tag tabular">+₹{Number(transaction.saved).toFixed(2)} saved</span>
            ) : (
              <span className="snackbar-dim-tag tabular">₹0 saved ({isPaused ? 'Protected' : 'Excluded'})</span>
            )}
          </div>
          <span className="snackbar-destination-line">
            {isPaused 
              ? 'Halted by Safe-to-Save Floor' 
              : `Swept into ${transaction.goalName} Vault`}
          </span>
        </div>
      </div>

      <div className="snackbar-right-actions">
        {onViewPot && transaction.saved > 0 && (
          <button
            type="button"
            onClick={onViewPot}
            className="snackbar-view-link"
          >
            VIEW
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="snackbar-dismiss-icon"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
