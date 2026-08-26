import React, { useState } from 'react';
import { X, Building2, Globe, Crown, Mail, User } from 'lucide-react';
import type { Organization, OrganizationPlanTier } from '../../types/organization';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (org: Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'projectCount'>) => Promise<Organization>;
}

export const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [industry, setIndustry] = useState('Software & Technology');
  const [planTier, setPlanTier] = useState<OrganizationPlanTier>('Enterprise');
  const [ownerName, setOwnerName] = useState('Shivam Kumar');
  const [ownerEmail, setOwnerEmail] = useState('shivam@crewpal.io');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    setIsSubmitting(true);

    const initials = name
      .split(' ')
      .map((w) => w.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'CP';

    const ownerInitials = ownerName
      .split(' ')
      .map((w) => w.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'SK';

    try {
      await onCreate({
        name: name.trim(),
        slug: slug.trim() || 'my-organization',
        domain: `${slug.trim() || 'org'}.crewpal.com`,
        is_active: true,
        planTier,
        owner: {
          name: ownerName,
          email: ownerEmail,
          avatarInitials: ownerInitials,
        },
        description: description.trim() || 'Enterprise workplace for project management.',
        industry,
        logoInitials: initials,
        accentBg: 'bg-forest-800',
        accentText: 'text-cream-50',
      });

      setName('');
      setSlug('');
      setDescription('');
      setError('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'You do not have permission to create an organization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/50 backdrop-blur-xs modal-backdrop-animate">
      <div className="bg-cream-50 rounded-3xl border border-cream-200 shadow-2xl w-full max-w-lg overflow-hidden modal-content-animate">
        {/* Header */}
        <div className="bg-forest-800 text-cream-50 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-olive-400 text-forest-900 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold leading-none">Register New Organization</h2>
              <p className="text-[11px] text-olive-300 font-medium mt-0.5">
                Create a new workplace profile in Crewpal
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

        {error && (
          <div role="alert" className="mx-5 mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <Input
            label="Organization Name *"
            placeholder="e.g. BrainMint Technologies"
            value={name}
            onChange={handleNameChange}
            required
            leftIcon={<Building2 className="w-4 h-4 text-forest-400" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Domain Slug"
              placeholder="e.g. brainmint"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              leftIcon={<Globe className="w-4 h-4 text-forest-400" />}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-forest-700">Industry / Sector</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-full border border-forest-200 bg-white px-4 py-2.5 text-sm text-forest-800 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 cursor-pointer"
              >
                <option value="Software & Technology">Software & Technology</option>
                <option value="EdTech & Education">EdTech & Education</option>
                <option value="Productivity Systems">Productivity Systems</option>
                <option value="Aerospace Engineering">Aerospace Engineering</option>
                <option value="Healthcare & Biotech">Healthcare & Biotech</option>
                <option value="Media & Marketing">Media & Marketing</option>
                <option value="Finance & Banking">Finance & Banking</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-forest-700 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-olive-600" />
                Subscription Tier
              </label>
              <select
                value={planTier}
                onChange={(e) => setPlanTier(e.target.value as OrganizationPlanTier)}
                className="w-full rounded-full border border-forest-200 bg-white px-4 py-2.5 text-sm text-forest-800 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 cursor-pointer"
              >
                <option value="Enterprise">Enterprise Tier</option>
                <option value="Pro">Pro Tier</option>
                <option value="Starter">Starter Tier</option>
              </select>
            </div>

            <Input
              label="Owner Name"
              placeholder="e.g. Shivam Kumar"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-forest-400" />}
            />
          </div>

          <Input
            label="Owner Email"
            type="email"
            placeholder="e.g. owner@organization.com"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-forest-400" />}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-forest-700">Description</label>
            <textarea
              rows={3}
              placeholder="Brief description about the organization..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-forest-200 bg-white p-3.5 text-sm text-forest-900 placeholder:text-forest-400 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20"
            />
          </div>

          <div className="pt-3 border-t border-cream-200 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
