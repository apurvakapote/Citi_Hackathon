import React from 'react';
import { History, Home, QrCode, Target, Vault } from 'lucide-react';

export default function AndroidNavBar({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'simulator', label: 'Simulate', icon: QrCode },
    { id: 'vault', label: 'Vault', icon: Vault },
    { id: 'pots', label: 'Pots', icon: Target },
    { id: 'ledger', label: 'Ledger', icon: History },
  ];

  return (
    <nav className="native-android-bottom-nav" aria-label="Bottom Navigation">
      <div className="nav-items-row">
        {tabs.map((tab) => {
          const IconCmp = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`nav-tab-button ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelectTab(tab.id)}
            >
              <div className="tab-icon-wrapper">
                <IconCmp size={19} strokeWidth={isSelected ? 2.5 : 2} />
              </div>
              <span className="tab-title">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Android Gesture Navigation Indicator */}
      <div className="android-home-gesture-pill" />
    </nav>
  );
}
