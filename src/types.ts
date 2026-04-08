export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  proposedPlan?: ProposedPlan;
  interactiveType?: 'course-title' | 'course-metadata' | 'course-outline' | 'community-title' | 'community-metadata' | 'community-structure';
  courseData?: CourseData;
  communityData?: CommunityData;
  isThinking?: boolean;
  thinkingSteps?: ThinkingStep[];
  isEditing?: boolean;
  editHistory?: EditHistory[];
  status?: 'generating' | 'complete' | 'error';
}

export interface ThinkingStep {
  id: string;
  step: string;
  status: 'pending' | 'active' | 'complete';
  timestamp: Date;
}

export interface EditHistory {
  id: string;
  previousContent: string;
  newContent: string;
  timestamp: Date;
}

export interface CourseData {
  title?: string;
  description?: string;
  targetAudience?: string;
  learningOutcomes?: string[];
  outline?: CourseModule[];
}

export interface CourseModule {
  title: string;
  lessons: string[];
}

export interface CommunityData {
  title?: string;
  description?: string;
  type?: 'club' | 'academy' | 'membership';
  vibe?: string;
  spaces?: CommunitySpace[];
  gamification?: {
    leaderboard: boolean;
    badges: boolean;
    points: boolean;
  };
}

export interface CommunitySpace {
  id: string;
  name: string;
  icon: string;
  type: 'announcement' | 'discussion' | 'media' | 'resources' | 'directory';
  description?: string;
  seededContent?: SeededPost[];
  readOnly?: boolean;
}

export interface SeededPost {
  id: string;
  author: 'ai' | 'welcome-bot';
  content: string;
  type: 'welcome' | 'conversation-starter' | 'rules' | 'guide';
  isPinned?: boolean;
}

export interface ProposedPlan {
  features: Feature[];
  styleGuidelines: StyleGuideline[];
  stack: {
    ai: string;
    ui: string;
  };
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface StyleGuideline {
  category: string;
  description: string;
}

export interface Conversation {
  id?: string;
  title?: string;
  messages: Message[];
  createdAt?: Date;
  mode?: 'creator' | 'learner'; // Add mode to track user type
}

export interface ModelSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  model: string;
}

export type AppVersion = 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7' | 'v8';