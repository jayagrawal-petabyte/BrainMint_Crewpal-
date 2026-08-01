import React from 'react';
import {
  Globe,
  Users,
  FolderKanban,
  Crown,
  CheckCircle2,
  XCircle,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { Organization } from '../../types/organization';

interface OrganizationCardProps {
  organization: Organization;
  onSelect: (organization: Organization) => void;
  onToggleStatus: (id: string) => void;
  index: number;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onSelect,
  onToggleStatus,
  index,
}) => {
  const planTierColors =
    organization.planTier === 'Enterprise'
      ? 'bg-forest-800 text-cream-50 border-forest-900'
      : organization.planTier === 'Pro'
      ? 'bg-teal-100 text-teal-800 border-teal-300'
      : 'bg-cream-200 text-forest-800 border-cream-300';

  return (
    <div
      className="bg-cream-50 border border-cream-200 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between card-animate group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="space-y-3.5">
        {/* Top Header: Logo, Name, Tier & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Badge */}
            <div
              className={`w-12 h-12 rounded-xl ${
                organization.accentBg || 'bg-forest-800'
              } ${
                organization.accentText || 'text-cream-50'
              } flex items-center justify-center font-extrabold text-lg shadow-sm border border-forest-900/10 shrink-0 group-hover:scale-105 transition-transform`}
            >
              {organization.logoInitials}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-forest-900 truncate">
                  {organization.name}
                </h3>
              </div>
              <p className="text-xs text-forest-500 font-medium truncate flex items-center gap-1 mt-0.5">
                <Globe className="w-3 h-3 text-forest-400 shrink-0" />
                {organization.domain}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 border ${
              organization.is_active
                ? 'bg-olive-100 text-olive-800 border-olive-300'
                : 'bg-rose-100 text-rose-800 border-rose-200'
            }`}
          >
            {organization.is_active ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-forest-600" />
                ACTIVE
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 text-rose-600" />
                INACTIVE
              </>
            )}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-forest-700 line-clamp-2 leading-relaxed font-normal">
          {organization.description}
        </p>

        {/* Badges: Plan Tier + Industry */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${planTierColors}`}>
            {organization.planTier === 'Enterprise' && <Crown className="w-3 h-3 text-olive-300" />}
            {organization.planTier.toUpperCase()}
          </span>

          <span className="text-[10px] font-semibold bg-cream-200/80 text-forest-800 border border-cream-300 px-2.5 py-0.5 rounded-md">
            {organization.industry}
          </span>
        </div>

        {/* Stats Row: Members & Projects */}
        <div className="grid grid-cols-2 gap-2 bg-cream-100/70 p-2.5 rounded-xl border border-cream-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-olive-200/80 text-forest-800 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-forest-500 uppercase font-semibold">Members</p>
              <p className="text-xs font-bold text-forest-900">{organization.memberCount} active</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-200/70 text-forest-800 flex items-center justify-center">
              <FolderKanban className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-forest-500 uppercase font-semibold">Projects</p>
              <p className="text-xs font-bold text-forest-900">{organization.projectCount} total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Row: Owner Info & Actions */}
      <div className="pt-3 border-t border-cream-200 flex items-center justify-between gap-3">
        {/* Owner */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-forest-800 text-cream-50 flex items-center justify-center text-[10px] font-bold shrink-0">
            {organization.owner.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-forest-900 truncate">
              {organization.owner.name}
            </p>
            <p className="text-[9px] text-forest-500 truncate">Owner</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onToggleStatus(organization.id)}
            title={organization.is_active ? 'Deactivate Organization' : 'Activate Organization'}
            className="p-1.5 rounded-lg text-forest-600 hover:text-forest-900 hover:bg-cream-200 transition-colors cursor-pointer"
          >
            {organization.is_active ? (
              <ToggleRight className="w-5 h-5 text-forest-600" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-rose-500" />
            )}
          </button>

          <button
            onClick={() => onSelect(organization)}
            className="flex items-center gap-1 bg-forest-800 hover:bg-forest-900 text-cream-50 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Overview
          </button>
        </div>
      </div>
    </div>
  );
};
