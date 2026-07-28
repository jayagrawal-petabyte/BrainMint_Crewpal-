import React from 'react';
import { useStore } from '../../store/StateContext';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';

export function Sidebar({ open, setOpen, onOpenProfile }) {
  const { auth, activeBranch, tasks } = useStore();

  const pendingCount = tasks.filter(t => t.status !== 'completed').length;

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="brand-header">
        <div className="brand-logo">
          <div className="brand-icon">S</div>
          <span>School ERP</span>
        </div>
        {setOpen && (
          <button className="btn-icon menu-toggle" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <a href="#overview" className="nav-link active">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </a>
        <a href="#projects" className="nav-link">
          <FolderKanban size={18} />
          <span>Projects</span>
          <span className="nav-badge">6</span>
        </a>
        <a href="#tasks" className="nav-link">
          <ListTodo size={18} />
          <span>Assigned Tasks</span>
          {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
        </a>
        <a href="#users" className="nav-link">
          <Users size={18} />
          <span>Users & Staff</span>
        </a>
        <a href="#rbac" className="nav-link">
          <ShieldCheck size={18} />
          <span>RBAC & Roles</span>
        </a>
      </nav>

      <div className="sidebar-widget">
        <small>ACTIVE BRANCH</small>
        <strong>{activeBranch ? activeBranch.name : 'Delhi Main Campus'}</strong>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '85%' }}></div>
        </div>
        <small style={{ fontSize: '10px', marginTop: '2px', color: 'var(--text-muted)' }}>
          Session: 2025 - 2026
        </small>
      </div>

      {auth.user && (
        <div className="user-profile-footer" onClick={onOpenProfile} title="Click to view & edit user state profile">
          <div className="avatar">{auth.user.avatar}</div>
          <div className="user-info">
            <span className="user-name">{auth.user.name}</span>
            <span className="user-role">{auth.user.role.toUpperCase()} • Harish</span>
          </div>
          <Zap size={14} style={{ marginLeft: 'auto', color: 'var(--primary)' }} />
        </div>
      )}
    </aside>
  );
}
