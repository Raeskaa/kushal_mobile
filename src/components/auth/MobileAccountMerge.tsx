import { X, AlertCircle } from 'lucide-react';

interface MobileAccountMergeProps {
  onClose?: () => void;
  existingEmail?: string;
  newProvider?: string;
}

export function MobileAccountMerge({ 
  onClose, 
  existingEmail = 'you@example.com',
  newProvider = 'Google'
}: MobileAccountMergeProps) {
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
      <div className="flex flex-col px-6 py-16">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl text-primary mb-2">LeapSpace</h1>
        </div>

        {/* Icon */}
        <div className="size-20 bg-secondary rounded-full flex items-center justify-center mb-6 mx-auto">
          <AlertCircle className="size-10 text-secondary-foreground" />
        </div>

        {/* Title */}
        <h2 className="text-2xl text-foreground mb-3 text-center">Account already exists</h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm mx-auto">
          An account with <span className="text-foreground">{existingEmail}</span> already exists.
        </p>

        {/* Info Box */}
        <div className="bg-muted rounded-xl p-4 mb-8">
          <p className="text-sm text-secondary-foreground mb-3">
            Would you like to merge your {newProvider} account with your existing account?
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="size-1.5 bg-primary rounded-full mt-1.5" />
              <p className="text-xs text-muted-foreground">Your existing data will be preserved</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="size-1.5 bg-primary rounded-full mt-1.5" />
              <p className="text-xs text-muted-foreground">You can sign in with either method</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="size-1.5 bg-primary rounded-full mt-1.5" />
              <p className="text-xs text-muted-foreground">Your preferences will sync across devices</p>
            </div>
          </div>
        </div>

        {/* Merge Accounts Button */}
        <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm mb-3 active:bg-primary/90 transition-colors">
          Merge accounts
        </button>

        {/* Sign In Instead */}
        <button className="w-full py-3 bg-muted text-foreground rounded-xl text-sm mb-3 active:bg-secondary transition-colors">
          Sign in with existing account
        </button>

        {/* Cancel */}
        <button 
          onClick={onClose}
          className="w-full py-3 text-sm text-muted-foreground text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
