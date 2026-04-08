import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { 
  MessageSquare, Users, Download, CheckCircle2, ArrowRight, ArrowLeft,
  Sparkles, Globe, Hash, Lock, Calendar, TrendingUp, X, ExternalLink,
  AlertCircle, Loader2, Shield, Crown, Zap, Brain, BarChart3
} from 'lucide-react';
import { CommunityData } from '../types';

// Platform icons/logos (we'll use Lucide icons as stand-ins)
const PLATFORMS = [
  { id: 'slack', name: 'Slack', icon: MessageSquare, color: 'bg-primary/10 text-primary', popular: true },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'bg-primary/10 text-primary', popular: true },
  { id: 'discord', name: 'Discord', icon: Users, color: 'bg-primary/10 text-primary', popular: true },
  { id: 'facebook', name: 'Facebook Groups', icon: Users, color: 'bg-accent text-accent-foreground', popular: false },
  { id: 'linkedin', name: 'LinkedIn Groups', icon: Users, color: 'bg-accent text-accent-foreground', popular: false },
  { id: 'telegram', name: 'Telegram', icon: MessageSquare, color: 'bg-accent text-accent-foreground', popular: false },
  { id: 'other', name: 'Other / CSV Import', icon: Download, color: 'bg-muted text-muted-foreground', popular: false },
];

// Mock Slack data
const MOCK_SLACK_WORKSPACES = [
  {
    id: 'ws1',
    name: 'Design Thinking Academy',
    domain: 'design-thinking.slack.com',
    members: 247,
    channels: 12,
    activity: 'high',
    logo: '🎨'
  },
  {
    id: 'ws2',
    name: 'Product Management Hub',
    domain: 'pm-hub.slack.com',
    members: 189,
    channels: 8,
    activity: 'medium',
    logo: '📊'
  },
  {
    id: 'ws3',
    name: 'Tech Entrepreneurs Network',
    domain: 'tech-entrepreneurs.slack.com',
    members: 512,
    channels: 24,
    activity: 'high',
    logo: '🚀'
  },
];

const MOCK_CHANNELS = [
  { id: 'ch1', name: 'general', members: 247, messages: 12543, type: 'public', category: 'announcement' },
  { id: 'ch2', name: 'introductions', members: 189, messages: 2341, type: 'public', category: 'discussion' },
  { id: 'ch3', name: 'design-critique', members: 156, messages: 8234, type: 'public', category: 'discussion' },
  { id: 'ch4', name: 'resources', members: 234, messages: 1456, type: 'public', category: 'resources' },
  { id: 'ch5', name: 'events', members: 198, messages: 876, type: 'public', category: 'announcement' },
  { id: 'ch6', name: 'job-board', members: 223, messages: 534, type: 'public', category: 'directory' },
  { id: 'ch7', name: 'random', members: 201, messages: 6789, type: 'public', category: 'discussion' },
  { id: 'ch8', name: 'announcements', members: 247, messages: 234, type: 'public', category: 'announcement' },
];

type ImportStep = 'platform' | 'connect' | 'workspace' | 'channels' | 'members' | 'preview' | 'enhance' | 'processing';

interface ImportCommunityDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (communityData: Partial<CommunityData>) => void;
}

export function ImportCommunityDialog({ open, onClose, onComplete }: ImportCommunityDialogProps) {
  const [step, setStep] = useState<ImportStep>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<typeof MOCK_SLACK_WORKSPACES[0] | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');
  const [importSettings, setImportSettings] = useState({
    messageHistory: '30',
    includeFiles: true,
    autoMapRoles: true,
    inviteMembers: true,
  });
  const [aiEnhancement, setAiEnhancement] = useState({
    analyzeTrends: true,
    suggestCourses: true,
    identifyModerators: true,
    createPlaybooks: true,
  });

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
  };

  const handleConnectPlatform = () => {
    setIsConnecting(true);
    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false);
      setStep('workspace');
    }, 2000);
  };

  const handleWorkspaceSelect = (workspace: typeof MOCK_SLACK_WORKSPACES[0]) => {
    setSelectedWorkspace(workspace);
    setCommunityName(workspace.name);
    setCommunityDescription(`Imported from ${workspace.domain}`);
  };

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleSelectAllChannels = () => {
    if (selectedChannels.length === MOCK_CHANNELS.length) {
      setSelectedChannels([]);
    } else {
      setSelectedChannels(MOCK_CHANNELS.map(ch => ch.id));
    }
  };

  const handleStartImport = () => {
    setStep('processing');
    
    // Simulate import progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Complete import and redirect to community preview
        setTimeout(() => {
          const importedCommunityData: Partial<CommunityData> = {
            title: communityName,
            description: communityDescription,
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
                description: `Imported from Slack - ${ch.messages} messages`,
              })),
            gamification: {
              leaderboard: true,
              badges: true,
              points: true,
            }
          };
          onComplete(importedCommunityData);
          onClose();
        }, 1000);
      }
      setImportProgress(progress);
    }, 300);
  };

  const renderPlatformSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-gray-900 mb-2">Popular Platforms</h3>
        <div className="grid grid-cols-3 gap-3">
          {PLATFORMS.filter(p => p.popular).map(platform => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformSelect(platform.id)}
                className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedPlatform === platform.id
                    ? 'border-[#420D74] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`size-12 ${platform.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                  <Icon className="size-6" />
                </div>
                <p className="text-sm text-gray-900 text-center">{platform.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm text-gray-900 mb-2">Other Platforms</h3>
        <div className="grid grid-cols-4 gap-3">
          {PLATFORMS.filter(p => !p.popular).map(platform => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                onClick={() => handlePlatformSelect(platform.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedPlatform === platform.id
                    ? 'border-[#420D74] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`size-10 ${platform.color} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
                  <Icon className="size-5" />
                </div>
                <p className="text-xs text-gray-900 text-center">{platform.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={() => setStep('connect')}
          disabled={!selectedPlatform}
          className="bg-[#420D74] hover:bg-[#5a1293]"
        >
          Continue
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderConnectStep = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
        <div className="size-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="size-8 text-purple-600" />
        </div>
        <h3 className="text-lg text-gray-900 mb-2">Connect to Slack</h3>
        <p className="text-sm text-gray-600 mb-6">
          We'll need permission to access your Slack workspace to import your community data.
        </p>

        <div className="bg-white rounded-lg p-4 mb-6 text-left">
          <p className="text-xs text-gray-600 mb-3">TrueLeap will be able to:</p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-green-600 mt-0.5" />
              <p className="text-xs text-gray-700">View workspace details and member list</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-green-600 mt-0.5" />
              <p className="text-xs text-gray-700">Read channel names and descriptions</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-green-600 mt-0.5" />
              <p className="text-xs text-gray-700">Access message history (configurable duration)</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-green-600 mt-0.5" />
              <p className="text-xs text-gray-700">View user profiles and roles</p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleConnectPlatform}
          disabled={isConnecting}
          className="bg-[#420D74] hover:bg-[#5a1293] w-full"
          size="lg"
        >
          {isConnecting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Connecting to Slack...
            </>
          ) : (
            <>
              <ExternalLink className="size-4 mr-2" />
              Connect Slack Workspace
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Shield className="size-4" />
        <p>Your data is encrypted and secure. We never share your information.</p>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep('platform')}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );

  const renderWorkspaceSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-gray-900 mb-2">Select Workspace to Import</h3>
        <p className="text-xs text-gray-600 mb-4">Choose which Slack workspace you'd like to import</p>
        
        <div className="space-y-3">
          {MOCK_SLACK_WORKSPACES.map(workspace => (
            <button
              key={workspace.id}
              onClick={() => handleWorkspaceSelect(workspace)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedWorkspace?.id === workspace.id
                  ? 'border-[#420D74] bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{workspace.logo}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm text-gray-900">{workspace.name}</h4>
                    {workspace.activity === 'high' && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        High Activity
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{workspace.domain}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="size-3" />
                      <span>{workspace.members} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="size-3" />
                      <span>{workspace.channels} channels</span>
                    </div>
                  </div>
                </div>
                {selectedWorkspace?.id === workspace.id && (
                  <CheckCircle2 className="size-5 text-[#420D74]" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep('connect')}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={() => setStep('channels')}
          disabled={!selectedWorkspace}
          className="bg-[#420D74] hover:bg-[#5a1293]"
        >
          Continue
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderChannelSelection = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm text-gray-900">Select Channels to Import</h3>
            <p className="text-xs text-gray-600 mt-1">
              {selectedChannels.length} of {MOCK_CHANNELS.length} channels selected
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSelectAllChannels}>
            {selectedChannels.length === MOCK_CHANNELS.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {MOCK_CHANNELS.map(channel => (
              <div
                key={channel.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedChannels.includes(channel.id)
                    ? 'border-[#420D74] bg-purple-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedChannels.includes(channel.id)}
                    onCheckedChange={() => handleChannelToggle(channel.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="size-4 text-gray-400" />
                      <h4 className="text-sm text-gray-900">{channel.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {channel.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="size-3" />
                        <span>{channel.members} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="size-3" />
                        <span>{channel.messages.toLocaleString()} messages</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep('workspace')}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={() => setStep('members')}
          disabled={selectedChannels.length === 0}
          className="bg-[#420D74] hover:bg-[#5a1293]"
        >
          Continue
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderMemberSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-gray-900 mb-4">Import Settings</h3>
        
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm text-gray-900 mb-3">Message History</h4>
            <div className="space-y-2">
              {['30', '90', 'all'].map(option => (
                <label key={option} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="messageHistory"
                    value={option}
                    checked={importSettings.messageHistory === option}
                    onChange={(e) => setImportSettings(prev => ({ ...prev, messageHistory: e.target.value }))}
                    className="text-[#420D74]"
                  />
                  <span className="text-sm text-gray-700">
                    {option === '30' ? 'Last 30 days' : option === '90' ? 'Last 90 days' : 'All time'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="text-sm text-gray-900">Additional Options</h4>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={importSettings.includeFiles}
                onCheckedChange={(checked) => 
                  setImportSettings(prev => ({ ...prev, includeFiles: checked as boolean }))
                }
              />
              <div>
                <p className="text-sm text-gray-900">Include files and attachments</p>
                <p className="text-xs text-gray-600">Import images, documents, and other files shared in channels</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={importSettings.autoMapRoles}
                onCheckedChange={(checked) => 
                  setImportSettings(prev => ({ ...prev, autoMapRoles: checked as boolean }))
                }
              />
              <div>
                <p className="text-sm text-gray-900">Auto-map roles and permissions</p>
                <p className="text-xs text-gray-600">Slack admins become community admins, etc.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={importSettings.inviteMembers}
                onCheckedChange={(checked) => 
                  setImportSettings(prev => ({ ...prev, inviteMembers: checked as boolean }))
                }
              />
              <div>
                <p className="text-sm text-gray-900">Send invitation emails to members</p>
                <p className="text-xs text-gray-600">Automatically invite all workspace members to join on TrueLeap</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep('channels')}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={() => setStep('preview')}
          className="bg-[#420D74] hover:bg-[#5a1293]"
        >
          Continue
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-gray-900 mb-4">Import Preview</h3>
        
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm text-gray-900 mb-3">Community Details</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Community Name</label>
                <Input
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  placeholder="Enter community name"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Description</label>
                <Textarea
                  value={communityDescription}
                  onChange={(e) => setCommunityDescription(e.target.value)}
                  placeholder="Enter community description"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="size-4 text-purple-600" />
              Import Summary
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Channels</p>
                <p className="text-2xl text-gray-900">{selectedChannels.length}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Members</p>
                <p className="text-2xl text-gray-900">{selectedWorkspace?.members || 0}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Messages</p>
                <p className="text-2xl text-gray-900">
                  {MOCK_CHANNELS
                    .filter(ch => selectedChannels.includes(ch.id))
                    .reduce((sum, ch) => sum + ch.messages, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">History</p>
                <p className="text-2xl text-gray-900">
                  {importSettings.messageHistory === '30' ? '30d' : 
                   importSettings.messageHistory === '90' ? '90d' : 'All'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm text-gray-900 mb-3">Selected Channels</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {MOCK_CHANNELS
                .filter(ch => selectedChannels.includes(ch.id))
                .map(channel => (
                  <div key={channel.id} className="flex items-center gap-2 text-xs text-gray-700 py-1">
                    <Hash className="size-3 text-gray-400" />
                    <span>{channel.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{channel.messages.toLocaleString()} messages</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep('members')}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={() => setStep('enhance')}
          className="bg-[#420D74] hover:bg-[#5a1293]"
        >
          Continue
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderAIEnhancement = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm text-gray-900 mb-2">AI-Powered Enhancements</h3>
        <p className="text-xs text-gray-600 mb-4">
          Let Leapy AI analyze your imported community and provide intelligent recommendations
        </p>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
            <Checkbox
              checked={aiEnhancement.analyzeTrends}
              onCheckedChange={(checked) => 
                setAiEnhancement(prev => ({ ...prev, analyzeTrends: checked as boolean }))
              }
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="size-4 text-purple-600" />
                <p className="text-sm text-gray-900">Analyze conversation trends</p>
              </div>
              <p className="text-xs text-gray-600">
                Identify popular topics, peak engagement times, and trending discussions
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
            <Checkbox
              checked={aiEnhancement.suggestCourses}
              onCheckedChange={(checked) => 
                setAiEnhancement(prev => ({ ...prev, suggestCourses: checked as boolean }))
              }
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="size-4 text-purple-600" />
                <p className="text-sm text-gray-900">Suggest course opportunities</p>
              </div>
              <p className="text-xs text-gray-600">
                AI will recommend courses based on common questions and popular topics
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
            <Checkbox
              checked={aiEnhancement.identifyModerators}
              onCheckedChange={(checked) => 
                setAiEnhancement(prev => ({ ...prev, identifyModerators: checked as boolean }))
              }
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="size-4 text-purple-600" />
                <p className="text-sm text-gray-900">Identify potential moderators</p>
              </div>
              <p className="text-xs text-gray-600">
                Find highly active and helpful members who could become moderators
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
            <Checkbox
              checked={aiEnhancement.createPlaybooks}
              onCheckedChange={(checked) => 
                setAiEnhancement(prev => ({ ...prev, createPlaybooks: checked as boolean }))
              }
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="size-4 text-purple-600" />
                <p className="text-sm text-gray-900">Create engagement playbooks</p>
              </div>
              <p className="text-xs text-gray-600">
                Generate automated workflows and engagement strategies based on your community's activity
              </p>
            </div>
          </label>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <Sparkles className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 mb-1">AI Analysis will run in the background</p>
              <p className="text-xs text-gray-600">
                You can start using your community immediately. AI insights will be available in the AI Hub within 5-10 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep('preview')}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleStartImport}
          className="bg-[#420D74] hover:bg-[#5a1293]"
        >
          <Sparkles className="size-4 mr-2" />
          Start Import
        </Button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="space-y-6 py-8">
      <div className="text-center">
        <div className="size-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="size-8 text-purple-600 animate-spin" />
        </div>
        <h3 className="text-lg text-gray-900 mb-2">Importing Your Community</h3>
        <p className="text-sm text-gray-600">
          This may take a few minutes. Please don't close this window.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-700">Import Progress</span>
            <span className="text-[#420D74] font-medium">{Math.round(importProgress)}%</span>
          </div>
          <Progress value={importProgress} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            {importProgress > 20 ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : (
              <Loader2 className="size-5 text-purple-600 animate-spin" />
            )}
            <span className={importProgress > 20 ? 'text-gray-900' : 'text-gray-600'}>
              Importing channels...
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {importProgress > 40 ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : importProgress > 20 ? (
              <Loader2 className="size-5 text-purple-600 animate-spin" />
            ) : (
              <div className="size-5 rounded-full border-2 border-gray-300" />
            )}
            <span className={importProgress > 40 ? 'text-gray-900' : 'text-gray-600'}>
              Importing members...
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {importProgress > 60 ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : importProgress > 40 ? (
              <Loader2 className="size-5 text-purple-600 animate-spin" />
            ) : (
              <div className="size-5 rounded-full border-2 border-gray-300" />
            )}
            <span className={importProgress > 60 ? 'text-gray-900' : 'text-gray-600'}>
              Analyzing message history...
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {importProgress > 80 ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : importProgress > 60 ? (
              <Loader2 className="size-5 text-purple-600 animate-spin" />
            ) : (
              <div className="size-5 rounded-full border-2 border-gray-300" />
            )}
            <span className={importProgress > 80 ? 'text-gray-900' : 'text-gray-600'}>
              Setting up roles and permissions...
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {importProgress >= 100 ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : importProgress > 80 ? (
              <Loader2 className="size-5 text-purple-600 animate-spin" />
            ) : (
              <div className="size-5 rounded-full border-2 border-gray-300" />
            )}
            <span className={importProgress >= 100 ? 'text-gray-900' : 'text-gray-600'}>
              Finalizing setup...
            </span>
          </div>
        </div>
      </div>

      {importProgress >= 100 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-900 font-medium">Import Complete!</p>
              <p className="text-xs text-gray-600">Redirecting to your community dashboard...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl text-gray-900">Import Existing Community</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {step === 'platform' && 'Choose your platform'}
                {step === 'connect' && 'Connect your workspace'}
                {step === 'workspace' && 'Select workspace'}
                {step === 'channels' && 'Choose channels to import'}
                {step === 'members' && 'Configure import settings'}
                {step === 'preview' && 'Review and confirm'}
                {step === 'enhance' && 'AI enhancements'}
                {step === 'processing' && 'Importing your community'}
              </p>
            </div>
            {step !== 'processing' && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="size-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="py-4">
            {step === 'platform' && renderPlatformSelection()}
            {step === 'connect' && renderConnectStep()}
            {step === 'workspace' && renderWorkspaceSelection()}
            {step === 'channels' && renderChannelSelection()}
            {step === 'members' && renderMemberSettings()}
            {step === 'preview' && renderPreview()}
            {step === 'enhance' && renderAIEnhancement()}
            {step === 'processing' && renderProcessing()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}