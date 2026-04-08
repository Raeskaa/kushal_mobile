import { useState } from 'react';
import { X, Mail } from 'lucide-react';

interface MobileForgotPasswordProps {
  onClose?: () => void;
}

export function MobileForgotPassword({ onClose }: MobileForgotPasswordProps) {
  const [email, setEmail] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onClose}
            className="text-secondary-foreground active:text-foreground transition-colors active:scale-95"
          >
            <X className="size-6" />
          </button>
          <div className="w-6" />
        </div>
      </div>

      <div className="flex flex-col px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-2xl text-primary mb-2">LeapSpace</h1>
        </div>

        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Mail className="size-10 text-primary" />
        </div>

        <h2 className="text-2xl text-foreground mb-3 text-center">Forgot password?</h2>

        <p className="text-sm text-muted-foreground mb-8 text-center max-w-sm mx-auto">
          No worries! Enter your email and we'll send you a link to reset your password.
        </p>

        <div className="mb-6">
          <label className="block text-sm text-foreground mb-2">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm mb-4 active:bg-primary/90 transition-colors">
          Send reset link
        </button>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-muted text-foreground rounded-xl text-sm active:bg-secondary transition-colors"
        >
          Back to sign in
        </button>
      </div>
    </div>
  );
}
