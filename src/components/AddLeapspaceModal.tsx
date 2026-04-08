import { useState } from 'react';
import { StandardModal } from './StandardModal';
import { Mail, Plus, Users, BookOpen } from 'lucide-react';

interface AddLeapspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

type Screen = 'main' | 'create';

export function AddLeapspaceModal({ isOpen, onClose, userEmail = 'mahesh@trueleap.io' }: AddLeapspaceModalProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');

  const handleClose = () => {
    setCurrentScreen('main');
    onClose();
  };

  const handleBack = () => {
    setCurrentScreen('main');
  };

  if (currentScreen === 'create') {
    return (
      <StandardModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create a Leapspace"
        showBackButton
        onBack={handleBack}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-secondary-foreground mb-2">
              Leapspace Name
            </label>
            <input
              type="text"
              placeholder="e.g. Design Academy, Marketing Hub"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm text-secondary-foreground mb-2">
              Description (optional)
            </label>
            <textarea
              placeholder="What's this leapspace about?"
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm text-secondary-foreground mb-2">
              Type
            </label>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-4 border-2 border-primary bg-card rounded-lg transition-colors active:scale-95">
                <Users className="size-5 text-primary" />
                <div className="text-left flex-1">
                  <div className="text-foreground">Community</div>
                  <div className="text-sm text-muted-foreground">Build and grow your learning community</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-4 border border-border bg-card rounded-lg transition-colors active:scale-95">
                <BookOpen className="size-5 text-muted-foreground" />
                <div className="text-left flex-1">
                  <div className="text-foreground">Course Platform</div>
                  <div className="text-sm text-muted-foreground">Create and sell online courses</div>
                </div>
              </button>
            </div>
          </div>

          <button className="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg transition-all active:scale-95">
            Create Leapspace
          </button>
        </div>
      </StandardModal>
    );
  }

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add a Leapspace"
    >
      <div className="space-y-6">
        {/* Create New Section */}
        <div>
          <h3 className="text-foreground mb-3">
            Start fresh
          </h3>

          <button 
            onClick={() => setCurrentScreen('create')}
            className="w-full flex items-center gap-3 px-4 py-4 bg-primary text-primary-foreground rounded-lg transition-all active:scale-95"
          >
            <Plus className="size-5" />
            <span>Create a new leapspace</span>
          </button>

          <p className="text-muted-foreground text-sm mt-3">
            Build your own community, create courses, or host events
          </p>
        </div>

        {/* Join Existing Section */}
        <div>
          <h3 className="text-foreground mb-3">
            Join an existing leapspace
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-secondary-foreground mb-2">
                Enter invite code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. DESIGN2024"
                  className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
                />
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg transition-all active:scale-95">
                  Join
                </button>
              </div>
            </div>

            <p className="text-muted-foreground text-sm">
              Ask the leapspace admin for an invite code
            </p>
          </div>
        </div>

        {/* Email Verification Section */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-foreground mb-3">
            Find your leapspaces
          </h3>

          <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border mb-3">
            <Mail className="size-5 text-muted-foreground" />
            <span className="text-secondary-foreground">{userEmail}</span>
          </div>

          <button className="w-full px-6 py-3 border-2 border-primary text-primary rounded-lg transition-all active:scale-95">
            Show my leapspaces
          </button>

          <p className="text-muted-foreground text-sm mt-3">
            We'll show you leapspaces associated with this email
          </p>
        </div>
      </div>
    </StandardModal>
  );
}
