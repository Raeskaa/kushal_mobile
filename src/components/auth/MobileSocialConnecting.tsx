import { Loader2 } from 'lucide-react';

interface MobileSocialConnectingProps {
  provider?: string;
}

export function MobileSocialConnecting({ provider = 'Google' }: MobileSocialConnectingProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Content - Centered */}
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl text-[#420D74] mb-2">LeapSpace</h1>
        </div>

        {/* Loading Spinner */}
        <div className="size-20 bg-[#420D74]/10 rounded-full flex items-center justify-center mb-6">
          <Loader2 className="size-10 text-[#420D74] animate-spin" />
        </div>

        {/* Status Text */}
        <h2 className="text-xl text-gray-900 mb-3">Connecting to {provider}...</h2>

        {/* Description */}
        <p className="text-sm text-gray-600 max-w-sm">
          Please wait while we securely connect your account.
          <br />
          This should only take a moment.
        </p>

        {/* Cancel Button */}
        <button className="mt-12 text-sm text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
