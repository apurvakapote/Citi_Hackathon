import React, { useState } from 'react';
import { 
  AlertCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  History, 
  Search, 
  ShieldCheck 
} from 'lucide-react';

export default function TransactionHistory({ transactions }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter((tx) => {
    const matchesCategory =
      filterCategory === 'all' || tx.category === filterCategory;
    const matchesSearch =
      (tx.categoryLabel && tx.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.goalName && tx.goalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.refId && tx.refId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.slabLabel && tx.slabLabel.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalSavedInView = filtered.reduce((acc, curr) => acc + (curr.saved || 0), 0);

  return (
    <div className="native-ledger-container">
      {/* Header */}
      <div className="ledger-top-bar">
        <div>
          <h2 className="ledger-title">Transaction Ledger</h2>
          <span className="ledger-caption">Immutable record of percentage auto-sweeps</span>
        </div>

        <div className="ledger-total-badge">
          <span>Logged:</span>
          <strong className="tabular">+₹{totalSavedInView.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="ledger-controls-row">
        <div className="ledger-filter-chips">
          {[
            { id: 'all', label: 'All' },
            { id: 'chai', label: 'Chai' },
            { id: 'dining', label: 'Dining' },
            { id: 'grocery', label: 'Kirana' },
            { id: 'travel', label: 'Travel' },
            { id: 'gadget', label: 'Gadget' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`ledger-filter-chip ${filterCategory === cat.id ? 'is-active' : ''}`}
              onClick={() => setFilterCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="ledger-search-box">
          <Search size={13} className="search-icon-dim" />
          <input
            type="text"
            placeholder="Search ref, pot, slab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-native-input"
          />
        </div>
      </div>

      {/* Edge-to-Edge List */}
      <div className="native-ledger-list">
        {filtered.length === 0 ? (
          <div className="ledger-empty-view">
            <ShieldCheck size={28} className="empty-shield" />
            <span className="empty-heading">No matching sweep records</span>
            <span className="empty-desc">Simulate a payment in the terminal to see percentage sweep records logged here.</span>
          </div>
        ) : (
          filtered.map((tx) => {
            const isExcluded = tx.isExcluded || tx.saved === 0;
            return (
              <div key={tx.id} className="native-ledger-row">
                <div className="ledger-row-left">
                  <div className={`ledger-cat-icon ${isExcluded ? 'is-excluded-icon' : ''}`}>
                    <span>{(tx.rateLabel || '0%').replace('%', '')}%</span>
                  </div>
                  <div className="ledger-row-info">
                    <div className="ledger-row-title-row">
                      <span className="ledger-row-title">{tx.goalName}</span>
                      <span className={`ledger-slab-tag ${isExcluded ? 'tag-warn' : 'tag-rate'}`}>
                        {tx.rateLabel ? `${tx.rateLabel} slab` : '0%'}
                      </span>
                    </div>
                    <span className="ledger-row-meta tabular">
                      {tx.timestamp} • {tx.refId}
                    </span>
                  </div>
                </div>

                <div className="ledger-row-right text-right">
                  {tx.saved > 0 ? (
                    <span className="ledger-row-saved tabular">+₹{Number(tx.saved).toFixed(2)}</span>
                  ) : (
                    <span className="ledger-row-paused tabular">₹0.00 ({tx.status || 'Halted'})</span>
                  )}
                  <span className="ledger-row-spent tabular">Paid ₹{Number(tx.spent).toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
