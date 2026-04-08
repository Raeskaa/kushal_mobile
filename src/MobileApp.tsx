import { useState } from 'react';
import { EventStoreProvider, useEventStore } from './data/EventStoreContext';
import { CreditProvider } from './data/CreditContext';
import { MobileWelcomeScreen } from './components/MobileWelcomeScreen';
import { MobileCommunityDashboard } from './components/MobileCommunityDashboard';
import { MobileHomeDashboard } from './components/MobileHomeDashboard';
import { MobileEnhancedAI } from './components/MobileEnhancedAI';
import { MobileLeapy } from './components/MobileLeapy';
import { MobileGlobalNav } from './components/MobileGlobalNav';
import { MobileTopBar } from './components/MobileTopBar';
import { MobileHorizontalTabs } from './components/MobileHorizontalTabs';
import { MobileCoursesPage } from './components/MobileCoursesPage';
import { SwipeableContent } from './components/SwipeableContent';
import { SimpleSearchPage } from './components/SimpleSearchPage';
import { LeapspaceSwitcher } from './components/LeapspaceSwitcher';
import { NavigationPatternsDemo } from './components/NavigationPatternsDemo';
import { MobileCommunitiesLanding } from './components/MobileCommunitiesLanding';
import { MobileIndividualCommunity } from './components/MobileIndividualCommunity';
import { MobileEventsLanding } from './components/MobileEventsLanding';
import { MobileIndividualEvent } from './components/MobileIndividualEvent';
import { MobileEventCreationFlow } from './components/MobileEventCreationFlow';
import { MobileProfile } from './components/MobileProfile';
import { AccountCenterScreen, ManageLeapSpaceScreen } from './components/settings/MobileSettingsScreens';
import { MobileSignIn } from './components/auth/MobileSignIn';
import { MobileRegister } from './components/auth/MobileRegister';
import { MobileMagicLinkSent } from './components/auth/MobileMagicLinkSent';
import { MobileOTPVerification } from './components/auth/MobileOTPVerification';
import { MobileForgotPassword } from './components/auth/MobileForgotPassword';
import { MobileNotifications } from './components/MobileNotifications';
import { LeapySheet } from './components/LeapySheet';
import { MobileMinimizedMeetWindow } from './components/event/MobileMinimizedMeetWindow';
import { type LeapyContext } from './data/leapyContexts';
import { getMutationForFlow, getCompletionToast } from './data/leapyMutations';
import { CommunityData } from './types';
import { ShoppingBag, Clock, Video, X, ChevronLeft, Layout, Users, Mic, ArrowLeft } from 'lucide-react';
import { EVENT_TEMPLATES } from './data/mockEventData';
import { cloneMobileSettingsState, initialMobileSettingsState, type MobileSettingsState } from './data/mobileSettingsDemo';
import { toast } from "sonner@2.0.3";

type Page = 'home' | 'communities' | 'courses' | 'events' | 'leapy' | 'drafts' | 'marketplace';
type Stage = 'welcome' | 'community-dashboard' | 'course-builder' | 'marketplace';

// Horizontal tabs configuration for each page
const horizontalTabs = {
  home: [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' },
    { id: 'team', label: 'Team' },
  ],
  communities: [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'events', label: 'Events' },
    { id: 'courses', label: 'Courses' },
    { id: 'analytics', label: 'Analytics' },
  ],
  courses: [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'students', label: 'Students' },
    { id: 'analytics', label: 'Analytics' },
  ],
  events: [
    { id: 'overview', label: 'Overview' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'attendees', label: 'Attendees' },
    { id: 'analytics', label: 'Analytics' },
  ],
  leapy: [],
  drafts: [],
  marketplace: [],
};

// Keep for swipe navigation
const builderTools = horizontalTabs;

export default function MobileApp() {
  return (
    <EventStoreProvider>
      <CreditProvider>
        <MobileAppInner />
      </CreditProvider>
    </EventStoreProvider>
  );
}

function MobileAppInner() {
  const { getEvent, updateEvent, createEvent } = useEventStore();
  const [currentPage, setCurrentPage] = useState<Page>('events'); // Start on events to show Leapy AI integration
  const [previousPage, setPreviousPage] = useState<Page>('events');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [stage, setStage] = useState<Stage>('welcome');
  const [showAIChat, setShowAIChat] = useState(false);
  const [communityData, setCommunityData] = useState<Partial<CommunityData>>({});
  const [aiContext, setAiContext] = useState<'community' | 'course' | 'general'>('general');
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLeapspaceSwitcher, setShowLeapspaceSwitcher] = useState(false);
  const [currentLeapspace, setCurrentLeapspace] = useState('trueleap-inc');
  const [showNavigationPatterns, setShowNavigationPatterns] = useState(false); // Demo closed
  const [mobileSettings, setMobileSettings] = useState<MobileSettingsState>(() => cloneMobileSettingsState(initialMobileSettingsState));
  const [showAccountCenter, setShowAccountCenter] = useState(false);
  const [accountCenterGroup, setAccountCenterGroup] = useState<'profile' | 'account'>('profile');
  const [accountCenterSection, setAccountCenterSection] = useState<string | null>(null);
  const [showManageLeapSpace, setShowManageLeapSpace] = useState(false);

  // Community navigation state
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);

  // Event navigation state
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEventCreation, setShowEventCreation] = useState(false);
  const [preselectedTemplateId, setPreselectedTemplateId] = useState<string | undefined>(undefined);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showWaitingRoom, setShowWaitingRoom] = useState<string | null>(null); // eventId
  const [showMeetingRoom, setShowMeetingRoom] = useState<string | null>(null); // eventId
  const [minimizedMeetingId, setMinimizedMeetingId] = useState<string | null>(null);

  // Leapy Sheet state
  const [leapySheetOpen, setLeapySheetOpen] = useState(false);
  const [leapyContext, setLeapyContext] = useState<LeapyContext | null>(null);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track authentication state
  const [showProfile, setShowProfile] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMagicLinkSent, setShowMagicLinkSent] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [authEmail, setAuthEmail] = useState('empty@email.com'); // Set to 'empty@email.com' for empty state demo, or '' for normal user
  const [authPhone, setAuthPhone] = useState('');

  const handleOpenLeapy = (context: LeapyContext) => {
    setLeapyContext(context);
    setLeapySheetOpen(true);
  };

  const handleCloseLeapy = () => {
    setLeapySheetOpen(false);
    setLeapyContext(null);
  };

  const handleStart = (prompt: string, mode?: 'creator' | 'learner', type?: 'course' | 'community') => {
    setAiContext(type === 'community' ? 'community' : type === 'course' ? 'course' : 'general');
    setShowAIChat(true);
  };

  const handleImportCommunity = (data: Partial<CommunityData>) => {
    setCommunityData(data);
    setStage('community-dashboard');
    setCurrentPage('home');
    setAiContext('community');
  };

  const handleCreateCommunity = (data: Partial<CommunityData>) => {
    setCommunityData(data);
    setStage('community-dashboard');
    setCurrentPage('home');
    setAiContext('community');
  };

  const handleAIChatOpen = () => {
    setShowAIChat(true);
  };

  const handleNavigate = (page: Page) => {
    setPreviousPage(currentPage); // Store the current page as the previous page
    setCurrentPage(page);
    // Clear selection state when switching pages
    if (page !== 'communities') setSelectedCommunityId(null);
    if (page !== 'events') setSelectedEventId(null);
    // Don't reset community data when navigating to home if it already exists
    if (page === 'home' && !communityData.title) {
      setStage('welcome');
    }
    // Leapy is now a full page, not a modal
  };

  const handleNestedNavigate = (sectionId: string) => {
    setActiveTab(sectionId);
  };

  const handleBackFromNested = () => {
    setActiveTab('overview');
  };

  // Swipe navigation helpers
  const getSwipeConfig = () => {
    if (!activeTab) return null;
    
    const currentTools = builderTools[currentPage as keyof typeof builderTools] || [];
    const currentIndex = currentTools.findIndex(tool => tool.id === activeTab);
    
    if (currentIndex === -1) return null;
    
    const canSwipeLeft = currentIndex > 0;
    const canSwipeRight = currentIndex < currentTools.length - 1;
    
    return {
      currentIndex,
      totalItems: currentTools.length,
      canSwipeLeft,
      canSwipeRight,
      onSwipeLeft: () => {
        if (currentIndex > 0) {
          handleNestedNavigate(currentTools[currentIndex - 1].id);
        }
      },
      onSwipeRight: () => {
        if (currentIndex < currentTools.length - 1) {
          handleNestedNavigate(currentTools[currentIndex + 1].id);
        }
      },
    };
  };

  const handleSearchClick = () => {
    console.log('🔎 SEARCH BUTTON CLICKED - setShowSearch(true)');
    setShowSearch(true);
  };

  const handleLeapspaceClick = () => {
    console.log('🌐 LEAPSPACE SWITCHER CLICKED');
    setShowLeapspaceSwitcher(true);
  };

  const handleProfileClick = () => {
    console.log('👤 PROFILE CLICKED');
    setShowProfile(true);
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  const openMyProfile = () => {
    setShowProfile(false);
    setAccountCenterGroup('profile');
    setAccountCenterSection(null);
    setShowAccountCenter(true);
  };

  const openMyAccount = () => {
    setShowProfile(false);
    setAccountCenterGroup('account');
    setAccountCenterSection(null);
    setShowAccountCenter(true);
  };

  const openManageLeapSpace = () => {
    if (currentLeapspace === 'all') {
      setCurrentLeapspace(mobileSettings.leapspaces[0]?.id ?? 'trueleap-inc');
    }

    setShowProfile(false);
    setShowLeapspaceSwitcher(false);
    setShowManageLeapSpace(true);
  };

  const getPageTitle = () => {
    const titles = {
      home: 'Trueleap',
      communities: 'Communities',
      courses: 'Courses',
      events: 'Events',
      drafts: 'Drafts',
      marketplace: 'Marketplace',
      leapy: 'Leapy AI',
    };
    return titles[currentPage] || 'Leapy';
  };

  const renderContent = () => {
    // When Leapy modal is open, render the previous page content underneath
    const pageToRender = currentPage === 'leapy' ? previousPage : currentPage;

    // Show appropriate content based on current page
    if (pageToRender === 'communities') {
      // If a community is selected, show individual community page
      if (selectedCommunityId) {
        return (
          <MobileIndividualCommunity
            communityId={selectedCommunityId}
            onBack={() => setSelectedCommunityId(null)}
          />
        );
      }
      
      // Otherwise show communities landing page
      return (
        <MobileCommunitiesLanding
          onCommunityClick={(communityId) => setSelectedCommunityId(communityId)}
          onSearchClick={handleSearchClick}
          onNotificationClick={handleNotificationClick}
          onProfileClick={handleProfileClick}
          onLeapspaceClick={handleLeapspaceClick}
          currentLeapspace={currentLeapspace}
        />
      );
    }

    if (pageToRender === 'events') {
      // If an event is selected, show individual event page
      if (selectedEventId) {
        return (
          <MobileIndividualEvent
            eventId={selectedEventId}
            onBack={() => setSelectedEventId(null)}
            onOpenLeapy={handleOpenLeapy}
            onNavigateEvent={(id) => setSelectedEventId(id)}
            onJoinWaitingRoom={(id) => setShowWaitingRoom(id)}
            onJoinMeetingRoom={(id) => setShowMeetingRoom(id)}
          />
        );
      }

      // Otherwise show events landing page
      return (
        <MobileEventsLanding
          onEventClick={(eventId) => setSelectedEventId(eventId)}
          onSearchClick={handleSearchClick}
          onNotificationClick={handleNotificationClick}
          onProfileClick={handleProfileClick}
          onLeapspaceClick={handleLeapspaceClick}
          onCreateEvent={() => handleOpenLeapy({ type: 'create_event' })}
          onCreateManually={(templateId) => {
            setPreselectedTemplateId(templateId);
            setShowEventCreation(true);
          }}
          onOpenLeapy={handleOpenLeapy}
          currentLeapspace={currentLeapspace}
          userEmail={authEmail || 'sarah@leapspace.io'}
        />
      );
    }

    if (pageToRender === 'courses') {
      const swipeConfig = getSwipeConfig();
      const tabs = horizontalTabs.courses;
      
      return (
        <div className="min-h-screen bg-card pb-20">
          <MobileTopBar 
            title={getPageTitle()}
            onSearchClick={handleSearchClick}
            onNotificationClick={handleNotificationClick}
            onProfileClick={handleProfileClick}
            onLeapspaceClick={handleLeapspaceClick}
          />
          <MobileHorizontalTabs
            title="Dashboard"
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleNestedNavigate}
            onSearchClick={handleSearchClick}
            onNotificationClick={() => console.log('Notification clicked')}
          />
          <SwipeableContent
            onSwipeLeft={swipeConfig?.onSwipeLeft}
            onSwipeRight={swipeConfig?.onSwipeRight}
            canSwipeLeft={swipeConfig?.canSwipeLeft || false}
            canSwipeRight={swipeConfig?.canSwipeRight || false}
            currentIndex={swipeConfig?.currentIndex || 0}
            totalItems={swipeConfig?.totalItems || 0}
          >
            <MobileCoursesPage activeTab={activeTab} />
          </SwipeableContent>
        </div>
      );
    }

    if (pageToRender === 'settings') {
      return (
        <div className="min-h-screen bg-card pb-20">
          <MobileTopBar 
            title={getPageTitle()}
            onSearchClick={handleSearchClick}
            onNotificationClick={handleNotificationClick}
            onProfileClick={handleProfileClick}
            onLeapspaceClick={handleLeapspaceClick}
          />
          <div className="p-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Settings coming soon</p>
            </div>
          </div>
        </div>
      );
    }

    if (pageToRender === 'drafts') {
      return (
        <div className="min-h-screen bg-card pb-20">
          <MobileTopBar 
            title={getPageTitle()}
            onSearchClick={handleSearchClick}
            onNotificationClick={handleNotificationClick}
            onProfileClick={handleProfileClick}
            onLeapspaceClick={handleLeapspaceClick}
          />
          <div className="p-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Drafts page - coming soon</p>
            </div>
          </div>
        </div>
      );
    }

    if (pageToRender === 'marketplace') {
      return (
        <div className="min-h-screen bg-card pb-20">
          <MobileTopBar 
            title={getPageTitle()}
            onSearchClick={handleSearchClick}
            onNotificationClick={handleNotificationClick}
            onProfileClick={handleProfileClick}
            onLeapspaceClick={handleLeapspaceClick}
          />
          <div className="p-4">
            <div className="text-center py-12">
              <ShoppingBag className="size-16 text-primary/20 mx-auto mb-4" />
              <p className="text-muted-foreground">Browse courses and communities</p>
            </div>
          </div>
        </div>
      );
    }

    // Home page - show dashboard if community exists, otherwise welcome screen
    if (pageToRender === 'home') {
      const swipeConfig = getSwipeConfig();
      const tabs = horizontalTabs.home;
      
      return (
        <div className="min-h-screen bg-card pb-20">
          <MobileTopBar 
            title={getPageTitle()}
            onSearchClick={handleSearchClick}
            onNotificationClick={handleNotificationClick}
            onProfileClick={handleProfileClick}
            onLeapspaceClick={handleLeapspaceClick}
          />
          <MobileHorizontalTabs
            title="Dashboard"
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleNestedNavigate}
            onSearchClick={handleSearchClick}
            onNotificationClick={() => console.log('Notification clicked')}
          />
          <SwipeableContent
            onSwipeLeft={swipeConfig?.onSwipeLeft}
            onSwipeRight={swipeConfig?.onSwipeRight}
            canSwipeLeft={swipeConfig?.canSwipeLeft || false}
            canSwipeRight={swipeConfig?.canSwipeRight || false}
            currentIndex={swipeConfig?.currentIndex || 0}
            totalItems={swipeConfig?.totalItems || 0}
          >
            <MobileHomeDashboard activeTab={activeTab} />
          </SwipeableContent>
        </div>
      );
    }

    // Community dashboard stage
    if (stage === 'community-dashboard' && communityData.title) {
      return (
        <MobileCommunityDashboard
          communityData={communityData}
          onOpenAI={handleAIChatOpen}
        />
      );
    }

    // Default to welcome screen
    if (stage === 'welcome') {
      return (
        <MobileWelcomeScreen
          onStart={handleStart}
          onImportCommunity={handleImportCommunity}
          onCreateCommunity={handleCreateCommunity}
          onAIChat={handleAIChatOpen}
        />
      );
    }

    return (
      <MobileWelcomeScreen
        onStart={handleStart}
        onImportCommunity={handleImportCommunity}
        onCreateCommunity={handleCreateCommunity}
        onAIChat={handleAIChatOpen}
      />
    );
  };

  return (
    <>
      {/* Navigation Patterns Demo - Full screen overlay */}
      {showNavigationPatterns ? (
        <div className="fixed inset-0 z-[9999] bg-card">
          <NavigationPatternsDemo
            onClose={() => setShowNavigationPatterns(false)}
          />
        </div>
      ) : (
        <>
          {renderContent()}

          {/* Global Navigation - Always visible */}
          <MobileGlobalNav
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onOpenAI={handleAIChatOpen}
            activeNestedSection={activeTab}
            onNestedNavigate={handleNestedNavigate}
          />

          {/* Search Page */}
          {showSearch && (
            <div className="fixed inset-0 z-50 bg-background">
              <SimpleSearchPage onClose={() => setShowSearch(false)} />
            </div>
          )}

          {/* Enhanced AI Chat */}
          <MobileEnhancedAI
            open={showAIChat}
            onClose={() => setShowAIChat(false)}
            context={aiContext}
            contextData={aiContext === 'community' ? communityData : undefined}
          />

          {/* Leapspace Switcher */}
          <LeapspaceSwitcher
            isOpen={showLeapspaceSwitcher}
            currentLeapspace={currentLeapspace}
            onClose={() => setShowLeapspaceSwitcher(false)}
            onSwitch={(leapspaceId) => {
              console.log('🔄 Switching to leapspace:', leapspaceId);
              setCurrentLeapspace(leapspaceId);
            }}
            onOpenManageLeapSpace={openManageLeapSpace}
          />

          {/* Leapy Sheet — Context-Aware AI */}
          <LeapySheet
            isOpen={leapySheetOpen}
            context={leapyContext}
            onClose={handleCloseLeapy}
            onComplete={(result) => {
              const ctxType = result?.contextType || leapyContext?.type;
              const entityId = leapyContext?.entityId;

              // Apply mutation to event store
              if (ctxType && entityId) {
                const currentEvent = getEvent(entityId);
                const mutation = getMutationForFlow(ctxType, currentEvent);
                if (mutation) {
                  updateEvent(entityId, mutation);
                }
              }

              // Handle create_event post-flow: navigate to the new event
              if (ctxType === 'create_event' && result?.newEventId) {
                setSelectedEventId(result.newEventId);
                setCurrentPage('events');
              }

              // Handle go_live: open meeting room
              if (ctxType === 'go_live' && entityId) {
                setShowMeetingRoom(entityId);
                setMinimizedMeetingId(null);
              }

              // Show completion toast
              if (ctxType) {
                const toastMsg = getCompletionToast(ctxType);
                if (toastMsg) {
                  toast.success(toastMsg);
                }
              }

              handleCloseLeapy();
            }}
          />

          {/* Profile Modal */}
          <MobileProfile
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            isLoggedIn={isLoggedIn}
            onOpenMyProfile={openMyProfile}
            onOpenMyAccount={openMyAccount}
            onOpenManageLeapSpace={openManageLeapSpace}
            onSignInClick={(email) => {
              console.log('✅ Auth Success: Logging user in');
              setAuthEmail(email || 'sarah@leapspace.io');
              setIsLoggedIn(true);
              setShowProfile(false);
              toast.success("Welcome back!");
            }}
          />

          <AccountCenterScreen
            isOpen={showAccountCenter}
            onClose={() => setShowAccountCenter(false)}
            initialGroup={accountCenterGroup}
            initialSection={accountCenterSection as any}
            settings={mobileSettings}
            onSave={setMobileSettings}
          />

          <ManageLeapSpaceScreen
            isOpen={showManageLeapSpace}
            onClose={() => setShowManageLeapSpace(false)}
            currentLeapspaceId={currentLeapspace}
            onCurrentLeapspaceChange={setCurrentLeapspace}
            settings={mobileSettings}
            onSave={setMobileSettings}
          />

          {/* Auth Screens */}
          {showSignIn && (
            <MobileSignIn 
              onClose={() => setShowSignIn(false)}
              onSignInSuccess={(email) => {
                setAuthEmail(email || 'sarah@leapspace.io');
                setIsLoggedIn(true);
                setShowSignIn(false);
                toast.success("Welcome back!");
              }}
              onSwitchToRegister={() => {
                setShowSignIn(false);
                setShowRegister(true);
              }}
              onMagicLinkSent={(email) => {
                setAuthEmail(email);
                setShowSignIn(false);
                setShowMagicLinkSent(true);
              }}
              onOTPSent={(phone) => {
                setAuthPhone(phone);
                setShowSignIn(false);
                setShowOTPVerification(true);
              }}
              onForgotPassword={() => {
                setShowSignIn(false);
                setShowForgotPassword(true);
              }}
            />
          )}
          {showRegister && (
            <MobileRegister 
              onClose={() => setShowRegister(false)}
              onSwitchToSignIn={() => {
                setShowRegister(false);
                setShowSignIn(true);
              }}
            />
          )}
          {showMagicLinkSent && (
            <MobileMagicLinkSent 
              onClose={() => setShowMagicLinkSent(false)}
              email={authEmail}
            />
          )}
          {showOTPVerification && (
            <MobileOTPVerification 
              onClose={() => setShowOTPVerification(false)}
              phoneNumber={authPhone}
            />
          )}
          {showForgotPassword && (
            <MobileForgotPassword onClose={() => setShowForgotPassword(false)} />
          )}

          {/* Event Creation Flow */}
          <MobileEventCreationFlow
            open={showEventCreation}
            onClose={() => {
              setShowEventCreation(false);
              setPreselectedTemplateId(undefined);
            }}
            onComplete={(eventData, continueBuilding) => {
              // Create the event in the store
              const newEventId = createEvent({
                title: eventData.title,
                description: eventData.description,
                date: eventData.date,
                time: eventData.time,
                endDate: eventData.endDate,
                endTime: eventData.endTime,
                timezone: eventData.timezone,
                durationMinutes: eventData.durationMinutes,
                isMultiDay: eventData.isMultiDay,
                isAllDay: eventData.isAllDay,
                isRecurring: eventData.isRecurring,
                recurrenceRule: eventData.recurrenceRule,
                recurrenceEnd: eventData.recurrenceEnd,
                format: eventData.format,
                locationDetails: eventData.locationDetails,
                virtualLink: eventData.virtualLink,
                capacity: eventData.capacity,
                visibility: eventData.visibility,
                accessType: eventData.accessType,
                isPaid: eventData.isPaid,
                price: eventData.price,
                category: eventData.category,
                templateId: eventData.templateId,
                communityId: eventData.communityId,
                communityName: eventData.communityName,
                tags: eventData.tags,
                creatorEmail: authEmail || 'empty@email.com',
                creatorName: authEmail === 'empty@email.com' ? 'New User' : 'Sarah Chen',
              });
              setShowEventCreation(false);
              setPreselectedTemplateId(undefined);

              if (continueBuilding) {
                // Navigate directly to the new event draft
                setSelectedEventId(newEventId);
                setCurrentPage('events');
                toast.success('Event created — let\'s keep building!');
              } else {
                // Stay on events landing
                setSelectedEventId(null);
                toast.success('Event created as draft — complete the checklist to publish!');
              }
            }}
            onSwitchToAI={() => {
              setShowEventCreation(false);
              setPreselectedTemplateId(undefined);
              handleOpenLeapy({ type: 'create_event' });
            }}
            preselectedTemplateId={preselectedTemplateId}
          />

          {/* Notifications Panel */}
          <MobileNotifications
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />

          {/* Templates Page Overlay */}
          {showTemplates && (
            <div className="fixed inset-0 z-50 bg-card overflow-y-auto">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <button onClick={() => setShowTemplates(false)} className="p-1">
                  <ArrowLeft className="size-5 text-card-foreground" />
                </button>
                <h1 className="text-[17px] text-card-foreground">Event Templates</h1>
              </div>
              <div className="p-4 space-y-3">
                {EVENT_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      setShowTemplates(false);
                      setPreselectedTemplateId(tpl.id);
                      setShowEventCreation(true);
                    }}
                    className="w-full bg-muted border border-border rounded-xl p-4 text-left active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Layout className="size-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] text-card-foreground mb-0.5">{tpl.name}</p>
                        <p className="text-[12px] text-muted-foreground mb-1.5">{tpl.description}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {tpl.defaultDuration} &middot; {tpl.defaultCapacity} seats &middot; {tpl.defaultFormat} &middot; {tpl.isPaid ? `$${tpl.defaultPrice}` : 'Free'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Waiting Room Overlay */}
          {showWaitingRoom && (
            <div className="fixed inset-0 z-50 bg-card flex flex-col">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <button onClick={() => setShowWaitingRoom(null)} className="p-1">
                  <ArrowLeft className="size-5 text-card-foreground" />
                </button>
                <h1 className="text-[17px] text-card-foreground">Waiting Room</h1>
              </div>
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Clock className="size-10 text-primary" />
                </div>
                <h2 className="text-[18px] text-card-foreground mb-2">You're in the waiting room</h2>
                <p className="text-[13px] text-muted-foreground mb-6 max-w-[280px]">
                  The host will let you in shortly. Please stay on this page.
                </p>
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Users className="size-4" />
                  <span>3 others waiting</span>
                </div>
                <Button onClick={() => { setShowMeetingRoom(showWaitingRoom); setShowWaitingRoom(null); }} className="mt-6">
                  Join When Ready
                </Button>
              </div>
            </div>
          )}

          {/* Meeting Room Overlay */}
          {showMeetingRoom && (
            <div className="fixed inset-0 z-50 bg-zinc-900 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3">
                <button onClick={() => setShowMeetingRoom(null)} className="p-1">
                  <ArrowLeft className="size-5 text-white" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-destructive bg-destructive/20 px-2 py-0.5 rounded-full">LIVE</span>
                  <span className="text-[13px] text-white/70">00:45:23</span>
                </div>
                <button
                  onClick={() => {
                    setShowMeetingRoom(null);
                    setMinimizedMeetingId(null);
                    toast.success('Left the meeting');
                  }}
                  className="text-[13px] text-destructive bg-destructive/20 px-3 py-1.5 rounded-lg"
                >
                  Leave
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="size-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                  <Video className="size-12 text-white/40" />
                </div>
                <h2 className="text-[18px] text-white mb-2">Meeting Room</h2>
                <p className="text-[13px] text-white/60 mb-8 max-w-[280px]">
                  Video conferencing will be integrated here. This is a placeholder for the live event experience.
                </p>
                <div className="flex items-center gap-6">
                  <button className="size-14 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Mic className="size-6 text-white" />
                  </button>
                  <button className="size-14 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Video className="size-6 text-white" />
                  </button>
                  <button className="size-14 bg-zinc-800 rounded-full flex items-center justify-center">
                    <Users className="size-6 text-white" />
                  </button>
                </div>
                <Button variant="outline" onClick={() => { setMinimizedMeetingId(showMeetingRoom); setShowMeetingRoom(null); }} className="mt-8 border-white/20 text-white hover:bg-white/10">
                  Minimize Meeting
                </Button>
              </div>
            </div>
          )}

          <MobileMinimizedMeetWindow
            visible={!!minimizedMeetingId}
            onRestore={() => {
              if (minimizedMeetingId) {
                setShowMeetingRoom(minimizedMeetingId);
                setMinimizedMeetingId(null);
              }
            }}
            onLeave={() => {
              setMinimizedMeetingId(null);
              toast.success('Left the meeting');
            }}
          />
        </>
      )}
    </>
  );
}
