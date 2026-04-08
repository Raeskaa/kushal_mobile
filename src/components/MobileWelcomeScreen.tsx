import { useState } from 'react';
import { Sparkles, Upload, Mic, Camera, Zap, Users, BookOpen, TrendingUp, MessageCircle, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { LeapyIcon } from './LeapyIcon';
import { MobileImportCommunityFlow } from './MobileImportCommunityFlow';
import { MobileCommunityCreationFlow } from './MobileCommunityCreationFlow';
import { CommunityData } from '../types';

interface MobileWelcomeScreenProps {
  onStart: (prompt: string, mode?: 'creator' | 'learner', type?: 'course' | 'community') => void;
  onImportCommunity?: (communityData: any) => void;
  onCreateCommunity?: (communityData: any) => void;
  onAIChat: () => void;
}

export function MobileWelcomeScreen({ onStart, onImportCommunity, onCreateCommunity, onAIChat }: MobileWelcomeScreenProps) {
  const [prompt, setPrompt] = useState('');
  const [showImportFlow, setShowImportFlow] = useState(false);
  const [showCreationFlow, setShowCreationFlow] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      const lowerPrompt = prompt.toLowerCase();
      const isCommunity = lowerPrompt.includes('community');
      const isCourse = lowerPrompt.includes('course') && !isCommunity;
      const type = isCommunity ? 'community' : (isCourse ? 'course' : undefined);
      onStart(prompt, undefined, type);
    }
  };

  const handleImportComplete = (communityData: Partial<CommunityData>) => {
    setShowImportFlow(false);
    if (onImportCommunity) {
      onImportCommunity(communityData);
    }
  };

  const handleCreateComplete = (communityData: Partial<CommunityData>) => {
    setShowCreationFlow(false);
    if (onCreateCommunity) {
      onCreateCommunity(communityData);
    }
  };

  const quickPrompts = [
    { text: 'Create a community', icon: Users, type: 'community' as const, action: () => setShowCreationFlow(true) },
    { text: 'Build a course', icon: BookOpen, type: 'course' as const },
    { text: 'Import from Slack', icon: Upload, action: () => setShowImportFlow(true) },
    { text: 'Get started guide', icon: Sparkles, type: undefined },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="px-4 pt-8 pb-6 text-center border-b border-gray-200">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
            <LeapyIcon className="size-5" />
            <span className="text-xs text-gray-700">
              Powered by Leapy AI
            </span>
          </div>
          
          <h1 className="text-3xl text-gray-900 mb-3 leading-tight px-4">
            Build & grow your learning community
          </h1>
          
          <p className="text-sm text-gray-600 px-6">
            Join <span className="font-medium text-gray-900">10,000+</span> educators 🚀
          </p>
        </div>

        {/* AI-First Input */}
        <div className="px-4 py-6 border-b border-gray-200">
          <div className="relative">
            <div className="relative bg-white rounded-lg border-2 border-gray-200 p-3 focus-within:border-[#420D74] transition-colors">
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Tell Leapy what you want to create..."
                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none resize-none min-h-[80px] text-sm bg-transparent"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 rounded-lg transition-all active:bg-gray-100"
                      title="Voice input"
                    >
                      <Mic className="size-5 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg transition-all active:bg-gray-100"
                      title="Upload image"
                    >
                      <Camera className="size-5 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImportFlow(true)}
                      className="p-2 rounded-lg transition-all active:bg-gray-100"
                      title="Import community"
                    >
                      <Upload className="size-5 text-[#420D74]" />
                    </button>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!prompt.trim()}
                    className="bg-[#420D74] text-white px-6 transition-all active:scale-95"
                    size="lg"
                  >
                    <Sparkles className="size-4 mr-2" />
                    Go
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-700">Popular actions</h3>
            <button 
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="text-xs text-[#420D74] flex items-center gap-1"
            >
              {showQuickActions ? 'Show less' : 'View all'}
              <ChevronRight className={`size-3 transition-transform ${showQuickActions ? 'rotate-90' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {quickPrompts.slice(0, showQuickActions ? quickPrompts.length : 4).map((item, idx) => {
              const Icon = item.icon;
              
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      onStart(item.text, undefined, item.type);
                    }
                  }}
                  className="bg-white border border-gray-200 rounded-lg p-4 text-left active:bg-gray-50 transition-colors"
                >
                  <div className="size-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="size-5 text-[#420D74]" />
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {item.text}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {idx === 0 && 'Build engaged learning communities'}
                    {idx === 1 && 'Create courses in minutes with AI'}
                    {idx === 2 && 'Migrate your existing community'}
                    {idx === 3 && 'Learn how to get started'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="px-4 py-6 border-b border-gray-200">
          <h3 className="text-sm text-gray-700 mb-4">What you can do</h3>
          <div className="space-y-3">
            {[
              { icon: Users, label: 'Communities', desc: 'Create & manage learning communities', count: '10k+' },
              { icon: BookOpen, label: 'Courses', desc: 'AI-powered course creation', count: '50k+' },
              { icon: TrendingUp, label: 'Analytics', desc: 'Track engagement & growth', count: 'Real-time' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 active:bg-gray-50 transition-colors"
                >
                  <div className="size-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="size-6 text-[#420D74]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{feature.label}</h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{feature.count}</span>
                    </div>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonial / Social Proof */}
        <div className="px-4 mb-20">
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="size-10 bg-[#420D74] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                SM
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-2 italic">
                  "Leapy helped me launch my community in under 10 minutes. The AI suggestions were spot-on!"
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-900">Sarah Miller</p>
                  <span className="text-xs text-gray-500">•</span>
                  <p className="text-xs text-gray-600">Design Community Leader</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-3 border-t border-purple-200">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="size-4 text-purple-500 fill-purple-500" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-600">5.0 from 2,450+ reviews</span>
            </div>
          </div>
        </div>

        {/* Import Flow Sheet */}
        <MobileImportCommunityFlow
          open={showImportFlow}
          onClose={() => setShowImportFlow(false)}
          onComplete={handleImportComplete}
        />

        {/* Creation Flow Sheet */}
        <MobileCommunityCreationFlow
          open={showCreationFlow}
          onClose={() => setShowCreationFlow(false)}
          onComplete={handleCreateComplete}
        />
      </div>
    </div>
  );
}