import React from 'react';
import { useStore } from '../../store/StateContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Building2,
  Calendar,
  ChevronDown
} from 'lucide-react';

export function Header({ setSidebarOpen, onOpenProfile }) {
  const {
    theme,
    toggleTheme,
    branches,
    activeSchoolId,
    changeBranch,
    academicYear,
    setAcademicYear,
    auth
  } = useStore();

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="btn-icon menu-toggle" onClick={() => setSidebarOpen(true)}>
          <Menu size={20} />
        </button>

        {/* Project State: Active School Branch Dropdown */}
        <div className="branch-selector">
          <Building2 size={16} style={{ color: 'var(--primary)' }} />
          <select
            value={activeSchoolId}
            onChange={(e) => changeBranch(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontWeight: 600, color: 'inherit', cursor: 'pointer' }}
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id} style={{ background: 'var(--bg-surface)', color: 'var(--text-main)' }}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Academic Session Picker */}
        <div className="session-badge" title="Academic Session Context">
          <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
          {academicYear}
        </div>
      </div>

      <div className="header-right">
        {/* Global Search Bar */}
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Search tasks, students, metrics..." />
        </div>

        {/* Dark / Light Theme Toggle */}
        <button className="btn-icon" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications Icon */}
        <button className="btn-icon" style={{ position: 'relative' }} title="Notifications Feed">
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--danger)',
            borderRadius: '50%'
          }}></span>
        </button>

        {/* User Profile Avatar Trigger */}
        {auth.user && (
          <div
            className="avatar"
            onClick={onOpenProfile}
            style={{ cursor: 'pointer', border: '2px solid var(--primary)' }}
            title="Open User State & Profile Settings"
          >
            {auth.user.avatar}
          </div>
        )}
      </div>
    </header>
  );
}
