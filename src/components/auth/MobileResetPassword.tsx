import { useState } from 'react';
import { X, Lock, Eye, EyeOff } from 'lucide-react';

interface MobileResetPasswordProps {
  onClose?: () => void;
}

export function MobileResetPassword({ onClose }: MobileResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onClose}
            className="text-gray-700 active:text-gray-900 transition-colors active:scale-95"
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
          <h1 className="text-2xl text-[#420D74] mb-2">LeapSpace</h1>
        </div>

        {/* Icon */}
        <div className="size-20 bg-[#420D74]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Lock className="size-10 text-[#420D74]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl text-gray-900 mb-3 text-center">Reset password</h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-8 text-center max-w-sm mx-auto">
          Choose a new password for your account
        </p>

        {/* New Password Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-900 mb-2">
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#420D74] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2 flex gap-1">
              <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'medium' || passwordStrength === 'strong' ? passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'}`} />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters
          </p>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <label className="block text-sm text-gray-900 mb-2">
            Confirm password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#420D74] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
          )}
        </div>

        {/* Reset Password Button */}
        <button 
          className="w-full py-3 bg-[#420D74] text-white rounded-xl text-sm mb-4 active:bg-[#350960] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!passwordsMatch || password.length < 8}
        >
          Reset password
        </button>

        {/* Back to Sign In */}
        <button 
          onClick={onClose}
          className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl text-sm active:bg-gray-200 transition-colors"
        >
          Back to sign in
        </button>
      </div>
    </div>
  );
}
