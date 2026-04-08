import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Bell, ChevronRight, CreditCard, ExternalLink, Globe, Shield, UserCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  cloneMobileSettingsState,
  getLeapSpaceNav,
  globalAccountSections,
  globalProfileSections,
  initialMobileSettingsState,
  type GenericLeapSpaceSectionState,
  type GlobalAccountSectionId,
  type GlobalProfileSectionId,
  type LeapSpaceSectionId,
  type LeapSpaceSettingsState,
  type MobileSettingsState,
} from '../../data/mobileSettingsDemo';

type AccountCenterGroup = 'profile' | 'account';

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
  members: 'Membership operations remain editable here in prototype form.',
  teams: 'Team structure and grouping placeholders for this LeapSpace.',
  roles: 'Role bundles and access placeholders for this LeapSpace.',
  policies: 'Policy logic stays scoped and legible at the workspace level.',
  invitations: 'Invitation defaults and review flow placeholders for this LeapSpace.',
  'audit-log': 'Operational audit settings remain a scoped workspace control.',
};

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
      ? '3 sections • Default identity inherited by LeapSpace profiles'
      : '5 sections • Account controls stay separate from profile identity';

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

  const currentSectionDirty = activeSection
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
          meta={`${formatRoleLabel(draftLeapspace.role)} role • ${draftLeapspace.communitiesCount} groups • ${draftLeapspace.eventsCount} events`}
          onBack={activeSection ? () => setActiveSection(null) : onClose}
        />

        <div className="flex-1 overflow-y-auto bg-muted/30 pb-8">
          {activeSection ? (
            <div className="space-y-4 px-4 py-4">
              {activeSection === 'leapspace-profile'
                ? renderLeapSpaceProfileSection(draftLeapspace, settings.globalProfile, (updater) => {
                    setDraftState((prev) => updateLeapspace(prev, activeLeapspaceId, (space) => {
                      space.leapspaceProfile = updater(space.leapspaceProfile);
                    }));
                  })
                : activeSection === 'notifications'
                  ? renderLeapSpaceNotificationsSection(draftLeapspace, (updater) => {
                      setDraftState((prev) => updateLeapspace(prev, activeLeapspaceId, (space) => {
                        space.notifications = updater(space.notifications);
                      }));
                    })
                  : renderGenericLeapSpaceSection(activeSection, draftLeapspace.genericSections[activeSection], (updater) => {
                      setDraftState((prev) => updateLeapspace(prev, activeLeapspaceId, (space) => {
                        space.genericSections[activeSection] = updater(space.genericSections[activeSection]);
                      }));
                    })}

              <SectionActionBar
                isDirty={currentSectionDirty}
                onDiscard={handleDiscardSection}
                onSave={handleSaveSection}
              />
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

function renderGlobalSection(
  section: GlobalProfileSectionId | GlobalAccountSectionId,
  draftState: MobileSettingsState,
  setDraftState: React.Dispatch<React.SetStateAction<MobileSettingsState>>,
) {
  switch (section) {
    case 'profile-basics':
      return (
        <>
          <SectionIntro
            title="Profile Basics"
            description="These are the default identity fields LeapSpaces inherit from unless a scoped profile overrides them."
          />
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
            <TextAreaField
              label="Short bio"
              value={draftState.globalProfile.shortBio}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, shortBio: value } }))}
            />
            <TextField
              label="Personal website"
              value={draftState.globalProfile.personalWebsite}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, personalWebsite: value } }))}
            />
            <div className="space-y-2">
              <FieldLabel>Profile assets</FieldLabel>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1">Change avatar</Button>
                <Button type="button" variant="outline" className="flex-1">Change banner</Button>
              </div>
            </div>
          </Card>
        </>
      );
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
            <TextAreaField
              label="Skills and strengths"
              value={draftState.globalProfile.skillsAndStrengths}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, skillsAndStrengths: value } }))}
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
            <TextAreaField
              label="Featured links"
              value={draftState.globalProfile.featuredLinks}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalProfile: { ...prev.globalProfile, featuredLinks: value } }))}
            />
          </Card>
        </>
      );
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
    case 'authentication':
      return (
        <>
          <SectionIntro title="Authentication" description="This needs to feel operational, not just descriptive." />
          <Card className="space-y-4">
            <TextField
              label="Account email"
              value={draftState.globalAccount.authentication.accountEmail}
              onChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, authentication: { ...prev.globalAccount.authentication, accountEmail: value } },
                }))
              }
            />
            <TextField
              label="Password state"
              value={draftState.globalAccount.authentication.passwordState}
              onChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, authentication: { ...prev.globalAccount.authentication, passwordState: value } },
                }))
              }
            />
            <TextField
              label="Passkeys"
              value={draftState.globalAccount.authentication.passkeys}
              onChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, authentication: { ...prev.globalAccount.authentication, passkeys: value } },
                }))
              }
            />
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
              label="Two-factor authentication"
              checked={draftState.globalAccount.authentication.twoFactorAuthentication}
              onCheckedChange={(checked) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, authentication: { ...prev.globalAccount.authentication, twoFactorAuthentication: checked } },
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
    case 'billing':
      return (
        <>
          <SectionIntro title="Billing" description="Billing belongs here so it never gets mixed into the profile experience." />
          <Card className="space-y-4">
            <TextField
              label="Current plan"
              value={draftState.globalAccount.billing.currentPlan}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalAccount: { ...prev.globalAccount, billing: { ...prev.globalAccount.billing, currentPlan: value } } }))}
            />
            <TextField
              label="Payment method"
              value={draftState.globalAccount.billing.paymentMethod}
              onChange={(value) =>
                setDraftState((prev) => ({ ...prev, globalAccount: { ...prev.globalAccount, billing: { ...prev.globalAccount.billing, paymentMethod: value } } }))
              }
            />
            <TextField
              label="Billing email"
              value={draftState.globalAccount.billing.billingEmail}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalAccount: { ...prev.globalAccount, billing: { ...prev.globalAccount.billing, billingEmail: value } } }))}
            />
            <TextField
              label="Renewal date"
              value={draftState.globalAccount.billing.renewalDate}
              onChange={(value) => setDraftState((prev) => ({ ...prev, globalAccount: { ...prev.globalAccount, billing: { ...prev.globalAccount.billing, renewalDate: value } } }))}
            />
            <TextAreaField
              label="Invoice delivery"
              value={draftState.globalAccount.billing.invoiceDelivery}
              onChange={(value) =>
                setDraftState((prev) => ({ ...prev, globalAccount: { ...prev.globalAccount, billing: { ...prev.globalAccount.billing, invoiceDelivery: value } } }))
              }
            />
          </Card>
        </>
      );
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
    case 'active-sessions':
      return (
        <>
          <SectionIntro title="Active Sessions" description="Let this area feel actionable instead of like a static list." />
          <Card className="space-y-4">
            <TextField
              label="Current session label"
              value={draftState.globalAccount.activeSessions.currentSessionLabel}
              onChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, activeSessions: { ...prev.globalAccount.activeSessions, currentSessionLabel: value } },
                }))
              }
            />
            <TextField
              label="Current session details"
              value={draftState.globalAccount.activeSessions.currentSessionDetails}
              onChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, activeSessions: { ...prev.globalAccount.activeSessions, currentSessionDetails: value } },
                }))
              }
            />
            <TextField
              label="Trusted devices summary"
              value={draftState.globalAccount.activeSessions.trustedDevicesSummary}
              onChange={(value) =>
                setDraftState((prev) => ({
                  ...prev,
                  globalAccount: { ...prev.globalAccount, activeSessions: { ...prev.globalAccount.activeSessions, trustedDevicesSummary: value } },
                }))
              }
            />
            <div className="space-y-2">
              <FieldLabel>Session control</FieldLabel>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1">Review devices</Button>
                <Button type="button" variant="outline" className="flex-1">Revoke other sessions</Button>
              </div>
            </div>
          </Card>
        </>
      );
    default:
      return null;
  }
}

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
  const initials = resolvedDisplayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'LS';

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
          {isDirty ? 'Save section' : 'Save section'}
        </Button>
      </div>
    </div>
  );
}

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
