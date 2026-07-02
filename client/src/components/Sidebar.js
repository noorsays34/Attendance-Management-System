import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { path: '/attendance', icon: '✓', label: 'Attendance' },
  { path: '/students', icon: '◈', label: 'Students' },
  { path: '/classes', icon: '⬟', label: 'Classes' },
  { path: '/reports', icon: '◉', label: 'Reports' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">A</div>
          {!collapsed && <div className="logo-text">
            <span className="logo-name">AttendX</span>
            <span className="logo-sub">School Manager</span>
          </div>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {!collapsed && location.pathname === item.path && (
              <span className="nav-indicator" />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">T</div>
            <div className="user-info">
              <span className="user-name">Teacher</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
