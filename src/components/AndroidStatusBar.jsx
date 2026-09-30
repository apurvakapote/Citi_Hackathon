import React, { useState, useEffect } from 'react';
import { BatteryMedium, Signal, Wifi } from 'lucide-react';

export default function AndroidStatusBar() {
  const [timeStr, setTimeStr] = useState('10:45');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="android-status-bar" aria-hidden="true">
      <div className="status-bar-left">
        <span className="status-bar-clock tabular">{timeStr}</span>
      </div>

      {/* Centered Camera Punch-hole */}
      <div className="camera-punch-hole" />

      <div className="status-bar-right">
        <Signal size={13} className="status-icon" strokeWidth={2.5} />
        <Wifi size={13} className="status-icon" strokeWidth={2.5} />
        <div className="status-battery-wrap">
          <span className="battery-percent tabular">94%</span>
          <BatteryMedium size={15} className="status-icon battery-icon" strokeWidth={2.25} />
        </div>
      </div>
    </div>
  );
}
