import { X, ChevronRight, Moon, User, Settings, LogOut, Bell, ChevronDown, Shield, History, LayoutGrid, HelpCircle, ArrowLeft, PenSquare, Smartphone, Rocket, Link as LinkIcon, AlertCircle, Mail, CreditCard, BookOpen, UserCircle2, Briefcase } from 'lucide-react';
import { IntegrationsList } from './auth/IntegrationsList';
import { useState, useRef, useEffect } from 'react';

interface MobileProfileProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
  onSignInClick?: (email: string) => void;
  onOpenMyProfile?: () => void;
  onOpenMyAccount?: () => void;
  onOpenManageLeapSpace?: () => void;
}

type LoginStep = 'LANDING' | 'INIT' | 'OTP' | 'PROFILE' | 'MERGE' | 'INTEGRATIONS';

export function MobileProfile({
  isOpen,
  onClose,
  isLoggedIn = false,
  onSignInClick,
  onOpenMyProfile,
  onOpenMyAccount,
  onOpenManageLeapSpace,
}: MobileProfileProps) {
  const [loginStep, setLoginStep] = useState<LoginStep>('LANDING');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoginStep('LANDING');
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setFullName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartLogin = () => setLoginStep('INIT');
  const handleEmailSubmit = () => { if (email) setLoginStep('OTP'); };

  const handleVerify = () => {
    if (email.toLowerCase().includes('merge') || email.toLowerCase().includes('sarah.chen')) { setLoginStep('MERGE'); return; }
    if (email.toLowerCase().includes('new')) { setLoginStep('PROFILE'); return; }
    onSignInClick?.(email);
    onClose();
  };

  const handleMergeConfirm = () => { onSignInClick?.(email); onClose(); };
  const handleMergeCancel = () => { onSignInClick?.(email); onClose(); };
  const handleProfileSubmit = () => { onSignInClick?.(email); onClose(); };

  const handleBack = () => {
    if (loginStep === 'INIT') setLoginStep('LANDING');
    if (loginStep === 'OTP') setLoginStep('INIT');
    if (loginStep === 'PROFILE') setLoginStep('OTP');
    if (loginStep === 'MERGE') setLoginStep('OTP');
    if (loginStep === 'INTEGRATIONS') setLoginStep('INIT');
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40 transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-x-0 bottom-0 top-12 bg-card text-foreground flex flex-col animate-slide-up rounded-t-3xl overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-border shrink-0">
            {loginStep !== 'LANDING' && !isLoggedIn ? (
               <button onClick={handleBack} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors active:scale-95">
                <ArrowLeft className="size-6" />
              </button>
            ) : (
              <button onClick={onClose} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors active:scale-95">
                <X className="size-6" />
              </button>
            )}
            
            <h2 className="text-base text-foreground">
               {isLoggedIn ? 'Account' : 
                 (loginStep === 'LANDING' ? 'Profile' :
                  loginStep === 'INIT' ? 'Log in' : 
                  loginStep === 'OTP' ? 'Verify' : 
                  loginStep === 'MERGE' ? 'Link Account' : 'Setup')}
            </h2>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar bg-muted/30">
            {isLoggedIn ? (
              <LoggedInView
                onOpenMyProfile={onOpenMyProfile}
                onOpenMyAccount={onOpenMyAccount}
                onOpenManageLeapSpace={onOpenManageLeapSpace}
              />
            ) : (
              <div className="min-h-full bg-card px-6 py-8 flex flex-col relative">
                {loginStep === 'LANDING' && (
                  <LandingStep 
                    onStartLogin={handleStartLogin} 
                    onQuickLogin={() => { onSignInClick?.(email || 'mahesh@trueleap.io'); onClose(); }}
                    onClose={onClose}
                  />
                )}
                {loginStep === 'INIT' && (
                  <InitStep email={email} setEmail={setEmail} onSubmit={handleEmailSubmit} onClose={onClose} onShowIntegrations={() => setLoginStep('INTEGRATIONS')} />
                )}
                {loginStep === 'INTEGRATIONS' && (
                  <IntegrationsList 
                    onClose={() => setLoginStep('INIT')}
                    onSelect={(provider) => { if (provider === 'phone') { setLoginStep('INIT'); } else { setLoginStep('OTP'); } }}
                  />
                )}
                {loginStep === 'OTP' && (
                  <OtpStep email={email} otp={otp} setOtp={setOtp} onSubmit={handleVerify} onResend={() => {}} onEditEmail={() => setLoginStep('INIT')} />
                )}
                {loginStep === 'MERGE' && (
                  <MergeStep email={email} onConfirm={handleMergeConfirm} onCancel={handleMergeCancel} />
                )}
                {loginStep === 'PROFILE' && (
                  <ProfileStep fullName={fullName} setFullName={setFullName} onSubmit={handleProfileSubmit} />
                )}
              </div>
            )}
          </div>
      </div>
    </div>
  );
}

// --- Sub-Components for Login Flow ---

function AuthFooter() {
  return (
    <div className="mt-auto text-center text-xs text-muted-foreground leading-relaxed px-4 pt-8 pb-4">
      By continuing, I agree to Leapspace's{' '}
      <button className="underline hover:text-foreground transition-colors">terms</button>,{' '}
      <button className="underline hover:text-foreground transition-colors">privacy policy</button>, and{' '}
      <button className="underline hover:text-foreground transition-colors">cookie policy</button>.
    </div>
  );
}

function LandingStep({ onStartLogin, onQuickLogin, onClose }: { onStartLogin: () => void, onQuickLogin: () => void, onClose: () => void }) {
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-20">
            <div className="flex items-center gap-2 mb-6">
               <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
                  <Rocket className="size-6 text-primary-foreground fill-primary-foreground" />
               </div>
               <span className="text-2xl text-foreground tracking-tight">LeapSpace</span>
            </div>
            <p className="text-base text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Sign in to access your courses, communities, and join the conversation.
            </p>
        </div>

        <div className="fixed bottom-8 left-6 right-6 space-y-4 max-w-sm mx-auto z-10">
          {/* Last Logged In User Card */}
          <div className="w-full bg-card border border-border p-4 rounded-lg flex items-center gap-4 relative">
            <div className="size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg shrink-0">
              R
            </div>
            <div className="flex-1 min-w-0">
               <div className="text-sm text-foreground truncate">Raeskaaa</div>
               <div className="text-xs text-muted-foreground truncate">mahesh@trueleap.io</div>
            </div>
            <button className="text-muted-foreground hover:text-foreground p-1">
              <X className="size-5" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 px-2 py-2">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground uppercase">Or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          {/* Action Buttons */}
          <button 
            onClick={onStartLogin}
            className="w-full h-12 bg-card border border-border text-foreground rounded-lg text-base hover:bg-muted active:scale-[0.98] transition-all"
          >
            Log in to another account
          </button>

          <button 
            onClick={onStartLogin}
            className="w-full h-12 bg-card border border-border text-foreground rounded-lg text-base hover:bg-muted active:scale-[0.98] transition-all"
          >
            Create account
          </button>

          {/* Stay Logged Out */}
          <div className="text-center pt-2">
            <button 
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground underline decoration-border underline-offset-4"
            >
              Stay logged out
            </button>
          </div>
        </div>
    </div>
  );
}

function InitStep({ email, setEmail, onSubmit, onClose, onShowIntegrations }: { email: string, setEmail: (s: string) => void, onSubmit: () => void, onClose: () => void, onShowIntegrations: () => void }) {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (method === 'phone') { setEmail(`${countryCode}${phoneNumber}`); } else { setEmail(''); }
  }, [method, countryCode, phoneNumber]);

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl text-foreground tracking-tight mb-3">Welcome back</h2>
        <p className="text-sm text-muted-foreground px-4">
          Log in or sign up to get smarter responses, upload files and images, and more.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        <SocialButton icon="https://cdn.simpleicons.org/google" label="Continue with Google" />
        <SocialButton icon="https://cdn.simpleicons.org/apple/000000" label="Continue with Apple" />
        <SocialButton icon="https://cdn.simpleicons.org/microsoft" label="Continue with Microsoft" />
        
        {method === 'email' ? (
          <button 
            onClick={() => setMethod('phone')}
            className="w-full h-12 bg-card border border-border rounded-lg flex items-center justify-center gap-3 hover:bg-muted active:scale-[0.98] transition-all relative group"
          >
             <Smartphone className="size-5 text-foreground" />
             <span className="text-base text-foreground">Continue with phone</span>
          </button>
        ) : (
          <button 
            onClick={() => setMethod('email')}
            className="w-full h-12 bg-card border border-border rounded-lg flex items-center justify-center gap-3 hover:bg-muted active:scale-[0.98] transition-all relative group"
          >
             <Mail className="size-5 text-foreground" />
             <span className="text-base text-foreground">Continue with email</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px bg-border flex-1" />
      </div>

      <div className="space-y-4 mb-4">
        {method === 'email' ? (
          <div className="relative">
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-4 bg-card border border-border rounded-lg text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        ) : (
          <div className="flex gap-3">
             <div className="relative w-24">
                <select 
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full h-14 pl-3 pr-8 bg-card border border-border rounded-lg text-base appearance-none focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                   <option value="+1">+1</option>
                   <option value="+44">+44</option>
                   <option value="+91">+91</option>
                   <option value="+86">+86</option>
                   <option value="+81">+81</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
             </div>
             <div className="relative flex-1">
                <input 
                  type="tel" 
                  placeholder="Mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full h-14 px-4 bg-card border border-border rounded-lg text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
             </div>
          </div>
        )}

        <button 
          onClick={onSubmit}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-base active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={method === 'email' ? !email : !phoneNumber}
        >
          Continue
        </button>
      </div>
      
      <div className="text-center mb-8">
         <button 
            onClick={onShowIntegrations}
            className="text-sm text-primary hover:underline"
         >
            + 97 more login methods
         </button>
      </div>

      <div className="mt-auto text-center pt-4">
        <button 
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground underline decoration-border underline-offset-4"
        >
          Stay logged out
        </button>
      </div>

      <AuthFooter />
    </div>
  );
}

function OtpStep({ email, otp, setOtp, onSubmit, onResend, onEditEmail }: { email: string, otp: string[], setOtp: (o: string[]) => void, onSubmit: () => void, onResend: () => void, onEditEmail: () => void }) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) { inputRefs.current[index + 1]?.focus(); }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) { inputRefs.current[index - 1]?.focus(); }
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl text-foreground tracking-tight mb-3">Check your inbox</h2>
        <p className="text-sm text-muted-foreground px-4">
          We've sent a 6-digit code to {email || 'mahesh@trueleap.io'}
        </p>
      </div>

      <div className="text-center mb-6">
        <label className="text-sm text-foreground block mb-4">Enter the code we just sent you.</label>
        <div className="flex justify-between gap-2 px-1">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={el => inputRefs.current[idx] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 text-center text-xl border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary caret-primary"
            />
          ))}
        </div>
      </div>

      <button 
        onClick={onSubmit}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-base active:scale-[0.98] transition-all mb-8"
      >
        Verify
      </button>

      <div className="text-center space-y-4">
        <div className="text-sm text-muted-foreground">
          Didn't receive it? <button onClick={onResend} className="text-primary hover:underline">Resend code</button>
        </div>
        
        <button onClick={onEditEmail} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <PenSquare className="size-3" />
          Edit address
        </button>
      </div>

      <AuthFooter />
    </div>
  );
}

function MergeStep({ email, onConfirm, onCancel }: { email: string, onConfirm: () => void, onCancel: () => void }) {
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="text-center mb-6">
        <h2 className="text-[30px] leading-[36px] text-primary tracking-tight mb-2">Merge accounts</h2>
        <p className="text-sm text-muted-foreground px-4 leading-[20px]">
           We found another account with the same email. This is your only chance to combine them.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
         <div className="flex items-center justify-center gap-8 mb-10 w-full relative">
            <div className="size-[64px] rounded-full bg-muted border border-border flex items-center justify-center relative z-10">
               <img src="https://cdn.simpleicons.org/slack" alt="Slack" className="size-8" />
            </div>
            <div className="relative z-10 bg-border rounded-full p-[1px] size-[24px] flex items-center justify-center ring-4 ring-card">
               <div className="bg-card rounded-full size-full flex items-center justify-center">
                  <LinkIcon className="size-3.5 text-muted-foreground" />
               </div>
            </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[1px] bg-border z-0"></div>
            <div className="size-[64px] rounded-full bg-muted border border-border flex items-center justify-center relative z-10">
               <img src="https://cdn.simpleicons.org/google" alt="Google" className="size-8" />
            </div>
         </div>
         
         <div className="px-4 text-center max-w-sm mx-auto">
            <p className="text-[14px] leading-[20px] text-muted-foreground">
               You previously signed in with <span className="text-foreground">Slack</span>. Merge it with your <span className="text-foreground">Google</span> login to keep all your data in one place.
            </p>
         </div>
      </div>

      <div className="mt-auto space-y-3 pb-2">
        <button 
          onClick={onConfirm}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-[10px] text-[16px] active:scale-[0.98] transition-all"
        >
          Merge accounts
        </button>
        <button 
          onClick={onCancel}
          className="w-full h-12 bg-card border border-border text-foreground hover:bg-muted rounded-[10px] text-[16px] active:scale-[0.98] transition-all"
        >
          I want to not do it
        </button>
        
        <p className="text-[11px] leading-[18px] text-muted-foreground text-center px-4 pt-1">
           This action cannot be undone and this is your only opportunity to merge these accounts.
        </p>
      </div>
    </div>
  );
}

function ProfileStep({ fullName, setFullName, onSubmit }: { fullName: string, setFullName: (s: string) => void, onSubmit: () => void }) {
  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl text-foreground tracking-tight mb-3">Complete your profile</h2>
        <p className="text-sm text-muted-foreground px-4">
          Just one last step to get you started
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm text-foreground mb-2 text-center">What's your full name?</label>
          <input 
            type="text" 
            placeholder="e.g. Sarah Chen"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-14 px-4 bg-card border border-border rounded-lg text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <button 
          onClick={onSubmit}
          disabled={!fullName}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-base active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finish Setup
        </button>
      </div>

      <AuthFooter />
    </div>
  );
}

function SocialButton({ icon, label }: { icon: string, label: string }) {
  return (
    <button className="w-full h-12 bg-card border border-border rounded-lg flex items-center justify-center gap-3 hover:bg-muted active:scale-[0.98] transition-all relative group">
       <img src={icon} alt="" className="size-5 shrink-0 object-contain" />
       <span className="text-base text-foreground">{label}</span>
    </button>
  );
}

// --- Logged In View ---

function LoggedInView({
  onOpenMyProfile,
  onOpenMyAccount,
  onOpenManageLeapSpace,
}: {
  onOpenMyProfile?: () => void;
  onOpenMyAccount?: () => void;
  onOpenManageLeapSpace?: () => void;
}) {
  return (
    <div className="px-4 py-6 pb-12 space-y-6 animate-in slide-in-from-right duration-300">
      {/* Profile Header */}
      <div className="bg-card rounded-2xl p-6 border border-border flex flex-col items-center text-center">
        <div className="relative mb-3">
           <div className="size-20 bg-primary rounded-full flex items-center justify-center text-3xl text-primary-foreground ring-4 ring-border">
              JD
           </div>
           <button className="absolute bottom-0 right-0 p-1.5 bg-card rounded-full ring-2 ring-border">
              <div className="size-3 bg-primary rounded-full border-2 border-card" />
           </button>
        </div>
        
        <h2 className="text-xl text-foreground mb-1">John Doe</h2>
        <p className="text-sm text-muted-foreground mb-4">john.doe@example.com</p>
        
         <button
           onClick={onOpenManageLeapSpace}
           className="px-5 py-2.5 rounded-full border border-border text-sm text-secondary-foreground hover:bg-muted active:bg-secondary transition-colors w-full sm:w-auto"
         >
           Manage LeapSpace
         </button>
       </div>

      {/* Account Switcher Card */}
      <div className="bg-card rounded-2xl overflow-hidden border border-border">
         <button className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors active:bg-secondary">
            <div className="flex items-center gap-3">
               <div className="flex -space-x-2">
                  <div className="size-8 rounded-full bg-accent ring-2 ring-card" />
                  <div className="size-8 rounded-full bg-primary ring-2 ring-card" />
               </div>
               <span className="text-sm text-secondary-foreground">Switch account</span>
            </div>
            <ChevronDown className="size-5 text-muted-foreground" />
         </button>
      </div>

      {/* Recommended Actions */}
      <div className="bg-card rounded-2xl overflow-hidden border border-border">
         <div className="p-4 flex items-center gap-3">
            <Shield className="size-5 text-destructive" />
            <div className="flex-1">
              <span className="text-sm text-foreground block">Security Checkup</span>
              <span className="text-xs text-muted-foreground">Recommended actions found</span>
            </div>
            <div className="size-2 bg-destructive rounded-full"></div>
         </div>
      </div>

      {/* Settings Menu Groups */}
      <div className="space-y-6">
         <div>
            <h3 className="px-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">Account Center</h3>
            <div className="bg-card rounded-2xl overflow-hidden border border-border">
               <MenuItem
                 icon={<UserCircle2 className="text-muted-foreground" />}
                 label="My Profile"
                 subLabel="Professional identity and visibility"
                 onClick={onOpenMyProfile}
               />
               <MenuItem
                 icon={<Settings className="text-muted-foreground" />}
                 label="My Account"
                 subLabel="Authentication, billing, sessions, and preferences"
                 onClick={onOpenMyAccount}
               />
               <MenuItem
                 icon={<Briefcase className="text-muted-foreground" />}
                 label="Manage LeapSpace"
                 subLabel="Scoped profile, notifications, and role-based controls"
                 onClick={onOpenManageLeapSpace}
               />
            </div>
          </div>

          <div>
            <h3 className="px-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">Activity</h3>
            <div className="bg-card rounded-2xl overflow-hidden border border-border">
               <MenuItem icon={<PenSquare className="text-muted-foreground" />} label="Drafts" />
               <MenuItem icon={<History className="text-muted-foreground" />} label="Recently viewed" />
               <MenuItem icon={<LayoutGrid className="text-muted-foreground" />} label="Connected work" />
            </div>
         </div>

         <div>
            <h3 className="px-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">Plan & Preferences</h3>
            <div className="bg-card rounded-2xl overflow-hidden border border-border">
               <MenuItem icon={<CreditCard className="text-muted-foreground" />} label="Billing" subLabel="Business plan billed monthly" onClick={onOpenMyAccount} />
               <MenuItem icon={<Bell className="text-muted-foreground" />} label="Notifications" subLabel="On" />
               <MenuItem icon={<Moon className="text-muted-foreground" />} label="Appearance" subLabel="Light mode" />
            </div>
         </div>

         <div>
            <h3 className="px-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">Support & Resources</h3>
            <div className="bg-card rounded-2xl overflow-hidden border border-border">
               <MenuItem icon={<BookOpen className="text-muted-foreground" />} label="Training & Tutorials" />
               <MenuItem icon={<HelpCircle className="text-muted-foreground" />} label="Help & Feedback" />
               <MenuItem icon={<LogOut className="text-destructive" />} label="Sign out" isDestructive />
            </div>
          </div>
      </div>
      
      <div className="pt-4 text-center text-xs text-muted-foreground">
         <div className="flex justify-center gap-4 mb-2">
           <button className="hover:text-foreground">Privacy Policy</button>
           <span>•</span>
           <button className="hover:text-foreground">Terms of Service</button>
         </div>
         <p>Version 2.4.0 (Build 305)</p>
      </div>
    </div>
  );
}

function MenuItem({ 
  icon, 
  label,
  subLabel,
  isDestructive = false,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  subLabel?: string;
  isDestructive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted active:bg-secondary transition-colors border-b border-border last:border-0 group"
    >
      <div className="flex items-center gap-4">
        <div className={`size-6 transition-colors ${isDestructive ? 'text-destructive' : 'text-muted-foreground group-hover:text-foreground'}`}>
           {icon}
        </div>
        <div className="text-left">
           <div className={`text-base ${isDestructive ? 'text-destructive' : 'text-foreground'}`}>
             {label}
           </div>
           {subLabel && (
             <div className="text-xs text-muted-foreground mt-0.5">
               {subLabel}
             </div>
           )}
        </div>
      </div>
    </button>
  );
}
