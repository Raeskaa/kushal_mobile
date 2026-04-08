import { 
  X, ChevronLeft, ChevronRight, 
  Sliders, Grid, Users, Bell, UserCircle, Shield, Lock, Eye, EyeOff, Cpu, CreditCard,
  Globe, Clock, Mail, Check, AlertCircle, Plus, Trash2, Smartphone, Laptop,
  Search, Copy, ExternalLink, Download, AlertTriangle
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsSection = 
  | 'general' 
  | 'integrations' 
  | 'connected_accounts' 
  | 'notifications' 
  | 'profile' 
  | 'security' 
  | 'privacy' 
  | 'accessibility' 
  | 'advanced' 
  | 'billing';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null);

  // Reset section when modal closes
  useEffect(() => {
    if (!isOpen) setActiveSection(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBack = () => {
    setActiveSection(null);
  };

  const getTitle = () => {
    switch (activeSection) {
      case 'general': return 'General';
      case 'integrations': return 'Integrations';
      case 'connected_accounts': return 'Connected Accounts';
      case 'notifications': return 'Notifications';
      case 'profile': return 'Profile';
      case 'security': return 'Security';
      case 'privacy': return 'Privacy';
      case 'accessibility': return 'Accessibility';
      case 'advanced': return 'Advanced';
      case 'billing': return 'Billing';
      default: return 'Settings';
    }
  };

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="absolute inset-x-0 bottom-0 top-0 sm:top-12 bg-gray-50 text-gray-900 flex flex-col animate-slide-up sm:rounded-t-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-4 py-4 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10 shrink-0">
          <button 
            onClick={activeSection ? handleBack : onClose}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 transition-colors active:scale-95"
          >
            {activeSection ? <ChevronLeft className="size-6" /> : <X className="size-6" />}
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900">
             {getTitle()}
          </h2>

          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
           {activeSection ? (
             <div className="min-h-full bg-gray-50 animate-in slide-in-from-right duration-300">
               <SectionContent section={activeSection} />
             </div>
           ) : (
             <div className="py-2">
               <SettingsMenu onSelect={setActiveSection} />
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function SettingsMenu({ onSelect }: { onSelect: (s: SettingsSection) => void }) {
  const menuItems: { id: SettingsSection; icon: any; label: string }[] = [
    { id: 'general', icon: Sliders, label: 'General' },
    { id: 'integrations', icon: Grid, label: 'Integrations' },
    { id: 'connected_accounts', icon: Users, label: 'Connected Accounts' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'profile', icon: UserCircle, label: 'Profile' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'privacy', icon: Lock, label: 'Privacy' },
    { id: 'accessibility', icon: Eye, label: 'Accessibility' },
    { id: 'advanced', icon: Cpu, label: 'Advanced' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
  ];

  return (
    <div className="bg-white border-y border-gray-100 divide-y divide-gray-100">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              <item.icon className="size-5" />
            </div>
            <span className="text-base font-medium text-gray-900">{item.label}</span>
          </div>
          <ChevronRight className="size-5 text-gray-300 group-hover:text-gray-400" />
        </button>
      ))}
    </div>
  );
}

function SectionContent({ section }: { section: SettingsSection }) {
  switch (section) {
    case 'general': return <GeneralSettings />;
    case 'integrations': return <IntegrationsSettings />;
    case 'connected_accounts': return <ConnectedAccountsSettings />;
    case 'notifications': return <NotificationsSettings />;
    case 'profile': return <ProfileSettings />;
    case 'security': return <SecuritySettings />;
    case 'privacy': return <PrivacySettings />;
    case 'accessibility': return <AccessibilitySettings />;
    case 'advanced': return <AdvancedSettings />;
    case 'billing': return <BillingSettings />;
    default: return null;
  }
}

// --- Individual Sections ---

function GeneralSettings() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="p-4 space-y-6 flex-1">
        <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Workspace Name</label>
            <input 
              type="text" 
              defaultValue="Design Team" 
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74] text-base"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Language</label>
            <div className="relative">
              <select className="w-full px-3 py-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74] text-base">
                <option>English (United States)</option>
                <option>English (United Kingdom)</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
             <div className="relative">
              <select className="w-full px-3 py-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74] text-base">
                <option>(GMT-08:00) Pacific Time</option>
                <option>(GMT-05:00) Eastern Time</option>
                <option>(GMT-06:00) Central Time</option>
                <option>(GMT-07:00) Mountain Time</option>
                <option>(GMT+00:00) UTC</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Save Button */}
      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10">
        <button className="w-full py-3 bg-[#420D74] hover:bg-[#531091] text-white rounded-xl text-base font-semibold active:scale-[0.98] transition-all shadow-sm">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function IntegrationsSettings() {
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const integrations = [
    { name: 'Google Drive', icon: 'https://cdn.simpleicons.org/google', connected: true, desc: 'Store and share files directly from your drive.' },
    { name: 'Slack', icon: 'https://cdn.simpleicons.org/slack', connected: true, desc: 'Receive notifications and updates in your channels.' },
    { name: 'Notion', icon: 'https://cdn.simpleicons.org/notion', connected: false, desc: 'Sync your workspace docs and wikis.' },
    { name: 'Figma', icon: 'https://cdn.simpleicons.org/figma', connected: false, desc: 'Embed files and prototypes.' },
    { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github', connected: false, desc: 'Link pull requests and repositories.' },
    { name: 'Discord', icon: 'https://cdn.simpleicons.org/discord', connected: false, desc: 'Community management and chat.' },
  ];

  const filtered = integrations.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74]"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map((app) => (
            <button
              key={app.name}
              onClick={() => setSelectedApp(app)}
              className="w-full bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                  <img src={app.icon} alt={app.name} className="size-full object-contain" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{app.name}</div>
                  <div className={`text-xs mt-0.5 ${app.connected ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                    {app.connected ? 'Connected' : 'Not connected'}
                  </div>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Detail Sheet/Modal Overlay */}
      {selectedApp && (
        <div className="fixed inset-0 z-[80] flex flex-col justify-end sm:justify-center items-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className="bg-white w-full sm:w-[90%] sm:max-w-md sm:rounded-2xl rounded-t-2xl relative z-10 animate-slide-up p-6">
            <div className="flex flex-col items-center text-center gap-4 mb-6">
               <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center p-3 shadow-sm border border-gray-100">
                  <img src={selectedApp.icon} alt={selectedApp.name} className="size-full object-contain" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-gray-900">{selectedApp.name}</h3>
                 <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">{selectedApp.desc}</p>
               </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedApp(null)}
                className={`w-full py-3 rounded-xl font-semibold text-base transition-colors ${
                  selectedApp.connected 
                  ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                  : 'bg-[#420D74] text-white hover:bg-[#531091]'
                }`}
              >
                {selectedApp.connected ? 'Disconnect Integration' : 'Connect Integration'}
              </button>
              <button 
                onClick={() => setSelectedApp(null)}
                className="w-full py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ConnectedAccountsSettings() {
  return (
    <div className="p-4 space-y-6">
      {/* Duplicate Account Detection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm font-medium">
           <AlertTriangle className="size-4 shrink-0" />
           <span>Possible duplicate detected</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4 shadow-sm">
           <div className="text-sm font-semibold text-gray-900">Merge Accounts</div>
           <p className="text-xs text-gray-500 leading-relaxed">
             We found another account matching your device profile. Select which data to keep.
           </p>
           
           <div className="flex flex-col gap-3">
              {/* Card 1: This Account */}
              <div className="border border-[#420D74] bg-purple-50/30 rounded-lg p-4 relative">
                 <div className="absolute top-4 right-4 text-[#420D74]">
                    <div className="bg-[#420D74] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">CURRENT</div>
                 </div>
                 <div className="text-sm font-bold text-gray-900 mb-1">John Doe</div>
                 <div className="text-xs text-gray-500">john.doe@gmail.com</div>
                 <div className="mt-2 text-xs text-gray-400">Created Jan 2024 • 12 Courses</div>
              </div>

              {/* Card 2: Detected Account */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                 <div className="flex justify-between items-start">
                   <div>
                     <div className="text-sm font-bold text-gray-900 mb-1">Jonathan Doe</div>
                     <div className="text-xs text-gray-500">j.doe@old-email.com</div>
                   </div>
                   <div className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">DETECTED</div>
                 </div>
                 <div className="mt-2 text-xs text-gray-400">Created Mar 2023 • 2 Courses</div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-3 pt-2">
             <button className="py-2.5 bg-[#420D74] text-white rounded-lg text-sm font-medium hover:bg-[#531091]">
               Merge Accounts
             </button>
             <button className="py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
               Not Me
             </button>
           </div>
        </div>
      </div>

      {/* Linked Methods */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Linked Methods</h3>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
           <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <img src="https://cdn.simpleicons.org/google" className="size-5 opacity-80" />
                 <div>
                   <div className="text-sm font-medium text-gray-900">Google</div>
                   <div className="text-xs text-gray-500">john.doe@gmail.com</div>
                 </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                 <Trash2 className="size-4" />
              </button>
           </div>
           <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <img src="https://cdn.simpleicons.org/github" className="size-5 opacity-80" />
                 <div>
                   <div className="text-sm font-medium text-gray-900">GitHub</div>
                   <div className="text-xs text-gray-500">Not connected</div>
                 </div>
              </div>
              <button className="text-xs text-[#420D74] font-medium px-3 py-1.5 bg-purple-50 rounded hover:bg-purple-100 transition-colors">
                Connect
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsSettings() {
  const NotificationRow = ({ label, defaultChecked }: { label: string, defaultChecked: boolean }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
      <div className="p-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <button 
          onClick={() => setChecked(!checked)}
          className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-[#420D74]' : 'bg-gray-200'}`}
        >
          <div className={`absolute top-1 left-1 bg-white size-4 rounded-full transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Email</h3>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <NotificationRow label="Product updates" defaultChecked={true} />
          <NotificationRow label="Security alerts" defaultChecked={true} />
          <NotificationRow label="Weekly Digest" defaultChecked={false} />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Push Notifications</h3>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <NotificationRow label="New courses" defaultChecked={true} />
          <NotificationRow label="Mentions" defaultChecked={true} />
          <NotificationRow label="Event Reminders" defaultChecked={true} />
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="p-4 space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-4 py-4">
         <div className="size-28 rounded-full bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center relative overflow-hidden group">
            <UserCircle className="size-20 text-gray-300" />
            <button className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Change</span>
            </button>
         </div>
         <div className="flex gap-3">
           <button className="text-sm text-[#420D74] font-medium bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors">
             Upload New
           </button>
           <button className="text-sm text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
             Remove
           </button>
         </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
            <input 
              type="text" 
              defaultValue="John" 
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
            <input 
              type="text" 
              defaultValue="Doe" 
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74]"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
             <input 
              type="email" 
              defaultValue="john.doe@example.com" 
              readOnly
              className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 focus:outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-green-600 flex items-center gap-1">
               <Check className="size-3" /> Verified
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
          <textarea 
            rows={4}
            defaultValue="Course creator and digital enthusiast. Passionate about building great user experiences." 
            className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74] resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [is2FAWizardOpen, setIs2FAWizardOpen] = useState(false);

  return (
    <>
      <div className="p-4 space-y-8">
        {/* Password */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Change Password</h3>
          <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Current Password"
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74]"
              />
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74]"
              />
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74]"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
              Update Password
            </button>
          </div>
        </div>

        {/* 2FA */}
        <div>
           <div className="flex items-center justify-between mb-3 px-1">
             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Two-Factor Authentication</h3>
           </div>
           <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Secure your account</div>
                <div className="text-xs text-gray-500 mt-0.5">Recommended</div>
              </div>
              <button 
                onClick={() => setIs2FAWizardOpen(true)}
                className="text-sm font-medium text-[#420D74] bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100"
              >
                Enable
              </button>
           </div>
        </div>

        {/* Active Sessions */}
        <div>
           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Active Sessions</h3>
           <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
              <div className="p-4 flex items-center gap-3">
                <Smartphone className="size-10 text-gray-400 p-2 bg-gray-50 rounded-lg" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">iPhone 14 Pro</div>
                  <div className="text-xs text-gray-500">San Francisco, CA • Active now</div>
                </div>
                <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Current</div>
              </div>
              <div className="p-4 flex items-center gap-3">
                <Laptop className="size-10 text-gray-400 p-2 bg-gray-50 rounded-lg" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">MacBook Air</div>
                  <div className="text-xs text-gray-500">San Francisco, CA • 2 hrs ago</div>
                </div>
                <button className="text-xs font-medium text-red-600 border border-red-200 px-3 py-1.5 rounded hover:bg-red-50">
                  Revoke
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* 2FA Wizard Modal */}
      {is2FAWizardOpen && (
        <div className="fixed inset-0 z-[80] bg-white flex flex-col animate-slide-up">
           <div className="px-4 py-4 flex items-center border-b border-gray-100">
             <button onClick={() => setIs2FAWizardOpen(false)} className="p-2 -ml-2">
                <X className="size-6 text-gray-500" />
             </button>
             <h2 className="text-lg font-semibold ml-2">Setup 2FA</h2>
           </div>
           
           <div className="flex-1 p-6 flex flex-col items-center justify-center text-center max-w-sm mx-auto w-full">
              <div className="size-16 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                 <Shield className="size-8 text-[#420D74]" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Authenticator App</h3>
              <p className="text-gray-500 text-sm mb-8">
                Use an app like Google Authenticator or Authy to scan the code or enter the key manually.
              </p>

              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 mb-6 w-full flex flex-col items-center">
                 {/* Fake QR */}
                 <div className="size-40 bg-white p-2 rounded-lg shadow-sm border border-gray-100 mb-4 flex items-center justify-center">
                    <Grid className="size-32 text-gray-900 opacity-80" /> 
                 </div>
                 <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 w-full">
                    <code className="text-xs font-mono text-gray-600 flex-1 truncate">J452 K932 P102 L459</code>
                    <button className="text-[#420D74] p-1 hover:bg-purple-50 rounded">
                       <Copy className="size-4" />
                    </button>
                 </div>
              </div>

              <button className="w-full py-3 bg-[#420D74] text-white rounded-xl font-semibold mb-3">
                Verify Code
              </button>
              <button 
                onClick={() => setIs2FAWizardOpen(false)}
                className="text-gray-500 font-medium text-sm"
              >
                I'll do this later
              </button>
           </div>
        </div>
      )}
    </>
  );
}

function PrivacySettings() {
  return (
    <div className="p-4 space-y-6">
       <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
             <div>
                <div className="text-sm font-medium text-gray-900">Download Data</div>
                <div className="text-xs text-gray-500">Get a copy of your information</div>
             </div>
             <Download className="size-5 text-gray-400" />
          </button>
       </div>

       <div className="bg-red-50 rounded-xl border border-red-100 p-4">
          <h4 className="text-red-800 font-semibold text-sm mb-2">Danger Zone</h4>
          <p className="text-xs text-red-600/80 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="w-full py-2.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50">
            Delete Account
          </button>
       </div>
    </div>
  );
}

function AccessibilitySettings() {
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <div className="p-4 space-y-4">
       <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          <div className="p-4 flex items-center justify-between">
             <div className="text-sm font-medium text-gray-900">Reduce Motion</div>
             <button 
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`w-11 h-6 rounded-full relative transition-colors ${reduceMotion ? 'bg-[#420D74]' : 'bg-gray-200'}`}
             >
                <div className={`absolute top-1 left-1 bg-white size-4 rounded-full transition-transform shadow-sm ${reduceMotion ? 'translate-x-5' : 'translate-x-0'}`} />
             </button>
          </div>
          <div className="p-4 flex items-center justify-between">
             <div className="text-sm font-medium text-gray-900">High Contrast</div>
             <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`w-11 h-6 rounded-full relative transition-colors ${highContrast ? 'bg-[#420D74]' : 'bg-gray-200'}`}
             >
                <div className={`absolute top-1 left-1 bg-white size-4 rounded-full transition-transform shadow-sm ${highContrast ? 'translate-x-5' : 'translate-x-0'}`} />
             </button>
          </div>
       </div>
    </div>
  );
}

function AdvancedSettings() {
  const [devMode, setDevMode] = useState(false);

  return (
    <div className="p-4 space-y-4">
       <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
          <div>
             <div className="text-sm font-medium text-gray-900">Developer Mode</div>
             <div className="text-xs text-gray-500">Access experimental features</div>
          </div>
          <button 
            onClick={() => setDevMode(!devMode)}
            className={`w-11 h-6 rounded-full relative transition-colors ${devMode ? 'bg-[#420D74]' : 'bg-gray-200'}`}
          >
             <div className={`absolute top-1 left-1 bg-white size-4 rounded-full transition-transform shadow-sm ${devMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
       </div>

       {devMode && (
         <div className="bg-gray-900 rounded-xl p-4 text-gray-300 font-mono text-xs space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between">
              <span>API Key</span>
              <span className="text-gray-500">Hidden</span>
            </div>
            <div className="h-px bg-gray-800" />
            <div className="flex justify-between">
              <span>Build Version</span>
              <span className="text-white">v2.4.0-beta</span>
            </div>
         </div>
       )}
    </div>
  );
}

function BillingSettings() {
  return (
    <div className="p-4 space-y-6">
       {/* Plan Card - Clean Purple Design */}
       <div className="bg-white rounded-2xl border-2 border-[#420D74] p-5 relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
               <div>
                  <div className="text-xs font-bold text-[#420D74] uppercase tracking-wider mb-1">Current Plan</div>
                  <div className="text-2xl font-bold text-gray-900">Pro Member</div>
               </div>
               <div className="bg-[#420D74] text-white text-xs font-bold px-2 py-1 rounded">ACTIVE</div>
            </div>
            
            <div className="text-sm text-gray-500 mb-6">
               <span className="font-semibold text-gray-900">$29/mo</span> billed annually
            </div>

            <div className="flex gap-3">
               <button className="flex-1 py-2.5 bg-[#420D74] text-white font-semibold text-sm rounded-lg hover:bg-[#531091] transition-colors">
                  Upgrade Plan
               </button>
               <button className="px-4 py-2.5 bg-white text-gray-600 font-medium text-sm rounded-lg border border-gray-200 hover:bg-gray-50">
                  Cancel
               </button>
            </div>
          </div>
       </div>

       {/* Payment Methods */}
       <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Payment Methods</h3>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-7 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
                      <CreditCard className="size-4 text-gray-600" />
                   </div>
                   <div>
                     <div className="text-sm font-medium text-gray-900">Visa ending in 4242</div>
                     <div className="text-xs text-gray-500">Expires 12/28</div>
                   </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500">
                   <Trash2 className="size-4" />
                </button>
             </div>
             
             <button className="w-full p-4 flex items-center gap-3 text-[#420D74] hover:bg-purple-50 transition-colors font-medium text-sm">
                <Plus className="size-4" />
                Add Payment Method
             </button>
          </div>
       </div>
    </div>
  );
}
