import React, { useState } from 'react';
import { useStore } from '../../store/StateContext';
import { X, User, Shield, Phone, Mail, LogOut, Check } from 'lucide-react';

export function UserProfileModal({ isOpen, onClose }) {
  const { auth, login, logout, userProfile, updateProfile } = useStore();
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.address);

  if (!isOpen || !auth.user) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ phone, address });
    onClose();
  };

  const handleRoleSwitch = (newRole) => {
    login(auth.user.email, newRole);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>User State & Profile Settings</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            {/* User Info Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div className="avatar" style={{ width: '54px', height: '54px', fontSize: '18px' }}>
                {auth.user.avatar}
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700 }}>
                  {auth.user.name}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{auth.user.email}</p>
                <div className="badge badge-primary" style={{ marginTop: '6px' }}>
                  Role: {auth.user.role.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Role Switching for Testing RBAC */}
            <div className="form-group">
              <label><Shield size={13} style={{ display: 'inline', marginRight: '4px' }} /> Switch RBAC Role (State Management Test)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '4px' }}>
                {['admin', 'teacher', 'student', 'staff'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`btn ${auth.user.role === r ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => handleRoleSwitch(r)}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label><Phone size={13} style={{ display: 'inline', marginRight: '4px' }} /> Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><User size={13} style={{ display: 'inline', marginRight: '4px' }} /> Residential Address</label>
              <input
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => { logout(); onClose(); }}
              style={{ color: 'var(--danger-text)' }}
            >
              <LogOut size={15} /> Log Out
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
