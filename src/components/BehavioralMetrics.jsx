import React from 'react';
import { ShieldCheck, TrendingUp, Zap } from 'lucide-react';

export default function BehavioralMetrics({ transactions, totalSaved }) {
  const validSweeps = transactions.filter(t => t.saved > 0);
  const count = validSweeps.length;
  const avgSaved = count > 0 ? (totalSaved / count).toFixed(1) : '0.0';
  const projectedMonthly = (parseFloat(avgSaved) * 4 * 30).toFixed(0);

  return (
    <div className="native-telemetry-strip">
      <div className="telemetry-stat-col">
        <span className="telemetry-stat-header">AVG. SWEEP</span>
        <span className="telemetry-stat-num tabular">₹{avgSaved}</span>
        <span className="telemetry-stat-sub">Dynamic percentage</span>
      </div>

      <div className="telemetry-divider" />

      <div className="telemetry-stat-col">
        <span className="telemetry-stat-header">EST. MONTHLY</span>
        <span className="telemetry-stat-num tabular">₹{parseInt(projectedMonthly).toLocaleString('en-IN')}</span>
        <span className="telemetry-stat-sub">At 4 UPI spends/day</span>
      </div>

      <div className="telemetry-divider" />

      <div className="telemetry-stat-col">
        <span className="telemetry-stat-header">FLOOR SHIELD</span>
        <span className="telemetry-stat-num">ACTIVE</span>
        <span className="telemetry-stat-sub">Essential funds safe</span>
      </div>
    </div>
  );
}
