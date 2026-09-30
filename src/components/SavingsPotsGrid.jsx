import React, { useState } from 'react';
import { 
  Check, 
  GraduationCap, 
  IndianRupee, 
  Laptop, 
  Palmtree, 
  Plus, 
  ShieldAlert, 
  Sparkles, 
  Target, 
  Trophy, 
  Wrench, 
  X 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const POT_ICONS = {
  ShieldAlert: ShieldAlert,
  Laptop: Laptop,
  Palmtree: Palmtree,
  GraduationCap: GraduationCap,
  Sparkles: Sparkles,
  Wrench: Wrench,
  Target: Target,
};

function getMilestoneBadge(percentage) {
  if (percentage >= 100) return { label: '🏆 Fully Funded', class: 'milestone-complete' };
  if (percentage >= 75) return { label: '⭐ Almost There', class: 'milestone-high' };
  if (percentage >= 50) return { label: '🔥 Halfway Milestone', class: 'milestone-mid' };
  if (percentage >= 25) return { label: '⚡ Building Momentum', class: 'milestone-low' };
  return { label: '🌱 Just Started', class: 'milestone-start' };
}

export default function SavingsPotsGrid({
  pots,
  onSetActivePot,
  onAddGoal,
  onBoostPot,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('20000');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [switchingPotId, setSwitchingPotId] = useState(null);

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalTarget) return;

    onAddGoal({
      id: `goal-${Date.now()}`,
      name: newGoalName.trim(),
      icon: 'Target',
      targetAmount: parseFloat(newGoalTarget),
      currentAmount: 0,
      color: '#10b981',
      description: newGoalDesc.trim() || 'Custom financial goal',
      isActive: false,
    });

    setNewGoalName('');
    setNewGoalTarget('20000');
    setNewGoalDesc('');
    setShowAddModal(false);
  };

  const handleSelectPot = (id) => {
    setSwitchingPotId(id);
    onSetActivePot(id);
    setTimeout(() => setSwitchingPotId(null), 300);
  };

  return (
    <div className="native-pots-container">
      {/* Section Header */}
      <div className="pots-section-header-bar">
        <div>
          <h2 className="pots-view-title">Goal-Based Savings Pots</h2>
          <span className="pots-view-caption">Direct percentage micro-sweeps into personal milestones</span>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(!showAddModal)}
          className="native-add-pot-trigger"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Add Goal Drawer */}
      {showAddModal && (
        <div className="native-add-goal-sheet animate-slide-down">
          <div className="sheet-top-label">
            <span>CREATE FINANCIAL GOAL</span>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="sheet-x-btn"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleCreateGoal} className="sheet-form">
            <div className="sheet-input-group">
              <label className="sheet-label" htmlFor="pot-title-input">GOAL NAME</label>
              <input
                id="pot-title-input"
                type="text"
                placeholder="e.g. Electric Bike, Higher Studies"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                className="sheet-native-input"
                required
              />
            </div>

            <div className="sheet-input-group">
              <label className="sheet-label" htmlFor="pot-target-input">TARGET AMOUNT (₹)</label>
              <input
                id="pot-target-input"
                type="number"
                min="500"
                step="500"
                placeholder="20000"
                value={newGoalTarget}
                onChange={(e) => setNewGoalTarget(e.target.value)}
                className="sheet-native-input tabular"
                required
              />
            </div>

            <div className="sheet-input-group">
              <label className="sheet-label" htmlFor="pot-desc-input">PURPOSE / NOTES</label>
              <input
                id="pot-desc-input"
                type="text"
                placeholder="Target date or importance"
                value={newGoalDesc}
                onChange={(e) => setNewGoalDesc(e.target.value)}
                className="sheet-native-input"
              />
            </div>

            <div className="sheet-button-row">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="sheet-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="sheet-confirm">
                Create Pot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goal Cards List */}
      <div className="native-pots-list">
        {pots.map((pot) => {
          const IconCmp = POT_ICONS[pot.icon] || Target;
          const percentage = Math.min(
            100,
            Math.round((pot.currentAmount / pot.targetAmount) * 100)
          );
          const isComplete = pot.currentAmount >= pot.targetAmount;
          const remaining = Math.max(0, pot.targetAmount - pot.currentAmount);
          const isSwitching = switchingPotId === pot.id;
          const badge = getMilestoneBadge(percentage);

          return (
            <div
              key={pot.id}
              className={`native-pot-row ${pot.isActive ? 'is-active-destination' : ''} ${
                isSwitching ? 'is-switching' : ''
              }`}
              onClick={() => handleSelectPot(pot.id)}
            >
              {/* Row Left: Icon & Title info */}
              <div className="pot-row-left">
                <div className="pot-row-icon">
                  <IconCmp size={18} strokeWidth={2.25} />
                </div>
                <div className="pot-row-details">
                  <div className="pot-row-title-line">
                    <span className="pot-row-title">{pot.name}</span>
                    {pot.isActive && (
                      <span className="pot-active-indicator-tag">ACTIVE DESTINATION</span>
                    )}
                  </div>
                  <span className="pot-row-subtext">{pot.description}</span>

                  {/* Milestone Badge Pill */}
                  <div className="pot-milestone-wrapper">
                    <span className={`milestone-badge-tag ${badge.class}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Horizontal Mint Progress Track */}
                  <div className="pot-row-meter-track">
                    <div
                      className="pot-row-meter-fill"
                      style={{
                        width: '100%',
                        transform: `scaleX(${percentage / 100})`,
                      }}
                    />
                  </div>

                  <div className="pot-row-meta-line">
                    <span className="pot-row-remaining">
                      {isComplete ? 'Goal 100% Achieved! 🎉' : `₹${remaining.toLocaleString('en-IN')} to target`}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBoostPot(pot.id, 50);
                      }}
                      className="pot-row-boost-chip"
                      title="Add a manual ₹50 boost"
                    >
                      <Plus size={10} strokeWidth={2.5} />
                      <span>+₹50 Boost</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Row Right: Amounts & Percentage */}
              <div className="pot-row-right text-right">
                <span className="pot-row-amount tabular">
                  ₹{pot.currentAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </span>
                <span className="pot-row-denom tabular">
                  of ₹{pot.targetAmount.toLocaleString('en-IN')}
                </span>
                <span className="pot-row-percent tabular">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
