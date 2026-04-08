import { Search, X, ChevronRight, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface IntegrationsListProps {
  onClose: () => void;
  onSelect: (provider: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All', count: 90 },
  { id: 'social', label: 'Social', count: 18 },
  { id: 'work', label: 'Work', count: 23 },
  { id: 'messaging', label: 'Messaging', count: 16 },
  { id: 'developer', label: 'Developer', count: 22 },
  { id: 'email', label: 'Email', count: 4 },
  { id: 'phone', label: 'Phone', count: 1 },
];

const INTEGRATIONS = [
  { id: 'google', name: 'Google', icon: 'https://cdn.simpleicons.org/google', category: 'social' },
  { id: 'facebook', name: 'Facebook', icon: 'https://cdn.simpleicons.org/facebook/1877F2', category: 'social' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'https://cdn.simpleicons.org/linkedin/0A66C2', category: 'work' },
  { id: 'apple', name: 'Apple', icon: 'https://cdn.simpleicons.org/apple/000000', category: 'social' },
  { id: 'twitter', name: 'Twitter / X', icon: 'https://cdn.simpleicons.org/x', category: 'social' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'https://cdn.simpleicons.org/whatsapp/25D366', category: 'messaging' },
  { id: 'slack', name: 'Slack', icon: 'https://cdn.simpleicons.org/slack', category: 'work' },
  { id: 'microsoft', name: 'Microsoft', icon: 'https://cdn.simpleicons.org/microsoft/00A4EF', category: 'work' },
  { id: 'notion', name: 'Notion', icon: 'https://cdn.simpleicons.org/notion', category: 'work' },
  { id: 'discord', name: 'Discord', icon: 'https://cdn.simpleicons.org/discord/5865F2', category: 'messaging' },
  { id: 'github', name: 'GitHub', icon: 'https://cdn.simpleicons.org/github', category: 'developer' },
  { id: 'gmail', name: 'Gmail', icon: 'https://cdn.simpleicons.org/gmail/EA4335', category: 'email' },
  { id: 'outlook', name: 'Outlook', icon: 'https://cdn.simpleicons.org/microsoftoutlook/0078D4', category: 'email' },
];

export function IntegrationsList({ onClose, onSelect }: IntegrationsListProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const filteredIntegrations = INTEGRATIONS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const showPhone = (activeCategory === 'all' || activeCategory === 'phone') && 
                    'phone number'.includes(searchQuery.toLowerCase());

  return (
    <div className={`fixed inset-0 z-[100] bg-white flex flex-col transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-4 border-b border-gray-100 shrink-0">
        <button 
          onClick={handleClose}
          className="p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="size-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">All Login Methods</h2>
      </div>

      {/* Search & Categories Container */}
      <div className="px-6 py-4 space-y-4 shrink-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search 90+ integrations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#420D74] transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                activeCategory === cat.id 
                  ? 'bg-[#420D74] text-white border-[#420D74]' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.label}
              <span className={`text-xs ${activeCategory === cat.id ? 'text-white/80' : 'text-gray-400'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-8">
        {/* Popular Section (Only shows when no search and All category) */}
        {activeCategory === 'all' && !searchQuery && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Popular in your region</h3>
            <div className="grid grid-cols-2 gap-3">
              {INTEGRATIONS.slice(0, 6).map(item => (
                <IntegrationCard key={item.id} item={item} onClick={() => onSelect(item.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {activeCategory === 'all' ? 'All integrations' : `${CATEGORIES.find(c => c.id === activeCategory)?.label} integrations`} 
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {filteredIntegrations.map(item => (
              <IntegrationCard key={item.id} item={item} onClick={() => onSelect(item.id)} />
            ))}
            
            {showPhone && (
              <button 
                onClick={() => onSelect('phone')}
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-[#420D74] hover:ring-1 hover:ring-[#420D74] transition-all active:scale-[0.98] aspect-[4/3] group"
              >
                <div className="size-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                  <Phone className="size-5" />
                </div>
                <span className="text-sm font-medium text-gray-900">Phone Number</span>
              </button>
            )}
          </div>
          
          {filteredIntegrations.length === 0 && !showPhone && (
            <div className="text-center py-12">
               <div className="mx-auto size-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                 <Search className="size-6 text-gray-400" />
               </div>
               <h3 className="text-gray-900 font-medium">No results found</h3>
               <p className="text-gray-500 text-sm mt-1">Try searching for something else</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({ item, onClick }: { item: typeof INTEGRATIONS[0], onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-[#420D74] hover:ring-1 hover:ring-[#420D74] transition-all active:scale-[0.98] aspect-[4/3] group"
    >
      <div className="size-10 rounded-lg bg-gray-50 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
        <img src={item.icon} alt={item.name} className="size-full object-contain" />
      </div>
      <span className="text-sm font-medium text-gray-900">{item.name}</span>
    </button>
  );
}
