import { useState } from 'react';
import { X, Mail, Phone, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface MobileRegisterProps {
  onClose?: () => void;
  onSwitchToSignIn?: () => void;
}

export function MobileRegister({ onClose, onSwitchToSignIn }: MobileRegisterProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAllMethods, setShowAllMethods] = useState(false);

  const handleRegister = async () => {
    // Basic validation
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (activeTab === 'email' && !email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }

    if (activeTab === 'phone' && phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      // In a real app, this would sign the user in
      onSwitchToSignIn?.(); 
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 text-gray-700 active:text-gray-900 transition-colors active:scale-95"
          >
            <X className="size-6" />
          </button>
          <div className="w-6" />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 overflow-y-auto pb-32 h-[calc(100vh-64px)]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-12 bg-purple-100 text-[#420D74] rounded-xl mb-3">
             <span className="font-bold text-xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-[#420D74]">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Start your learning journey today</p>
        </div>

        {/* Email/Phone Toggle */}
        <div className="bg-gray-100/80 p-1 rounded-xl mb-6 flex">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'email'
                ? 'bg-white text-gray-900 border border-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setActiveTab('phone')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'phone'
                ? 'bg-white text-gray-900 border border-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Phone
          </button>
        </div>

        <div className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74] transition-all"
            />
          </div>

          {/* Email Input */}
          {activeTab === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74] transition-all"
                />
              </div>
            </div>
          )}

          {/* Phone Input */}
          {activeTab === 'phone' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select className="px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74]">
                  <option>🇺🇸 +1</option>
                  <option>🇬🇧 +44</option>
                  <option>🇮🇳 +91</option>
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74] transition-all"
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#420D74]/20 focus:border-[#420D74] transition-all pr-11"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 ml-1">Must be at least 6 characters</p>
          </div>
        </div>

        {/* Create Account Button */}
        <button 
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full mt-8 py-3.5 bg-[#420D74] text-white rounded-xl text-sm font-semibold active:bg-[#350960] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            "Create account"
          )}
        </button>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Login Buttons - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <SocialButton icon="🔵" label="Google" />
          <SocialButton icon="🔷" label="Facebook" />
          <SocialButton icon="💼" label="LinkedIn" />
          <SocialButton icon="🍎" label="Apple" />
        </div>

        {/* More Login Methods */}
        <button 
          onClick={() => setShowAllMethods(true)}
          className="w-full py-3 text-sm font-medium text-gray-600 hover:text-[#420D74] transition-colors"
        >
          View all sign up options
        </button>

        {/* Sign In Link */}
        <div className="text-center text-sm text-gray-600 mt-6 pb-8">
          Already have an account?{' '}
          <button className="font-semibold text-[#420D74] hover:underline" onClick={onSwitchToSignIn}>
            Sign in
          </button>
        </div>
      </div>

      {/* All Login Methods Modal */}
      {showAllMethods && (
        <AllLoginMethodsModal onClose={() => setShowAllMethods(false)} />
      )}
    </div>
  );
}

function SocialButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors">
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function AllLoginMethodsModal({ onClose }: { onClose: () => void }) {
  const providers = [
    { name: 'Google', icon: '🔵' },
    { name: 'Facebook', icon: '🔷' },
    { name: 'LinkedIn', icon: '💼' },
    { name: 'Apple', icon: '🍎' },
    { name: 'Twitter / X', icon: '🐦' },
    { name: 'WhatsApp', icon: '💬' },
    { name: 'Slack', icon: '💼' },
    { name: 'Microsoft', icon: '🪟' },
    { name: 'Notion', icon: '📝' },
    { name: 'Discord', icon: '🎮' },
    { name: 'GitHub', icon: '🐙' },
    { name: 'Gmail', icon: '📧' },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-white animate-slide-up">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 text-gray-700 active:text-gray-900 transition-colors active:scale-95"
          >
            <X className="size-6" />
          </button>
          <h2 className="text-base font-semibold text-gray-900">
            Sign up options
          </h2>
          <div className="w-6" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 overflow-y-auto pb-24 h-full">
        <div className="grid grid-cols-2 gap-3">
          {providers.map((provider) => (
            <button
              key={provider.name}
              className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl active:bg-gray-50 transition-colors hover:border-gray-300"
            >
              <div className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">
                {provider.icon}
              </div>
              <span className="text-sm font-medium text-gray-900">{provider.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}