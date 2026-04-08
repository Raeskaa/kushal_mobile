import { ReactNode } from 'react';
import { X, ChevronLeft } from 'lucide-react';

interface StandardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  children: ReactNode;
}

export function StandardModal({ 
  isOpen, 
  onClose, 
  title, 
  showBackButton = false,
  onBack,
  children 
}: StandardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white animate-in fade-in duration-200">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 safe-area-inset-top">
        <div className="flex items-center justify-between">
          <button 
            onClick={showBackButton && onBack ? onBack : onClose}
            className="text-gray-700 active:text-gray-900 transition-colors active:scale-95"
          >
            {showBackButton ? (
              <ChevronLeft className="size-6" />
            ) : (
              <X className="size-6" />
            )}
          </button>
          
          <h1 className="text-lg text-gray-900 absolute left-1/2 transform -translate-x-1/2">
            {title}
          </h1>
          
          <div className="w-6" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 bg-white">
        {children}
      </div>
    </div>
  );
}