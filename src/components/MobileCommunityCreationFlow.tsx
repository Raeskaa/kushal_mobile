import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  ArrowLeft, ArrowRight, Check, Sparkles, Users, Globe, Lock, BookOpen, MessageSquare,
  Lightbulb, Users as UsersIcon, Target, Zap, MessageCircle, Mic, X, Loader2, CheckCircle2
} from 'lucide-react';
import { LeapyIcon } from './LeapyIcon';
import { CommunityData } from '../types';

interface MobileCommunityCreationFlowProps {
  open: boolean;
  onClose: () => void;
  onComplete: (communityData: Partial<CommunityData>) => void;
}

type Step = 'intro' | 'question1' | 'question2' | 'question3' | 'ai-thinking' | 'preview';

const AI_SUGGESTIONS = {
  question1: [
    "Design Thinking Practitioners",
    "Product Managers & Leaders",
    "UX Designers Community",
    "Tech Entrepreneurs Hub"
  ],
  question2: [
    "To learn best practices and share experiences",
    "To network and find collaboration opportunities",
    "To get mentorship and career guidance",
    "To build a business around my expertise"
  ],
  question3: [
    "Beginners looking to learn",
    "Professionals wanting to level up",
    "Experts seeking to share knowledge",
    "Mix of all experience levels"
  ]
};

export function MobileCommunityCreationFlow({ open, onClose, onComplete }: MobileCommunityCreationFlowProps) {
  const [step, setStep] = useState<Step>('intro');
  const [showAIHelp, setShowAIHelp] = useState(true);
  
  // User answers
  const [communityName, setCommunityName] = useState('');
  const [communityGoal, setCommunityGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  
  // AI state
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [generatedData, setGeneratedData] = useState<Partial<CommunityData> | null>(null);

  const currentQuestion = step === 'question1' ? 1 : step === 'question2' ? 2 : step === 'question3' ? 3 : 0;
  const totalQuestions = 3;

  const handleSuggestionClick = (suggestion: string) => {
    if (step === 'question1') {
      setCommunityName(suggestion);
    } else if (step === 'question2') {
      setCommunityGoal(suggestion);
    } else if (step === 'question3') {
      setTargetAudience(suggestion);
    }
  };

  const handleNext = () => {
    if (step === 'intro') {
      setStep('question1');
    } else if (step === 'question1' && communityName.trim()) {
      setStep('question2');
    } else if (step === 'question2' && communityGoal.trim()) {
      setStep('question3');
    } else if (step === 'question3' && targetAudience.trim()) {
      // Generate community structure
      setStep('ai-thinking');
      setIsAIThinking(true);
      
      // Simulate AI generation
      setTimeout(() => {
        const generated: Partial<CommunityData> = {
          title: communityName,
          description: communityGoal,
          type: 'academy',
          spaces: [
            {
              id: '1',
              name: 'welcome',
              icon: 'wave',
              type: 'announcement',
              description: 'Welcome new members and community guidelines'
            },
            {
              id: '2',
              name: 'introductions',
              icon: 'users',
              type: 'discussion',
              description: 'Members introduce themselves and connect'
            },
            {
              id: '3',
              name: 'general-discussion',
              icon: 'message-circle',
              type: 'discussion',
              description: 'Open discussions about ' + communityName.toLowerCase()
            },
            {
              id: '4',
              name: 'resources',
              icon: 'book',
              type: 'resources',
              description: 'Helpful resources and learning materials'
            },
            {
              id: '5',
              name: 'events',
              icon: 'calendar',
              type: 'announcement',
              description: 'Community events and meetups'
            }
          ],
          gamification: {
            leaderboard: true,
            badges: true,
            points: true
          }
        };
        
        setGeneratedData(generated);
        setIsAIThinking(false);
        setStep('preview');
      }, 3000);
    }
  };

  const handleBack = () => {
    if (step === 'question1') {
      setStep('intro');
    } else if (step === 'question2') {
      setStep('question1');
    } else if (step === 'question3') {
      setStep('question2');
    } else if (step === 'preview') {
      setStep('question3');
    }
  };

  const handleComplete = () => {
    if (generatedData) {
      onComplete(generatedData);
      onClose();
      // Reset state
      setTimeout(() => {
        setStep('intro');
        setCommunityName('');
        setCommunityGoal('');
        setTargetAudience('');
        setGeneratedData(null);
      }, 500);
    }
  };

  const renderProgressBar = () => {
    if (step === 'intro' || step === 'ai-thinking' || step === 'preview') return null;
    
    const progress = (currentQuestion / totalQuestions) * 100;
    
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-600">Question {currentQuestion} of {totalQuestions}</p>
          <p className="text-xs text-[#420D74]">{Math.round(progress)}%</p>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#420D74] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  const renderAIHelper = (suggestions: string[]) => {
    if (!showAIHelp) return null;

    return (
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="size-8 bg-[#420D74] rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="size-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 mb-1">Leapy AI suggests:</p>
            <p className="text-xs text-gray-600">Tap any suggestion to use it</p>
          </div>
          <button 
            onClick={() => setShowAIHelp(false)}
            className="p-1 hover:bg-purple-100 rounded-lg"
          >
            <X className="size-4 text-gray-600" />
          </button>
        </div>
        <div className="space-y-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-3 py-2.5 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-[#420D74] flex-shrink-0" />
                <span className="text-sm text-gray-900">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0 flex flex-col">
        <SheetHeader className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl">Create Your Community</SheetTitle>
              <p className="text-xs text-gray-600 mt-1">AI will help you every step</p>
            </div>
            {step !== 'ai-thinking' && (
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="size-5" />
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Intro Step */}
          {step === 'intro' && (
            <div className="space-y-6 text-center py-8">
              <LeapyIcon className="size-20 mx-auto" />
              
              <div>
                <h2 className="text-lg text-gray-900 mb-2">
                  Let's build your community together
                </h2>
                <p className="text-gray-600">
                  I'll ask you 3 simple questions and create the perfect structure for your community
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Users, title: "Tell me about your community", desc: "What's it about and who's it for?" },
                  { icon: Target, title: "Define your goals", desc: "What do you want to achieve?" },
                  { icon: Zap, title: "Get AI-powered setup", desc: "I'll create everything for you" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 text-left p-4 bg-white border border-gray-200 rounded-xl">
                      <div className="size-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="size-5 text-[#420D74]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-[#420D74] hover:bg-[#5a1293]"
                size="lg"
              >
                <Sparkles className="size-4 mr-2" />
                Let's Start
              </Button>
            </div>
          )}

          {/* Question 1 */}
          {step === 'question1' && (
            <div className="space-y-4">
              {renderProgressBar()}
              
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 bg-[#420D74] rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base text-gray-900 mb-1">
                      What's your community about?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Give your community a name that reflects its purpose
                    </p>
                  </div>
                </div>
              </div>

              {renderAIHelper(AI_SUGGESTIONS.question1)}

              <div>
                <label className="text-sm text-gray-900 mb-2 block">
                  Community Name
                </label>
                <div className="relative">
                  <Input
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    placeholder="e.g., Design Thinking Practitioners"
                    className="text-base pr-10"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-lg">
                    <Mic className="size-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={!communityName.trim()}
                className="w-full bg-[#420D74] hover:bg-[#5a1293]"
                size="lg"
              >
                Continue
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Question 2 */}
          {step === 'question2' && (
            <div className="space-y-4">
              {renderProgressBar()}
              
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 bg-[#420D74] rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base text-gray-900 mb-1">
                      What's the main goal?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Why are people joining this community?
                    </p>
                  </div>
                </div>
              </div>

              {renderAIHelper(AI_SUGGESTIONS.question2)}

              <div>
                <label className="text-sm text-gray-900 mb-2 block">
                  Community Goal
                </label>
                <div className="relative">
                  <Textarea
                    value={communityGoal}
                    onChange={(e) => setCommunityGoal(e.target.value)}
                    placeholder="e.g., To learn best practices and share experiences"
                    className="text-base resize-none"
                    rows={3}
                  />
                  <button className="absolute right-3 top-3 p-1.5 hover:bg-gray-100 rounded-lg">
                    <Mic className="size-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!communityGoal.trim()}
                  className="flex-1 bg-[#420D74] hover:bg-[#5a1293]"
                  size="lg"
                >
                  Continue
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Question 3 */}
          {step === 'question3' && (
            <div className="space-y-4">
              {renderProgressBar()}
              
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 bg-[#420D74] rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base text-gray-900 mb-1">
                      Who's your target audience?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Describe who you're building this for
                    </p>
                  </div>
                </div>
              </div>

              {renderAIHelper(AI_SUGGESTIONS.question3)}

              <div>
                <label className="text-sm text-gray-900 mb-2 block">
                  Target Audience
                </label>
                <div className="relative">
                  <Textarea
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Professionals wanting to level up"
                    className="text-base resize-none"
                    rows={3}
                  />
                  <button className="absolute right-3 top-3 p-1.5 hover:bg-gray-100 rounded-lg">
                    <Mic className="size-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!targetAudience.trim()}
                  className="flex-1 bg-[#420D74] hover:bg-[#5a1293]"
                  size="lg"
                >
                  <Sparkles className="size-4 mr-2" />
                  Generate
                </Button>
              </div>
            </div>
          )}

          {/* AI Thinking */}
          {step === 'ai-thinking' && (
            <div className="space-y-6 text-center py-12">
              <div className="size-20 bg-[#420D74] rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="size-10 text-white animate-spin" />
              </div>
              
              <div>
                <h2 className="text-lg text-gray-900 mb-2">
                  AI is creating your community...
                </h2>
                <p className="text-gray-600">
                  Analyzing your inputs and generating the perfect structure
                </p>
              </div>

              <div className="space-y-3 max-w-xs mx-auto">
                {[
                  { label: "Designing community structure", done: true },
                  { label: "Creating channels & spaces", done: true },
                  { label: "Setting up engagement features", done: false },
                  { label: "Personalizing recommendations", done: false }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-left">
                    {item.done ? (
                      <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Loader2 className="size-5 text-purple-600 animate-spin flex-shrink-0" />
                    )}
                    <span className={`text-sm ${item.done ? 'text-gray-900' : 'text-gray-600'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {step === 'preview' && generatedData && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">
                      Your community is ready!
                    </p>
                    <p className="text-xs text-gray-600">
                      Review the structure and launch when ready
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-base text-gray-900 mb-1">{generatedData.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{generatedData.description}</p>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Type</p>
                    <p className="text-sm text-gray-900 capitalize">{generatedData.type}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Channels</p>
                    <p className="text-sm text-gray-900">{generatedData.spaces?.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Features</p>
                    <p className="text-sm text-gray-900">Active</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm text-gray-900 mb-3">Channels Created:</h4>
                  <div className="space-y-2">
                    {generatedData.spaces?.map((space, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="size-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="size-4 text-[#420D74]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">#{space.name}</p>
                          <p className="text-xs text-gray-600">{space.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900 mb-1">
                      AI-Powered Features Enabled
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>✓ Gamification (badges, points, leaderboard)</li>
                      <li>✓ Smart content recommendations</li>
                      <li>✓ Automated engagement tracking</li>
                      <li>✓ AI moderation assistance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-[#420D74] hover:bg-[#5a1293]"
                  size="lg"
                >
                  <CheckCircle2 className="size-4 mr-2" />
                  Launch Community
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}