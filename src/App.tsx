import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatFlow } from './components/ChatFlow';
import { BuilderView } from './components/BuilderView';
import { CommunityBuilderView } from './components/CommunityBuilderView';
import { MarketplaceView } from './components/MarketplaceView';
import { CopilotShowcase } from './components/CopilotShowcase';
import { AppLayout } from './components/AppLayout';
import { CommunityGenerationPreview } from './components/CommunityGenerationPreview';
import { Conversation, CourseData, CommunityData, Message, AppVersion } from './types';
import MobileApp from './MobileApp';
import { NavigationPatternsDemo } from './components/NavigationPatternsDemo';
import { CommunityBuilderDemo } from './components/CommunityBuilderDemo';
import { Toaster } from 'sonner@2.0.3';
import { EventStoreProvider } from './data/EventStoreContext';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [showNavigationDemo, setShowNavigationDemo] = useState(true); // Show demo
  const [stage, setStage] = useState<'welcome' | 'chat' | 'builder' | 'community-builder' | 'marketplace' | 'copilot-demo' | 'community-preview'>('welcome');
  const [conversation, setConversation] = useState<Conversation>({ messages: [] });
  const [courseData, setCourseData] = useState<Partial<CourseData>>({});
  const [communityData, setCommunityData] = useState<Partial<CommunityData>>({});
  const [contentType, setContentType] = useState<'course' | 'community'>('course');
  const [appVersion, setAppVersion] = useState<AppVersion>('v1');
  const [userMode, setUserMode] = useState<'creator' | 'learner'>('creator');

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isFigmaCapture = typeof window !== 'undefined' && window.location.hash.includes('figmacapture');

  // Return mobile version if on mobile device
  if (isMobile || isFigmaCapture) {
    if (isFigmaCapture) {
      return (
        <div className="min-h-screen bg-background py-6">
          <div
            id="figma-mobile-capture"
            className="mx-auto min-h-screen w-[390px] max-w-[390px] overflow-hidden bg-background shadow-2xl"
          >
            <MobileApp />
          </div>
        </div>
      );
    }

    return <MobileApp />;
  }

  // Demo removed - using real app now

  const handleStart = (prompt: string, mode?: 'creator' | 'learner', type?: 'course' | 'community') => {
    // Create initial user message from the welcome screen prompt
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    
    const selectedMode = mode || userMode;
    const selectedType = type || 'course';
    
    setConversation({ 
      messages: [initialMessage],
      mode: selectedMode
    });
    setUserMode(selectedMode);
    setContentType(selectedType);
    
    // Learners go to marketplace, creators go to chat
    if (selectedMode === 'learner') {
      setStage('marketplace');
    } else {
      setStage('chat');
    }
  };

  const handleCourseComplete = (data: Partial<CourseData>) => {
    setCourseData(data);
    setStage('builder');
  };

  const handleCommunityComplete = (data: Partial<CommunityData>) => {
    setCommunityData(data);
    setStage('community-preview'); // Show preview first instead of going directly to builder
  };

  const handleBack = () => {
    if (stage === 'builder' || stage === 'community-builder') {
      setStage('chat');
    } else {
      setStage('welcome');
    }
  };

  const handleModeChange = (mode: 'creator' | 'learner') => {
    setUserMode(mode);
    setConversation(prev => ({ ...prev, mode }));
    
    // Switch between marketplace and chat based on mode
    if (mode === 'learner' && stage === 'chat') {
      setStage('marketplace');
    } else if (mode === 'creator' && stage === 'marketplace') {
      setStage('chat');
    }
  };

  const handleNewClick = () => {
    setStage('welcome');
    setConversation({ messages: [] });
    setCourseData({});
    setCommunityData({});
  };

  const handleImportCommunity = (data: Partial<CommunityData>) => {
    setCommunityData(data);
    setUserMode('creator');
    setContentType('community');
    setStage('community-preview');
  };

  if (stage === 'welcome') {
    return (
      <EventStoreProvider>
        <Toaster position="bottom-right" />
        <AppLayout currentPage="home" showBanner={true} onNewClick={handleNewClick}>
          <WelcomeScreen 
            onStart={handleStart} 
            onVersionChange={setAppVersion}
            currentVersion={appVersion}
            userMode={userMode}
            onModeChange={handleModeChange}
            onImportCommunity={handleImportCommunity}
          />
        </AppLayout>
      </EventStoreProvider>
    );
  }

  if (stage === 'marketplace') {
    return (
      <MarketplaceView
        conversation={conversation}
        onUpdateConversation={setConversation}
        appVersion={appVersion}
        onVersionChange={setAppVersion}
        userMode={userMode}
        onModeChange={handleModeChange}
        onBack={handleBack}
      />
    );
  }

  if (stage === 'chat') {
    return (
      <ChatFlow
        conversation={conversation}
        onUpdateConversation={setConversation}
        onCourseComplete={handleCourseComplete}
        onCommunityComplete={handleCommunityComplete}
        contentType={contentType}
        appVersion={appVersion}
        onVersionChange={setAppVersion}
        userMode={userMode}
        onModeChange={handleModeChange}
      />
    );
  }

  if (stage === 'community-builder') {
    return (
      <EventStoreProvider>
        <Toaster position="bottom-right" />
        <AppLayout 
          currentPage="communities" 
          showBanner={true} 
          onNewClick={handleNewClick} 
          copilotOpenByDefault={true}
          copilotContext="community"
        >
          <CommunityBuilderView
            conversation={conversation}
            onUpdateMessages={(messages) => setConversation({ messages })}
            communityData={communityData}
            onBack={handleBack}
            appVersion={appVersion}
            onVersionChange={setAppVersion}
            userMode={userMode}
            onModeChange={handleModeChange}
          />
        </AppLayout>
      </EventStoreProvider>
    );
  }

  if (stage === 'copilot-demo') {
    return (
      <EventStoreProvider>
        <Toaster position="bottom-right" />
        <AppLayout 
          currentPage="communities" 
          showBanner={true} 
          onNewClick={() => setStage('welcome')} 
          copilotOpenByDefault={true}
          copilotContext="community"
        >
          <CopilotShowcase />
        </AppLayout>
      </EventStoreProvider>
    );
  }

  if (stage === 'community-preview') {
    return (
      <CommunityGenerationPreview
        communityData={communityData}
        onComplete={() => setStage('community-builder')}
      />
    );
  }

  // Builder view (for creators)
  return (
    <EventStoreProvider>
      <Toaster position="bottom-right" />
      <AppLayout 
        currentPage="courses" 
        showBanner={true} 
        onNewClick={handleNewClick}
        copilotContext="course"
      >
        <BuilderView
          conversation={conversation}
          onUpdateMessages={(messages) => setConversation({ messages })}
          courseData={courseData}
          onBack={handleBack}
          appVersion={appVersion}
          onVersionChange={setAppVersion}
          userMode={userMode}
          onModeChange={handleModeChange}
        />
      </AppLayout>
    </EventStoreProvider>
  );
}