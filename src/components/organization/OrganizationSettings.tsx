import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Shield,
  CreditCard,
  AlertTriangle,
  Check,
  Globe,
  Mail,
  Lock,
  Key,
  Trash2,
  Upload,
  Crown,
  CheckCircle2,
  Users,
  Calendar,
  Download,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select, SelectOption } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { FormGroup } from '../common/FormGroup';
import { Modal } from '../ui/Modal';
import { useOrganizationStore } from '../../store/organization';
import type { Organization, OrganizationPlanTier } from '../../types/organization';

type TabKey = 'general' | 'security' | 'billing' | 'danger';

interface FormErrors {
  name?: string;
  slug?: string;
  domain?: string;
  contactEmail?: string;
  billingEmail?: string;
}

const INDUSTRY_OPTIONS: SelectOption[] = [
  { label: 'Software & Technology', value: 'Software & Technology' },
  { label: 'Productivity Systems', value: 'Productivity Systems' },
  { label: 'EdTech & Education', value: 'EdTech & Education' },
  { label: 'Aerospace Engineering', value: 'Aerospace Engineering' },
  { label: 'Media & Marketing', value: 'Media & Marketing' },
  { label: 'Healthcare & Biotech', value: 'Healthcare & Biotech' },
  { label: 'Financial Services', value: 'Financial Services' },
];

const ROLE_OPTIONS: SelectOption[] = [
  { label: 'Employee (Standard Access)', value: 'EMPLOYEE' },
  { label: 'Manager (Team Oversight)', value: 'MANAGER' },
];

const TIMEOUT_OPTIONS: SelectOption[] = [
  { label: '15 Minutes', value: '15' },
  { label: '30 Minutes', value: '30' },
  { label: '1 Hour (Recommended)', value: '60' },
  { label: '8 Hours (Workday)', value: '480' },
  { label: 'Never Expire', value: '0' },
];

const ToggleSwitch = ({
  enabled,
  onChange,
  id,
}: {
  enabled: boolean;
  onChange: () => void;
  id?: string;
}) => (
  <button
    type="button"
    id={id}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 ${
      enabled ? 'bg-forest-800' : 'bg-cream-300'
    }`}
    role="switch"
    aria-checked={enabled}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const OrganizationSettings: React.FC = () => {
  const navigate = useNavigate();
  const {
    organizations,
    selectedOrg,
    updateOrganization,
    toggleOrganizationStatus,
    removeOrganization,
  } = useOrganizationStore();

  const defaultOrg: Organization = selectedOrg || organizations[0];

  const [activeTab, setActiveTab] = useState<TabKey>('general');

  // General Settings State
  const [name, setName] = useState(defaultOrg?.name ?? '');
  const [slug, setSlug] = useState(defaultOrg?.slug ?? '');
  const [domain, setDomain] = useState(defaultOrg?.domain ?? '');
  const [description, setDescription] = useState(defaultOrg?.description ?? '');
  const [industry, setIndustry] = useState(defaultOrg?.industry ?? '');
  const [contactEmail, setContactEmail] = useState(defaultOrg?.owner?.email ?? '');
  const [logoInitials, setLogoInitials] = useState(defaultOrg?.logoInitials ?? 'CP');

  // Security Settings State
  const [allowedDomains, setAllowedDomains] = useState('brainmint.io, crewpal.app');
  const [defaultRole, setDefaultRole] = useState('EMPLOYEE');
  const [require2FA, setRequire2FA] = useState(true);
  const [enforceSSO, setEnforceSSO] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [restrictProjectCreation, setRestrictProjectCreation] = useState(false);

  // Billing Settings State
  const [planTier, setPlanTier] = useState<OrganizationPlanTier>(defaultOrg?.planTier ?? 'Enterprise');
  const [billingEmail, setBillingEmail] = useState('billing@brainmint.io');

  // UI Feedback States
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isOrgActive, setIsOrgActive] = useState(defaultOrg?.is_active ?? true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<OrganizationPlanTier>(planTier);

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Organization name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!slug.trim()) {
      newErrors.slug = 'Workspace URL slug is required';
    } else if (!/^[a-z0-9-]+$/i.test(slug.trim())) {
      newErrors.slug = 'Slug can only contain letters, numbers, and hyphens';
    }

    if (!domain.trim()) {
      newErrors.domain = 'Primary domain is required';
    }

    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (billingEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail)) {
      newErrors.billingEmail = 'Please enter a valid billing email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    if (defaultOrg) {
      updateOrganization(defaultOrg.id, {
        name,
        slug,
        domain,
        description,
        industry,
        owner: { ...defaultOrg.owner, email: contactEmail },
        logoInitials,
        planTier,
        is_active: isOrgActive,
      });
    }
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  // Reset Handler
  const handleReset = () => {
    if (!defaultOrg) return;
    setName(defaultOrg.name);
    setSlug(defaultOrg.slug);
    setDomain(defaultOrg.domain);
    setDescription(defaultOrg.description);
    setIndustry(defaultOrg.industry);
    setContactEmail(defaultOrg.owner.email);
    setLogoInitials(defaultOrg.logoInitials);
    setAllowedDomains('brainmint.io, crewpal.app');
    setDefaultRole('EMPLOYEE');
    setRequire2FA(true);
    setEnforceSSO(false);
    setSessionTimeout('60');
    setRestrictProjectCreation(false);
    setPlanTier(defaultOrg.planTier);
    setBillingEmail('billing@brainmint.io');
    setIsOrgActive(defaultOrg.is_active);
    setErrors({});
  };

  const tabs = [
    { id: 'general', label: 'General Profile', icon: Building2 },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, badge: 'High Risk' },
  ];

  const breadcrumbsItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Organization', path: '/organization' },
    { label: 'Organization Settings' },
  ];
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream-50 p-4 sm:p-5 rounded-2xl border border-cream-200 shadow-sm">
        <div className="space-y-1">
          <Breadcrumbs items={breadcrumbsItems} className="mb-1" />
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-forest-800 text-cream-50 flex items-center justify-center shadow-sm shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-forest-900 tracking-tight leading-tight">
                Organization Settings
              </h1>
              <p className="text-xs text-forest-600 font-medium">
                Configure workplace identity, domain policies, member defaults, and subscription plans.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="cursor-pointer text-xs"
          >
            Reset Form
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            leftIcon={
              saveSuccess ? (
                <Check className="w-4 h-4 text-white" />
              ) : isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )
            }
            className={`shadow-md transition-all cursor-pointer text-xs ${
              saveSuccess ? 'bg-olive-600 hover:bg-olive-700' : ''
            }`}
          >
            {saveSuccess ? 'Settings Saved!' : isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="flex items-center gap-3 bg-olive-100 border border-olive-300 text-olive-900 px-4 py-3 rounded-xl shadow-xs animate-in slide-down-animate">
          <CheckCircle2 className="w-5 h-5 text-forest-700 shrink-0" />
          <p className="text-xs font-semibold">
            Organization settings updated successfully! All workspace policies are now active.
          </p>
        </div>
      )}

      {/* Main Settings Navigation & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs (Sidebar on desktop, horizontal scroll on mobile) */}
        <div className="lg:col-span-1">
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-2 shadow-sm space-y-1 overflow-x-auto no-scrollbar flex lg:flex-col flex-nowrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDanger = tab.id === 'danger';

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all w-full shrink-0 text-left cursor-pointer ${
                    isActive
                      ? isDanger
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-forest-800 text-cream-50 shadow-sm'
                      : isDanger
                      ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-800'
                      : 'text-forest-700 hover:bg-cream-200/60 hover:text-forest-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Panel Content */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSave} className="space-y-6">
            {/* ─── TAB 1: GENERAL PROFILE ─── */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
                <div className="px-6 py-4 border-b border-cream-200 bg-cream-50 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-forest-900 tracking-wide uppercase">
                      General Workplace Profile
                    </h2>
                    <p className="text-xs text-forest-500 mt-0.5">
                      Basic information about your company, brand identity, and primary contact.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-cream-200 text-forest-800 rounded-md">
                    ID: {defaultOrg.id}
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  {/* Branding / Logo Avatar */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-cream-50/70 rounded-xl border border-cream-200">
                    <div className="w-16 h-16 rounded-2xl bg-forest-800 text-cream-50 flex items-center justify-center font-extrabold text-2xl shadow-sm border border-forest-900/10 shrink-0">
                      {logoInitials || 'CP'}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <h4 className="text-xs font-bold text-forest-900 uppercase">
                        Workspace Logo & Initials
                      </h4>
                      <p className="text-xs text-forest-500">
                        Display icon used across header bar, project assignments, and emails.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          leftIcon={<Upload className="w-3.5 h-3.5" />}
                          onClick={() => {
                            const newInit = prompt('Enter 2-letter logo initials:', logoInitials);
                            if (newInit) setLogoInitials(newInit.substring(0, 2).toUpperCase());
                          }}
                        >
                          Change Initials
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormGroup label="Organization Name *" error={errors.name} id="org-name">
                      <Input
                        id="org-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. BrainMint Technologies"
                        error={errors.name}
                      />
                    </FormGroup>

                    <FormGroup label="Workspace Slug (Subdomain) *" error={errors.slug} id="org-slug">
                      <div className="relative">
                        <Input
                          id="org-slug"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                          placeholder="brainmint"
                          error={errors.slug}
                        />
                      </div>
                    </FormGroup>

                    <FormGroup label="Primary Domain *" error={errors.domain} id="org-domain">
                      <Input
                        id="org-domain"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="brainmint.crewpal.com"
                        leftIcon={<Globe className="w-4 h-4 text-forest-400" />}
                        error={errors.domain}
                      />
                    </FormGroup>

                    <FormGroup label="Industry Sector" id="org-industry">
                      <Select
                        id="org-industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        options={INDUSTRY_OPTIONS}
                      />
                    </FormGroup>
                  </div>

                  <FormGroup label="Primary Contact Email" error={errors.contactEmail} id="org-email">
                    <Input
                      id="org-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="admin@brainmint.io"
                      leftIcon={<Mail className="w-4 h-4 text-forest-400" />}
                      error={errors.contactEmail}
                    />
                  </FormGroup>

                  <FormGroup label="Organization Description" id="org-desc">
                    <Textarea
                      id="org-desc"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description about the organization, core objectives, or team scope..."
                    />
                  </FormGroup>
                </div>
              </div>
            )}

            {/* ─── TAB 2: SECURITY & ACCESS ─── */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
                <div className="px-6 py-4 border-b border-cream-200 bg-cream-50">
                  <h2 className="text-sm font-bold text-forest-900 tracking-wide uppercase">
                    Security & Access Policies
                  </h2>
                  <p className="text-xs text-forest-500 mt-0.5">
                    Define member onboarding domain restrictions, authentication rules, and session limits.
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Allowed Email Domains */}
                  <FormGroup label="Allowed Email Domains for Auto-Join" id="allowed-domains">
                    <Input
                      id="allowed-domains"
                      value={allowedDomains}
                      onChange={(e) => setAllowedDomains(e.target.value)}
                      placeholder="e.g. brainmint.io, crewpal.app"
                      leftIcon={<Globe className="w-4 h-4 text-forest-400" />}
                    />
                    <p className="text-[11px] text-forest-500 mt-1">
                      Comma-separated list. Users with matching email domains will be able to join automatically.
                    </p>
                  </FormGroup>

                  {/* Default Role Selection */}
                  <FormGroup label="Default Role for New Members" id="default-role">
                    <Select
                      id="default-role"
                      value={defaultRole}
                      onChange={(e) => setDefaultRole(e.target.value)}
                      options={ROLE_OPTIONS}
                    />
                  </FormGroup>

                  {/* Session Timeout */}
                  <FormGroup label="Inactive Session Timeout" id="session-timeout">
                    <Select
                      id="session-timeout"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      options={TIMEOUT_OPTIONS}
                    />
                  </FormGroup>

                  <hr className="border-cream-200" />

                  {/* Security Toggles Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-cream-50/70 rounded-xl border border-cream-200">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-forest-100 flex items-center justify-center text-forest-800 shrink-0">
                          <Lock className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-forest-900">Enforce Two-Factor Authentication (2FA)</p>
                          <p className="text-[11px] text-forest-500 mt-0.5">
                            Mandate 2FA setup for all team members before accessing organization projects.
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        id="toggle-2fa"
                        enabled={require2FA}
                        onChange={() => setRequire2FA(!require2FA)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-cream-50/70 rounded-xl border border-cream-200">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-olive-100 flex items-center justify-center text-forest-800 shrink-0">
                          <Key className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-forest-900">Single Sign-On (SSO / SAML)</p>
                          <p className="text-[11px] text-forest-500 mt-0.5">
                            Authenticate workforce through enterprise identity providers (Google Workspace / Okta).
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        id="toggle-sso"
                        enabled={enforceSSO}
                        onChange={() => setEnforceSSO(!enforceSSO)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-cream-50/70 rounded-xl border border-cream-200">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-800 shrink-0">
                          <Shield className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-forest-900">Restrict Project Creation to Managers</p>
                          <p className="text-[11px] text-forest-500 mt-0.5">
                            Prevent standard employee accounts from initializing new top-level projects.
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        id="toggle-restrict-projects"
                        enabled={restrictProjectCreation}
                        onChange={() => setRestrictProjectCreation(!restrictProjectCreation)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 3: SUBSCRIPTION & BILLING ─── */}
            {activeTab === 'billing' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Current Plan Overview Card */}
                <div className="bg-forest-900 text-cream-50 rounded-2xl p-6 shadow-md relative overflow-hidden">
                  <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-olive-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 bg-olive-400 text-forest-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                          <Crown className="w-3.5 h-3.5" />
                          {planTier} PLAN
                        </span>
                        <span className="bg-white/10 text-cream-200 text-xs px-2.5 py-0.5 rounded-full">
                          Active License
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">BrainMint Enterprise Workplace</h3>
                      <p className="text-xs text-cream-300">
                        Full access to automated scrum boards, unlimited projects, priority support, and analytics.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      leftIcon={<Sparkles className="w-4 h-4 text-forest-800" />}
                      onClick={() => setIsPlanModalOpen(true)}
                      className="shrink-0 cursor-pointer font-bold"
                    >
                      Change Plan
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-forest-700/80 relative z-10 text-xs">
                    <div>
                      <p className="text-cream-300 text-[10px] uppercase font-semibold">Active Members</p>
                      <p className="text-base font-extrabold text-white mt-0.5 flex items-center gap-1">
                        <Users className="w-4 h-4 text-olive-300" />
                        42 / 50 Seats
                      </p>
                    </div>

                    <div>
                      <p className="text-cream-300 text-[10px] uppercase font-semibold">Billing Frequency</p>
                      <p className="text-base font-extrabold text-white mt-0.5 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-olive-300" />
                        Annual ($499/yr)
                      </p>
                    </div>

                    <div>
                      <p className="text-cream-300 text-[10px] uppercase font-semibold">Next Renewal</p>
                      <p className="text-base font-extrabold text-white mt-0.5">Jan 15, 2027</p>
                    </div>
                  </div>
                </div>

                {/* Billing Email Form */}
                <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6 space-y-4">
                  <h3 className="text-xs font-bold text-forest-900 uppercase tracking-wide">
                    Billing Contact & Receipts
                  </h3>
                  <FormGroup label="Invoice Recipient Email" error={errors.billingEmail} id="billing-email">
                    <Input
                      id="billing-email"
                      type="email"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="billing@brainmint.io"
                      leftIcon={<Mail className="w-4 h-4 text-forest-400" />}
                      error={errors.billingEmail}
                    />
                  </FormGroup>
                </div>

                {/* Billing History Table */}
                <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-cream-200 bg-cream-50">
                    <h3 className="text-xs font-bold text-forest-900 uppercase tracking-wide">
                      Invoice History
                    </h3>
                  </div>
                  <div className="divide-y divide-cream-100 text-xs">
                    {[
                      { id: 'INV-2026-001', date: 'Jan 15, 2026', amount: '$499.00', status: 'Paid' },
                      { id: 'INV-2025-001', date: 'Jan 15, 2025', amount: '$499.00', status: 'Paid' },
                    ].map((inv) => (
                      <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-cream-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-forest-700">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-forest-900">{inv.id}</p>
                            <p className="text-forest-500 text-[11px]">{inv.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-forest-900">{inv.amount}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-olive-100 text-olive-800 border border-olive-300">
                            {inv.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => alert(`Downloading ${inv.id}...`)}
                            className="p-1.5 text-forest-600 hover:text-forest-900 rounded-lg hover:bg-cream-100 transition-colors cursor-pointer"
                            title="Download Invoice PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 4: DANGER ZONE ─── */}
            {activeTab === 'danger' && (
              <div className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
                <div className="px-6 py-4 border-b border-rose-200 bg-rose-50 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <div>
                    <h2 className="text-sm font-bold text-rose-900 tracking-wide uppercase">
                      Danger Zone
                    </h2>
                    <p className="text-xs text-rose-700">
                      Irreversible and destructive actions for this organization workspace.
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Deactivate Workspace */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-rose-100 bg-rose-50/50">
                    <div>
                      <h4 className="text-xs font-bold text-forest-900">
                        {isOrgActive ? 'Deactivate Organization Workspace' : 'Reactivate Organization Workspace'}
                      </h4>
                      <p className="text-xs text-forest-500 mt-0.5">
                        {isOrgActive
                          ? 'Temporarily disable member logins and suspend active project boards. Data will be preserved.'
                          : 'Restore workspace access for members and re-enable active projects.'}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant={isOrgActive ? 'danger' : 'primary'}
                      size="sm"
                      onClick={() => setIsDeactivateModalOpen(true)}
                      className="shrink-0 cursor-pointer"
                    >
                      {isOrgActive ? 'Deactivate Workspace' : 'Reactivate Workspace'}
                    </Button>
                  </div>

                  {/* Permanent Deletion */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-rose-300 bg-rose-100/40">
                    <div>
                      <h4 className="text-xs font-extrabold text-rose-900">
                        Permanently Delete Organization
                      </h4>
                      <p className="text-xs text-rose-700 mt-0.5">
                        Permanently delete this organization, including all member accounts, project tasks, and documents.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="shrink-0 cursor-pointer shadow-sm"
                    >
                      Delete Workspace
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ─── MODAL 1: CHANGE PLAN MODAL ─── */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title="Change Subscription Plan"
        subtitle="Select a plan tier that fits your enterprise team scope."
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { tier: 'Starter', price: '$99/mo', desc: 'Up to 10 members', badge: 'Basic' },
              { tier: 'Pro', price: '$249/mo', desc: 'Up to 25 members', badge: 'Popular' },
              { tier: 'Enterprise', price: '$499/mo', desc: 'Unlimited scale & support', badge: 'Full Access' },
            ].map((p) => {
              const isSelected = selectedNewPlan === p.tier;
              return (
                <div
                  key={p.tier}
                  onClick={() => setSelectedNewPlan(p.tier as OrganizationPlanTier)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-forest-800 bg-cream-50 shadow-sm'
                      : 'border-cream-200 bg-white hover:border-cream-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-forest-900">{p.tier}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-200 text-forest-800">
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-lg font-extrabold text-forest-900 mt-2">{p.price}</p>
                  <p className="text-[11px] text-forest-500 mt-1">{p.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
            <Button variant="ghost" size="sm" onClick={() => setIsPlanModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setPlanTier(selectedNewPlan);
                if (defaultOrg) {
                  updateOrganization(defaultOrg.id, { planTier: selectedNewPlan });
                }
                setIsPlanModalOpen(false);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2500);
              }}
            >
              Confirm Plan Switch
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL 2: DEACTIVATE MODAL ─── */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        title={isOrgActive ? 'Deactivate Workspace?' : 'Reactivate Workspace?'}
        subtitle={`Organization: ${name}`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-forest-700 leading-relaxed">
            {isOrgActive
              ? 'Deactivating will restrict access for all 42 members until reactivated by an organization owner.'
              : 'Reactivating will instantly restore member logins and project access.'}
          </p>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setIsDeactivateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={isOrgActive ? 'danger' : 'primary'}
              size="sm"
              onClick={() => {
                if (defaultOrg) {
                  toggleOrganizationStatus(defaultOrg.id);
                }
                setIsOrgActive(!isOrgActive);
                setIsDeactivateModalOpen(false);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2500);
              }}
            >
              Confirm {isOrgActive ? 'Deactivation' : 'Reactivation'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL 3: DELETE CONFIRMATION MODAL ─── */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteConfirmInput('');
        }}
        title="Delete Organization Workspace"
        subtitle="This action CANNOT be undone."
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
            <p className="font-bold">Warning:</p>
            <p>
              Deleting <strong>{name}</strong> will remove all team tasks, projects, member roles, and settings.
            </p>
          </div>

          <FormGroup label={`Type "${slug}" to confirm:`} id="delete-confirm-input">
            <Input
              id="delete-confirm-input"
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              placeholder={slug}
            />
          </FormGroup>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteConfirmInput('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={deleteConfirmInput !== slug}
              onClick={() => {
                if (defaultOrg) {
                  removeOrganization(defaultOrg.id);
                }
                setIsDeleteModalOpen(false);
                navigate('/organization');
              }}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrganizationSettings;
