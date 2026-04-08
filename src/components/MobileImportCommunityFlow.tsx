import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { 
  MessageSquare, Users, Download, CheckCircle2, ArrowRight, ArrowLeft,
  Sparkles, Hash, Loader2, Shield, Crown, Zap, Brain, BarChart3, X, ChevronRight
} from 'lucide-react';
import { CommunityData } from '../types';

const PLATFORMS = [
  { id: 'slack', name: 'Slack', icon: MessageSquare, color: 'bg-purple-100 text-purple-600', popular: true },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'bg-green-100 text-green-600', popular: true },
  { id: 'discord', name: 'Discord', icon: Users, color: 'bg-indigo-100 text-indigo-600', popular: true },
  { id: 'other', name: 'Other', icon: Download, color: 'bg-gray-100 text-gray-600', popular: false },
];

const MOCK_SLACK_WORKSPACES = [
  { id: 'ws1', name: 'Design Thinking Academy', domain: 'design-thinking.slack.com', members: 247, channels: 12, logo: '🎨' },
  { id: 'ws2', name: 'Product Management Hub', domain: 'pm-hub.slack.com', members: 189, channels: 8, logo: '📊' },
  { id: 'ws3', name: 'Tech Entrepreneurs', domain: 'tech-entrepreneurs.slack.com', members: 512, channels: 24, logo: '🚀' },
];

const MOCK_CHANNELS = [
  { id: 'ch1', name: 'general', members: 247, messages: 12543, category: 'announcement' },
  { id: 'ch2', name: 'introductions', members: 189, messages: 2341, category: 'discussion' },
  { id: 'ch3', name: 'design-critique', members: 156, messages: 8234, category: 'discussion' },
  { id: 'ch4', name: 'resources', members: 234, messages: 1456, category: 'resources' },
  { id: 'ch5', name: 'events', members: 198, messages: 876, category: 'announcement' },
  { id: 'ch6', name: 'job-board', members: 223, messages: 534, category: 'directory' },
];

type ImportStep = 'platform' | 'connect' | 'workspace' | 'channels' | 'settings' | 'ai' | 'processing';

interface MobileImportCommunityFlowProps {
  open: boolean;
  onClose: () => void;
  onComplete: (communityData: Partial<CommunityData>) => void;
}

export function MobileImportCommunityFlow({ open, onClose, onComplete }: MobileImportCommunityFlowProps) {
  const [step, setStep] = useState<ImportStep>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<typeof MOCK_SLACK_WORKSPACES[0] | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6']);
  const [isConnecting, setIsConnecting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setStep('connect');
  };

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setStep('workspace');
    }, 2000);
  };

  const handleWorkspaceSelect = (workspace: typeof MOCK_SLACK_WORKSPACES[0]) => {
    setSelectedWorkspace(workspace);
    setStep('channels');
  };

  const handleStartImport = () => {
    setStep('processing');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          const importedData: Partial<CommunityData> = {
            title: selectedWorkspace?.name || 'Imported Community',
            description: `Imported from ${selectedWorkspace?.domain}`,
            type: 'academy',
            spaces: MOCK_CHANNELS
              .filter(ch => selectedChannels.includes(ch.id))
              .map(ch => ({
                id: ch.id,
                name: ch.name,
                icon: ch.category === 'announcement' ? 'megaphone' : 
                      ch.category === 'resources' ? 'book' : 
                      ch.category === 'directory' ? 'users' : 'message-circle',
                type: ch.category as any,
                description: `${ch.messages.toLocaleString()} messages`,
              })),
          };
          onComplete(importedData);
          onClose();
          // Reset state
          setTimeout(() => {
            setStep('platform');
            setSelectedPlatform('');
            setSelectedWorkspace(null);
            setImportProgress(0);
          }, 500);
        }, 1000);
      }
      setImportProgress(progress);
    }, 400);
  };

  const renderStepIndicator = () => {
    const steps = ['Platform', 'Connect', 'Workspace', 'Channels', 'Settings', 'AI'];
    const currentIndex = steps.findIndex(s => s.toLowerCase() === step);
    
    return (
      <div className="flex items-center gap-1 px-4 mb-4">
        {steps.map((s, idx) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full ${
              idx <= currentIndex ? 'bg-[#420D74]' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">Import Community</SheetTitle>
            {step !== 'processing' && (
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="size-5" />
              </button>
            )}
          </div>
          <SheetDescription className="sr-only">
            Step-by-step wizard to import your community from Slack, WhatsApp, Discord or other platforms
          </SheetDescription>
          {step !== 'processing' && renderStepIndicator()}
        </SheetHeader>

        <div className="px-4 overflow-y-auto h-[calc(90vh-120px)] pb-6">
          {/* Platform Selection */}
          {step === 'platform' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-900 mb-3">Choose your platform</h3>
                <div className="space-y-3">
                  {PLATFORMS.map(platform => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => handlePlatformSelect(platform.id)}
                        className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-[#420D74] bg-white active:scale-95 transition-all flex items-center gap-4"
                      >
                        <div className={`size-12 ${platform.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="size-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-gray-900">{platform.name}</p>
                          {platform.popular && (
                            <Badge className="mt-1 bg-purple-100 text-[#420D74] text-xs border-0">Popular</Badge>
                          )}
                        </div>
                        <ChevronRight className="size-5 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Connect Step */}
          {step === 'connect' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center">
                <div className="size-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="size-8 text-purple-600" />
                </div>
                <h3 className="text-base text-gray-900 mb-2">Connect to Slack</h3>
                <p className="text-sm text-gray-600 mb-6">
                  We need permission to access your workspace
                </p>

                <div className="bg-white rounded-xl p-4 mb-6 text-left space-y-2">
                  <p className="text-xs text-gray-600 mb-3">TrueLeap will access:</p>
                  {[
                    'Workspace details & members',
                    'Channel names & descriptions',
                    'Message history',
                    'User profiles & roles'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                      <p className="text-xs text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full bg-[#420D74] hover:bg-[#5a1293]"
                  size="lg"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="size-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>Connect Workspace</>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-4 justify-center">
                  <Shield className="size-4" />
                  <p>Secure & encrypted</p>
                </div>
              </div>
            </div>
          )}

          {/* Workspace Selection */}
          {step === 'workspace' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Select workspace</h3>
              <div className="space-y-3">
                {MOCK_SLACK_WORKSPACES.map(workspace => (
                  <button
                    key={workspace.id}
                    onClick={() => handleWorkspaceSelect(workspace)}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-[#420D74] bg-white active:scale-95 transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{workspace.logo}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">{workspace.name}</h4>
                        <p className="text-xs text-gray-600 mb-2 truncate">{workspace.domain}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="size-3" />
                            <span>{workspace.members}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Hash className="size-3" />
                            <span>{workspace.channels} channels</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Channel Selection */}
          {step === 'channels' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Select channels</h3>
                <Badge variant="secondary" className="text-xs">
                  {selectedChannels.length} of {MOCK_CHANNELS.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {MOCK_CHANNELS.map(channel => (
                  <label
                    key={channel.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                      selectedChannels.includes(channel.id)
                        ? 'border-[#420D74] bg-purple-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <Checkbox
                      checked={selectedChannels.includes(channel.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedChannels([...selectedChannels, channel.id]);
                        } else {
                          setSelectedChannels(selectedChannels.filter(id => id !== channel.id));
                        }
                      }}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="size-4 text-gray-400 flex-shrink-0" />
                        <h4 className="font-medium text-gray-900">{channel.name}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{channel.members} members</span>
                        <span>•</span>
                        <span>{channel.messages.toLocaleString()} msgs</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <Button
                onClick={() => setStep('settings')}
                disabled={selectedChannels.length === 0}
                className="w-full bg-[#420D74] hover:bg-[#5a1293]"
                size="lg"
              >
                Continue
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Settings */}
          {step === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Import settings</h3>
              
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-3">Message history</p>
                  <div className="space-y-2">
                    {[
                      { value: '30', label: 'Last 30 days' },
                      { value: '90', label: 'Last 90 days' },
                      { value: 'all', label: 'All time' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                        <input
                          type="radio"
                          name="history"
                          value={option.value}
                          defaultChecked={option.value === '30'}
                          className="text-[#420D74]"
                        />
                        <span className="text-sm text-gray-900">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  {[
                    { label: 'Include files & attachments', checked: true },
                    { label: 'Auto-map roles', checked: true },
                    { label: 'Send invitation emails', checked: true }
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-start gap-3">
                      <Checkbox defaultChecked={item.checked} className="mt-0.5" />
                      <span className="text-sm text-gray-900">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep('ai')}
                className="w-full bg-[#420D74] hover:bg-[#5a1293]"
                size="lg"
              >
                Continue
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          )}

          {/* AI Enhancement */}
          {step === 'ai' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">AI enhancements</h3>
                <p className="text-xs text-gray-600">Let Leapy analyze and optimize your community</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { icon: BarChart3, label: 'Analyze trends', desc: 'Popular topics & engagement patterns', color: 'purple' },
                  { icon: Brain, label: 'Suggest courses', desc: 'Create courses from discussions', color: 'blue' },
                  { icon: Crown, label: 'Find moderators', desc: 'Identify helpful members', color: 'yellow' },
                  { icon: Zap, label: 'Create playbooks', desc: 'Automated engagement strategies', color: 'green' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <label
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl"
                    >
                      <Checkbox defaultChecked className="mt-0.5" />
                      <div className={`size-10 bg-${item.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`size-5 text-${item.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-0.5">{item.label}</p>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">AI runs in background</p>
                    <p className="text-xs text-gray-600">
                      Start using immediately. Insights ready in 5-10 minutes.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStartImport}
                className="w-full bg-[#420D74] hover:bg-[#5a1293]"
                size="lg"
              >
                <Sparkles className="size-4 mr-2" />
                Start Import
              </Button>
            </div>
          )}

          {/* Processing */}
          {step === 'processing' && (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <div className="size-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="size-10 text-purple-600 animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Importing Community</h3>
                <p className="text-sm text-gray-600">Please don&apos;t close this window</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-700">Progress</span>
                    <span className="text-[#420D74] font-medium">{Math.round(importProgress)}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Importing channels...', threshold: 20 },
                    { label: 'Importing members...', threshold: 40 },
                    { label: 'Analyzing history...', threshold: 60 },
                    { label: 'Setting up roles...', threshold: 80 },
                    { label: 'Finalizing...', threshold: 100 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      {importProgress >= item.threshold ? (
                        <CheckCircle2 className="size-5 text-green-600 flex-shrink-0" />
                      ) : importProgress >= (idx > 0 ? [20, 40, 60, 80][idx - 1] : 0) ? (
                        <Loader2 className="size-5 text-purple-600 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      )}
                      <span className={importProgress >= item.threshold ? 'text-gray-900' : 'text-gray-600'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {importProgress >= 100 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Import Complete!</p>
                      <p className="text-xs text-gray-600">Redirecting to dashboard...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}