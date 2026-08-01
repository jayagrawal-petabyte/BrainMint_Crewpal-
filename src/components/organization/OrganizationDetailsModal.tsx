import React from 'react';
import {
  X,
  Building2,
  Globe,
  Crown,
  Users,
  FolderKanban,
  Calendar,
  Mail,
  Hash,
} from 'lucide-react';
import type { Organization } from '../../types/organization';
import { Button } from '../common/Button';

interface OrganizationDetailsModalProps {
  organization: Organization | null;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
}

export const OrganizationDetailsModal: React.FC<OrganizationDetailsModalProps> = ({
  organization,
  onClose,
  onToggleStatus,
}) => {
  if (!organization) return null;

  const formattedDate = new Date(organization.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/50 backdrop-blur-xs modal-backdrop-animate">
      <div className="bg-cream-50 rounded-3xl border border-cream-200 shadow-2xl w-full max-w-xl overflow-hidden modal-content-animate">
        {/* Modal Header */}
        <div className="bg-forest-800 text-cream-50 p-6 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-14 h-14 rounded-2xl ${
                organization.accentBg || 'bg-olive-400'
              } ${
                organization.accentText || 'text-forest-900'
              } flex items-center justify-center font-extrabold text-xl shadow-md border border-white/20`}
            >
              {organization.logoInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">{organization.name}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    organization.is_active
                      ? 'bg-olive-400 text-forest-900'
                      : 'bg-rose-300 text-rose-900'
                  }`}
                >
                  {organization.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-olive-300 font-medium flex items-center gap-1 mt-0.5">
                <Globe className="w-3.5 h-3.5" />
                {organization.domain}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-forest-700 text-cream-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Overview Banner */}
          <div className="bg-cream-100 p-4 rounded-2xl border border-cream-200 space-y-2">
            <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider">
              About Workspace
            </h4>
            <p className="text-xs text-forest-700 leading-relaxed">
              {organization.description}
            </p>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-white rounded-xl border border-cream-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-forest-500 font-medium">
                <Hash className="w-3.5 h-3.5 text-forest-400" />
                <span>Organization Slug</span>
              </div>
              <p className="text-xs font-bold text-forest-900 font-mono">
                {organization.slug}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-cream-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-forest-500 font-medium">
                <Crown className="w-3.5 h-3.5 text-olive-600" />
                <span>Subscription Plan</span>
              </div>
              <p className="text-xs font-bold text-forest-900">
                {organization.planTier} Plan
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-cream-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-forest-500 font-medium">
                <Building2 className="w-3.5 h-3.5 text-forest-400" />
                <span>Industry Sector</span>
              </div>
              <p className="text-xs font-bold text-forest-900">
                {organization.industry}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-cream-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-forest-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-forest-400" />
                <span>Registered Date</span>
              </div>
              <p className="text-xs font-bold text-forest-900">{formattedDate}</p>
            </div>
          </div>

          {/* Owner Details */}
          <div className="p-4 bg-cream-100/80 rounded-2xl border border-cream-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-800 text-cream-50 font-extrabold text-sm flex items-center justify-center border border-forest-900">
                {organization.owner.avatarInitials}
              </div>
              <div>
                <p className="text-xs font-bold text-forest-900">
                  {organization.owner.name}
                </p>
                <p className="text-[11px] text-forest-600 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-forest-400" />
                  {organization.owner.email}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-forest-50 text-forest-700 px-2.5 py-1 rounded-full border border-forest-100">
              PRIMARY OWNER
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-olive-50 rounded-2xl border border-olive-200 text-center space-y-0.5">
              <Users className="w-5 h-5 text-forest-700 mx-auto" />
              <p className="text-lg font-extrabold text-forest-900">
                {organization.memberCount}
              </p>
              <p className="text-[10px] text-forest-600 font-bold uppercase">
                Active Workforce Members
              </p>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-0.5">
              <FolderKanban className="w-5 h-5 text-rose-700 mx-auto" />
              <p className="text-lg font-extrabold text-forest-900">
                {organization.projectCount}
              </p>
              <p className="text-[10px] text-rose-800 font-bold uppercase">
                Active Projects
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-cream-100 border-t border-cream-200 flex items-center justify-between">
          <Button
            variant={organization.is_active ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => {
              onToggleStatus(organization.id);
            }}
          >
            {organization.is_active ? 'Deactivate Workspace' : 'Activate Workspace'}
          </Button>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Overview
          </Button>
        </div>
      </div>
    </div>
  );
};
