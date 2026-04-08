export type GlobalProfileSectionId = 'profile-basics' | 'professional-identity' | 'visibility';
export type GlobalAccountSectionId = 'preferences' | 'authentication' | 'billing' | 'connected-accounts' | 'active-sessions';
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
  skillsAndStrengths: string;
  workExperienceSummary: string;
  educationSummary: string;
  featuredLinks: string;
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
    passkeys: string;
    sessionChallengePolicy: string;
    twoFactorAuthentication: boolean;
    securityAlerts: boolean;
  };
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
  activeSessions: {
    currentSessionLabel: string;
    currentSessionDetails: string;
    trustedDevicesSummary: string;
  };
}

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
    skillsAndStrengths: 'Growth strategy, GTM, event operations, mentoring',
    workExperienceSummary: '3 roles added across community, learning, and growth functions.',
    educationSummary: '2 entries added with design and systems focus.',
    featuredLinks: 'LinkedIn, portfolio, case studies',
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
      passkeys: '1 registered device',
      sessionChallengePolicy: 'Challenge sign-in when device or region changes',
      twoFactorAuthentication: true,
      securityAlerts: true,
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
    activeSessions: {
      currentSessionLabel: 'Chrome on Mac',
      currentSessionDetails: 'San Francisco, CA • Active now',
      trustedDevicesSummary: '3 devices marked trusted',
    },
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
