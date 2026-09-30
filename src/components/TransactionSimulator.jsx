import React, { useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  ArrowRight, 
  Car, 
  Coffee, 
  HeartPulse, 
  HelpCircle, 
  IndianRupee, 
  Info, 
  Plane, 
  RotateCcw, 
  Send, 
  ShieldAlert, 
  ShieldCheck, 
  ShoppingCart, 
  Smartphone, 
  Sparkles, 
  Utensils, 
  Zap 
} from 'lucide-react';
import { 
  calculatePercentageSavings, 
  EXPENSE_CATEGORIES, 
  PERCENTAGE_SLABS, 
  QUICK_PRESETS 
} from '../data/initialData';

const CATEGORY_ICONS = {
  Coffee: Coffee,
  Car: Car,
  ShoppingCart: ShoppingCart,
  Utensils: Utensils,
  Plane: Plane,
  Smartphone: Smartphone,
};

export default function TransactionSimulator({
  mainBalance,
  safeFloor,
  dailyLimit,
  todaySaved,
  activePot,
  onSimulatePayment,
}) {
  const [amount, setAmount] = useState('40');
  const [selectedCategory, setSelectedCategory] = useState('chai');
  const [merchantName, setMerchantName] = useState('Sharma Tea Stall');
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const numAmount = parseFloat(amount) || 0;
  const calc = calculatePercentageSavings(numAmount);

  // Protective Floor Check: (Main Balance - Calculated Savings) < Safe Floor
  const willTriggerSmartPause = numAmount > 0 && (mainBalance - calc.saved) < safeFloor;
  
  // Daily Limit Check
  const remainingDailyAllowance = Math.max(0, dailyLimit - todaySaved);
  const willExceedDailyLimit = !calc.isExcluded && calc.saved > 0 && (todaySaved + calc.saved > dailyLimit);
  
  // Effective savings to be swept
  let effectiveSaved = calc.saved;
  let sweepStatusNotice = null;

  if (calc.isExcluded) {
    effectiveSaved = 0;
    sweepStatusNotice = 'EXCLUDED_LARGE_TX';
  } else if (willTriggerSmartPause) {
    effectiveSaved = 0;
    sweepStatusNotice = 'PAUSED_LOW_BALANCE';
  } else if (remainingDailyAllowance <= 0) {
    effectiveSaved = 0;
    sweepStatusNotice = 'DAILY_LIMIT_REACHED';
  } else if (todaySaved + calc.saved > dailyLimit) {
    effectiveSaved = +(remainingDailyAllowance).toFixed(2);
    sweepStatusNotice = 'CAPPED_BY_DAILY_LIMIT';
  }

  const handlePresetClick = (preset, idx) => {
    setAmount(preset.amount.toString());
    setSelectedCategory(preset.category);
    setMerchantName(preset.label);
    setActivePresetIndex(idx);
    setErrorMsg('');
  };

  const handleAdjustAmount = (delta) => {
    const nextVal = Math.max(1, (parseFloat(amount) || 0) + delta);
    setAmount(nextVal.toString());
    setActivePresetIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numAmount || numAmount <= 0) {
      setErrorMsg('Enter an amount greater than ₹0');
      return;
    }

    if (!activePot) {
      setErrorMsg('Choose an active destination savings pot first');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    setTimeout(() => {
      onSimulatePayment({
        spent: numAmount,
        rawCalculatedSavings: calc.saved,
        saved: effectiveSaved,
        rateLabel: calc.rateLabel,
        slabLabel: calc.slabLabel,
        slabId: calc.slabId,
        category: selectedCategory,
        categoryLabel: EXPENSE_CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Expense',
        merchantName: merchantName || 'UPI Merchant',
        goalId: activePot.id,
        goalName: activePot.name,
        isExcluded: calc.isExcluded,
        exclusionReason: calc.exclusionReason,
        sweepStatusNotice,
        explanation: calc.explanation,
      });
      setIsProcessing(false);
    }, 250);
  };

  return (
    <div className="native-simulator-flow">
      {/* Top Header */}
      <div className="simulator-section-heading">
        <h2 className="sim-title">UPI Payment Terminal</h2>
        <span className="sim-sub">Percentage Slab Auto-Sweep & Safe-to-Save Engine</span>
      </div>

      {/* Percentage Slabs Architecture Bar */}
      <div className="sim-slabs-overview">
        <span className="sim-strip-label">ACTIVE PERCENTAGE SLABS:</span>
        <div className="sim-slabs-strip">
          {PERCENTAGE_SLABS.map((slab) => {
            const isCurrentlyActive = calc.slabId === slab.id;
            return (
              <div 
                key={slab.id} 
                className={`slab-indicator-chip ${isCurrentlyActive ? 'is-active-slab' : ''}`}
                title={slab.description}
              >
                <span className="slab-rate">{slab.percent > 0 ? `${slab.percent}%` : '0%'}</span>
                <span className="slab-range">{slab.label.split('(')[1]?.replace(')', '') || slab.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fast Presets Strip */}
      <div className="sim-presets-strip">
        <span className="sim-strip-label">TEST SCENARIOS (EACH SLAB):</span>
        <div className="sim-presets-scroll">
          {QUICK_PRESETS.map((preset, idx) => {
            const isSelected = activePresetIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                className={`sim-preset-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handlePresetClick(preset, idx)}
              >
                <span className="preset-name">{preset.label}</span>
                <strong className="preset-price tabular">₹{preset.amount}</strong>
                <span className="preset-note">{preset.slabNote}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="sim-form-container">
        {/* Giant Centered Amount Display */}
        <div className="sim-amount-hero">
          <span className="sim-field-meta">ENTER UPI PAYMENT AMOUNT</span>
          <div className="sim-amount-display-row">
            <span className="sim-rupee-sign">₹</span>
            <input
              id="spend-amount"
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setActivePresetIndex(null);
                setErrorMsg('');
              }}
              placeholder="0"
              className="sim-giant-input tabular"
              required
            />
            {amount && (
              <button
                type="button"
                onClick={() => { setAmount(''); setActivePresetIndex(null); }}
                className="sim-clear-icon"
                title="Clear"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>

          {/* Stepper shortcuts */}
          <div className="sim-stepper-row">
            <button type="button" onClick={() => handleAdjustAmount(10)} className="sim-step-chip">+₹10</button>
            <button type="button" onClick={() => handleAdjustAmount(100)} className="sim-step-chip">+₹100</button>
            <button type="button" onClick={() => handleAdjustAmount(500)} className="sim-step-chip">+₹500</button>
            <button type="button" onClick={() => handleAdjustAmount(2000)} className="sim-step-chip">+₹2,000</button>
            <button type="button" onClick={() => setAmount('12000')} className="sim-step-chip chip-crimson">₹12,000 (Exclude)</button>
          </div>
        </div>

        {/* Merchant Category Selector */}
        <div className="sim-category-section">
          <span className="sim-field-meta">MERCHANT CATEGORY</span>
          <div className="sim-category-scroll">
            {EXPENSE_CATEGORIES.map((cat) => {
              const IconCmp = CATEGORY_ICONS[cat.icon] || Coffee;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`sim-cat-chip ${isSelected ? 'is-active-cat' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setMerchantName(cat.label);
                  }}
                >
                  <IconCmp size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <div className="sim-error-line" role="alert">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LIVE DECISION EXPLANATION BOX */}
        <div className="sim-decision-box">
          <div className="decision-header-row">
            <div className="decision-title-lockup">
              <Sparkles size={14} className="accent-mint-icon" />
              <span className="decision-title">LIVE DECISION ENGINE</span>
            </div>
            <span className={`decision-slab-tag ${calc.isExcluded ? 'tag-excluded' : 'tag-mint'} tabular`}>
              {calc.rateLabel} applied
            </span>
          </div>

          {/* Math breakdown */}
          <div className="decision-metrics-row">
            <div className="decision-metric-item">
              <span className="metric-caption">SPENT</span>
              <span className="metric-val tabular">₹{numAmount.toLocaleString('en-IN')}</span>
            </div>

            <ArrowRight size={13} className="decision-arrow" />

            <div className="decision-metric-item">
              <span className="metric-caption">SLAB APPLIED</span>
              <span className="metric-val tabular">{calc.rateLabel}</span>
            </div>

            <ArrowRight size={13} className="decision-arrow" />

            <div className={`decision-metric-item ${effectiveSaved > 0 ? 'mint-highlight' : 'dim-highlight'}`}>
              <span className="metric-caption">AUTOSAVED</span>
              <span className="metric-val-large tabular">
                {effectiveSaved > 0 ? `+₹${effectiveSaved.toFixed(2)}` : '₹0.00'}
              </span>
            </div>
          </div>

          {/* Verbal Mathematical Explanation */}
          <div className="decision-text-explanation">
            <Info size={13} className="info-icon" />
            <span>{calc.explanation}</span>
          </div>

          {/* Safe-to-Save Status Guard */}
          <div className="decision-safety-status">
            {calc.isExcluded ? (
              <div className="safety-badge badge-warning">
                <AlertCircle size={13} />
                <span>Large transaction rule active: No savings swept for transactions exceeding ₹10,000.</span>
              </div>
            ) : willTriggerSmartPause ? (
              <div className="safety-badge badge-crimson">
                <AlertTriangle size={13} />
                <span>Smart Pause Triggered: Main balance (₹{mainBalance.toLocaleString('en-IN')}) would breach ₹{safeFloor.toLocaleString('en-IN')} floor. Auto-sweep halted!</span>
              </div>
            ) : willExceedDailyLimit ? (
              <div className="safety-badge badge-amber">
                <AlertCircle size={13} />
                <span>Daily Cap Limit: Today's savings hit limit of ₹{dailyLimit.toLocaleString('en-IN')} (Already saved ₹{todaySaved.toLocaleString('en-IN')}).</span>
              </div>
            ) : (
              <div className="safety-badge badge-safe">
                <ShieldCheck size={13} />
                <span>Safe-to-Save verified: Sweeping into <strong>{activePot ? activePot.name : 'Active Pot'}</strong>. Main balance remains safely above ₹{safeFloor.toLocaleString('en-IN')}.</span>
              </div>
            )}
          </div>
        </div>

        {/* Full-width Sticky CTA Button */}
        <button
          type="submit"
          disabled={isProcessing || !numAmount}
          className={`sim-execute-btn ${isProcessing ? 'is-loading' : ''} ${willTriggerSmartPause ? 'btn-warn' : ''}`}
        >
          {isProcessing ? (
            <span>Executing UPI Payment...</span>
          ) : (
            <>
              <Send size={16} strokeWidth={2.5} />
              <span>
                {effectiveSaved > 0 
                  ? `Pay ₹${numAmount} • Save ₹${effectiveSaved.toFixed(2)}`
                  : `Pay ₹${numAmount} • Save ₹0 (Protected)`}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
