import React, { useState, useEffect } from 'react';
import { Mail, UserPlus, CheckCircle2, Building2, Shield, Loader2 } from 'lucide-react';
import Modal from '../ui/Modal';
import FormGroup from '../common/FormGroup';
import { Input } from '../common/Input';
import Select, { SelectOption } from '../common/Select';
import Textarea from '../common/Textarea';
import { Button } from '../common/Button';
import type { Organization } from '../../types/organization';

// ─── Validation Helpers ───────────────────────────────────────────────────────
export interface InviteFormValues {
  email: string;
  role: string;
  organizationId: string;
  message?: string;
}

export interface InviteFormErrors {
  email?: string;
  role?: string;
  organizationId?: string;
}

export const validateInviteForm = (values: InviteFormValues): InviteFormErrors => {
  const errors: InviteFormErrors = {};

  // Email Validation
  if (!values.email || !values.email.trim()) {
    errors.email = 'Email address is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    if (!emailRegex.test(values.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. user@organization.com)';
    }
  }

  // Role Validation
  if (!values.role || !values.role.trim()) {
    errors.role = 'Please select a member role';
  }

  return errors;
};
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_OPTIONS: SelectOption[] = [
  { label: 'Admin (Full workplace management access)', value: 'Admin' },
  { label: 'Manager (Project oversight & team management)', value: 'Manager' },
  { label: 'Employee / Member (Standard workspace access)', value: 'Employee' },
  { label: 'Guest / Viewer (Read-only project access)', value: 'Viewer' },
];

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizations?: Organization[];
  defaultOrganizationId?: string;
  onSuccess?: (details: { email: string; role: string; organizationId?: string; orgName?: string }) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  organizations = [],
  defaultOrganizationId = '',
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Employee');
  const [organizationId, setOrganizationId] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<InviteFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [invitedDetails, setInvitedDetails] = useState<{ email: string; role: string; orgName?: string } | null>(null);

  // Sync organization default when modal opens or prop changes
  useEffect(() => {
    if (isOpen) {
      setOrganizationId(defaultOrganizationId || (organizations[0]?.id ?? ''));
      setErrors({});
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, defaultOrganizationId, organizations]);

  if (!isOpen) return null;

  const orgOptions: SelectOption[] = organizations.map((org) => ({
    label: org.name,
    value: org.id,
  }));

  const handleResetForm = () => {
    setEmail('');
    setRole('Employee');
    setOrganizationId(defaultOrganizationId || (organizations[0]?.id ?? ''));
    setMessage('');
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    setInvitedDetails(null);
  };

  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formValues: InviteFormValues = {
      email,
      role,
      organizationId,
      message,
    };

    const validationErrors = validateInviteForm(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate Network Request Delay for loading state
    setTimeout(() => {
      setIsSubmitting(false);
      const selectedOrg = organizations.find((o) => o.id === organizationId);
      const details = {
        email: email.trim(),
        role,
        organizationId,
        orgName: selectedOrg ? selectedOrg.name : undefined,
      };
      setInvitedDetails(details);
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess(details);
      }
    }, 800);
  };

  const selectedOrgName = organizations.find((o) => o.id === organizationId)?.name;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Invitation Sent' : 'Invite Team Member'}
      subtitle={
        isSuccess
          ? 'The workspace invitation has been delivered'
          : 'Send an email invitation to collaborate on CREWPAL workspace'
      }
      size="md"
    >
      {isSuccess && invitedDetails ? (
        /* ─── SUCCESS UI STATE ─── */
        <div className="py-4 px-2 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-olive-100 border-2 border-olive-400 text-forest-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-forest-700" />
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-extrabold text-[#1e3624]">
              Invitation Successfully Delivered!
            </h4>
            <p className="text-sm text-[#1e3624]/80 max-w-sm mx-auto leading-relaxed">
              We've sent a member invitation email to{' '}
              <span className="font-bold text-[#1e3624] underline">{invitedDetails.email}</span> as a{' '}
              <span className="font-semibold text-forest-800">{invitedDetails.role}</span>
              {invitedDetails.orgName ? (
                <> for <span className="font-semibold">{invitedDetails.orgName}</span>.</>
              ) : (
                '.'
              )}
            </p>
          </div>

          <div className="p-3 bg-cream-100/80 rounded-xl border border-[#d4d9b8] text-xs text-[#1e3624]/70 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-forest-600 shrink-0" />
            <span>The invite link remains valid for 7 days via email confirmation.</span>
          </div>

          <div className="pt-3 border-t border-[#d4d9b8] flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetForm}
              className="cursor-pointer"
            >
              Invite Another Member
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleClose}
              className="cursor-pointer"
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        /* ─── INVITATION FORM ─── */
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Member Email */}
          <FormGroup label="Member Email Address *" id="invite-email">
            <Input
              id="invite-email"
              type="email"
              placeholder="e.g. colleague@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              disabled={isSubmitting}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4 text-forest-500" />}
              autoFocus
              className="bg-white"
            />
          </FormGroup>

          {/* Role Selection */}
          <FormGroup label="Assign Role *" id="invite-role" error={errors.role}>
            <Select
              id="invite-role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
              }}
              disabled={isSubmitting}
              error={!!errors.role}
              options={ROLE_OPTIONS}
              className="bg-white"
            />
          </FormGroup>

          {/* Workplace / Organization Selection (if multiple orgs provided) */}
          {organizations.length > 0 && (
            <FormGroup label="Target Organization" id="invite-org">
              {organizations.length === 1 ? (
                <div className="px-3.5 py-2.5 rounded-lg border border-[#d4d9b8] bg-cream-100 text-sm font-medium text-forest-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-forest-600" />
                  <span>{selectedOrgName || organizations[0].name}</span>
                </div>
              ) : (
                <Select
                  id="invite-org"
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  disabled={isSubmitting}
                  options={orgOptions}
                  className="bg-white"
                />
              )}
            </FormGroup>
          )}

          {/* Personal Note (Optional) */}
          <FormGroup label="Personal Invitation Note (Optional)" id="invite-message">
            <Textarea
              id="invite-message"
              rows={3}
              placeholder="Add a welcoming note or context for the workspace invite..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              className="bg-white"
            />
          </FormGroup>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#d4d9b8] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              leftIcon={
                isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cream-50" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )
              }
              className="cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? 'Sending Invite...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default InviteMemberModal;

