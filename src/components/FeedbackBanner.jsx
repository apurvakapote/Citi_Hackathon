import React from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  X 
} from 'lucide-react';

export default function FeedbackBanner({ transaction, onDismiss }) {
  if (!transaction) return null;

  const isPaused = transaction.sweepStatusNotice === 'PAUSED_LOW_BALANCE';
  const isExcluded = transaction.isExcluded;
  const isCapped = transaction.sweepStatusNotice === 'CAPPED_BY_DAILY_LIMIT';

  return (
    <section 
      className={`pennywise-feedback-alert animate-slide-down ${isPaused ? 'alert-warning-theme' : isExcluded ? 'alert-neutral-theme' : ''}`} 
      aria-live="polite"
    >
      <div className="alert-content-row">
        <div className="alert-badge-seal">
          {isPaused ? (
            <AlertTriangle size={20} className="alert-crimson-icon" strokeWidth={2.5} />
          ) : isExcluded ? (
            <ShieldAlert size={20} className="alert-dim-icon" strokeWidth={2.5} />
          ) : (
            <CheckCircle2 size={22} className="alert-seal-icon" strokeWidth={2.5} />
          )}
        </div>

        <div className="alert-body-col">
          <div className="alert-top-meta">
            {isPaused ? (
              <span className="alert-status-pill pill-crimson">SMART PAUSE TRIGGERED</span>
            ) : isExcluded ? (
              <span className="alert-status-pill pill-neutral">LARGE TRANSACTION EXCLUDED</span>
            ) : (
              <span className="alert-status-pill">PERCENTAGE SWEEP EXECUTED</span>
            )}
            <span className="alert-timestamp tabular">{transaction.timestamp}</span>
            <span className="alert-ref tabular">ID: {transaction.refId}</span>
          </div>

          <div className="alert-math-breakdown">
            <div className="alert-math-node">
              <span className="math-node-label">PAID AMOUNT</span>
              <span className="math-node-val tabular">₹{Number(transaction.spent).toLocaleString('en-IN')}</span>
            </div>

            <ArrowRight size={14} className="math-node-sep" />

            <div className="alert-math-node">
              <span className="math-node-label">SLAB APPLIED</span>
              <span className="math-node-val tabular">{transaction.rateLabel || '0%'}</span>
            </div>

            <ArrowRight size={14} className="math-node-sep" />

            <div className={`alert-math-node ${transaction.saved > 0 ? 'node-saved-mint' : 'node-saved-dim'}`}>
              <span className="math-node-label">SWEPT TO VAULT</span>
              <span className="math-node-val-large tabular">
                {transaction.saved > 0 ? `+₹${Number(transaction.saved).toFixed(2)}` : '₹0.00'}
              </span>
            </div>
          </div>

          <div className="alert-allocation-footer">
            {isPaused ? (
              <span className="alert-paused-note">
                Auto-sweep was halted to protect your Safe-to-Save minimum floor. Essential funds safeguarded!
              </span>
            ) : isExcluded ? (
              <span className="alert-paused-note">
                Transactions above ₹10,000 are exempted from auto-sweeps to preserve liquid operating capital.
              </span>
            ) : (
              <>
                <Sparkles size={13} className="accent-mint-icon" />
                <span>
                  Allocated to <strong>{transaction.goalName}</strong> in PennyWise Escrow Vault.
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="alert-close-btn"
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>
      </div>
    </section>
  );
}
