import { X, AlertTriangle } from 'lucide-react';

interface MobileExpiredMagicLinkProps {
  onClose?: () => void;
  email?: string;
}

export function MobileExpiredMagicLink({ onClose, email = 'you@example.com' }: MobileExpiredMagicLinkProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
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

      {/* Content */}
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-2xl text-primary mb-2">LeapSpace</h1>
        </div>

        <div className="size-20 bg-secondary rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="size-10 text-secondary-foreground" />
        </div>

        <h2 className="text-2xl text-foreground mb-3">Link expired</h2>

        <p className="text-sm text-muted-foreground mb-8 max-w-sm">
          This magic link has expired or has already been used.
          <br />
          <br />
          Magic links are valid for 15 minutes for security reasons.
        </p>

        <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm mb-3 active:bg-primary/90 transition-colors">
          Request new link
        </button>

        <p className="text-xs text-muted-foreground mb-8">
          We'll send a new link to <span className="text-foreground">{email}</span>
        </p>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-muted text-foreground rounded-xl text-sm active:bg-secondary transition-colors"
        >
          Back to sign in
        </button>

        <p className="text-xs text-muted-foreground mt-8">
          Having trouble? Contact support
        </p>
      </div>
    </div>
  );
}
