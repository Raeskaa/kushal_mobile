import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Users as UsersIcon, Hash, Image as ImageIcon, FileText, Trophy, Award, Star, MessageSquare, Pin, ChevronDown, Bell, Settings as SettingsIcon, Search, Plus, Palette, GraduationCap, Smile, MoreVertical, TrendingUp, Check, X, Calendar, UserPlus, Eye, MessageCircle, ThumbsUp, Clock, ChevronRight, Filter, Home, BookOpen, BarChart3, Shield, Flag, Bookmark, Upload, Link, Video, Paperclip, AtSign, ChevronLeft, Edit, Trash2, Lock, Unlock, UserMinus, AlertCircle, Zap, TrendingDown, Activity, Mail, Lightbulb, Target, Wand2, Copy, ExternalLink, Bot, Brain, Rocket, Users2, Gauge, PlayCircle, CheckCircle, RefreshCw, Command, MousePointer, Mic, Volume2, Play, Pause, BarChart, GitBranch, Workflow, Cpu, Radio, Radar, Network, UserCheck, Heart, ThumbsDown, Flame, Coffee, CalendarDays, ListChecks, Boxes, Layers, Grid3x3, BookMarked, CircleDot, Ban, UserX, MoveRight, Info, Phone, MapPin } from 'lucide-react';
import { CommunityData, Conversation, Message, AppVersion } from '../types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import LeapyLogo from '../imports/Button';
import { AnalyticsView, SettingsView, EventsView } from './CommunityDashboardViews';
import { CalendarTab, AutomationTab, InsightsTab } from './AIHubTabs';

interface CommunityBuilderViewProps {
  conversation: Conversation;
  onUpdateMessages: (messages: Message[]) => void;
  communityData: Partial<CommunityData>;
  onBack: () => void;
  appVersion?: AppVersion;
  onVersionChange?: (version: AppVersion) => void;
  userMode?: 'creator' | 'learner';
  onModeChange?: (mode: 'creator' | 'learner') => void;
}

const versionDescriptions: Record<AppVersion, string> = {
  v1: 'Intent Detection',
  v2: 'Dual-Pane',
  v3: 'Smart Toggle',
  v4: 'Context Menu',
  v5: 'Tab-Based',
  v6: 'Command Palette',
  v7: 'Persona Selection',
  v8: 'Action Cards',
};

type AICopilotMode = 'builder' | 'helper' | 'analyst';
type AIPersonality = 'professional' | 'casual' | 'enthusiastic' | 'minimal';

const copilotModes = [
  { id: 'builder' as const, label: 'Builder', icon: Rocket, description: 'Create and edit community structure' },
  { id: 'helper' as const, label: 'Helper', icon: MessageCircle, description: 'Ask questions and get guidance' },
  { id: 'analyst' as const, label: 'Analyst', icon: BarChart3, description: 'View insights and analytics' },
];

const aiPersonalities = [
  { id: 'professional' as const, label: 'Professional', description: 'Formal and concise' },
  { id: 'casual' as const, label: 'Casual', description: 'Friendly and relaxed' },
  { id: 'enthusiastic' as const, label: 'Enthusiastic', description: 'Energetic and motivating' },
  { id: 'minimal' as const, label: 'Minimal', description: 'Brief and to-the-point' },
];

const aiPlaybooks = [
  { id: 'onboarding', name: 'New Member Onboarding', icon: UserPlus, tasks: 5, automation: true },
  { id: 'engagement', name: 'Weekly Engagement Boost', icon: Zap, tasks: 7, automation: true },
  { id: 'reactivation', name: 'Inactive Member Re-engagement', icon: RefreshCw, tasks: 4, automation: false },
  { id: 'event', name: 'Event Promotion', icon: Calendar, tasks: 6, automation: true },
  { id: 'content', name: '30-Day Content Strategy', icon: FileText, tasks: 30, automation: true },
];

// Sample members data
const sampleMembers = [
  { id: '1', name: 'Sarah Chen', status: 'online', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', level: 5, points: 1250, title: 'Community Manager', joinDate: 'Jan 2024', bio: 'Passionate about building communities and helping people connect.', expertise: ['Community Building', 'Design', 'UX'], sentiment: 'positive', churnRisk: 5, contributorScore: 95 },
  { id: '2', name: 'Marcus Webb', status: 'online', role: 'Moderator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', level: 4, points: 890, title: 'Tech Lead', joinDate: 'Jan 2024', bio: 'Full-stack developer with 10 years of experience.', expertise: ['React', 'Node.js', 'DevOps'], sentiment: 'positive', churnRisk: 12, contributorScore: 88 },
  { id: '3', name: 'Elena Rodriguez', status: 'online', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', level: 3, points: 645, title: 'Product Designer', joinDate: 'Feb 2024', bio: 'Creating beautiful and functional user experiences.', expertise: ['UI Design', 'Figma', 'Prototyping'], sentiment: 'positive', churnRisk: 8, contributorScore: 82 },
  { id: '4', name: 'James Park', status: 'idle', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', level: 3, points: 580, title: 'Developer', joinDate: 'Feb 2024', bio: 'Building cool stuff with code.', expertise: ['JavaScript', 'Python', 'AI/ML'], sentiment: 'neutral', churnRisk: 78, contributorScore: 45 },
  { id: '5', name: 'Aisha Kumar', status: 'online', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha', level: 2, points: 420, title: 'Marketing Specialist', joinDate: 'Mar 2024', bio: 'Growth marketer focused on community-led growth.', expertise: ['Marketing', 'SEO', 'Content'], sentiment: 'positive', churnRisk: 15, contributorScore: 78 },
  { id: '6', name: 'Tom Anderson', status: 'offline', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom', level: 2, points: 310, title: 'Content Creator', joinDate: 'Mar 2024', bio: 'Creating engaging content for online communities.', expertise: ['Writing', 'Video', 'Social Media'], sentiment: 'neutral', churnRisk: 45, contributorScore: 62 },
  { id: '7', name: 'Lisa Wong', status: 'online', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', level: 1, points: 180, title: 'Designer', joinDate: 'Apr 2024', bio: 'Junior designer learning every day.', expertise: ['Design', 'Illustration'], sentiment: 'positive', churnRisk: 22, contributorScore: 68 },
  { id: '8', name: 'David Kim', status: 'offline', role: 'Member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', level: 1, points: 95, title: 'Student', joinDate: 'Apr 2024', bio: 'Computer science student passionate about tech.', expertise: ['Coding', 'Learning'], sentiment: 'positive', churnRisk: 35, contributorScore: 42 },
];

// Sample posts
const samplePosts = [
  {
    id: 'p1',
    author: sampleMembers[0],
    content: 'Just finished the new landing page design! Would love to get your feedback on the color palette and layout. I\'ve attached some screenshots below.',
    timestamp: '2 hours ago',
    channel: 'design-feedback',
    reactions: [{ emoji: '👍', count: 12, reacted: false }, { emoji: '🎨', count: 5, reacted: true }, { emoji: '🔥', count: 3, reacted: false }],
    replies: [
      { author: sampleMembers[2], preview: 'This looks amazing! The color scheme is very modern...' },
      { author: sampleMembers[4], preview: 'Love the minimal approach. Have you considered...' },
    ],
    hasImage: true,
    isPinned: false,
    aiScore: 87,
    sentiment: 'positive'
  },
  {
    id: 'p2',
    author: sampleMembers[1],
    content: 'Quick reminder: Our monthly community call is tomorrow at 3 PM EST. We\'ll be discussing Q1 goals and upcoming features. Looking forward to seeing everyone there!',
    timestamp: '5 hours ago',
    channel: 'announcements',
    reactions: [{ emoji: '👍', count: 24, reacted: true }, { emoji: '📅', count: 15, reacted: false }],
    replies: [
      { author: sampleMembers[3], preview: 'Will there be a recording available?' },
    ],
    hasImage: false,
    isPinned: true,
    aiScore: 92,
    sentiment: 'positive'
  },
  {
    id: 'p3',
    author: sampleMembers[2],
    content: 'Has anyone tried the new analytics dashboard? The insights are incredibly detailed! I\'m particularly impressed with the user journey tracking feature.',
    timestamp: '1 day ago',
    channel: 'general',
    reactions: [{ emoji: '🔥', count: 7, reacted: false }, { emoji: '✨', count: 3, reacted: false }, { emoji: '👀', count: 5, reacted: false }],
    replies: [
      { author: sampleMembers[0], preview: 'Yes! The conversion funnel view is super helpful...' },
      { author: sampleMembers[5], preview: 'I found a bug in the export feature though...' },
    ],
    hasImage: false,
    isPinned: false,
    aiScore: 78,
    sentiment: 'positive',
    authorId: '3' // Member's own post
  },
];

export function CommunityBuilderView({ 
  communityData, 
  onBack,
  appVersion = 'v1',
  onVersionChange,
  userMode = 'creator',
  onModeChange
}: CommunityBuilderViewProps) {
  const [chatInput, setChatInput] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('home');
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'moderator' | 'member'>('admin');
  const [mainView, setMainView] = useState<'home' | 'channels' | 'events' | 'members' | 'analytics' | 'settings' | 'messages' | 'ai-hub'>('home');
  const [channelTab, setChannelTab] = useState<'chat' | 'resources' | 'events' | 'members'>('chat');
  const [showWelcomeChecklist, setShowWelcomeChecklist] = useState(true);
  const [checklistProgress, setChecklistProgress] = useState(40);
  const [completedTasks, setCompletedTasks] = useState(['create', 'channels']);
  const [collapsedSections, setCollapsedSections] = useState<string[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof sampleMembers[0] | null>(null);
  const [showMemberProfile, setShowMemberProfile] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [selectedDM, setSelectedDM] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [aiMode, setAiMode] = useState<AICopilotMode>('builder');
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>('enthusiastic');
  const [aiAutoPilot, setAiAutoPilot] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [aiHubTab, setAiHubTab] = useState<'overview' | 'playbooks' | 'calendar' | 'automation' | 'insights'>('overview');
  const [healthScore, setHealthScore] = useState(78);
  const [sentimentScore, setSentimentScore] = useState(85);
  const [composerText, setComposerText] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);
  const [aiLearningProgress, setAiLearningProgress] = useState(34);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [aiImpactStats, setAiImpactStats] = useState({
    timeSaved: 8.5,
    actionsCompleted: 23,
    postsCreated: 5,
    membersInvited: 12,
    predictionsAccurate: 94,
  });

  // New AI Panel States
  const [showThinkingProcess, setShowThinkingProcess] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [communityDescription, setCommunityDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('Beginners to intermediate designers from East India');
  const [communitySpecifics, setCommunitySpecifics] = useState([
    'Membership Allowed',
    'Apply knowledge through practical projects',
    'Build real-world applications with confidence',
    'Master advanced techniques and best practices'
  ]);
  const [newSpecific, setNewSpecific] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  const [dmConversations, setDmConversations] = useState([
    { id: 'dm1', member: sampleMembers[2], lastMessage: 'Thanks for the feedback!', unread: 2, timestamp: '10m ago' },
    { id: 'dm2', member: sampleMembers[4], lastMessage: 'When is the next event?', unread: 0, timestamp: '2h ago' },
  ]);
  
  // Different AI messages based on role
  const getInitialAIMessage = () => {
    if (userRole === 'admin') {
      return {
        role: 'assistant' as const,
        content: `🎉 Hey there! I'm Leapy, your AI copilot for "${communityData.title || 'Design Professionals Hub'}".

I'm learning your style and preferences. Currently in **Builder Mode** with **Enthusiastic** personality.

**🎯 Quick Win Alert:**
Your community health score is 78/100. I've identified 3 actions that could boost it to 85+ this week:
1. Post welcome message (predicted +4 points)
2. Schedule first event (predicted +3 points)
3. Invite 5 target members (predicted +2 points)

Want me to handle these on autopilot?`,
        timestamp: new Date(),
        type: 'recommendation' as const,
        actions: [
          {
            label: '🚀 Enable Autopilot',
            onClick: () => {},
            variant: 'primary' as const
          },
          {
            label: '👀 Review Actions',
            onClick: () => {},
            variant: 'secondary' as const
          }
        ]
      };
    } else if (userRole === 'moderator') {
      return {
        role: 'assistant' as const,
        content: `👋 Hi! I'm Leapy, your moderation assistant.

I'm here to help you keep the community healthy and safe.

**🛡️ Moderation Queue:**
• 2 flagged posts to review
• 1 member needs warning (spam behavior)
• 0 active conflicts

**💡 Suggestions:**
• Pin the welcome post in #general
• Create weekly highlights thread

How can I help you today?`,
        timestamp: new Date(),
        type: 'recommendation' as const,
        suggestions: ['Review flagged posts', 'Pin welcome post', 'Create highlights thread']
      };
    } else {
      return {
        role: 'assistant' as const,
        content: `👋 Welcome to ${communityData.title || 'Design Professionals Hub'}!

Here are some tips to get started:

• Introduce yourself in #introductions
• Check out upcoming events
• Explore channels that interest you
• Connect with other members

What would you like to explore first?`,
        timestamp: new Date(),
        type: 'recommendation' as const,
        suggestions: ['See upcoming events', 'Browse channels', 'Find members to connect']
      };
    }
  };

  const [chatMessages, setChatMessages] = useState<Array<{ 
    role: 'user' | 'assistant'; 
    content: string; 
    timestamp: Date;
    suggestions?: string[];
    type?: 'insight' | 'recommendation' | 'celebration' | 'warning';
    actions?: Array<{label: string, onClick: () => void, preview?: any, variant?: 'primary' | 'secondary'}>;
  }>>([getInitialAIMessage()]);

  const [isGenerating, setIsGenerating] = useState(false);

  // Update AI message when role changes
  useEffect(() => {
    setChatMessages([getInitialAIMessage()]);
  }, [userRole]);

  const community = {
    title: communityData.title || 'Design Professionals Hub',
    description: communityData.description || 'A vibrant community for designers to connect, learn, and grow together.',
    memberCount: 247,
    onlineCount: 42,
    channels: [
      { id: 'announcements', name: 'Announcements', icon: Bell, members: 247, unread: 2, description: 'Important updates', isPinned: true },
      { id: 'general', name: 'General', icon: Hash, members: 247, unread: 5, description: 'General discussions', isPinned: false },
      { id: 'introductions', name: 'Introductions', icon: UsersIcon, members: 186, unread: 0, description: 'Introduce yourself', isPinned: false },
      { id: 'design-feedback', name: 'Design Feedback', icon: Palette, members: 124, unread: 3, description: 'Get design critiques', isPinned: false },
      { id: 'resources', name: 'Resources', icon: FileText, members: 198, unread: 0, description: 'Shared resources', isPinned: false },
      { id: 'random', name: 'Random', icon: Smile, members: 156, unread: 1, description: 'Off-topic fun', isPinned: false },
    ],
  };

  const handleSend = () => {
    if (!chatInput.trim() || isGenerating) return;

    const userMessage = {
      role: 'user' as const,
      content: chatInput.trim(),
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, userMessage]);
    const userInput = chatInput.trim().toLowerCase();
    setChatInput('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiResponse = "I can help you with that! Let me know what specific changes you'd like to make.";
      let suggestions: string[] = [];
      let messageType: 'insight' | 'recommendation' | 'celebration' | 'warning' | undefined;
      let actions: Array<{label: string, onClick: () => void, preview?: any, variant?: 'primary' | 'secondary'}> = [];

      // Role-specific AI responses
      if (userRole === 'admin') {
        if (userInput.includes('autopilot')) {
          aiResponse = `🤖 **Autopilot Mode Activated!**

I'll handle daily operations. You'll get weekly summaries every Monday.`;
          setAiAutoPilot(true);
          messageType = 'celebration';
        } else if (userInput.includes('playbook')) {
          aiResponse = `📚 **AI Playbooks Ready**

5 automation sequences available. Which should I activate?`;
          suggestions = ['Activate Onboarding', 'Start Engagement Boost', 'All playbooks'];
        }
      } else if (userRole === 'moderator') {
        if (userInput.includes('flag') || userInput.includes('report')) {
          aiResponse = `🚩 **Flagged Content Queue**

2 posts need review:
1. Spam link in #general (auto-flagged)
2. Off-topic discussion in #design-feedback

Recommend: Delete #1, Move #2 to #random`;
          suggestions = ['Review now', 'Auto-delete spam', 'Move to #random'];
          messageType = 'warning';
        } else if (userInput.includes('pin')) {
          aiResponse = `📌 **Pin Post Suggestion**

The welcome post in #general has high engagement. Pinning it would help new members.`;
          suggestions = ['Pin welcome post', 'Pin latest announcement'];
        }
      } else {
        // Member responses
        if (userInput.includes('event')) {
          aiResponse = `📅 **Upcoming Events**

3 events this week:
• Tomorrow: Community Call (3 PM EST)
• Thu: Design Workshop
• Sat: NYC Meetup

Want to RSVP?`;
          suggestions = ['RSVP to all', 'Just Community Call', 'See event details'];
        } else if (userInput.includes('channel')) {
          aiResponse = `📢 **Popular Channels**

Based on your interests:
• #design-feedback (124 members)
• #resources (198 members)
• #random (156 members)

Want to join?`;
          suggestions = ['Join all 3', 'Browse all channels'];
        }
      }

      const aiMessage = {
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date(),
        suggestions: suggestions.length > 0 ? suggestions : undefined,
        type: messageType,
        actions: actions.length > 0 ? actions : undefined,
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
  };

  // New AI Panel Handlers
  const handleRegenerateField = (field: string) => {
    setIsRegenerating(field);
    setAiThinking(true);
    
    setTimeout(() => {
      if (field === 'description') {
        setCommunityDescription('A vibrant hub for design professionals to collaborate, share insights, and grow together. Connect with fellow designers, access exclusive resources, and participate in workshops that push creative boundaries.');
      } else if (field === 'audience') {
        setTargetAudience('Professional designers, UX/UI specialists, and creative enthusiasts from around the world');
      } else if (field === 'all-specifics') {
        setCommunitySpecifics([
          'Open membership with application process',
          'Weekly design challenges and competitions',
          'Monthly guest speaker sessions',
          'Portfolio review and feedback',
          'Industry networking opportunities'
        ]);
      }
      setIsRegenerating(null);
      setAiThinking(false);
    }, 2000);
  };

  const handleRegenerateAll = () => {
    setIsRegenerating('all');
    setAiThinking(true);
    
    setTimeout(() => {
      setCommunityDescription('An innovative space where designers unite to share knowledge, collaborate on projects, and elevate their craft together.');
      setTargetAudience('Intermediate to advanced designers passionate about modern design practices');
      setCommunitySpecifics([
        'Curated membership community',
        'Bi-weekly design sprints and hackathons',
        'Access to premium design tools and resources',
        'Mentorship from industry leaders',
        'Exclusive job board and opportunities'
      ]);
      setIsRegenerating(null);
      setAiThinking(false);
    }, 3000);
  };

  const handleAddSpecific = () => {
    if (newSpecific.trim()) {
      setCommunitySpecifics([...communitySpecifics, newSpecific.trim()]);
      setNewSpecific('');
    }
  };

  const handleRemoveSpecific = (index: number) => {
    setCommunitySpecifics(communitySpecifics.filter((_, i) => i !== index));
  };

  const handleSaveAndContinue = () => {
    setAiThinking(true);
    setTimeout(() => {
      const aiMessage = {
        role: 'assistant' as const,
        content: '✨ Great! Your community structure looks amazing. Let me help you set up channels and permissions next.',
        timestamp: new Date(),
        type: 'celebration' as const,
      };
      setChatMessages([...chatMessages, aiMessage]);
      setAiThinking(false);
    }, 1000);
  };

  // Get AI message based on mode and personality
  const getAIMessage = () => {
    const messages = {
      builder: {
        enthusiastic: "Perfect! I've generated a community description and specifics for \"Design Professionals Hub\". Feel free to edit anything below! 🎨✨",
        professional: "I've analyzed your requirements and generated an optimized community structure. You may review and modify the fields below.",
        casual: "Hey! I put together a community structure for you. Take a look and tweak anything you'd like! 😊",
        minimal: "Community structure ready. Edit fields as needed."
      },
      helper: {
        enthusiastic: "Hey there! 👋 I'm here to help you with anything community-related. Ask me about best practices, member engagement, or any questions you have!",
        professional: "I'm available to assist with community management questions, provide guidance on best practices, and help optimize your community strategy.",
        casual: "Hi! Need help with something? I'm here to make community management easier for you. Just ask!",
        minimal: "Ask me anything about managing your community."
      },
      analyst: {
        enthusiastic: "🔍 Your community is looking healthy! Let me break down the key metrics and insights that matter most right now!",
        professional: "Based on current data analysis, I've identified several key performance indicators and actionable insights for your community.",
        casual: "Looking good! Here's what the data is telling us about your community 📊",
        minimal: "Analysis complete. Key metrics below."
      }
    };

    if (userRole === 'moderator') {
      return aiMode === 'helper' 
        ? "I've identified 2 posts that need review. I can help you handle moderation tasks efficiently."
        : "Moderation queue: 2 items. Check flagged content below.";
    }

    if (userRole === 'member') {
      return aiMode === 'helper'
        ? "Welcome! I'm here to help you get the most out of this community. What would you like to know?"
        : "Welcome! Here are some tips to get started.";
    }

    return messages[aiMode]?.[aiPersonality] || messages.builder.enthusiastic;
  };

  const toggleSection = (section: string) => {
    if (collapsedSections.includes(section)) {
      setCollapsedSections(collapsedSections.filter(s => s !== section));
    } else {
      setCollapsedSections([...collapsedSections, section]);
    }
  };

  const tasks = [
    { id: 'create', label: 'Create your community', completed: true },
    { id: 'channels', label: 'Add channels', completed: true },
    { id: 'invite', label: 'Invite 5 members', completed: false },
    { id: 'post', label: 'Create your first post', completed: false },
    { id: 'event', label: 'Schedule an event', completed: false },
  ];

  const onlineMembers = sampleMembers.filter(m => m.status === 'online');

  const handleMemberClick = (member: typeof sampleMembers[0]) => {
    setSelectedMember(member);
    setShowMemberProfile(true);
  };

  const currentMode = copilotModes.find(m => m.id === aiMode)!;

  // Permission helpers
  const canAccessAIHub = userRole === 'admin';
  const canAccessAnalytics = userRole === 'admin' || userRole === 'moderator';
  const canAccessSettings = userRole === 'admin';
  const canControlAutopilot = userRole === 'admin';
  const canCreateChannels = userRole === 'admin';
  const canInviteMembers = userRole === 'admin';
  const canModerateContent = userRole === 'admin' || userRole === 'moderator';
  const canDeleteAnyPost = userRole === 'admin' || userRole === 'moderator';
  const canPinPosts = userRole === 'admin' || userRole === 'moderator';
  const canBanMembers = userRole === 'admin';
  const canChangeRoles = userRole === 'admin';
  const canViewAIInsights = userRole === 'admin';
  const canActivatePlaybooks = userRole === 'admin';

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-3 bg-white sticky top-0 z-40 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Back
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="size-8 rounded-lg flex items-center justify-center text-white text-sm" style={{ backgroundColor: '#420D74' }}>
              {community.title.charAt(0)}
            </div>
            <div>
              <h1 className="text-gray-900 text-sm flex items-center gap-2">
                {community.title}
                {aiAutoPilot && canControlAutopilot && (
                  <Badge variant="secondary" className="text-xs">
                    <Cpu className="size-3 mr-1" />
                    Autopilot
                  </Badge>
                )}
              </h1>
              <p className="text-gray-500 text-xs">
                {community.onlineCount} online • {community.memberCount} members
                {canAccessAnalytics && <> • {healthScore}% health</>}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* AI Mode Switcher - Admin Only */}
            {canAccessAIHub && (
              <Popover open={showModeSelector} onOpenChange={setShowModeSelector}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-purple-200" style={{ borderColor: '#E8D5F5', backgroundColor: '#F9F4FC' }}>
                    <currentMode.icon className="size-4" style={{ color: '#420D74' }} />
                    <span style={{ color: '#420D74' }}>AI: {currentMode.label}</span>
                    <ChevronDown className="size-3" style={{ color: '#420D74' }} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" align="end">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 px-2 py-1">AI Copilot Mode</p>
                    {copilotModes.map((mode) => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => {
                            setAiMode(mode.id);
                            setShowModeSelector(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                            aiMode === mode.id ? 'bg-gray-100 border border-gray-200' : ''
                          }`}
                          style={aiMode === mode.id ? { backgroundColor: '#F9F4FC', borderColor: '#E8D5F5' } : {}}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="size-4 text-gray-600" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{mode.label}</p>
                              <p className="text-xs text-gray-500">{mode.description}</p>
                            </div>
                            {aiMode === mode.id && <Check className="size-4" style={{ color: '#420D74' }} />}
                          </div>
                        </button>
                      );
                    })}
                    
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2 px-2">AI Personality</p>
                      <div className="grid grid-cols-2 gap-2">
                        {aiPersonalities.map((personality) => (
                          <button
                            key={personality.id}
                            onClick={() => setAiPersonality(personality.id)}
                            className={`px-2 py-1.5 rounded-md text-xs transition-all ${
                              aiPersonality === personality.id 
                                ? 'text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            style={aiPersonality === personality.id ? { backgroundColor: '#420D74' } : {}}
                          >
                            {personality.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setMainView('ai-hub');
                          setShowModeSelector(false);
                        }}
                        className="w-full px-3 py-2 text-white rounded-lg transition-all text-sm"
                        style={{ backgroundColor: '#420D74' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#331059'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#420D74'}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Sparkles className="size-4" />
                          <span>Open AI Hub</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Autopilot Toggle - Admin Only */}
            {canControlAutopilot && (
              <Button
                variant={aiAutoPilot ? "default" : "outline"}
                size="sm"
                onClick={() => setAiAutoPilot(!aiAutoPilot)}
                className={aiAutoPilot ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Radio className={`size-4 mr-1 ${aiAutoPilot ? 'animate-pulse' : ''}`} />
                {aiAutoPilot ? 'ON' : 'OFF'}
              </Button>
            )}

            {/* Role Switcher - Demo purposes */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setUserRole('admin')}
                className={`px-2.5 py-1 rounded-md text-xs transition-all flex items-center gap-1 ${
                  userRole === 'admin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Star className="size-3" />
                Admin
              </button>
              <button
                onClick={() => setUserRole('moderator')}
                className={`px-2.5 py-1 rounded-md text-xs transition-all flex items-center gap-1 ${
                  userRole === 'moderator' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Shield className="size-3" />
                Mod
              </button>
              <button
                onClick={() => setUserRole('member')}
                className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                  userRole === 'member' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Member
              </button>
            </div>

            {/* Voice Mode - Admin & Mod */}
            {(userRole === 'admin' || userRole === 'moderator') && (
              <Button
                variant={voiceMode ? "default" : "outline"}
                size="sm"
                onClick={() => setVoiceMode(!voiceMode)}
              >
                {voiceMode ? <Volume2 className="size-4" /> : <Mic className="size-4" />}
              </Button>
            )}

            <Button variant="outline" size="sm">
              <Bell className="size-4" />
            </Button>
            
            {/* Publish - Admin Only */}
            {userRole === 'admin' && (
              <Button className="text-white" style={{ backgroundColor: '#420D74' }}>
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* AI Impact Stats Bar - Admin & Mod Only */}
      {canAccessAnalytics && (
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs">
              {userRole === 'admin' && (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="size-3.5 text-purple-600" />
                    <span className="text-gray-700">
                      <span className="font-medium text-purple-900">{aiImpactStats.timeSaved}h</span> saved
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-3.5 text-green-600" />
                    <span className="text-gray-700">
                      <span className="font-medium text-green-900">{aiImpactStats.actionsCompleted}</span> actions
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2">
                <FileText className="size-3.5 text-blue-600" />
                <span className="text-gray-700">
                  <span className="font-medium text-blue-900">{aiImpactStats.postsCreated}</span> posts this week
                </span>
              </div>
              {userRole === 'admin' && (
                <>
                  <div className="h-4 w-px bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <Gauge className="size-3.5 text-purple-600" />
                    <span className="text-gray-700">Health: <span className="font-medium text-purple-900">{healthScore}/100</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="size-3.5 text-pink-600" />
                    <span className="text-gray-700">Sentiment: <span className="font-medium text-pink-900">{sentimentScore}%</span></span>
                  </div>
                </>
              )}
            </div>
            {userRole === 'admin' && (
              <Button size="sm" variant="ghost" className="text-xs text-purple-700 hover:text-purple-900">
                View AI Report →
              </Button>
            )}
            {userRole === 'moderator' && (
              <Badge variant="outline" className="text-xs">
                <Eye className="size-3 mr-1" />
                View Only
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Community Preview (70%) */}
        <div className="flex-1 overflow-hidden bg-gray-50" style={{ width: '70%' }}>
          <div className="h-full flex overflow-hidden">
            {/* Sidebar Navigation - Role-based */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
              {/* Main Navigation */}
              <div className="p-3 border-b border-gray-200">
                <nav className="space-y-1">
                  <button
                    onClick={() => setMainView('home')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      mainView === 'home' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Home className="size-4" />
                    <span className="text-sm">Home</span>
                  </button>
                  
                  {/* AI Hub - Admin Only */}
                  {canAccessAIHub && (
                    <button
                      onClick={() => setMainView('ai-hub')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        mainView === 'ai-hub' ? 'bg-purple-100 text-purple-900' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Sparkles className="size-4" />
                      <span className="text-sm">AI Hub</span>
                      <Badge variant="secondary" className="ml-auto text-xs">New</Badge>
                    </button>
                  )}

                  <button
                    onClick={() => setMainView('messages')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      mainView === 'messages' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Mail className="size-4" />
                    <span className="text-sm">Messages</span>
                    {dmConversations.reduce((acc, dm) => acc + dm.unread, 0) > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs px-1.5">
                        {dmConversations.reduce((acc, dm) => acc + dm.unread, 0)}
                      </Badge>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setMainView('events')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      mainView === 'events' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="size-4" />
                    <span className="text-sm">Events</span>
                    <Badge variant="secondary" className="ml-auto text-xs">3</Badge>
                  </button>
                  
                  <button
                    onClick={() => setMainView('courses')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      mainView === 'courses' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <GraduationCap className="size-4" />
                    <span className="text-sm">Courses</span>
                    <Badge variant="secondary" className="ml-auto text-xs">5</Badge>
                  </button>
                  
                  <button
                    onClick={() => setMainView('members')}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      mainView === 'members' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <UsersIcon className="size-4" />
                    <span className="text-sm">Members</span>
                  </button>
                  
                  {/* Analytics - Admin & Mod */}
                  {canAccessAnalytics && (
                    <button
                      onClick={() => setMainView('analytics')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        mainView === 'analytics' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <BarChart3 className="size-4" />
                      <span className="text-sm">Analytics</span>
                      {userRole === 'moderator' && (
                        <Eye className="size-3 ml-auto text-gray-400" />
                      )}
                    </button>
                  )}
                  
                  {/* Settings - Admin Only */}
                  {canAccessSettings && (
                    <button
                      onClick={() => setMainView('settings')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        mainView === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <SettingsIcon className="size-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                  )}
                </nav>
              </div>

              <ScrollArea className="flex-1">
                {/* Channels Section */}
                <div className="p-3">
                  <button
                    onClick={() => toggleSection('channels')}
                    className="w-full flex items-center justify-between px-2 py-1 text-xs text-gray-500 uppercase tracking-wide hover:text-gray-700"
                  >
                    <span>Channels</span>
                    <ChevronDown className={`size-3 transition-transform ${collapsedSections.includes('channels') ? '-rotate-90' : ''}`} />
                  </button>
                  
                  {!collapsedSections.includes('channels') && (
                    <div className="space-y-0.5 mt-2">
                      {community.channels.map((channel) => {
                        const IconComponent = channel.icon;
                        return (
                          <button
                            key={channel.id}
                            onClick={() => {
                              setSelectedSpace(channel.id);
                              setMainView('channels');
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors group ${
                              selectedSpace === channel.id && mainView === 'channels'
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <IconComponent className="size-4 flex-shrink-0" />
                            <span className="text-sm flex-1 text-left truncate">{channel.name}</span>
                            {channel.unread > 0 && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                                {channel.unread}
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                      
                      {/* Add Channel - Admin Only */}
                      {canCreateChannels ? (
                        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                          <Plus className="size-4" />
                          <span className="text-sm">Add Channel</span>
                        </button>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-gray-300 cursor-not-allowed">
                                <Plus className="size-4" />
                                <span className="text-sm">Add Channel</span>
                                <Lock className="size-3 ml-auto" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Admin only</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  )}
                </div>

                {/* Online Members */}
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={() => toggleSection('online')}
                    className="w-full flex items-center justify-between px-2 py-1 text-xs text-gray-500 uppercase tracking-wide hover:text-gray-700"
                  >
                    <span>Online — {onlineMembers.length}</span>
                    <ChevronDown className={`size-3 transition-transform ${collapsedSections.includes('online') ? '-rotate-90' : ''}`} />
                  </button>
                  
                  {!collapsedSections.includes('online') && (
                    <div className="space-y-1 mt-2">
                      {onlineMembers.slice(0, 5).map((member) => (
                        <button
                          key={member.id}
                          onClick={() => handleMemberClick(member)}
                          className="w-full flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded-md"
                        >
                          <div className="relative">
                            <img src={member.avatar} alt={member.name} className="size-6 rounded-full" />
                            <div className="absolute bottom-0 right-0 size-2 bg-green-500 rounded-full border border-white" />
                          </div>
                          <span className="text-sm text-gray-900 truncate flex-1 text-left">{member.name.split(' ')[0]}</span>
                          {member.role === 'Admin' && <Star className="size-3 text-yellow-500" />}
                          {member.role === 'Moderator' && <Shield className="size-3 text-blue-500" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* User Profile */}
              <div className="p-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <img src={sampleMembers[0].avatar} alt="You" className="size-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate flex items-center gap-1">
                      You
                      {userRole === 'admin' && <Star className="size-3 text-yellow-500" />}
                      {userRole === 'moderator' && <Shield className="size-3 text-blue-500" />}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-green-500" />
                      Online
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <SettingsIcon className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* AI Hub View - Admin Only */}
              {mainView === 'ai-hub' && canAccessAIHub && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-gray-900">AI Command Center</h2>
                        <p className="text-sm text-gray-600 mt-1">Your AI copilot dashboard</p>
                      </div>
                    </div>

                    {/* AI Hub Tabs */}
                    <div className="flex items-center gap-2 border-b border-gray-200 -mb-4">
                      {[
                        { id: 'overview', label: 'Overview', icon: Grid3x3 },
                        { id: 'playbooks', label: 'Playbooks', icon: Workflow },
                        { id: 'calendar', label: 'Calendar', icon: CalendarDays },
                        { id: 'automation', label: 'Automation', icon: Zap },
                        { id: 'insights', label: 'Insights', icon: Lightbulb },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setAiHubTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                              aiHubTab === tab.id
                                ? 'border-purple-600 text-gray-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <Icon className="size-4" />
                            <span className="text-sm">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-6">
                    {aiHubTab === 'overview' && (
                      <div className="space-y-6 max-w-6xl">
                        {/* Health Score */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2 bg-purple-600 rounded-lg p-6 text-white">
                            <p className="text-purple-100 text-sm mb-2">Community Health Score</p>
                            <div className="flex items-baseline gap-3 mb-4">
                              <span className="text-5xl font-bold">{healthScore}</span>
                              <span className="text-2xl text-purple-100">/100</span>
                              <Badge className="bg-green-500 text-white border-0">
                                <TrendingUp className="size-3 mr-1" />
                                +8
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-500">
                              <div>
                                <p className="text-purple-100 text-xs mb-1">Engagement</p>
                                <p className="text-xl font-bold">82%</p>
                              </div>
                              <div>
                                <p className="text-purple-100 text-xs mb-1">Growth</p>
                                <p className="text-xl font-bold">+14.9%</p>
                              </div>
                              <div>
                                <p className="text-purple-100 text-xs mb-1">Retention</p>
                                <p className="text-xl font-bold">78%</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                            <div className="flex items-center gap-2 mb-4">
                              <Heart className="size-5 text-green-700" />
                              <p className="text-sm font-medium text-green-900">Sentiment</p>
                            </div>
                            <div className="text-4xl font-bold text-green-900 mb-2">{sentimentScore}%</div>
                            <p className="text-sm text-green-700">Positive mood</p>
                          </div>
                        </div>

                        {/* AI Recommendations */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Lightbulb className="size-5 text-blue-700" />
                            <h3 className="font-medium text-blue-900">AI Recommendations</h3>
                            <Badge className="ml-auto bg-blue-600 text-white">3 urgent</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-4 bg-white rounded-lg border border-blue-200">
                              <div className="flex items-start justify-between mb-2">
                                <AlertCircle className="size-5 text-orange-600" />
                                <Badge variant="destructive" className="text-xs">High</Badge>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Churn Risk</p>
                              <p className="text-xs text-gray-600 mb-3">James Park: 78% risk</p>
                              <Button size="sm" variant="outline" className="w-full text-xs">
                                <Wand2 className="size-3 mr-1" />
                                AI Intervention
                              </Button>
                            </div>

                            <div className="p-4 bg-white rounded-lg border border-blue-200">
                              <div className="flex items-start justify-between mb-2">
                                <TrendingDown className="size-5 text-orange-600" />
                                <Badge className="text-xs bg-orange-100 text-orange-700">Medium</Badge>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Engagement Drop</p>
                              <p className="text-xs text-gray-600 mb-3">Down 15% this week</p>
                              <Button size="sm" variant="outline" className="w-full text-xs">
                                <Wand2 className="size-3 mr-1" />
                                Create Post
                              </Button>
                            </div>

                            <div className="p-4 bg-white rounded-lg border border-blue-200">
                              <div className="flex items-start justify-between mb-2">
                                <UserCheck className="size-5 text-green-600" />
                                <Badge className="text-xs bg-green-100 text-green-700">Opportunity</Badge>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Member Matching</p>
                              <p className="text-xs text-gray-600 mb-3">5 connections found</p>
                              <Button size="sm" variant="outline" className="w-full text-xs">
                                <Wand2 className="size-3 mr-1" />
                                Make Intros
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Recent Actions */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="font-medium text-gray-900 mb-4">Recent AI Actions</h3>
                          <div className="space-y-3">
                            {[
                              { action: 'Posted daily conversation starter', time: '2 hours ago', status: 'success', engagement: '+12 replies' },
                              { action: 'Sent welcome DM to 3 new members', time: '5 hours ago', status: 'success', engagement: '2 responded' },
                              { action: 'Created member spotlight: Sarah Chen', time: '1 day ago', status: 'success', engagement: '24 reactions' },
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                                <CheckCircle className="size-4 text-green-600" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{item.action}</p>
                                  <p className="text-xs text-gray-500">{item.time}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">{item.engagement}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {aiHubTab === 'playbooks' && (
                      <div className="space-y-4 max-w-4xl">
                        {aiPlaybooks.map((playbook) => {
                          const Icon = playbook.icon;
                          return (
                            <div key={playbook.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-purple-100 rounded-lg">
                                    <Icon className="size-6 text-purple-700" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-gray-900 mb-1">{playbook.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{playbook.tasks} automated tasks</p>
                                    {playbook.automation && (
                                      <Badge className="bg-green-100 text-green-700 border-0">
                                        <Zap className="size-3 mr-1" />
                                        Auto-enabled
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button className="bg-purple-600 hover:bg-purple-700">
                                  <PlayCircle className="size-4 mr-2" />
                                  Activate
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {aiHubTab === 'calendar' && <CalendarTab />}
                    {aiHubTab === 'automation' && <AutomationTab />}
                    {aiHubTab === 'insights' && <InsightsTab />}
                  </ScrollArea>
                </div>
              )}

              {/* Home View */}
              {mainView === 'home' && (
                <div className="flex-1 overflow-y-auto">
                  {/* Header Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center overflow-hidden border-b border-gray-200">
                    {/* Placeholder pattern for header */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)',
                      }} />
                    </div>

                    {/* Edit/Upload Button */}
                    {userRole === 'admin' && (
                      <div className="absolute top-4 right-4">
                        <Button
                          size="sm"
                          className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg"
                        >
                          <Upload className="size-3 mr-2" />
                          Upload Header
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-gray-900 mb-4">Activity Feed</h2>
                    
                    {/* Post Composer */}
                    {!showComposer ? (
                      <button
                        onClick={() => setShowComposer(true)}
                        className="w-full flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                      >
                        <img src={sampleMembers[0].avatar} alt="You" className="size-10 rounded-full" />
                        <span className="text-sm text-gray-500 flex-1 text-left">Start a post...</span>
                        {userRole === 'admin' && (
                          <Badge variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="size-3 mr-1" />
                            AI Draft
                          </Badge>
                        )}
                      </button>
                    ) : (
                      <div className="border-2 border-purple-300 rounded-lg p-4">
                        <div className="flex gap-3 mb-3">
                          <img src={sampleMembers[0].avatar} alt="You" className="size-10 rounded-full" />
                          <div className="flex-1">
                            <Textarea
                              value={composerText}
                              onChange={(e) => setComposerText(e.target.value)}
                              placeholder="What's on your mind?"
                              className="border-none focus:ring-0 resize-none mb-2"
                              rows={3}
                              autoFocus
                            />
                            {composerText && userRole === 'admin' && (
                              <div className="flex items-start gap-2 text-xs bg-purple-50 px-3 py-2 rounded-md mb-2 border border-purple-200">
                                <Lightbulb className="size-4 text-purple-700 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-purple-900 font-medium mb-1">AI Prediction</p>
                                  <p className="text-purple-700">Expected ~25 reactions • Best time: Tomorrow 2 PM</p>
                                </div>
                                <Button size="sm" variant="ghost" className="text-purple-600 hover:bg-purple-100">
                                  <Wand2 className="size-3 mr-1" />
                                  Optimize
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <ImageIcon className="size-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Video className="size-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Smile className="size-4" />
                            </Button>
                            {userRole === 'admin' && (
                              <>
                                <div className="h-4 w-px bg-gray-200 mx-1" />
                                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                                  <Wand2 className="size-4 mr-1" />
                                  AI Improve
                                </Button>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setShowComposer(false)}>
                              Cancel
                            </Button>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Posts Feed */}
                  <div className="p-6">
                    <div className="space-y-4 max-w-2xl">
                      {samplePosts.map((post) => (
                        <div key={post.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors">
                          {post.isPinned && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-100">
                              <Pin className="size-3" />
                              <span>Pinned post</span>
                            </div>
                          )}
                          
                          <div className="flex gap-3 mb-3">
                            <img src={post.author.avatar} alt={post.author.name} className="size-10 rounded-full" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-900">{post.author.name}</span>
                                <span className="text-xs text-gray-500">{post.author.title}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-500">{post.timestamp}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Hash className="size-3" />
                                <span>{post.channel}</span>
                              </div>
                            </div>
                            
                            {/* Context Menu - Role-based */}
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreVertical className="size-4" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48 p-1" align="end">
                                {/* Member can only edit/delete own posts */}
                                {userRole === 'member' && post.authorId === '3' && (
                                  <>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <Edit className="size-4" />
                                      Edit
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                                      <Trash2 className="size-4" />
                                      Delete
                                    </button>
                                  </>
                                )}
                                
                                {/* Member can bookmark/report others' posts */}
                                {userRole === 'member' && post.authorId !== '3' && (
                                  <>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <Bookmark className="size-4" />
                                      Bookmark
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <Flag className="size-4" />
                                      Report
                                    </button>
                                  </>
                                )}
                                
                                {/* Moderator options */}
                                {userRole === 'moderator' && (
                                  <>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <Pin className="size-4" />
                                      Pin post
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <Edit className="size-4" />
                                      Edit
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <MoveRight className="size-4" />
                                      Move to channel
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-md">
                                      <AlertCircle className="size-4" />
                                      Warn author
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                                      <Trash2 className="size-4" />
                                      Delete
                                    </button>
                                  </>
                                )}
                                
                                {/* Admin options */}
                                {userRole === 'admin' && (
                                  <>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <Pin className="size-4" />
                                      Pin post
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <Wand2 className="size-4 text-purple-600" />
                                      AI Improve
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <Edit className="size-4" />
                                      Edit
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <MoveRight className="size-4" />
                                      Move to channel
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                      <BarChart3 className="size-4" />
                                      View analytics
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                                      <Trash2 className="size-4" />
                                      Delete
                                    </button>
                                  </>
                                )}
                              </PopoverContent>
                            </Popover>
                          </div>

                          <p className="text-sm text-gray-900 leading-relaxed mb-3">
                            {post.content}
                          </p>

                          {post.hasImage && (
                            <div className="mb-3 rounded-lg bg-gray-100 h-48 flex items-center justify-center text-sm text-gray-500">
                              [Image Preview]
                            </div>
                          )}

                          {/* Reactions */}
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                            {post.reactions.map((reaction, idx) => (
                              <button
                                key={idx}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors border ${
                                  reaction.reacted
                                    ? 'bg-purple-50 border-purple-200'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                }`}
                              >
                                <span className="text-sm">{reaction.emoji}</span>
                                <span className="text-xs text-gray-600">{reaction.count}</span>
                              </button>
                            ))}
                            <button className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-gray-50 rounded-md transition-colors border border-gray-200">
                              <Smile className="size-3.5 text-gray-500" />
                            </button>
                          </div>

                          {/* Replies Preview */}
                          {post.replies.length > 0 && (
                            <button className="w-full text-left">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex -space-x-2">
                                  {post.replies.slice(0, 3).map((reply, idx) => (
                                    <img
                                      key={idx}
                                      src={reply.author.avatar}
                                      alt={reply.author.name}
                                      className="size-6 rounded-full border-2 border-white"
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                                </span>
                              </div>
                              <div className="pl-8">
                                <div className="flex gap-2 text-xs text-gray-600">
                                  <span className="font-medium">{post.replies[0].author.name}</span>
                                  <span className="truncate">{post.replies[0].preview}</span>
                                </div>
                              </div>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Courses View */}
              {mainView === 'courses' && (
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-gray-900">Courses</h2>
                        <p className="text-sm text-gray-600 mt-1">Create and manage your course library</p>
                      </div>
                      {userRole === 'admin' && (
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Plus className="size-4 mr-2" />
                          Create Course
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="max-w-6xl space-y-6">
                      {/* Course Stats - Admin/Mod Only */}
                      {(userRole === 'admin' || userRole === 'moderator') && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Total Courses</span>
                              <GraduationCap className="size-4 text-purple-600" />
                            </div>
                            <p className="text-2xl text-gray-900">5</p>
                            <p className="text-xs text-gray-500 mt-1">2 published, 3 draft</p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Active Students</span>
                              <UsersIcon className="size-4 text-blue-600" />
                            </div>
                            <p className="text-2xl text-gray-900">127</p>
                            <p className="text-xs text-green-600 mt-1">↑ 12% this week</p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Completion Rate</span>
                              <CheckCircle className="size-4 text-green-600" />
                            </div>
                            <p className="text-2xl text-gray-900">68%</p>
                            <p className="text-xs text-gray-500 mt-1">Average across all courses</p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Total Revenue</span>
                              <TrendingUp className="size-4 text-emerald-600" />
                            </div>
                            <p className="text-2xl text-gray-900">$12.4k</p>
                            <p className="text-xs text-gray-500 mt-1">This month</p>
                          </div>
                        </div>
                      )}

                      {/* Filter/Sort Bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="size-4 mr-2" />
                          Filter
                        </Button>
                      </div>

                      {/* Courses Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            id: 1,
                            title: 'Complete Web Development Bootcamp',
                            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
                            students: 45,
                            lessons: 24,
                            duration: '12h 30m',
                            price: 'Paid',
                            status: 'published',
                            progress: 100,
                            category: 'Development'
                          },
                          {
                            id: 2,
                            title: 'Digital Marketing Fundamentals',
                            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
                            students: 32,
                            lessons: 18,
                            duration: '8h 15m',
                            price: 'Free',
                            status: 'published',
                            progress: 100,
                            category: 'Marketing'
                          },
                          {
                            id: 3,
                            title: 'UI/UX Design Masterclass',
                            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
                            students: 28,
                            lessons: 20,
                            duration: '10h 45m',
                            price: 'Paid',
                            status: 'draft',
                            progress: 75,
                            category: 'Design'
                          },
                          {
                            id: 4,
                            title: 'Python for Data Science',
                            thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
                            students: 0,
                            lessons: 15,
                            duration: '9h 20m',
                            price: 'Paid',
                            status: 'draft',
                            progress: 40,
                            category: 'Development'
                          },
                          {
                            id: 5,
                            title: 'Content Creation Strategy',
                            thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
                            students: 0,
                            lessons: 12,
                            duration: '6h 00m',
                            price: 'Free',
                            status: 'draft',
                            progress: 20,
                            category: 'Marketing'
                          }
                        ].map((course) => (
                          <div key={course.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors group">
                            {/* Thumbnail */}
                            <div className="relative h-40 overflow-hidden bg-gray-200 flex items-center justify-center">
                              {/* Placeholder pattern */}
                              <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)',
                                }} />
                              </div>
                              <GraduationCap className="size-12 text-gray-400" />
                              
                              {/* Status Badge */}
                              <div className="absolute top-2 right-2">
                                <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                                  {course.status === 'published' ? 'Published' : 'Draft'}
                                </Badge>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-3 flex-1">
                                  <h3 className="text-sm text-gray-900 line-clamp-2 flex-1">{course.title}</h3>
                                  
                                  {/* Circular Progress for drafts - Admin only */}
                                  {userRole === 'admin' && course.status === 'draft' && (
                                    <div className="relative size-12 flex-shrink-0">
                                      <svg className="size-12 -rotate-90" viewBox="0 0 48 48">
                                        <circle
                                          cx="24"
                                          cy="24"
                                          r="20"
                                          fill="none"
                                          stroke="#e5e7eb"
                                          strokeWidth="4"
                                        />
                                        <circle
                                          cx="24"
                                          cy="24"
                                          r="20"
                                          fill="none"
                                          stroke="#9333ea"
                                          strokeWidth="4"
                                          strokeDasharray={`${2 * Math.PI * 20}`}
                                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - course.progress / 100)}`}
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs text-gray-900">{course.progress}%</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {userRole === 'admin' && (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="size-4" />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-1" align="end">
                                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                        <Edit className="size-4" />
                                        Edit Course
                                      </button>
                                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                        <Copy className="size-4" />
                                        Duplicate
                                      </button>
                                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                        <BarChart3 className="size-4" />
                                        View Analytics
                                      </button>
                                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                        <Wand2 className="size-4 text-purple-600" />
                                        AI Improve
                                      </button>
                                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                                        <Trash2 className="size-4" />
                                        Delete
                                      </button>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                                <Badge variant="outline" className="text-xs">{course.price}</Badge>
                              </div>

                              {/* Stats */}
                              <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <BookOpen className="size-3" />
                                  <span>{course.lessons} lessons</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="size-3" />
                                  <span>{course.duration}</span>
                                </div>
                              </div>

                              {course.status === 'published' && (
                                <div className="flex items-center gap-1 text-xs text-gray-600 pt-3 border-t border-gray-100">
                                  <UsersIcon className="size-3" />
                                  <span>{course.students} students enrolled</span>
                                </div>
                              )}

                              {course.status === 'draft' && userRole === 'admin' && (
                                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 mt-2">
                                  Continue Building
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* AI Suggestion - Admin Only */}
                      {userRole === 'admin' && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="size-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Lightbulb className="size-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm text-gray-900 mb-1">AI Course Suggestions</h3>
                              <p className="text-sm text-gray-600 mb-3">Based on your community's interests and engagement, here are recommended courses to create:</p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="size-1.5 rounded-full bg-purple-600" />
                                  <span className="text-sm text-gray-700">Advanced JavaScript Patterns</span>
                                  <span className="text-xs text-gray-500">(High demand)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="size-1.5 rounded-full bg-purple-600" />
                                  <span className="text-sm text-gray-700">Social Media Growth Hacks</span>
                                  <span className="text-xs text-gray-500">(Trending topic)</span>
                                </div>
                              </div>
                              <Button size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700">
                                <Wand2 className="size-3 mr-2" />
                                Generate Course Outline
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages View */}
              {mainView === 'messages' && (
                <div className="flex-1 flex overflow-hidden">
                  {/* Conversations List */}
                  <div className="w-80 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-gray-900">Messages</h2>
                        <Button size="sm">
                          <Plus className="size-4 mr-2" />
                          New
                        </Button>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search messages..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <ScrollArea className="flex-1">
                      <div className="p-2">
                        {dmConversations.map((conv) => (
                          <button
                            key={conv.id}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                          >
                            <div className="relative">
                              <img src={conv.member.avatar} alt={conv.member.name} className="size-12 rounded-full" />
                              <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-900 truncate">{conv.member.name}</span>
                                <span className="text-xs text-gray-500">{conv.timestamp}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                                {conv.unread > 0 && (
                                  <Badge className="ml-2 bg-purple-600">{conv.unread}</Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Message Thread */}
                  <div className="flex-1 flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={dmConversations[0].member.avatar} alt={dmConversations[0].member.name} className="size-10 rounded-full" />
                          <div>
                            <h3 className="text-gray-900">{dmConversations[0].member.name}</h3>
                            <p className="text-sm text-gray-500">Active now</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Phone className="size-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Video className="size-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <ScrollArea className="flex-1 p-6">
                      <div className="space-y-4 max-w-3xl">
                        {/* Sample messages */}
                        <div className="flex gap-3">
                          <img src={dmConversations[0].member.avatar} alt="" className="size-8 rounded-full" />
                          <div>
                            <div className="bg-gray-100 rounded-lg px-4 py-2 inline-block max-w-md">
                              <p className="text-sm text-gray-900">Hey! I loved your recent post about design systems. Do you have any resources you'd recommend?</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                          <div className="text-right">
                            <div className="bg-purple-600 rounded-lg px-4 py-2 inline-block max-w-md">
                              <p className="text-sm text-white">Thanks! I'd recommend checking out the Material Design guidelines and Refactoring UI book.</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">10:32 AM</p>
                          </div>
                          <img src={sampleMembers[0].avatar} alt="" className="size-8 rounded-full" />
                        </div>

                        {userRole === 'admin' && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="size-4 text-purple-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-purple-900 font-medium mb-1">AI Suggestion</p>
                                <p className="text-xs text-purple-700">Looks like {dmConversations[0].member.name} is interested in design resources. Consider inviting them to the #design-resources channel.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="size-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ImageIcon className="size-4" />
                        </Button>
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        />
                        {userRole === 'admin' && (
                          <Button variant="outline" size="sm">
                            <Wand2 className="size-4 text-purple-600" />
                          </Button>
                        )}
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Send className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Members View */}
              {mainView === 'members' && (
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-gray-900">Members</h2>
                        <p className="text-sm text-gray-600 mt-1">Manage your community members</p>
                      </div>
                      {(userRole === 'admin' || userRole === 'moderator') && (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Filter className="size-4 mr-2" />
                            Filter
                          </Button>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <UserPlus className="size-4 mr-2" />
                            Invite
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Member Stats - Admin/Mod Only */}
                    {(userRole === 'admin' || userRole === 'moderator') && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Total Members</span>
                            <UsersIcon className="size-4 text-gray-400" />
                          </div>
                          <p className="text-xl text-gray-900">128</p>
                          <p className="text-xs text-green-600 mt-0.5">↑ 12 this week</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Active Today</span>
                            <Activity className="size-4 text-gray-400" />
                          </div>
                          <p className="text-xl text-gray-900">42</p>
                          <p className="text-xs text-gray-500 mt-0.5">32.8% of total</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">New This Month</span>
                            <UserPlus className="size-4 text-gray-400" />
                          </div>
                          <p className="text-xl text-gray-900">23</p>
                          <p className="text-xs text-green-600 mt-0.5">↑ 15% vs last month</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">At Risk</span>
                            <AlertCircle className="size-4 text-gray-400" />
                          </div>
                          <p className="text-xl text-gray-900">8</p>
                          <p className="text-xs text-orange-600 mt-0.5">Needs attention</p>
                        </div>
                      </div>
                    )}

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search members by name, role, or expertise..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="max-w-6xl">
                      {/* Members Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sampleMembers.map((member) => (
                          <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="relative">
                                <img src={member.avatar} alt={member.name} className="size-12 rounded-full" />
                                <div className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white ${
                                  member.status === 'online' ? 'bg-green-500' : member.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-400'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <span className="text-sm text-gray-900 truncate">{member.name}</span>
                                  {member.role === 'Admin' && <Star className="size-3 text-yellow-500" />}
                                  {member.role === 'Moderator' && <Shield className="size-3 text-blue-500" />}
                                </div>
                                <p className="text-xs text-gray-600 truncate">{member.title}</p>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical className="size-4" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-1" align="end">
                                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    <MessageCircle className="size-4" />
                                    Send Message
                                  </button>
                                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    <Eye className="size-4" />
                                    View Profile
                                  </button>
                                  {(userRole === 'admin' || userRole === 'moderator') && (
                                    <>
                                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                        <Shield className="size-4" />
                                        Change Role
                                      </button>
                                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                                        <UserMinus className="size-4" />
                                        Remove
                                      </button>
                                    </>
                                  )}
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {member.expertise.slice(0, 2).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {member.expertise.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{member.expertise.length - 2}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Trophy className="size-3" />
                                <span>Lvl {member.level}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="size-3" />
                                <span>{member.points}</span>
                              </div>
                            </div>

                            {/* AI Insights - Admin Only */}
                            {userRole === 'admin' && member.churnRisk > 50 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-xs text-orange-600">
                                  <AlertCircle className="size-3" />
                                  <span>High churn risk ({member.churnRisk}%)</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* AI Member Matching - Admin Only */}
                      {userRole === 'admin' && (
                        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="size-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Users2 className="size-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm text-gray-900 mb-1">AI Member Connections</h3>
                              <p className="text-sm text-gray-600 mb-3">Suggested member connections based on shared interests and complementary skills:</p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="flex -space-x-2">
                                    <img src={sampleMembers[2].avatar} alt="" className="size-6 rounded-full border-2 border-white" />
                                    <img src={sampleMembers[4].avatar} alt="" className="size-6 rounded-full border-2 border-white" />
                                  </div>
                                  <span className="text-gray-700">Elena & Aisha</span>
                                  <span className="text-xs text-gray-500">(Both interested in UI/UX)</span>
                                </div>
                              </div>
                              <Button size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700">
                                <Wand2 className="size-3 mr-2" />
                                Facilitate Introduction
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics View */}
              {mainView === 'analytics' && canAccessAnalytics && (
                <AnalyticsView userRole={userRole} samplePosts={samplePosts} />
              )}

              {/* Settings View */}
              {mainView === 'settings' && canAccessSettings && (
                <SettingsView userRole={userRole} communityData={communityData} />
              )}

              {/* Events View */}
              {mainView === 'events' && (
                <EventsView userRole={userRole} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Button - Admin Only */}
      {canAccessAIHub && (
        <button
          onClick={() => setMainView('ai-hub')}
          className="fixed bottom-6 right-6 size-14 bg-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group z-50"
        >
          <Sparkles className="size-6 text-white" />
          <div className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </div>
        </button>
      )}

      {/* Member Profile Modal - Role-based actions */}
      {showMemberProfile && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMemberProfile(false)}>
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4">
                  <div className="relative">
                    <img src={selectedMember.avatar} alt={selectedMember.name} className="size-16 rounded-full" />
                    <div className={`absolute bottom-0 right-0 size-4 rounded-full border-2 border-white ${
                      selectedMember.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 flex items-center gap-2">
                      {selectedMember.name}
                      {selectedMember.role === 'Admin' && <Star className="size-4 text-yellow-500" />}
                      {selectedMember.role === 'Moderator' && <Shield className="size-4 text-blue-500" />}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedMember.title}</p>
                    <p className="text-xs text-gray-500 mt-1">Joined {selectedMember.joinDate}</p>
                  </div>
                </div>
                <button onClick={() => setShowMemberProfile(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="size-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Bio</p>
                  <p className="text-sm text-gray-900">{selectedMember.bio}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMember.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Level</p>
                    <p className="text-lg text-gray-900">{selectedMember.level}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Points</p>
                    <p className="text-lg text-gray-900">{selectedMember.points}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Posts</p>
                    <p className="text-lg text-gray-900">{Math.floor(Math.random() * 50) + 10}</p>
                  </div>
                </div>

                {/* AI Insights - Admin Only */}
                {canViewAIInsights && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Brain className="size-4 text-purple-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-purple-900 mb-2">AI Insights</p>
                        <div className="space-y-1 text-xs text-purple-800">
                          <div className="flex justify-between">
                            <span>Contributor Score:</span>
                            <span className="font-medium">{selectedMember.contributorScore}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Churn Risk:</span>
                            <span className="font-medium">{selectedMember.churnRisk}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sentiment:</span>
                            <span className="font-medium capitalize">{selectedMember.sentiment}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Role-based */}
                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <MessageSquare className="size-4 mr-2" />
                    Message
                  </Button>
                  
                  {/* Admin actions */}
                  {userRole === 'admin' && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <MoreVertical className="size-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-1" align="end">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <Star className="size-4" />
                          Change Role
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <Brain className="size-4" />
                          View AI Report
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                          <Ban className="size-4" />
                          Ban Member
                        </button>
                      </PopoverContent>
                    </Popover>
                  )}
                  
                  {/* Moderator actions */}
                  {userRole === 'moderator' && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <MoreVertical className="size-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-1" align="end">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <AlertCircle className="size-4" />
                          Warn Member
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-md">
                          <UserMinus className="size-4" />
                          Temp Mute (24h)
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                          <Flag className="size-4" />
                          Report to Admin
                        </button>
                      </PopoverContent>
                    </Popover>
                  )}
                  
                  {/* Member actions */}
                  {userRole === 'member' && (
                    <Button variant="outline">
                      <Eye className="size-4 mr-2" />
                      View Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
