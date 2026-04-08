import { X, Mail } from 'lucide-react';

interface MobileMagicLinkSentProps {
  onClose?: () => void;
  email?: string;
}

export function MobileMagicLinkSent({ onClose, email = 'you@example.com' }: MobileMagicLinkSentProps) {
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

      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-2xl text-primary mb-2">LeapSpace</h1>
        </div>

        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Mail className="size-10 text-primary" />
        </div>

        <h2 className="text-2xl text-foreground mb-3">Check your email</h2>

        <p className="text-sm text-muted-foreground mb-8 max-w-sm">
          We've sent a magic link to{' '}
          <span className="text-foreground">{email}</span>
          <br />
          Click the link in the email to sign in.
        </p>

        <button className="text-sm text-primary mb-4">
          Didn't receive the email? Resend
        </button>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-muted text-foreground rounded-xl text-sm active:bg-secondary transition-colors"
        >
          Back to sign in
        </button>

        <p className="text-xs text-muted-foreground mt-8">
          Check your spam folder if you don't see it in your inbox.
        </p>
      </div>
    </div>
  );
}
