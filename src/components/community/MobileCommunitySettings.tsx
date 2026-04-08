import { useState } from 'react';
import { ChevronRight, Globe, Lock, Bell, Users, Zap, Shield, Download } from 'lucide-react';

interface MobileCommunitySettingsProps {
  communityId: string;
}

export function MobileCommunitySettings({ communityId }: MobileCommunitySettingsProps) {
  const [isPublic, setIsPublic] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const settingsSections = [
    {
      title: 'General',
      icon: Globe,
      items: [
        { label: 'Community Info', description: 'Name, description, logo' },
        { label: 'Visibility & Access', description: 'Public/Private settings' },
        { label: 'Community Guidelines', description: 'Rules and policies' },
      ],
    },
    {
      title: 'Roles & Permissions',
      icon: Users,
      items: [
        { label: 'Role Management', description: 'Create and edit roles' },
        { label: 'Permissions Matrix', description: 'Set role permissions' },
      ],
    },
    {
      title: 'Channels',
      icon: Zap,
      items: [
        { label: 'Manage Channels', description: 'Create, edit, delete channels' },
        { label: 'Channel Settings', description: 'Configure individual channels' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', description: 'Configure email alerts' },
        { label: 'Push Notifications', description: 'Mobile and web push' },
        { label: 'In-App Notifications', description: 'Activity feed settings' },
      ],
    },
    {
      title: 'Integrations',
      icon: Zap,
      items: [
        { label: 'Connected Apps', description: 'Slack, Discord, Zoom' },
        { label: 'Webhooks', description: 'Configure webhooks' },
        { label: 'API Access', description: 'API keys and settings' },
      ],
    },
    {
      title: 'Moderation & Safety',
      icon: Shield,
      items: [
        { label: 'Content Moderation', description: 'Auto-moderation rules' },
        { label: 'Member Safety', description: 'Reporting and blocking' },
        { label: 'AI Moderation', description: 'AI-powered content filtering' },
      ],
    },
  ];

  return (
    <div className="pb-4">
      {/* Quick Settings */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-3">
        <h3 className="text-sm text-gray-900 mb-3">Quick Settings</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-sm text-gray-900">Public Community</h4>
            <p className="text-xs text-gray-600">Anyone can discover and join</p>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`w-10 h-6 rounded-full relative transition-all ${
              isPublic ? 'bg-[#420D74]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 size-4 bg-white rounded-full transition-all ${
                isPublic ? 'right-1' : 'left-1'
              }`}
            ></div>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-sm text-gray-900">Require Approval</h4>
            <p className="text-xs text-gray-600">Manually approve new members</p>
          </div>
          <button
            onClick={() => setRequireApproval(!requireApproval)}
            className={`w-10 h-6 rounded-full relative transition-all ${
              requireApproval ? 'bg-[#420D74]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 size-4 bg-white rounded-full transition-all ${
                requireApproval ? 'right-1' : 'left-1'
              }`}
            ></div>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-sm text-gray-900">Email Notifications</h4>
            <p className="text-xs text-gray-600">Send updates to members</p>
          </div>
          <button
            onClick={() => setEmailNotifications(!emailNotifications)}
            className={`w-10 h-6 rounded-full relative transition-all ${
              emailNotifications ? 'bg-[#420D74]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 size-4 bg-white rounded-full transition-all ${
                emailNotifications ? 'right-1' : 'left-1'
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="p-4 space-y-3">
        {settingsSections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <section.icon className="size-4 text-[#420D74]" />
                <h3 className="text-sm text-gray-900">{section.title}</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  className="w-full p-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-all flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h4 className="text-sm text-gray-900">{item.label}</h4>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                  <ChevronRight className="size-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Advanced Settings */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm text-gray-900">Advanced</h3>
          </div>
          <div className="divide-y divide-gray-200">
            <button className="w-full p-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-all flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm text-gray-900">Data & Privacy</h4>
                <p className="text-xs text-gray-600">Export data, GDPR compliance</p>
              </div>
              <ChevronRight className="size-4 text-gray-400" />
            </button>
            <button className="w-full p-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-all flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm text-gray-900">Developer Tools</h4>
                <p className="text-xs text-gray-600">API console, audit logs</p>
              </div>
              <ChevronRight className="size-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
          <div className="p-3 bg-red-50 border-b border-red-200">
            <h3 className="text-sm text-red-900">Danger Zone</h3>
          </div>
          <div className="divide-y divide-red-200">
            <button className="w-full p-3 text-left hover:bg-red-50 active:bg-red-100 transition-all">
              <h4 className="text-sm text-red-900">Transfer Ownership</h4>
              <p className="text-xs text-red-600">Transfer community to another admin</p>
            </button>
            <button className="w-full p-3 text-left hover:bg-red-50 active:bg-red-100 transition-all">
              <h4 className="text-sm text-red-900">Archive Community</h4>
              <p className="text-xs text-red-600">Make community read-only</p>
            </button>
            <button className="w-full p-3 text-left hover:bg-red-50 active:bg-red-100 transition-all">
              <h4 className="text-sm text-red-900">Delete Community</h4>
              <p className="text-xs text-red-600">Permanently delete this community</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
