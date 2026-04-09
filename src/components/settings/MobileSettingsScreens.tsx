import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Coins,
  CreditCard,
  ExternalLink,
  KeyRound,
  LogOut,
  Monitor,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import {
  ALL_MEMBER_ROLES,
  CREDIT_PACKAGES,
  cloneMobileSettingsState,
  formatCredits,
  getLeapSpaceNav,
  globalAccountSections,
  globalProfileSections,
  initialMobileSettingsState,
  MOCK_INVITATIONS,
  MOCK_MEMBERS,
  MOCK_ROLES,
  MOCK_TEAMS,
  type CreditsState,
  type GenericLeapSpaceSectionState,
  type GlobalAccountSectionId,
  type GlobalProfileSectionId,
  type InvitationStatus,
  type LeapSpaceSectionId,
  type LeapSpaceSettingsState,
  type MobileSettingsState,
  type SpaceInvitation,
  type SpaceMember,
} from '../../data/mobileSettingsDemo';

/* ─────────────────────────────────────────────
   Constants & helpers
   ───────────────────────────────────────────── */

type AccountCenterGroup = 'profile' | 'account';

/** Sections that manage their own inline actions (no SectionActionBar) */
const SELF_MANAGED_SECTIONS = new Set<LeapSpaceSectionId>(['members', 'invitations', 'roles', 'teams']);

const connectedAccountCopy: Record<'google' | 'linkedIn' | 'microsoft' | 'github', string> = {
  google: 'Used for one-click sign-in and calendar-aware workflows.',
  linkedIn: 'Used for professional identity, trust, and profile enrichment.',
  microsoft: 'Used for enterprise sign-in and work calendar access.',
  github: 'Used for developer identity and repository-linked workflows.',
};

const genericSectionDescriptions: Partial<Record<LeapSpaceSectionId, string>> = {
  'my-content': 'Creator-scoped defaults for content produced inside this LeapSpace.',
  moderation: 'Moderation controls stay scoped to this LeapSpace and role.',
  overview: 'Workspace-level orientation and high-level setting placeholders.',
  branding: 'Branding stays scoped to this LeapSpace only.',
  integrations: 'Workspace integrations remain scoped and editable here.',
  policies: 'Policy logic stays scoped and legible at the workspace level.',
  'audit-log': 'Operational audit settings remain a scoped workspace control.',
};

function getInitials(name: string): string {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '??'
  );
}

const BIO_MAX_LENGTH = 400;

/* ─────────────────────────────────────────────
   Props
   ───────────────────────────────────────────── */

interface AccountCenterScreenProps {
  isOpen: boolean;
  onClose: () => void;
  initialGroup: AccountCenterGroup;
  initialSection?: GlobalProfileSectionId | GlobalAccountSectionId | null;
  settings: MobileSettingsState;
  onSave: (nextState: MobileSettingsState) => void;
}

interface ManageLeapSpaceScreenProps {
  isOpen: boolean;
  onClose: () => void;
  currentLeapspaceId: string;
  onCurrentLeapspaceChange: (leapspaceId: string) => void;
  settings: MobileSettingsState;
  onSave: (nextState: MobileSettingsState) => void;
}

/* ─────────────────────────────────────────────
   Small reusable components (internal)
   ───────────────────────────────────────────── */

function WebManageLink({ label, description }: { label: string; description?: string }) {
  return (
    <button
      type="button"
      onClick={() => toast.info('This would open the web dashboard for full management.')}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5"
    >
      <div className="min-w-0 text-left">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <ExternalLink className="ml-3 size-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function ReadonlyField({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SkillTagInput – proper component with own state
   ───────────────────────────────────────────── */

function SkillTagInput({ skills, onChange }: { skills: string[]; onChange: (skills: string[]) => void }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    onChange([...skills, trimmed]);
    setInputValue('');
  };

  const handleRemove = (skill: string) => {
    onChange(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <FieldLabel>Skills and strengths</FieldLabel>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 py-1 pl-3 pr-1.5 text-sm">
              {skill}
              <button type="button" onClick={() => handleRemove(skill)} className="rounded-full p-0.5 hover:bg-muted">
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill..."
          className="h-11 flex-1"
        />
        <Button type="button" variant="outline" size="sm" className="h-11 px-3" onClick={handleAdd}>
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FeaturedLinksEditor – proper component with own state
   ───────────────────────────────────────────── */

function FeaturedLinksEditor({
  links,
  onChange,
}: {
  links: Array<{ label: string; url: string }>;
  onChange: (links: Array<{ label: string; url: string }>) => void;
}) {
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAdd = () => {
    const trimLabel = newLabel.trim();
    const trimUrl = newUrl.trim();
    if (!trimLabel || !trimUrl) return;
    onChange([...links, { label: trimLabel, url: trimUrl }]);
    setNewLabel('');
    setNewUrl('');
  };

  const handleRemove = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <FieldLabel>Featured links</FieldLabel>
      {links.length > 0 && (
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{link.label}</p>
                <p className="truncate text-xs text-muted-foreground">{link.url}</p>
              </div>
              <button type="button" onClick={() => handleRemove(index)} className="shrink-0 rounded-full p-1 hover:bg-muted">
                <Trash2 className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2 rounded-xl border border-dashed border-border p-3">
        <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Link label" className="h-10" />
        <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="h-10" />
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={handleAdd}>
          <Plus className="mr-1.5 size-4" />
          Add link
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CreditsDashboard – proper component with own state
   ───────────────────────────────────────────── */

function CreditsDashboard({ credits, onChange }: { credits: CreditsState; onChange: (next: CreditsState) => void }) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const recentTransactions = credits.history.slice(0, 4);

  const handleBuy = () => {
    const pkg = CREDIT_PACKAGES.find((p) => p.id === selectedPackage);
    if (!pkg) return;
    onChange({
      ...credits,
      balance: credits.balance + pkg.credits,
      history: [
        {
          id: `txn-${Date.now()}`,
          type: 'purchase',
          description: `${pkg.name} Pack purchased`,
          amount: pkg.credits,
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
        },
        ...credits.history,
      ],
    });
    setSelectedPackage(null);
    toast.success(`${pkg.name} Pack purchased — ${formatCredits(pkg.credits)} credits added`);
  };

  return (
    <div className="space-y-4">
      {/* Balance overview — 2x2 grid */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <Coins className="size-5 text-primary" />
          <span className="text-sm font-medium text-foreground">Credit Balance</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-background px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-lg font-semibold text-foreground">{formatCredits(credits.balance)}</p>
          </div>
          <div className="rounded-xl border border-border bg-background px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Used this month</p>
            <p className="text-lg font-semibold text-foreground">{formatCredits(credits.usedThisMonth)}</p>
          </div>
          <div className="rounded-xl border border-border bg-background px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Pending holds</p>
            <p className="text-lg font-semibold text-foreground">{formatCredits(credits.pendingHolds)}</p>
          </div>
          <div className="rounded-xl border border-border bg-background px-3 py-2.5">
            <p className="text-xs text-muted-foreground">Lifetime earned</p>
            <p className="text-lg font-semibold text-foreground">{formatCredits(credits.lifetimeEarned)}</p>
          </div>
        </div>
      </Card>

      {/* Quick-buy packages — 2x2 grid */}
      <Card className="space-y-3">
        <p className="text-sm font-medium text-foreground">Buy credits</p>
        <div className="grid grid-cols-2 gap-2">
          {CREDIT_PACKAGES.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedPackage(isSelected ? null : pkg.id)}
                className={`relative rounded-xl border px-3 py-3 text-left transition ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background'
                }`}
              >
                {pkg.popular && (
                  <Badge variant="default" className="absolute -top-2 right-2 text-[10px]">
                    Popular
                  </Badge>
                )}
                <p className="text-sm font-medium text-foreground">{pkg.name}</p>
                <p className="text-base font-semibold text-foreground">{formatCredits(pkg.credits)}</p>
                <p className="text-xs text-muted-foreground">${pkg.price.toFixed(2)}</p>
                {pkg.savings > 0 && <p className="text-xs font-medium text-primary">Save {pkg.savings}%</p>}
              </button>
            );
          })}
        </div>
        {selectedPackage && (
          <Button type="button" className="w-full" onClick={handleBuy}>
            Buy {CREDIT_PACKAGES.find((p) => p.id === selectedPackage)?.name} Pack
          </Button>
        )}
      </Card>

      {/* Recent transactions */}
      <Card className="space-y-3">
        <p className="text-sm font-medium text-foreground">Recent transactions</p>
        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-border rounded-xl border border-border bg-background">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
                <span
                  className={`ml-3 shrink-0 text-sm font-medium ${
                    txn.amount > 0 ? 'text-green-600' : 'text-foreground'
                  }`}
                >
                  {txn.amount > 0 ? '+' : ''}
                  {formatCredits(Math.abs(txn.amount))}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        )}
        <WebManageLink label="View full history on web" description="See all transactions and detailed usage reports" />
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MembersSection – proper component (FULL on mobile)
   ───────────────────────────────────────────── */

function MembersSection() {
  const [members, setMembers] = useState<SpaceMember[]>(() => [...MOCK_MEMBERS]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  const handleRoleChange = (memberId: string, newRole: string) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    toast.success('Role updated');
  };

  const handleRemove = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setConfirmRemoveId(null);
    toast.success('Member removed');
  };

  return (
    <div className="space-y-4">
      <SectionIntro title="Members" description="Manage membership for this LeapSpace. Admins need to handle people on the go." />

      {/* Search + role filter */}
      <Card className="space-y-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="h-11"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRoleFilter(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              !roleFilter ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            All ({members.length})
          </button>
          {ALL_MEMBER_ROLES.map((role) => {
            const count = members.filter((m) => m.role === role).length;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(roleFilter === role ? null : role)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  roleFilter === role ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {role} ({count})
              </button>
            );
          })}
        </div>
      </Card>

      {/* Member cards */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((member) => (
            <Card key={member.id} className="space-y-3">
              <div className="flex items-start gap-3">
                {/* Initials avatar */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {getInitials(member.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                  {member.phone && <p className="text-xs text-muted-foreground">{member.phone}</p>}
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">
                  {member.role}
                </Badge>
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-2">
                <Select value={member.role} onValueChange={(value) => handleRoleChange(member.id, value)}>
                  <SelectTrigger className="h-9 flex-1 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_MEMBER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {confirmRemoveId === member.id ? (
                  <div className="flex gap-1.5">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-9 text-xs"
                      onClick={() => handleRemove(member.id)}
                    >
                      Confirm
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs"
                      onClick={() => setConfirmRemoveId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs"
                    onClick={() => setConfirmRemoveId(member.id)}
                  >
                    <Trash2 className="mr-1 size-3.5" />
                    Remove
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-muted-foreground">No members match your search.</p>
        </Card>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   InvitationsSection – summary + single invite on mobile
   ───────────────────────────────────────────── */

function InvitationsSection() {
  const [invitations, setInvitations] = useState<SpaceInvitation[]>(() => [...MOCK_INVITATIONS]);
  const [statusFilter, setStatusFilter] = useState<InvitationStatus | null>(null);

  // Single invite form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState('Learner');

  const filtered = useMemo(() => {
    return invitations.filter((inv) => !statusFilter || inv.status === statusFilter);
  }, [invitations, statusFilter]);

  const statusBadgeVariant = (status: InvitationStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'accepted':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'expired':
        return 'outline';
    }
  };

  const statuses: InvitationStatus[] = ['pending', 'accepted', 'cancelled', 'expired'];

  const handleSendInvite = () => {
    const trimName = inviteName.trim();
    const trimEmail = inviteEmail.trim();
    const trimPhone = invitePhone.trim();
    if (!trimName || (!trimEmail && !trimPhone)) {
      toast.error('Name and at least email or phone are required.');
      return;
    }
    const newInvite: SpaceInvitation = {
      id: `inv-${Date.now()}`,
      name: trimName,
      avatarId: null,
      email: trimEmail || null,
      phone: trimPhone || null,
      role: inviteRole,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvitations((prev) => [newInvite, ...prev]);
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
    setInviteRole('Learner');
    toast.success(`Invitation sent to ${trimName}`);
  };

  const handleCancel = (id: string) => {
    setInvitations((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: 'cancelled' as InvitationStatus } : inv)));
    toast.success('Invitation cancelled');
  };

  return (
    <div className="space-y-4">
      <SectionIntro title="Invitations" description="View invitation status and send individual invites. Use web for bulk operations." />

      {/* Status filter pills */}
      <Card className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              !statusFilter ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            All ({invitations.length})
          </button>
          {statuses.map((status) => {
            const count = invitations.filter((inv) => inv.status === status).length;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                  statusFilter === status ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>
      </Card>

      {/* Invitation list */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((inv) => (
            <Card key={inv.id} className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{inv.name}</p>
                    <Badge variant={statusBadgeVariant(inv.status)} className="text-[10px] capitalize">
                      {inv.status}
                    </Badge>
                  </div>
                  {inv.email && <p className="truncate text-xs text-muted-foreground">{inv.email}</p>}
                  {inv.phone && <p className="text-xs text-muted-foreground">{inv.phone}</p>}
                </div>
                <div className="shrink-0 text-right">
                  <Badge variant="outline" className="text-[10px]">
                    {inv.role}
                  </Badge>
                  <p className="mt-1 text-[10px] text-muted-foreground">{inv.createdAt}</p>
                </div>
              </div>
              {inv.status === 'pending' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleCancel(inv.id)}
                >
                  Cancel invitation
                </Button>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-muted-foreground">No invitations match this filter.</p>
        </Card>
      )}

      {/* Single invite form */}
      <Card className="space-y-3">
        <p className="text-sm font-medium text-foreground">Send an invitation</p>
        <Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Full name" className="h-11" />
        <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Email address" className="h-11" />
        <Input value={invitePhone} onChange={(e) => setInvitePhone(e.target.value)} placeholder="Phone (optional)" className="h-11" />
        <Select value={inviteRole} onValueChange={setInviteRole}>
          <SelectTrigger className="h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_MEMBER_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" className="w-full" onClick={handleSendInvite}>
          <Plus className="mr-1.5 size-4" />
          Send invitation
        </Button>
      </Card>

      <WebManageLink label="Bulk invite on web" description="Import CSV, send batch invites, and manage templates" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   AccountCenterScreen (exported)
   ───────────────────────────────────────────── */

export function AccountCenterScreen({ isOpen, onClose, initialGroup, initialSection, settings, onSave }: AccountCenterScreenProps) {
  const [draftState, setDraftState] = useState(() => cloneMobileSettingsState(settings));
  const [activeGroup, setActiveGroup] = useState<AccountCenterGroup>(initialGroup);
  const [activeSection, setActiveSection] = useState<GlobalProfileSectionId | GlobalAccountSectionId | null>(initialSection ?? null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setDraftState(cloneMobileSettingsState(settings));
    setActiveGroup(initialGroup);
    setActiveSection(initialSection ?? null);
    setSearch('');
  }, [isOpen, settings, initialGroup, initialSection]);

  if (!isOpen) return null;

  const globalHasChanges =
    JSON.stringify(draftState.globalProfile) !== JSON.stringify(settings.globalProfile) ||
    JSON.stringify(draftState.globalAccount) !== JSON.stringify(settings.globalAccount);

  const visibleSections = (activeGroup === 'profile' ? globalProfileSections : globalAccountSections).filter((section) =>
    section.label.toLowerCase().includes(search.toLowerCase()),
  );

  const sectionTitle = activeSection ? getGlobalSectionLabel(activeSection) : activeGroup === 'profile' ? 'My Profile' : 'My Account';
  const sectionSubtitle = activeGroup === 'profile' ? 'Global profile' : 'Internal account controls';
  const sectionDescription =
    activeGroup === 'profile'
      ? 'This is your default professional identity across LeapSpaces.'
      : 'This is your technical and internal account management area.';
  const metaLine =
    activeGroup === 'profile'
      ? '3 sections \u2022 Default identity inherited by LeapSpace profiles'
      : '6 sections \u2022 Account controls stay separate from profile identity';

  const handleDiscard = () => {
    setDraftState((prev) => ({
      ...prev,
      globalProfile: cloneMobileSettingsState(settings).globalProfile,
      globalAccount: cloneMobileSettingsState(settings).globalAccount,
    }));
    toast.success('Changes discarded');
  };

  const handleSave = () => {
    onSave({
      ...settings,
      globalProfile: cloneMobileSettingsState(draftState).globalProfile,
      globalAccount: cloneMobileSettingsState(draftState).globalAccount,
    });
    toast.success('Global settings saved');
  };

  return (
    <div className="fixed inset-0 z-[80] bg-background">
      <div className="flex h-full flex-col">
        <ScreenHeader
          title={sectionTitle}
          subtitle={sectionSubtitle}
          description={sectionDescription}
          meta={metaLine}
          onBack={activeSection ? () => setActiveSection(null) : onClose}
        />

        <div className="flex-1 overflow-y-auto bg-muted/30 pb-28">
          {activeSection ? (
            <div className="space-y-4 px-4 py-4">
              {renderGlobalSection(activeSection, draftState, setDraftState)}
            </div>
          ) : (
            <div className="space-y-4 px-4 py-4">
              <SegmentedTabs
                options={[
                  { value: 'profile', label: 'My Profile' },
                  { value: 'account', label: 'My Account' },
                ]}
                value={activeGroup}
                onChange={(value) => setActiveGroup(value as AccountCenterGroup)}
              />

              <Card>
                <FieldLabel htmlFor="account-center-search">Search profile or account</FieldLabel>
                <Input
                  id="account-center-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search profile or account"
                />
              </Card>

              <Card className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {activeGroup === 'profile' ? 'My Profile' : 'My Account'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activeGroup === 'profile'
                      ? 'Keep professional identity separate from billing, sessions, and authentication.'
                      : 'Keep account controls separate from profile presentation and LeapSpace-scoped identity.'}
                  </p>
                </div>

                <div className="divide-y divide-border rounded-xl border border-border bg-background">
                  {visibleSections.map((section) => (
                    <NavRow
                      key={section.id}
                      label={section.label}
                      onClick={() => setActiveSection(section.id)}
                    />
                  ))}

                  {visibleSections.length === 0 ? (
                    <div className="px-4 py-5 text-sm text-muted-foreground">No matching sections.</div>
                  ) : null}
                </div>
              </Card>
            </div>
          )}
        </div>

        {activeSection ? (
          <StickySaveBar
            isDirty={globalHasChanges}
            subtitle={
              activeGroup === 'profile'
                ? 'Saving here updates your global default profile only.'
                : 'Saving here updates only account-level controls.'
            }
            onDiscard={handleDiscard}
            onSave={handleSave}
          />
        ) : null}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ManageLeapSpaceScreen (exported)
   ───────────────────────────────────────────── */

export function ManageLeapSpaceScreen({
  isOpen,
  onClose,
  currentLeapspaceId,
  onCurrentLeapspaceChange,
  settings,
  onSave,
}: ManageLeapSpaceScreenProps) {
  const [draftState, setDraftState] = useState(() => cloneMobileSettingsState(settings));
  const [activeLeapspaceId, setActiveLeapspaceId] = useState(currentLeapspaceId);
  const [activeSection, setActiveSection] = useState<LeapSpaceSectionId | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const validLeapspaceId = settings.leapspaces.some((space) => space.id === currentLeapspaceId)
      ? currentLeapspaceId
      : settings.leapspaces[0]?.id ?? initialMobileSettingsState.leapspaces[0].id;

    setDraftState(cloneMobileSettingsState(settings));
    setActiveLeapspaceId(validLeapspaceId);
    setActiveSection(null);
    setSearch('');
  }, [isOpen, currentLeapspaceId, settings]);

  if (!isOpen) return null;

  const savedLeapspace = settings.leapspaces.find((space) => space.id === activeLeapspaceId) ?? settings.leapspaces[0];
  const draftLeapspace = draftState.leapspaces.find((space) => space.id === activeLeapspaceId) ?? draftState.leapspaces[0];

  if (!savedLeapspace || !draftLeapspace) return null;

  const navGroups = getLeapSpaceNav(draftLeapspace.role)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
    }))
    .filter((group) => group.items.length > 0);

  const isSelfManaged = activeSection ? SELF_MANAGED_SECTIONS.has(activeSection) : false;

  const currentSectionDirty = activeSection && !isSelfManaged
    ? isLeapSpaceSectionDirty(activeSection, draftLeapspace, savedLeapspace)
    : false;

  const handleLeapspaceChange = (value: string) => {
    setActiveLeapspaceId(value);
    onCurrentLeapspaceChange(value);
  };

  const handleDiscardSection = () => {
    setDraftState((prev) => {
      const next = cloneMobileSettingsState(prev);
      const nextLeapspace = next.leapspaces.find((space) => space.id === activeLeapspaceId);

      if (!nextLeapspace || !activeSection) return prev;

      if (activeSection === 'leapspace-profile') {
        nextLeapspace.leapspaceProfile = cloneValue(savedLeapspace.leapspaceProfile);
      } else if (activeSection === 'notifications') {
        nextLeapspace.notifications = cloneValue(savedLeapspace.notifications);
      } else {
        nextLeapspace.genericSections[activeSection] = cloneValue(savedLeapspace.genericSections[activeSection]);
      }

      return next;
    });
    toast.success('Section reset');
  };

  const handleSaveSection = () => {
    if (!activeSection) return;

    const nextState = cloneMobileSettingsState(settings);
    const savedIndex = nextState.leapspaces.findIndex((space) => space.id === activeLeapspaceId);
    const draftMatch = draftState.leapspaces.find((space) => space.id === activeLeapspaceId);

    if (savedIndex === -1 || !draftMatch) return;

    if (activeSection === 'leapspace-profile') {
      nextState.leapspaces[savedIndex].leapspaceProfile = cloneValue(draftMatch.leapspaceProfile);
      toast.success('LeapSpace Profile saved');
    } else if (activeSection === 'notifications') {
      nextState.leapspaces[savedIndex].notifications = cloneValue(draftMatch.notifications);
      toast.success('Notifications saved');
    } else {
      nextState.leapspaces[savedIndex].genericSections[activeSection] = cloneValue(draftMatch.genericSections[activeSection]);
      toast.success(`${getLeapSpaceSectionLabel(activeSection)} saved`);
    }

    onSave(nextState);
  };

  /** Render the right content for the active section */
  const renderActiveSection = () => {
    if (!activeSection) return null;

    if (activeSection === 'leapspace-profile') {
      return renderLeapSpaceProfileSection(draftLeapspace, settings.globalProfile, (updater) => {
        setDraftState((prev) =>
          updateLeapspace(prev, activeLeapspaceId, (space) => {
            space.leapspaceProfile = updater(space.leapspaceProfile);
          }),
        );
      });
    }

    if (activeSection === 'notifications') {
      return renderLeapSpaceNotificationsSection(draftLeapspace, (updater) => {
        setDraftState((prev) =>
          updateLeapspace(prev, activeLeapspaceId, (space) => {
            space.notifications = updater(space.notifications);
          }),
        );
      });
    }

    if (activeSection === 'members') {
      return <MembersSection />;
    }

    if (activeSection === 'invitations') {
      return <InvitationsSection />;
    }

    if (activeSection === 'roles') {
      return renderRolesSummary();
    }

    if (activeSection === 'teams') {
      return renderTeamsSummary();
    }

    // Generic fallthrough
    return renderGenericLeapSpaceSection(activeSection, draftLeapspace.genericSections[activeSection], (updater) => {
      setDraftState((prev) =>
        updateLeapspace(prev, activeLeapspaceId, (space) => {
          space.genericSections[activeSection] = updater(space.genericSections[activeSection]);
        }),
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[81] bg-background">
      <div className="flex h-full flex-col">
        <ScreenHeader
          title={activeSection ? getLeapSpaceSectionLabel(activeSection) : 'Manage LeapSpace'}
          subtitle={activeSection ? 'LeapSpace-scoped settings' : 'Manage LeapSpace'}
          description={
            activeSection
              ? 'This section is scoped to the selected LeapSpace only.'
              : 'Keep LeapSpace Profile, notifications, and role-based workspace controls scoped to one LeapSpace.'
          }
          meta={`${formatRoleLabel(draftLeapspace.role)} role \u2022 ${draftLeapspace.communitiesCount} groups \u2022 ${draftLeapspace.eventsCount} events`}
          onBack={activeSection ? () => setActiveSection(null) : onClose}
        />

        <div className="flex-1 overflow-y-auto bg-muted/30 pb-8">
          {activeSection ? (
            <div className="space-y-4 px-4 py-4">
              {renderActiveSection()}

              {!isSelfManaged && (
                <SectionActionBar
                  isDirty={currentSectionDirty}
                  onDiscard={handleDiscardSection}
                  onSave={handleSaveSection}
                />
              )}
            </div>
          ) : (
            <div className="space-y-4 px-4 py-4">
              <Card className="space-y-4">
                <div>
                  <FieldLabel htmlFor="manage-leapspace-picker">LeapSpace</FieldLabel>
                  <Select value={activeLeapspaceId} onValueChange={handleLeapspaceChange}>
                    <SelectTrigger id="manage-leapspace-picker" className="h-11">
                      <SelectValue placeholder="Select LeapSpace" />
                    </SelectTrigger>
                    <SelectContent>
                      {draftState.leapspaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">LeapSpace Profile inherits from My Profile by default.</p>
                  <p className="mt-1">Selected identity, visibility, and messaging fields can be overridden here without changing the global user profile.</p>
                </div>

                <div>
                  <FieldLabel htmlFor="leapspace-settings-search">Search LeapSpace settings</FieldLabel>
                  <Input
                    id="leapspace-settings-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search LeapSpace settings"
                  />
                </div>
              </Card>

              {navGroups.map((group) => (
                <Card key={group.title} className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{group.title}</p>
                  </div>

                  <div className="divide-y divide-border rounded-xl border border-border bg-background">
                    {group.items.map((item) => (
                      <NavRow key={item.id} label={item.label} onClick={() => setActiveSection(item.id)} />
                    ))}
                  </div>
                </Card>
              ))}

              {navGroups.length === 0 ? (
                <Card>
                  <p className="text-sm text-muted-foreground">No matching LeapSpace settings.</p>
                </Card>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   renderGlobalSection (function — no hooks allowed)
   ───────────────────────────────────────────── */

function renderGlobalSection(
  section: GlobalProfileSectionId | GlobalAccountSectionId,
  draftState: MobileSettingsState,
  setDraftState: React.Dispatch<React.SetStateAction<MobileSettingsState>>,
) {
  switch (section) {
    /* ── Profile Basics ── */
    case 'profile-basics': {
      const bioLength = draftState.globalProfile.shortBio.length;
      return (
        <>
          <SectionIntro
            title="Profile Basics"
            description="These are the default identity fields LeapSpaces inherit from unless a scoped profile overrides them."
          />

          {/* Banner + avatar preview */}
          <Card className="space-y-0 p-0">
            <div className="h-28 rounded-t-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            <div className="px-4 pb-4">
              <div className="-mt-10 flex items-end gap-3">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-primary text-xl font-semibold text-primary-foreground">
                  {getInitials(draftState.globalProfile.preferredName || draftState.globalProfile.fullName)}
                </div>
                <div className="min-w-0 pb-1">
                  <p className="truncate text-base font-medium text-foreground">
                    {draftState.globalProfile.preferredName || draftState.globalProfile.fullName}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{draftState.globalProfile.professionalHeadline}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-border px-4 py-3">
              <Button type="button" variant="outline" className="flex-1" size="sm">
                Change avatar
              </Button>
              <Button type="button" variant="outline" className="flex-1" size="sm">
                Change banner
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <TextField
              label="Full name"
              value={draftState.globalProfile.fullName}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, fullName: value } }))}
            />
            <TextField
              label="Preferred name"
              value={draftState.globalProfile.preferredName}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, preferredName: value } }))}
            />
            <TextField
              label="Professional headline"
              value={draftState.globalProfile.professionalHeadline}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, professionalHeadline: value } }))}
            />
            <TextField
              label="Primary location"
              value={draftState.globalProfile.primaryLocation}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, primaryLocation: value } }))}
            />

            {/* Bio with char counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="field-short-bio">Short bio</FieldLabel>
                <span className={`text-xs ${bioLength > BIO_MAX_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {bioLength}/{BIO_MAX_LENGTH}
                </span>
              </div>
              <Textarea
                id="field-short-bio"
                value={draftState.globalProfile.shortBio}
                onChange={(event) =>
                  setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, shortBio: event.target.value } }))
                }
                className="min-h-28"
              />
            </div>

            <TextField
              label="Personal website"
              value={draftState.globalProfile.personalWebsite}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, personalWebsite: value } }))}
            />
          </Card>
        </>
      );
    }

    /* ── Professional Identity ── */
    case 'professional-identity':
      return (
        <>
          <SectionIntro
            title="Professional Identity"
            description="Use richer fields here so the profile feels complete in discovery, trust, and matching surfaces."
          />
          <Card className="space-y-4">
            <TextField
              label="Current role / title"
              value={draftState.globalProfile.currentRoleTitle}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, currentRoleTitle: value } }))}
            />
            <TextField
              label="Company / organization"
              value={draftState.globalProfile.companyOrganization}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, companyOrganization: value } }))}
            />
            <TextField
              label="Industry"
              value={draftState.globalProfile.industry}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, industry: value } }))}
            />
            <TextField
              label="Primary expertise"
              value={draftState.globalProfile.primaryExpertise}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, primaryExpertise: value } }))}
            />

            {/* Skills — tag input (stateful component) */}
            <SkillTagInput
              skills={draftState.globalProfile.skillsAndStrengths}
              onChange={(skills) =>
                setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, skillsAndStrengths: skills } }))
              }
            />

            <TextAreaField
              label="Work experience summary"
              value={draftState.globalProfile.workExperienceSummary}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, workExperienceSummary: value } }))}
            />
            <TextAreaField
              label="Education summary"
              value={draftState.globalProfile.educationSummary}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, educationSummary: value } }))}
            />

            {/* Featured links — structured editor (stateful component) */}
            <FeaturedLinksEditor
              links={draftState.globalProfile.featuredLinks}
              onChange={(links) =>
                setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, featuredLinks: links } }))
              }
            />
          </Card>
        </>
      );

    /* ── Visibility ── */
    case 'visibility':
      return (
        <>
          <SectionIntro title="Visibility" description="Control global profile presentation and discoverability defaults." />
          <Card className="space-y-4">
            <SelectField
              label="Profile visibility"
              value={draftState.globalProfile.profileVisibility}
              onValueChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalProfile: { ...prev.globalProfile, profileVisibility: value as typeof prev.globalProfile.profileVisibility },
                }))
              }
              options={[
                { value: 'members-only', label: 'LeapSpace members only' },
                { value: 'connections-only', label: 'Connections only' },
                { value: 'public-profile', label: 'Public profile' },
              ]}
            />
            <ToggleField
              label="Show company on global profile"
              checked={draftState.globalProfile.showCompanyOnGlobalProfile}
              onCheckedChange={(checked) =>
                setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, showCompanyOnGlobalProfile: checked } }))
              }
            />
            <ToggleField
              label="Show location on global profile"
              checked={draftState.globalProfile.showLocationOnGlobalProfile}
              onCheckedChange={(checked) =>
                setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, showLocationOnGlobalProfile: checked } }))
              }
            />
            <ToggleField
              label="Show social links"
              checked={draftState.globalProfile.showSocialLinks}
              onCheckedChange={(checked) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, showSocialLinks: checked } }))}
            />
            <ToggleField
              label="Allow member search discovery"
              checked={draftState.globalProfile.allowMemberSearchDiscovery}
              onCheckedChange={(checked) =>
                setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, allowMemberSearchDiscovery: checked } }))
              }
            />
            <ToggleField
              label="Use profile for recommendations"
              checked={draftState.globalProfile.useProfileForRecommendations}
              onCheckedChange={(checked) =>
                setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, useProfileForRecommendations: checked } }))
              }
            />
          </Card>

          <Card className="space-y-2 border-amber-200 bg-amber-50/60">
            <p className="text-sm font-medium text-foreground">What stays out of My Profile</p>
            <p className="text-sm text-muted-foreground">
              Billing, invoices, payment methods, sessions, passwords, and provider connections remain in My Account.
            </p>
            <p className="text-sm text-muted-foreground">
              Anonymity rules do not belong in My Profile. Anonymous mode is handled inside each LeapSpace Profile.
            </p>
          </Card>
        </>
      );

    /* ── Preferences ── */
    case 'preferences':
      return (
        <>
          <SectionIntro title="Preferences" description="These affect the account experience, not the public profile." />
          <Card className="space-y-4">
            <TextField
              label="Language"
              value={draftState.globalAccount.preferences.language}
              onChange={(value) =>
                setDraftState((prev) => ({ ...prev, globalAccount: { ...prev.globalAccount, preferences: { ...prev.globalAccount.preferences, language: value } } }))
              }
            />
            <SelectField
              label="Region"
              value={draftState.globalAccount.preferences.region}
              onValueChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, preferences: { ...prev.globalAccount.preferences, region: value as typeof prev.globalAccount.preferences.region } },
                }))
              }
              options={[
                { value: 'india', label: 'India' },
                { value: 'united-states', label: 'United States' },
                { value: 'singapore', label: 'Singapore' },
                { value: 'united-kingdom', label: 'United Kingdom' },
              ]}
            />
            <SelectField
              label="Timezone"
              value={draftState.globalAccount.preferences.timezone}
              onValueChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, preferences: { ...prev.globalAccount.preferences, timezone: value as typeof prev.globalAccount.preferences.timezone } },
                }))
              }
              options={[
                { value: 'gmt-5-30', label: 'GMT+5:30' },
                { value: 'utc', label: 'UTC' },
                { value: 'pacific-time', label: 'Pacific Time' },
                { value: 'eastern-time', label: 'Eastern Time' },
              ]}
            />
            <div className="space-y-2">
              <FieldLabel>Theme preference</FieldLabel>
              <SegmentedTabs
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'system', label: 'System' },
                  { value: 'dark', label: 'Dark' },
                ]}
                value={draftState.globalAccount.preferences.themePreference}
                onChange={(value) =>
                  setDraftState((prev) => ({
                    ...prev,
                    globalAccount: { ...prev.globalAccount, preferences: { ...prev.globalAccount.preferences, themePreference: value as typeof prev.globalAccount.preferences.themePreference } },
                  }))
                }
              />
            </div>
            <SelectField
              label="Default start page"
              value={draftState.globalAccount.preferences.defaultStartPage}
              onValueChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, preferences: { ...prev.globalAccount.preferences, defaultStartPage: value as typeof prev.globalAccount.preferences.defaultStartPage } },
                }))
              }
              options={[
                { value: 'engagement-feed', label: 'Engagement feed' },
                { value: 'home-overview', label: 'Home overview' },
                { value: 'events', label: 'Events' },
                { value: 'communities', label: 'Communities' },
              ]}
            />
          </Card>
        </>
      );

    /* ── Authentication — summary + limited actions ── */
    case 'authentication':
      return (
        <>
          <SectionIntro title="Authentication" description="Security essentials. Use web for full passkey and password management." />

          {/* Email — readonly */}
          <Card className="space-y-4">
            <ReadonlyField label="Account email" value={draftState.globalAccount.authentication.accountEmail} />
            <WebManageLink label="Change email on web" description="Email changes require identity verification" />
          </Card>

          {/* Password — status display */}
          <Card className="space-y-4">
            <ReadonlyField label="Password status" value={draftState.globalAccount.authentication.passwordState} />
            <WebManageLink label="Change password on web" description="Password updates require current password verification" />
          </Card>

          {/* 2FA — toggle (actionable on mobile) */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
              </div>
              <Badge variant={draftState.globalAccount.authentication.twoFactorAuthentication ? 'default' : 'secondary'}>
                {draftState.globalAccount.authentication.twoFactorAuthentication ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <ToggleField
              label="Two-factor authentication"
              checked={draftState.globalAccount.authentication.twoFactorAuthentication}
              onCheckedChange={(checked) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, authentication: { ...prev.globalAccount.authentication, twoFactorAuthentication: checked } },
                }))
              }
            />
          </Card>

          {/* Passkeys — count summary, not management */}
          <Card className="space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="size-5 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Passkeys ({draftState.globalAccount.authentication.passkeys.length})
              </p>
            </div>
            {draftState.globalAccount.authentication.passkeys.length > 0 ? (
              <div className="space-y-2">
                {draftState.globalAccount.authentication.passkeys.map((pk) => (
                  <div key={pk.id} className="rounded-xl border border-border bg-background px-4 py-2.5">
                    <p className="text-sm text-foreground">{pk.name}</p>
                    <p className="text-xs text-muted-foreground">Last used {pk.lastUsed}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No passkeys registered.</p>
            )}
            <WebManageLink label="Manage passkeys on web" description="Add, rename, or remove passkeys" />
          </Card>

          {/* Session challenge + security alerts */}
          <Card className="space-y-4">
            <TextField
              label="Session challenge policy"
              value={draftState.globalAccount.authentication.sessionChallengePolicy}
              onChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, authentication: { ...prev.globalAccount.authentication, sessionChallengePolicy: value } },
                }))
              }
            />
            <ToggleField
              label="Security alerts"
              checked={draftState.globalAccount.authentication.securityAlerts}
              onCheckedChange={(checked) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, authentication: { ...prev.globalAccount.authentication, securityAlerts: checked } },
                }))
              }
            />
          </Card>
        </>
      );

    /* ── Credits — dashboard with quick buy ── */
    case 'credits':
      return (
        <>
          <SectionIntro title="Credits" description="View your balance, buy credit packs, and see recent transactions." />
          <CreditsDashboard
            credits={draftState.globalAccount.credits}
            onChange={(next) =>
              setDraftState((prev) => ({
                ...prev,
                globalAccount: { ...prev.globalAccount, credits: next },
              }))
            }
          />
        </>
      );

    /* ── Billing — readonly summary + manage on web ── */
    case 'billing':
      return (
        <>
          <SectionIntro title="Billing" description="Billing belongs here so it never gets mixed into the profile experience." />

          <Card className="space-y-4">
            <ReadonlyField label="Current plan" value={draftState.globalAccount.billing.currentPlan} />
            <ReadonlyField label="Renewal date" value={draftState.globalAccount.billing.renewalDate} />
          </Card>

          <Card className="space-y-4">
            <ReadonlyField
              label="Payment method"
              value={draftState.globalAccount.billing.paymentMethod}
              icon={<CreditCard className="size-4 shrink-0" />}
            />
            <ReadonlyField label="Billing email" value={draftState.globalAccount.billing.billingEmail} />
            <ReadonlyField label="Invoice delivery" value={draftState.globalAccount.billing.invoiceDelivery} />
          </Card>

          <WebManageLink label="Manage billing on web" description="Update payment method, change plan, download invoices" />
        </>
      );

    /* ── Connected Accounts ── */
    case 'connected-accounts':
      return (
        <>
          <SectionIntro title="Connected Accounts" description="Real connection state makes this page feel finished even in prototype form." />
          <Card className="space-y-4">
            {(Object.keys(draftState.globalAccount.connectedAccounts) as Array<keyof typeof draftState.globalAccount.connectedAccounts>).map((provider) => (
              <ToggleField
                key={provider}
                label={provider === 'linkedIn' ? 'LinkedIn' : provider.charAt(0).toUpperCase() + provider.slice(1)}
                description={connectedAccountCopy[provider as keyof typeof connectedAccountCopy]}
                checked={draftState.globalAccount.connectedAccounts[provider]}
                onCheckedChange={(checked) =>
                  setDraftState((prev) => ({
                    ...prev,
                    globalAccount: {
                      ...prev.globalAccount,
                      connectedAccounts: { ...prev.globalAccount.connectedAccounts, [provider]: checked },
                    },
                  }))
                }
              />
            ))}
          </Card>
        </>
      );

    /* ── Active Sessions — session cards with revoke ── */
    case 'active-sessions': {
      const sessions = draftState.globalAccount.activeSessions;
      return (
        <>
          <SectionIntro title="Active Sessions" description="Review your active sessions and revoke access from unrecognized devices." />

          {sessions.length > 0 ? (
            <div className="space-y-2">
              {sessions.map((session) => {
                const isPhone = /iphone|android|pixel|galaxy/i.test(session.device);
                const DeviceIcon = isPhone ? Smartphone : Monitor;
                return (
                  <Card key={session.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <DeviceIcon className="size-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{session.label}</p>
                          {session.current && (
                            <Badge variant="default" className="text-[10px]">
                              This device
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{session.device}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.location} \u2022 {session.lastActive}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          setDraftState((prev) => ({
                            ...prev,
                            globalAccount: {
                              ...prev.globalAccount,
                              activeSessions: prev.globalAccount.activeSessions.filter((s) => s.id !== session.id),
                            },
                          }));
                          toast.success(`Session "${session.label}" revoked`);
                        }}
                      >
                        <Trash2 className="mr-1.5 size-3.5" />
                        Revoke session
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <p className="text-sm text-muted-foreground">No active sessions found.</p>
            </Card>
          )}

          {sessions.filter((s) => !s.current).length > 0 && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: {
                    ...prev.globalAccount,
                    activeSessions: prev.globalAccount.activeSessions.filter((s) => s.current),
                  },
                }));
                toast.success('All other sessions revoked');
              }}
            >
              <LogOut className="mr-2 size-4" />
              Revoke all other sessions
            </Button>
          )}
        </>
      );
    }

    default:
      return null;
  }
}

/* ─────────────────────────────────────────────
   renderLeapSpaceProfileSection
   ───────────────────────────────────────────── */

function renderLeapSpaceProfileSection(
  leapspace: LeapSpaceSettingsState,
  globalProfile: MobileSettingsState['globalProfile'],
  update: (updater: (value: LeapSpaceSettingsState['leapspaceProfile']) => LeapSpaceSettingsState['leapspaceProfile']) => void,
) {
  const resolvedDisplayName =
    leapspace.leapspaceProfile.useCodenameInsteadOfFullIdentity && leapspace.leapspaceProfile.codenameAlternateName
      ? leapspace.leapspaceProfile.codenameAlternateName
      : leapspace.leapspaceProfile.displayNameInThisLeapSpace || globalProfile.preferredName || globalProfile.fullName;
  const previewBio = leapspace.leapspaceProfile.bioInThisLeapSpace || globalProfile.shortBio;
  const initials = getInitials(resolvedDisplayName);

  return (
    <>
      <SectionIntro
        title="LeapSpace Profile"
        description="This is the scoped identity, privacy, and messaging layer inside one specific LeapSpace."
      />

      <Card className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="h-20 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent" />
          <div className="px-4 pb-4">
            <div className="-mt-8 flex items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-background bg-primary text-lg font-semibold text-primary-foreground">
                  {initials}
                </div>
                <div>
                  <p className="text-base font-medium text-foreground">{resolvedDisplayName}</p>
                  {leapspace.leapspaceProfile.showRoleBadgeOnProfile ? (
                    <p className="mt-1 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">{leapspace.leapspaceProfile.roleTitle}</p>
                  ) : null}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{previewBio}</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <TextField
          label="Display name in this LeapSpace"
          value={leapspace.leapspaceProfile.displayNameInThisLeapSpace}
          onChange={(value) => update((prev) => ({ ...prev, displayNameInThisLeapSpace: value }))}
        />
        <TextField
          label="Codename / alternate name"
          value={leapspace.leapspaceProfile.codenameAlternateName}
          onChange={(value) => update((prev) => ({ ...prev, codenameAlternateName: value }))}
        />
        <TextField
          label="Role title"
          value={leapspace.leapspaceProfile.roleTitle}
          onChange={(value) => update((prev) => ({ ...prev, roleTitle: value }))}
        />
        <SelectField
          label="Profile photo mode"
          value={leapspace.leapspaceProfile.profilePhotoMode}
          onValueChange={(value) => update((prev) => ({ ...prev, profilePhotoMode: value as typeof prev.profilePhotoMode }))}
          options={[
            { value: 'global-avatar', label: 'Use global avatar' },
            { value: 'leapspace-avatar', label: 'Use LeapSpace-specific avatar' },
          ]}
        />
        <SelectField
          label="Override mode"
          value={leapspace.leapspaceProfile.overrideMode}
          onValueChange={(value) => update((prev) => ({ ...prev, overrideMode: value as typeof prev.overrideMode }))}
          options={[
            { value: 'customized', label: 'Customized for this LeapSpace' },
            { value: 'inherit-global', label: 'Fully inherit global profile' },
          ]}
        />
        <TextField
          label="Override scope"
          value={leapspace.leapspaceProfile.overrideScope}
          onChange={(value) => update((prev) => ({ ...prev, overrideScope: value }))}
        />
        <TextAreaField
          label="Bio in this LeapSpace"
          value={leapspace.leapspaceProfile.bioInThisLeapSpace}
          onChange={(value) => update((prev) => ({ ...prev, bioInThisLeapSpace: value }))}
        />
      </Card>

      <Card className="space-y-4">
        <ToggleField
          label="Anonymous mode in this LeapSpace"
          checked={leapspace.leapspaceProfile.anonymousModeInThisLeapSpace}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, anonymousModeInThisLeapSpace: checked }))}
        />
        <ToggleField
          label="Use codename instead of full identity"
          checked={leapspace.leapspaceProfile.useCodenameInsteadOfFullIdentity}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, useCodenameInsteadOfFullIdentity: checked }))}
        />
        <ToggleField
          label="Show role badge on profile"
          checked={leapspace.leapspaceProfile.showRoleBadgeOnProfile}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, showRoleBadgeOnProfile: checked }))}
        />
        <ToggleField
          label="Appear in member directory"
          checked={leapspace.leapspaceProfile.appearInMemberDirectory}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, appearInMemberDirectory: checked }))}
        />
        <ToggleField
          label="Allow direct messages from members"
          description="Global direct message defaults can be overridden per LeapSpace here."
          checked={leapspace.leapspaceProfile.allowDirectMessagesFromMembers}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, allowDirectMessagesFromMembers: checked }))}
        />
        <ToggleField
          label="Appear in search inside this LeapSpace"
          checked={leapspace.leapspaceProfile.appearInSearchInsideThisLeapSpace}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, appearInSearchInsideThisLeapSpace: checked }))}
        />
        <ToggleField
          label="Allow connection requests"
          checked={leapspace.leapspaceProfile.allowConnectionRequests}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, allowConnectionRequests: checked }))}
        />
        <ToggleField
          label="Allow mentoring requests"
          checked={leapspace.leapspaceProfile.allowMentoringRequests}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, allowMentoringRequests: checked }))}
        />
        <ToggleField
          label="Allow collaboration requests"
          checked={leapspace.leapspaceProfile.allowCollaborationRequests}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, allowCollaborationRequests: checked }))}
        />
      </Card>

      <Card className="space-y-2 border-amber-200 bg-amber-50/60">
        <p className="text-sm font-medium text-foreground">Privacy rule</p>
        <p className="text-sm text-muted-foreground">Anonymity is available in all LeapSpaces.</p>
        <p className="text-sm text-muted-foreground">
          If a member turns on anonymous mode here, admins do not get an override view of the hidden identity.
        </p>
      </Card>
    </>
  );
}

/* ─────────────────────────────────────────────
   renderLeapSpaceNotificationsSection
   ───────────────────────────────────────────── */

function renderLeapSpaceNotificationsSection(
  leapspace: LeapSpaceSettingsState,
  update: (updater: (value: LeapSpaceSettingsState['notifications']) => LeapSpaceSettingsState['notifications']) => void,
) {
  return (
    <>
      <SectionIntro title="Notifications" description="These are LeapSpace-scoped notification overrides." />
      <Card className="space-y-4">
        <ToggleField
          label={`Mute ${leapspace.name}`}
          checked={leapspace.notifications.muteSpace}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, muteSpace: checked }))}
        />
        <ToggleField
          label="Mentions and replies"
          checked={leapspace.notifications.mentionsAndReplies}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, mentionsAndReplies: checked }))}
        />
        <ToggleField
          label="Direct messages from members"
          checked={leapspace.notifications.directMessagesFromMembers}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, directMessagesFromMembers: checked }))}
        />
        <ToggleField
          label="Mobile push notifications"
          checked={leapspace.notifications.mobilePushNotifications}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, mobilePushNotifications: checked }))}
        />
        <ToggleField
          label="Suppress @everyone and announcements"
          checked={leapspace.notifications.suppressAnnouncements}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, suppressAnnouncements: checked }))}
        />
        <ToggleField
          label="Suppress role mentions"
          checked={leapspace.notifications.suppressRoleMentions}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, suppressRoleMentions: checked }))}
        />
        <ToggleField
          label="Mute new event notifications"
          checked={leapspace.notifications.muteNewEventNotifications}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, muteNewEventNotifications: checked }))}
        />
        <ToggleField
          label="Inherit global defaults when no override exists"
          checked={leapspace.notifications.inheritGlobalDefaultsWhenNoOverrideExists}
          onCheckedChange={(checked) => update((prev) => ({ ...prev, inheritGlobalDefaultsWhenNoOverrideExists: checked }))}
        />
        <SelectField
          label="Digest frequency"
          value={leapspace.notifications.digestFrequency}
          onValueChange={(value) => update((prev) => ({ ...prev, digestFrequency: value as typeof prev.digestFrequency }))}
          options={[
            { value: 'live', label: 'Live notifications' },
            { value: 'hourly', label: 'Hourly digest' },
            { value: 'daily', label: 'Daily digest' },
          ]}
        />
      </Card>
    </>
  );
}

/* ─────────────────────────────────────────────
   renderRolesSummary – read-only + link to web
   ───────────────────────────────────────────── */

function renderRolesSummary() {
  return (
    <div className="space-y-4">
      <SectionIntro title="Roles" description="View current role definitions. Use web for full role management." />

      <div className="space-y-2">
        {MOCK_ROLES.map((role) => (
          <Card key={role.roleDefinitionId} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{role.role}</p>
              <div className="flex items-center gap-2">
                {role.isBuiltIn && (
                  <Badge variant="secondary" className="text-[10px]">
                    Built-in
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px]">
                  {role.permissions.length} permissions
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <WebManageLink label="Manage roles on web" description="Create custom roles, edit permission bundles, assign to members" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   renderTeamsSummary – read-only + link to web
   ───────────────────────────────────────────── */

function renderTeamsSummary() {
  return (
    <div className="space-y-4">
      <SectionIntro title="Teams" description="View current teams. Use web for full team management." />

      <div className="space-y-2">
        {MOCK_TEAMS.map((team) => {
          const boundRole = MOCK_ROLES.find((r) => r.roleDefinitionId === team.roleDefinitionId);
          return (
            <Card key={team.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{team.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{team.description}</p>
                </div>
                <Badge variant={team.enabled ? 'default' : 'secondary'} className="shrink-0 text-[10px]">
                  {team.enabled ? 'Active' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{team.memberIds.length} members</span>
                {boundRole && <span>\u2022 {boundRole.role}</span>}
              </div>
            </Card>
          );
        })}
      </div>

      <WebManageLink label="Manage teams on web" description="Create teams, assign members, bind roles, set permissions" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   renderGenericLeapSpaceSection
   ───────────────────────────────────────────── */

function renderGenericLeapSpaceSection(
  section: Exclude<LeapSpaceSectionId, 'leapspace-profile' | 'notifications'>,
  value: GenericLeapSpaceSectionState,
  update: (updater: (prev: GenericLeapSpaceSectionState) => GenericLeapSpaceSectionState) => void,
) {
  return (
    <>
      <SectionIntro title={getLeapSpaceSectionLabel(section)} description={genericSectionDescriptions[section] ?? 'LeapSpace-scoped editable placeholder section.'} />
      <Card className="space-y-4">
        <TextField label="Primary setting" value={value.primarySetting} onChange={(next) => update((prev) => ({ ...prev, primarySetting: next }))} />
        <TextField label="Secondary setting" value={value.secondarySetting} onChange={(next) => update((prev) => ({ ...prev, secondarySetting: next }))} />
        <TextAreaField label="Operational notes" value={value.operationalNotes} onChange={(next) => update((prev) => ({ ...prev, operationalNotes: next }))} />
        <ToggleField label="Section enabled" checked={value.sectionEnabled} onCheckedChange={(checked) => update((prev) => ({ ...prev, sectionEnabled: checked }))} />
      </Card>
    </>
  );
}

/* ─────────────────────────────────────────────
   UI Primitives
   ───────────────────────────────────────────── */

function ScreenHeader({
  title,
  subtitle,
  description,
  meta,
  onBack,
}: {
  title: string;
  subtitle: string;
  description: string;
  meta: string;
  onBack: () => void;
}) {
  return (
    <div className="border-b border-border bg-background px-4 pb-4 pt-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{subtitle}</p>
          <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      <p className="mt-2 text-xs text-muted-foreground">{meta}</p>
    </div>
  );
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-base font-medium text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-border bg-card p-4 ${className}`.trim()}>{children}</div>;
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
      {children}
    </label>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = `field-${label.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`;

  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} className="h-11" />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = `field-${label.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`;

  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-28" />
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onCheckedChange,
  description,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function SelectField({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const id = `field-${label.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`;

  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="h-11">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function SegmentedTabs({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card p-2">
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function NavRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between px-4 py-4 text-left">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}

function StickySaveBar({
  isDirty,
  subtitle,
  onDiscard,
  onSave,
}: {
  isDirty: boolean;
  subtitle: string;
  onDiscard: () => void;
  onSave: () => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
      <div className="mb-3">
        <p className="text-sm font-medium text-foreground">{isDirty ? 'You have unsaved changes' : 'All changes saved'}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onDiscard}>
          Discard changes
        </Button>
        <Button type="button" className="flex-1" onClick={onSave}>
          Save changes
        </Button>
      </div>
    </div>
  );
}

function SectionActionBar({ isDirty, onDiscard, onSave }: { isDirty: boolean; onDiscard: () => void; onSave: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 text-sm text-muted-foreground">{isDirty ? 'You have unsaved changes' : 'All changes saved'}</div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={onDiscard}>
          Discard
        </Button>
        <Button type="button" className="flex-1" onClick={onSave}>
          Save section
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Utility functions
   ───────────────────────────────────────────── */

function getGlobalSectionLabel(section: GlobalProfileSectionId | GlobalAccountSectionId) {
  return [...globalProfileSections, ...globalAccountSections].find((item) => item.id === section)?.label ?? section;
}

function getLeapSpaceSectionLabel(section: LeapSpaceSectionId) {
  return {
    'leapspace-profile': 'LeapSpace Profile',
    notifications: 'Notifications',
    overview: 'Overview',
    branding: 'Branding',
    integrations: 'Integrations',
    members: 'Members',
    teams: 'Teams',
    roles: 'Roles',
    policies: 'Policies',
    invitations: 'Invitations',
    'audit-log': 'Audit Log',
    moderation: 'Moderation',
    'my-content': 'My Content',
  }[section];
}

function formatRoleLabel(role: LeapSpaceSettingsState['role']) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function isLeapSpaceSectionDirty(section: LeapSpaceSectionId, draft: LeapSpaceSettingsState, saved: LeapSpaceSettingsState) {
  if (section === 'leapspace-profile') {
    return JSON.stringify(draft.leapspaceProfile) !== JSON.stringify(saved.leapspaceProfile);
  }

  if (section === 'notifications') {
    return JSON.stringify(draft.notifications) !== JSON.stringify(saved.notifications);
  }

  return JSON.stringify(draft.genericSections[section]) !== JSON.stringify(saved.genericSections[section]);
}

function updateLeapspace(state: MobileSettingsState, leapspaceId: string, updater: (space: LeapSpaceSettingsState) => void) {
  const next = cloneMobileSettingsState(state);
  const target = next.leapspaces.find((space) => space.id === leapspaceId);

  if (!target) return state;

  updater(target);
  return next;
}

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
