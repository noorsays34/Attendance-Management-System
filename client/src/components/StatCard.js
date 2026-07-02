import React from 'react';
import './StatCard.css';

export default function StatCard({ title, value, subtitle, color = 'blue', icon }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
      <div className="stat-card-bar">
        <div className="stat-card-bar-fill" />
      </div>
    </div>
  );
}
