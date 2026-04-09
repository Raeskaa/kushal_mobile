export type GlobalProfileSectionId = 'profile-basics' | 'professional-identity' | 'visibility';
export type GlobalAccountSectionId = 'preferences' | 'authentication' | 'credits' | 'billing' | 'connected-accounts' | 'active-sessions';
export type LeapSpaceSectionId =
  | 'leapspace-profile'
  | 'notifications'
  | 'overview'
  | 'branding'
  | 'integrations'
  | 'members'
  | 'teams'
  | 'roles'
  | 'policies'
  | 'invitations'
  | 'audit-log'
  | 'moderation'
  | 'my-content';

export type LeapSpaceRole = 'admin' | 'moderator' | 'creator' | 'learner';
export type LeapSpaceType = 'work' | 'custom' | 'community' | 'school';

/* ─────────────────────────────────────────────
   Global Profile State
   ───────────────────────────────────────────── */
export interface GlobalProfileState {
  fullName: string;
  preferredName: string;
  professionalHeadline: string;
  primaryLocation: string;
  shortBio: string;
  personalWebsite: string;
  currentRoleTitle: string;
  companyOrganization: string;
  industry: string;
  primaryExpertise: string;
  skillsAndStrengths: string[];
  workExperienceSummary: string;
  educationSummary: string;
  featuredLinks: Array<{ label: string; url: string }>;
  profileVisibility: 'members-only' | 'connections-only' | 'public-profile';
  showCompanyOnGlobalProfile: boolean;
  showLocationOnGlobalProfile: boolean;
  showSocialLinks: boolean;
  allowMemberSearchDiscovery: boolean;
  useProfileForRecommendations: boolean;
  inheritanceDefaults: {
    pronouns: string;
    coverImageMode: string;
    expertiseTags: string[];
    interests: string[];
    mentorshipAvailability: boolean;
    collaborationInterests: boolean;
    directMessagesDefault: boolean;
  };
}

/* ─────────────────────────────────────────────
   Passkey & Session types (structured, matching web)
   ───────────────────────────────────────────── */
export interface PasskeyEntry {
  id: string;
  name: string;
  createdAt: string;
  lastUsed: string;
}

export interface SessionEntry {
  id: string;
  label: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

/* ─────────────────────────────────────────────
   Credits types (matching web CreditSystem)
   ───────────────────────────────────────────── */
export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'spend' | 'earn' | 'hold';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export interface CreditsState {
  balance: number;
  usedThisMonth: number;
  pendingHolds: number;
  lifetimeEarned: number;
  history: CreditTransaction[];
}

/* ─────────────────────────────────────────────
   Global Account State
   ───────────────────────────────────────────── */
export interface GlobalAccountState {
  preferences: {
    language: string;
    region: 'india' | 'united-states' | 'singapore' | 'united-kingdom';
    timezone: 'gmt-5-30' | 'utc' | 'pacific-time' | 'eastern-time';
    themePreference: 'light' | 'system' | 'dark';
    defaultStartPage: 'engagement-feed' | 'home-overview' | 'events' | 'communities';
  };
  authentication: {
    accountEmail: string;
    passwordState: string;
    passkeys: PasskeyEntry[];
    sessionChallengePolicy: string;
    twoFactorAuthentication: boolean;
    securityAlerts: boolean;
  };
  credits: CreditsState;
  billing: {
    currentPlan: string;
    paymentMethod: string;
    billingEmail: string;
    renewalDate: string;
    invoiceDelivery: string;
  };
  connectedAccounts: {
    google: boolean;
    linkedIn: boolean;
    microsoft: boolean;
    github: boolean;
  };
  activeSessions: SessionEntry[];
}

/* ─────────────────────────────────────────────
   Members – mock data matching GET /api/leapspaces/{id}/members
   ───────────────────────────────────────────── */
export interface SpaceMember {
  id: string;
  name: string;
  avatarId: string | null;
  email: string;
  phone: string | null;
  role: string;
}

export const MOCK_MEMBERS: SpaceMember[] = [
  { id: 'm1', name: 'Sarah Chen', avatarId: null, email: 'sarah@trueleap.ai', phone: '+1 415-555-1001', role: 'Admin' },
  { id: 'm2', name: 'Marcus Webb', avatarId: null, email: 'marcus@trueleap.ai', phone: '+1 415-555-1002', role: 'Admin' },
  { id: 'm3', name: 'Elena Rodriguez', avatarId: null, email: 'elena@gmail.com', phone: '+1 310-555-2003', role: 'Moderator' },
  { id: 'm4', name: 'James Park', avatarId: null, email: 'james@gmail.com', phone: null, role: 'Creator' },
  { id: 'm5', name: 'Aisha Patel', avatarId: null, email: 'aisha@outlook.com', phone: '+44 7700-900111', role: 'Learner' },
  { id: 'm6', name: 'Tom Nakamura', avatarId: null, email: 'tom.n@proton.me', phone: null, role: 'Learner' },
  { id: 'm7', name: 'Priya Sharma', avatarId: null, email: 'priya.s@yahoo.com', phone: '+91 98765-43210', role: 'Creator' },
  { id: 'm8', name: 'Daniel Okafor', avatarId: null, email: 'daniel.o@gmail.com', phone: null, role: 'Moderator' },
  { id: 'm9', name: 'Lucia Fernandez', avatarId: null, email: 'lucia.f@hotmail.com', phone: '+34 612-345-678', role: 'Learner' },
  { id: 'm10', name: 'Kai Williams', avatarId: null, email: 'kai.w@trueleap.ai', phone: '+1 212-555-3004', role: 'Admin' },
];

export const ALL_MEMBER_ROLES = ['Admin', 'Moderator', 'Creator', 'Learner'];

/* ─────────────────────────────────────────────
   Invitations – mock data matching GET/POST/PUT /api/leapspaces/{id}/invitations
   ───────────────────────────────────────────── */
export type InvitationStatus = 'pending' | 'accepted' | 'cancelled' | 'expired';

export interface SpaceInvitation {
  id: string;
  name: string;
  avatarId: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  status: InvitationStatus;
  createdAt: string;
}

export const MOCK_INVITATIONS: SpaceInvitation[] = [
  { id: 'inv1', name: 'Alex Kim', avatarId: null, email: 'alex.k@gmail.com', phone: null, role: 'Moderator', status: 'pending', createdAt: '2026-04-06' },
  { id: 'inv2', name: 'Beatrice Mwangi', avatarId: null, email: 'bea@trueleap.ai', phone: '+254 722-111222', role: 'Creator', status: 'accepted', createdAt: '2026-04-02' },
  { id: 'inv3', name: 'Carlos Ruiz', avatarId: null, email: null, phone: '+52 55-1234-5678', role: 'Learner', status: 'pending', createdAt: '2026-04-05' },
  { id: 'inv4', name: 'Diana Novak', avatarId: null, email: 'diana.n@outlook.com', phone: null, role: 'Admin', status: 'cancelled', createdAt: '2026-03-28' },
  { id: 'inv5', name: 'Ethan Brooks', avatarId: null, email: 'ethan@gmail.com', phone: '+1 503-555-8899', role: 'Learner', status: 'expired', createdAt: '2026-03-15' },
  { id: 'inv6', name: 'Fatima Al-Hassan', avatarId: null, email: 'fatima.h@proton.me', phone: null, role: 'Moderator', status: 'accepted', createdAt: '2026-03-30' },
  { id: 'inv7', name: 'George Tanaka', avatarId: null, email: null, phone: '+81 90-1234-5678', role: 'Creator', status: 'pending', createdAt: '2026-04-07' },
];

/* ─────────────────────────────────────────────
   Roles & Permissions – matching GET /api/leapspaces/{id}/access-control
   ───────────────────────────────────────────── */
export interface RoleDefinition {
  role: string;
  roleDefinitionId: string;
  permissions: string[];
  isBuiltIn: boolean;
}

export interface PermissionGroup {
  category: string;
  permissions: Array<{ id: string; label: string; description: string }>;
}

export const LEAPSPACE_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: 'Content',
    permissions: [
      { id: 'content.view', label: 'View content', description: 'See posts, articles, and shared resources' },
      { id: 'content.create', label: 'Create content', description: 'Publish posts, articles, and resources' },
      { id: 'content.edit', label: 'Edit any content', description: 'Modify content created by others' },
      { id: 'content.delete', label: 'Delete any content', description: 'Remove content created by others' },
    ],
  },
  {
    category: 'Members',
    permissions: [
      { id: 'members.view', label: 'View members', description: 'See the member directory' },
      { id: 'members.invite', label: 'Invite members', description: 'Send invitations to new people' },
      { id: 'members.remove', label: 'Remove members', description: 'Revoke membership from the LeapSpace' },
      { id: 'members.manage-roles', label: 'Change member roles', description: 'Promote or demote members' },
    ],
  },
  {
    category: 'Events',
    permissions: [
      { id: 'events.view', label: 'View events', description: 'See event listings and details' },
      { id: 'events.create', label: 'Create events', description: 'Start new events in this LeapSpace' },
      { id: 'events.manage', label: 'Manage events', description: 'Edit or cancel any event' },
      { id: 'events.manage-attendees', label: 'Manage attendees', description: 'Approve, reject, or check in attendees' },
    ],
  },
  {
    category: 'Courses',
    permissions: [
      { id: 'courses.view', label: 'View courses', description: 'See course listings and materials' },
      { id: 'courses.create', label: 'Create courses', description: 'Author new courses' },
      { id: 'courses.manage', label: 'Manage courses', description: 'Edit or archive any course' },
    ],
  },
  {
    category: 'Communities',
    permissions: [
      { id: 'communities.view', label: 'View communities', description: 'See community spaces and channels' },
      { id: 'communities.create', label: 'Create communities', description: 'Start new community spaces' },
      { id: 'communities.moderate', label: 'Moderate communities', description: 'Pin, lock, or delete community threads' },
    ],
  },
  {
    category: 'Settings & Admin',
    permissions: [
      { id: 'settings.view', label: 'View settings', description: 'See LeapSpace configuration' },
      { id: 'settings.manage', label: 'Manage settings', description: 'Change branding, integrations, and config' },
      { id: 'settings.manage-roles', label: 'Manage roles', description: 'Create, edit, or delete role definitions' },
      { id: 'settings.manage-teams', label: 'Manage teams', description: 'Create and configure teams' },
      { id: 'settings.view-audit', label: 'View audit log', description: 'Access operational change history' },
    ],
  },
];

export const ALL_PERMISSION_IDS = LEAPSPACE_PERMISSION_GROUPS.flatMap(g => g.permissions.map(p => p.id));

export const MOCK_ROLES: RoleDefinition[] = [
  {
    role: 'LeapSpace Admin',
    roleDefinitionId: 'rd-admin',
    permissions: [...ALL_PERMISSION_IDS],
    isBuiltIn: true,
  },
  {
    role: 'Moderator',
    roleDefinitionId: 'rd-moderator',
    permissions: [
      'content.view', 'content.create', 'content.edit', 'content.delete',
      'members.view', 'members.invite',
      'events.view', 'events.manage-attendees',
      'courses.view',
      'communities.view', 'communities.moderate',
      'settings.view',
    ],
    isBuiltIn: true,
  },
  {
    role: 'Creator',
    roleDefinitionId: 'rd-creator',
    permissions: [
      'content.view', 'content.create',
      'members.view',
      'events.view', 'events.create',
      'courses.view', 'courses.create',
      'communities.view', 'communities.create',
      'settings.view',
    ],
    isBuiltIn: true,
  },
  {
    role: 'Learner',
    roleDefinitionId: 'rd-learner',
    permissions: [
      'content.view',
      'members.view',
      'events.view',
      'courses.view',
      'communities.view',
    ],
    isBuiltIn: true,
  },
  {
    role: 'Event Manager',
    roleDefinitionId: 'rd-event-mgr',
    permissions: [
      'content.view', 'content.create',
      'members.view', 'members.invite',
      'events.view', 'events.create', 'events.manage', 'events.manage-attendees',
      'courses.view',
      'communities.view',
      'settings.view',
    ],
    isBuiltIn: false,
  },
];

/* ─────────────────────────────────────────────
   Teams – mock data (no backend API yet)
   ───────────────────────────────────────────── */
export interface SpaceTeam {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  roleDefinitionId: string | null;
  customPermissions: string[] | null; // null = inherit role as-is, array = customized set
  enabled: boolean;
}

export const MOCK_TEAMS: SpaceTeam[] = [
  { id: 't1', name: 'Core Admins', description: 'Primary administrators for this LeapSpace', memberIds: ['m1', 'm2', 'm10'], roleDefinitionId: 'rd-admin', customPermissions: null, enabled: true },
  { id: 't2', name: 'Event Ops', description: 'Handles event creation, management, and attendee coordination', memberIds: ['m3', 'm4', 'm7'], roleDefinitionId: 'rd-event-mgr', customPermissions: null, enabled: true },
  { id: 't3', name: 'Community Moderators', description: 'Moderates discussions and community channels', memberIds: ['m3', 'm8'], roleDefinitionId: 'rd-moderator', customPermissions: null, enabled: true },
  { id: 't4', name: 'Content Creators', description: 'Publishes courses, articles, and resources', memberIds: ['m4', 'm7'], roleDefinitionId: 'rd-creator', customPermissions: null, enabled: false },
];

/* ─────────────────────────────────────────────
   Credit packages & constants (matching web CreditSystem)
   ───────────────────────────────────────────── */
export const CREDITS_PER_DOLLAR = 60;

export function formatCredits(credits: number): string {
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(credits % 1000 === 0 ? 0 : 1)}k`;
  }
  return credits.toLocaleString();
}

export const CREDIT_PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 500, price: 8.33, popular: false, savings: 0 },
  { id: 'standard', name: 'Standard', credits: 1500, price: 22.50, popular: false, savings: 10 },
  { id: 'pro', name: 'Pro', credits: 5000, price: 66.67, popular: true, savings: 20 },
  { id: 'enterprise', name: 'Enterprise', credits: 15000, price: 175.00, popular: false, savings: 30 },
];

/* ─────────────────────────────────────────────
   LeapSpace Profile / Notifications / Generic Section (unchanged)
   ───────────────────────────────────────────── */
export interface LeapSpaceProfileState {
  displayNameInThisLeapSpace: string;
  codenameAlternateName: string;
  roleTitle: string;
  profilePhotoMode: 'global-avatar' | 'leapspace-avatar';
  overrideMode: 'customized' | 'inherit-global';
  overrideScope: string;
  bioInThisLeapSpace: string;
  anonymousModeInThisLeapSpace: boolean;
  useCodenameInsteadOfFullIdentity: boolean;
  showRoleBadgeOnProfile: boolean;
  appearInMemberDirectory: boolean;
  allowDirectMessagesFromMembers: boolean;
  appearInSearchInsideThisLeapSpace: boolean;
  allowConnectionRequests: boolean;
  allowMentoringRequests: boolean;
  allowCollaborationRequests: boolean;
}

export interface LeapSpaceNotificationsState {
  muteSpace: boolean;
  mentionsAndReplies: boolean;
  directMessagesFromMembers: boolean;
  mobilePushNotifications: boolean;
  suppressAnnouncements: boolean;
  suppressRoleMentions: boolean;
  muteNewEventNotifications: boolean;
  inheritGlobalDefaultsWhenNoOverrideExists: boolean;
  digestFrequency: 'live' | 'hourly' | 'daily';
}

export interface GenericLeapSpaceSectionState {
  primarySetting: string;
  secondarySetting: string;
  operationalNotes: string;
  sectionEnabled: boolean;
}

export interface LeapSpaceSettingsState {
  id: string;
  name: string;
  type: LeapSpaceType;
  role: LeapSpaceRole;
  communitiesCount: number;
  coursesCount: number;
  eventsCount: number;
  leapspaceProfile: LeapSpaceProfileState;
  notifications: LeapSpaceNotificationsState;
  genericSections: Record<Exclude<LeapSpaceSectionId, 'leapspace-profile' | 'notifications'>, GenericLeapSpaceSectionState>;
}

export interface MobileSettingsState {
  globalProfile: GlobalProfileState;
  globalAccount: GlobalAccountState;
  leapspaces: LeapSpaceSettingsState[];
}

export interface NavGroupItem {
  id: LeapSpaceSectionId;
  label: string;
}

export interface NavGroup {
  title: string;
  items: NavGroupItem[];
}

export const globalProfileSections: { id: GlobalProfileSectionId; label: string }[] = [
  { id: 'profile-basics', label: 'Profile Basics' },
  { id: 'professional-identity', label: 'Professional Identity' },
  { id: 'visibility', label: 'Visibility' },
];

export const globalAccountSections: { id: GlobalAccountSectionId; label: string }[] = [
  { id: 'preferences', label: 'Preferences' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'credits', label: 'Credits' },
  { id: 'billing', label: 'Billing' },
  { id: 'connected-accounts', label: 'Connected Accounts' },
  { id: 'active-sessions', label: 'Active Sessions' },
];

export const leapSpaceNavByRole: Record<LeapSpaceRole, NavGroup[]> = {
  admin: [
    { title: 'Personal', items: [{ id: 'leapspace-profile', label: 'LeapSpace Profile' }, { id: 'notifications', label: 'Notifications' }] },
    { title: 'Workspace', items: [{ id: 'overview', label: 'Overview' }, { id: 'branding', label: 'Branding' }, { id: 'integrations', label: 'Integrations' }] },
    { title: 'Access', items: [{ id: 'members', label: 'Members' }, { id: 'teams', label: 'Teams' }, { id: 'roles', label: 'Roles' }, { id: 'policies', label: 'Policies' }, { id: 'invitations', label: 'Invitations' }, { id: 'audit-log', label: 'Audit Log' }] },
  ],
  moderator: [
    { title: 'Personal', items: [{ id: 'leapspace-profile', label: 'LeapSpace Profile' }, { id: 'notifications', label: 'Notifications' }] },
    { title: 'Moderation', items: [{ id: 'moderation', label: 'Moderation' }, { id: 'members', label: 'Members' }, { id: 'invitations', label: 'Invitations' }] },
  ],
  creator: [
    { title: 'Personal', items: [{ id: 'leapspace-profile', label: 'LeapSpace Profile' }, { id: 'notifications', label: 'Notifications' }] },
    { title: 'Creation', items: [{ id: 'my-content', label: 'My Content' }, { id: 'integrations', label: 'Integrations' }] },
    { title: 'Workspace', items: [{ id: 'overview', label: 'Overview' }] },
  ],
  learner: [
    { title: 'Personal', items: [{ id: 'leapspace-profile', label: 'LeapSpace Profile' }, { id: 'notifications', label: 'Notifications' }] },
  ],
};

function createGenericSectionState(name: string, leapspaceName: string, leapspaceType: LeapSpaceType): GenericLeapSpaceSectionState {
  switch (name) {
    case 'my-content':
      return {
        primarySetting: 'Review before publish',
        secondarySetting: 'Slack, Zapier, Google Calendar',
        operationalNotes: `Creator defaults for content built inside ${leapspaceName}.`,
        sectionEnabled: true,
      };
    case 'moderation':
      return {
        primarySetting: 'Community safety baseline',
        secondarySetting: 'Prioritize reports assigned to me',
        operationalNotes: 'Moderators can manage safety and member-level enforcement, but not workspace identity or billing.',
        sectionEnabled: true,
      };
    case 'overview':
      return {
        primarySetting: leapspaceName,
        secondarySetting: leapspaceType === 'work' ? 'Workspace' : leapspaceType,
        operationalNotes: 'High-level description, default member promise, and workspace orientation copy.',
        sectionEnabled: true,
      };
    case 'branding':
      return {
        primarySetting: leapspaceName,
        secondarySetting: 'Hero image uploaded',
        operationalNotes: 'Workspace for creators, moderators, operators, and invited partners.',
        sectionEnabled: true,
      };
    case 'integrations':
      return {
        primarySetting: 'Slack connected to #community-ops',
        secondarySetting: '2 calendars synced',
        operationalNotes: '3 automations active in Zapier.',
        sectionEnabled: true,
      };
    case 'members':
      return {
        primarySetting: '246 active members',
        secondarySetting: '18 pending invites',
        operationalNotes: 'People with direct membership or inherited access in this LeapSpace.',
        sectionEnabled: true,
      };
    case 'teams':
      return {
        primarySetting: 'Core Admins',
        secondarySetting: 'Event Ops',
        operationalNotes: 'Reusable groups that carry policies in bulk and make access composable.',
        sectionEnabled: true,
      };
    case 'roles':
      return {
        primarySetting: 'LeapSpace Admin',
        secondarySetting: 'Event Manager',
        operationalNotes: 'Named permission bundles attached to members or teams.',
        sectionEnabled: true,
      };
    case 'policies':
      return {
        primarySetting: 'Actor + role + scope',
        secondarySetting: 'Admin approval required',
        operationalNotes: 'Keep policies legible so the workspace access model feels intentional.',
        sectionEnabled: true,
      };
    case 'invitations':
      return {
        primarySetting: '18 pending invites',
        secondarySetting: 'Community Team',
        operationalNotes: 'Default assignee team and invite review process for this workspace.',
        sectionEnabled: true,
      };
    case 'audit-log':
      return {
        primarySetting: 'Policy changes retained 180 days',
        secondarySetting: 'Member and billing changes tracked',
        operationalNotes: 'Operational log for admins reviewing access and workflow changes.',
        sectionEnabled: true,
      };
    default:
      return {
        primarySetting: '',
        secondarySetting: '',
        operationalNotes: '',
        sectionEnabled: true,
      };
  }
}

function createLeapSpace(id: string, name: string, type: LeapSpaceType, role: LeapSpaceRole, communitiesCount: number, coursesCount: number, eventsCount: number): LeapSpaceSettingsState {
  const isLearner = role === 'learner';
  const isAdminOrCreator = role === 'admin' || role === 'creator';

  return {
    id,
    name,
    type,
    role,
    communitiesCount,
    coursesCount,
    eventsCount,
    leapspaceProfile: {
      displayNameInThisLeapSpace: 'Google User',
      codenameAlternateName: '',
      roleTitle: role.charAt(0).toUpperCase() + role.slice(1),
      profilePhotoMode: 'global-avatar',
      overrideMode: 'customized',
      overrideScope: 'Display name, bio, photo, visibility, and messaging permissions',
      bioInThisLeapSpace: 'Helping creators and operators build structured, high-signal spaces.',
      anonymousModeInThisLeapSpace: false,
      useCodenameInsteadOfFullIdentity: false,
      showRoleBadgeOnProfile: true,
      appearInMemberDirectory: true,
      allowDirectMessagesFromMembers: !isLearner,
      appearInSearchInsideThisLeapSpace: true,
      allowConnectionRequests: true,
      allowMentoringRequests: !isLearner,
      allowCollaborationRequests: isAdminOrCreator,
    },
    notifications: {
      muteSpace: false,
      mentionsAndReplies: true,
      directMessagesFromMembers: !isLearner,
      mobilePushNotifications: true,
      suppressAnnouncements: true,
      suppressRoleMentions: false,
      muteNewEventNotifications: false,
      inheritGlobalDefaultsWhenNoOverrideExists: true,
      digestFrequency: 'live',
    },
    genericSections: {
      overview: createGenericSectionState('overview', name, type),
      branding: createGenericSectionState('branding', name, type),
      integrations: createGenericSectionState('integrations', name, type),
      members: createGenericSectionState('members', name, type),
      teams: createGenericSectionState('teams', name, type),
      roles: createGenericSectionState('roles', name, type),
      policies: createGenericSectionState('policies', name, type),
      invitations: createGenericSectionState('invitations', name, type),
      'audit-log': createGenericSectionState('audit-log', name, type),
      moderation: createGenericSectionState('moderation', name, type),
      'my-content': createGenericSectionState('my-content', name, type),
    },
  };
}

export const initialMobileSettingsState: MobileSettingsState = {
  globalProfile: {
    fullName: 'Google User',
    preferredName: 'Google',
    professionalHeadline: 'AI systems operator building high-signal communities',
    primaryLocation: 'Bengaluru, India',
    shortBio: 'I design, operate, and grow community-led learning systems for professionals.',
    personalWebsite: 'https://trueleap.io/rae',
    currentRoleTitle: 'Community Systems Designer',
    companyOrganization: 'TrueLeap',
    industry: 'Professional learning and creator tools',
    primaryExpertise: 'Community design, event systems, growth operations',
    skillsAndStrengths: ['Growth strategy', 'GTM', 'Event operations', 'Mentoring', 'Community design'],
    workExperienceSummary: '3 roles added across community, learning, and growth functions.',
    educationSummary: '2 entries added with design and systems focus.',
    featuredLinks: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/example' },
      { label: 'Portfolio', url: 'https://portfolio.example.com' },
      { label: 'Case Studies', url: 'https://trueleap.io/cases' },
    ],
    profileVisibility: 'members-only',
    showCompanyOnGlobalProfile: true,
    showLocationOnGlobalProfile: false,
    showSocialLinks: true,
    allowMemberSearchDiscovery: true,
    useProfileForRecommendations: true,
    inheritanceDefaults: {
      pronouns: 'she/her',
      coverImageMode: 'global-banner',
      expertiseTags: ['Community design', 'Events', 'Growth'],
      interests: ['Mentoring', 'Peer learning'],
      mentorshipAvailability: true,
      collaborationInterests: true,
      directMessagesDefault: true,
    },
  },
  globalAccount: {
    preferences: {
      language: 'English',
      region: 'india',
      timezone: 'gmt-5-30',
      themePreference: 'light',
      defaultStartPage: 'engagement-feed',
    },
    authentication: {
      accountEmail: 'user@google.com',
      passwordState: 'Updated 41 days ago',
      passkeys: [
        { id: 'pk1', name: 'MacBook Pro Touch ID', createdAt: '2026-02-15', lastUsed: '2026-04-08' },
        { id: 'pk2', name: 'iPhone Face ID', createdAt: '2026-03-01', lastUsed: '2026-04-07' },
      ],
      sessionChallengePolicy: 'Challenge sign-in when device or region changes',
      twoFactorAuthentication: true,
      securityAlerts: true,
    },
    credits: {
      balance: 4_250,
      usedThisMonth: 1_820,
      pendingHolds: 360,
      lifetimeEarned: 12_500,
      history: [
        { id: '1', type: 'purchase', description: 'Pro Pack purchased', amount: 5000, date: '2026-04-06', status: 'completed' },
        { id: '2', type: 'spend', description: 'Event registration: AI Summit 2026', amount: -360, date: '2026-04-05', status: 'completed' },
        { id: '3', type: 'spend', description: 'Course enrollment: Advanced React', amount: -180, date: '2026-04-03', status: 'completed' },
        { id: '4', type: 'earn', description: 'Referral bonus: Invited 3 members', amount: 150, date: '2026-04-02', status: 'completed' },
        { id: '5', type: 'spend', description: 'Event registration: Design Sprint', amount: -240, date: '2026-03-28', status: 'completed' },
        { id: '6', type: 'purchase', description: 'Standard Pack purchased', amount: 1500, date: '2026-03-20', status: 'completed' },
        { id: '7', type: 'spend', description: 'AI Assistant usage (March)', amount: -420, date: '2026-03-15', status: 'completed' },
        { id: '8', type: 'hold', description: 'Pending: Workshop registration', amount: -360, date: '2026-04-07', status: 'pending' },
      ],
    },
    billing: {
      currentPlan: 'Business plan billed monthly',
      paymentMethod: 'Visa ending in 4242',
      billingEmail: 'user@google.com',
      renewalDate: 'April 28, 2026',
      invoiceDelivery: 'Monthly summary to finance and account owner',
    },
    connectedAccounts: {
      google: true,
      linkedIn: true,
      microsoft: false,
      github: false,
    },
    activeSessions: [
      { id: 's1', label: 'Chrome on Mac', device: 'MacBook Pro', location: 'Bengaluru, India', lastActive: 'Active now', current: true },
      { id: 's2', label: 'Safari on iPhone', device: 'iPhone 15 Pro', location: 'Bengaluru, India', lastActive: '2 hours ago', current: false },
      { id: 's3', label: 'Firefox on Windows', device: 'Dell XPS 15', location: 'San Francisco, CA', lastActive: '3 days ago', current: false },
    ],
  },
  leapspaces: [
    createLeapSpace('trueleap-inc', 'TrueLeap Inc.', 'work', 'admin', 10, 24, 15),
    createLeapSpace('creator-studio', 'Creator Studio', 'custom', 'creator', 4, 7, 3),
    createLeapSpace('community-circle', 'Community Circle', 'community', 'moderator', 6, 2, 8),
    createLeapSpace('ai-learners-hub', 'AI Learners Hub', 'school', 'learner', 3, 11, 5),
  ],
};

export function cloneMobileSettingsState(state: MobileSettingsState): MobileSettingsState {
  return JSON.parse(JSON.stringify(state)) as MobileSettingsState;
}

export function getLeapSpaceNav(role: LeapSpaceRole): NavGroup[] {
  return leapSpaceNavByRole[role];
}
