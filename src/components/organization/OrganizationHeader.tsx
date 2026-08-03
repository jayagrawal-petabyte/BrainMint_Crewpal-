import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus, Building2, ShieldCheck, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '../common/Button';

interface OrganizationHeaderProps {
  onOpenCreateModal: () => void;
  onOpenInviteModal?: () => void;
  activeCount: number;
  totalCount: number;
}

export const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
  onOpenCreateModal,
  onOpenInviteModal,
  activeCount,
  totalCount,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cream-50 p-6 rounded-2xl border border-cream-200 shadow-sm">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-cream-50 flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-forest-900 tracking-tight">
                Organization Management
              </h1>
              <span className="hidden sm:flex items-center gap-1 bg-olive-100 text-olive-800 border border-olive-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                Verified Workplace
              </span>
            </div>
            <p className="text-xs md:text-sm text-forest-600 font-medium mt-0.5">
              Manage enterprise profiles, domain routing, subscription tiers, and workspace oversight.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-cream-100 rounded-xl border border-cream-200 text-xs text-forest-800">
          <span className="font-semibold">{activeCount} of {totalCount} Active</span>
        </div>

        <Button
          variant="ghost"
          leftIcon={<SettingsIcon className="w-4 h-4" />}
          onClick={() => navigate('/organization/settings')}
          className="shadow-xs hover:shadow-sm transition-all cursor-pointer border border-cream-300"
        >
          Org Settings
        </Button>

        {onOpenInviteModal && (
          <Button
            variant="secondary"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={onOpenInviteModal}
            className="shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            Invite Member
          </Button>
        )}

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onOpenCreateModal}
          className="shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          New Organization
        </Button>
      </div>
    </div>
  );
};

